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
        const [error, setError] = useState(null);
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
            setError(null);
            githubApi.get(`/users/${username}`)
                .then(r => { setUser(r.data); setError(null); })
                .catch(err => {
                    setUser(null);
                    if (err.response) {
                        if (err.response.status === 404) {
                            setError('not_found');
                        } else if (err.response.status === 403 && (err.response.data?.message?.includes('rate limit') || err.response.data?.message?.includes('limit exceeded'))) {
                            setError('rate_limit');
                        } else {
                            setError(err.response.data?.message || `API Error: ${err.response.status}`);
                        }
                    } else if (err.request) {
                        setError('network_error');
                    } else {
                        setError(err.message || 'An unexpected error occurred');
                    }
                });
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

        if (error) {
            let errorTitle = 'Error';
            let errorMessage = 'An error occurred while fetching the developer profile.';
            let showDotEnvTip = false;

            if (error === 'not_found') {
                errorTitle = 'User Not Found';
                errorMessage = `The GitHub user "${username}" does not exist. Please check the username and try again.`;
            } else if (error === 'rate_limit') {
                errorTitle = 'API Rate Limit Exceeded';
                errorMessage = 'GitHub API rate limit exceeded. To resolve this, you can configure a GitHub Personal Access Token in a .env file.';
                showDotEnvTip = true;
            } else if (error === 'network_error') {
                errorTitle = 'Network / Server Error';
                errorMessage = 'Could not connect to the backend server. Please verify that the backend server is running (try running "npm run dev:full" instead of "npm run dev").';
            } else {
                errorTitle = 'GitHub API Error';
                errorMessage = error;
            }

            return (
                <div className='page'>
                    <div className='not-found-card card' style={{ padding: '32px', maxWidth: '560px', margin: '0 auto 24px' }}>
                        <h2>{errorTitle}</h2>
                        <p>{errorMessage}</p>
                        {showDotEnvTip && (
                            <div className='dotenv-tip' style={{ marginTop: '20px', padding: '16px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '14px', textAlign: 'left', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: 'var(--primary)' }}>💡 How to fix this:</p>
                                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.5' }}>
                                    <li>Create or open the `.env` file in the project root folder.</li>
                                    <li>Add your GitHub Personal Access Token: `VITE_GITHUB_TOKEN=your_token_here`</li>
                                    <li>Restart the development server.</li>
                                </ol>
                            </div>
                        )}
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
                <div className='card profile-card'>
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