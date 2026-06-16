import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const githubApi = axios.create({
    baseURL: '/api'
});
export default function Repositories() {
    const { username } = useParams();
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!username) return;
        setLoading(true);

        githubApi.get(`/saved/users/${username}/repos`)
            .then(saved => {
                if (saved.data.length > 0) {
                    setRepos(saved.data);
                    setLoading(false);
                } else {
                    return githubApi.get(`/users/${username}/repos`)
                        .then(live => {
                            setRepos(live.data);
                            setLoading(false);
                        });
                }
            })
            .catch(() => {
                githubApi.get(`/users/${username}/repos`)
                    .then(live => setRepos(live.data))
                    .finally(() => setLoading(false));
            });
    }, [username]);

    return (
        <div className='page'>
            <h1>{username} Repositories</h1>
            {loading ? (
                <p>Loading repositories...</p>
            ) : (
                <div className='grid'>
                    {repos.map(repo => (
                        <div className='card' key={repo.id}>
                            <h3>{repo.name}</h3>
                            <p>{repo.description}</p>
                            <small>⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}</small>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
