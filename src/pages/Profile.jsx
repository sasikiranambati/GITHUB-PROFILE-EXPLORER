import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const githubApi = axios.create({
    baseURL: '/api'
});

function removeHistoryUser(user, setHistory, username) {
    let prev = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    prev = prev.filter(u => u !== user);
    localStorage.setItem('searchHistory', JSON.stringify(prev));
    setHistory(prev);
}

function getFavoriteUsers() {
    return JSON.parse(localStorage.getItem('favoriteUsers') || '[]');
}

function setFavoriteUsers(favs) {
    localStorage.setItem('favoriteUsers', JSON.stringify(favs));
}

function toggleFavorite(username, setIsFavorite) {
    let favs = getFavoriteUsers();
    const normalized = username.toLowerCase();
    if (favs.includes(normalized)) {
        favs = favs.filter(u => u !== normalized);
        setIsFavorite(false);
    } else {
        favs = [normalized, ...favs];
        setIsFavorite(true);
    }
    setFavoriteUsers(favs);
}

export default function Profile() {
        const { username } = useParams();
        const [user, setUser] = useState(null);
        const [notFound, setNotFound] = useState(false);
        const [history, setHistory] = useState([]);
        const [isFavorite, setIsFavorite] = useState(false);
        const navigate = useNavigate();

        useEffect(() => {
            if (!username) return;
            const favs = getFavoriteUsers();
            setIsFavorite(favs.includes(username.toLowerCase()));
        }, [username]);

        // Fetch user data
        useEffect(() => {
            if (!username) return;
            setUser(null);
            setNotFound(false);
            githubApi.get(`/users/${username}`)
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
                                    <div
                                        key={i}
                                        className='history-tag history-tag-action'
                                        onClick={() => navigate(`/profile/${u}`)}
                                        role='button'
                                        tabIndex={0}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                navigate(`/profile/${u}`);
                                            }
                                        }}
                                    >
                                        <span className='history-tag-user'>{u}</span>
                                        <button
                                            type='button'
                                            className='history-tag-clear'
                                            title='Remove from history'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeHistoryUser(u, setHistory, username);
                                            }}
                                        >&times;</button>
                                    </div>
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
                    <img src={user.avatar_url} alt={`${user.login} avatar`} />
                    <h2>{user.name || user.login}</h2>
                    <p>{user.bio}</p>
                    <div className='stats'>
                        <span>Followers {user.followers}</span>
                        <span>Repos {user.public_repos}</span>
                    </div>
                    <div className='profile-btn-row'>
                        <a href={user.html_url} target='_blank' rel='noopener noreferrer' className='profile-btn github-btn'>GitHub</a>
                        <a href={user.html_url + '?tab=repositories'} target='_blank' rel='noopener noreferrer' className='profile-btn repos-btn'>Repositories</a>
                        <button
                            type='button'
                            className={`profile-btn favorite-btn ${isFavorite ? 'favorite-active' : ''}`}
                            onClick={() => toggleFavorite(user.login, setIsFavorite)}
                        >
                            {isFavorite ? 'Remove favorite' : 'Add to favorite'}
                        </button>
                    </div>
                </div>

                {history.length > 1 && (
                    <div className='search-history'>
                        <h3>Search History</h3>
                        <div className='history-tags'>
                            {history.filter(u => u !== username).map((u, i) => (
                                <button
                                    key={i}
                                    type='button'
                                    className='history-tag history-tag-action'
                                    onClick={() => navigate(`/profile/${u}`)}
                                >
                                    <span>{u}</span>
                                    <span className='history-tag-clear' title='Remove from history' onClick={(e) => { e.stopPropagation(); removeHistoryUser(u, setHistory, username); }}>&times;</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
}