import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
export default function Repositories() {
    const { username } = useParams(); const [repos, setRepos] = useState([]);
    useEffect(() => { axios.get(`https://api.github.com/users/${username}/repos`).then(r => setRepos(r.data)); }, [username]);
    return <div className='page'><h1>{username} Repositories</h1><div className='grid'>{repos.map(repo => <div className='card' key={repo.id}><h3>{repo.name}</h3><p>{repo.description}</p><small>⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}</small></div>)}</div></div>
}