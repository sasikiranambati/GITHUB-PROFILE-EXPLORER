import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function removeHistoryUser(user, setHistory, username) {
    let prev = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    prev = prev.filter(u => u !== user);
    localStorage.setItem('searchHistory', JSON.stringify(prev));
    setHistory(prev);
}

export default function Profile() {
        const { username } = useParams();
        const [user, setUser] = useState(null);
        const [notFound, setNotFound] = useState(false);
        const [history, setHistory] = useState([]);
        const navigate = useNavigate();

        // Fetch user data
        useEffect(() => {
                setUser(null);
                setNotFound(false);
                axios.get(`https://api.github.com/users/${username}`)
                        .then(r => { setUser(r.data); setNotFound(false); })
                        .catch(() => { setUser(null); setNotFound(true); });
        }, [username]);

        // Manage search history in localStorage
        useEffect(() => {
            if (!username) return;
            let prev = JSON.parse(localStorage.getItem('searchHistory') || '[]');
            prev = prev.filter(u => u !== username);
            prev.unshift(username);
            if (prev.length > 8) prev = prev.slice(0, 8);
            localStorage.setItem('searchHistory', JSON.stringify(prev));
            setHistory(prev);
        }, [username]);

        if (notFound) {
            return (
                <div className='page'>
                    <div className='not-found-card'>
                        <h2>User Not Found</h2>
                        <p>The GitHub user "{username}" does not exist. Please check the username and try again.</p>
                    </div>
                    {history.length > 1 && (
                        <div className='search-history'>
                            <h3>Search History</h3>
                            <div className='history-tags'>
                                {history.filter(u => u !== username).map((u, i) => (
                                    <span key={i} className='history-tag history-tag-action'>
                                        <span className='history-tag-user' onClick={() => navigate(`/profile/${u}`)}>{u}</span>
                                        <button className='history-tag-clear' title='Remove from history' onClick={() => removeHistoryUser(u, setHistory, username)}>&times;</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (!user) return <div className='page'>Loading...</div>;

        return (
            <div className='page'>
                <div className='card profile'>
                    <img src={user.avatar_url} />
                    <h2>{user.name || user.login}</h2>
                    <p>{user.bio}</p>
                    <div className='stats'>
                        <span>Followers {user.followers}</span>
                        <span>Repos {user.public_repos}</span>
                    </div>
                    <div className='profile-btn-row'>
                        <a href={user.html_url} target='_blank' rel='noopener noreferrer' className='profile-btn github-btn'>GitHub</a>
                        <a href={user.html_url + '?tab=repositories'} target='_blank' rel='noopener noreferrer' className='profile-btn repos-btn'>Repositories</a>
                    </div>
                </div>

                {history.length > 1 && (
                    <div className='search-history'>
                        <h3>Search History</h3>
                        <div className='history-tags'>
                            {history.filter(u => u !== username).map((u, i) => (
                                <span key={i} className='history-tag' onClick={() => navigate(`/profile/${u}`)}>{u}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
}