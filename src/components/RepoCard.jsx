function RepoCard({ repo }) {
    return (
        <div className="card">
            <h3>{repo.name}</h3>
            <p>{repo.description}</p>

            <p>⭐ Stars: {repo.stargazers_count}</p>
            <p>🍴 Forks: {repo.forks_count}</p>
            <p>💻 Language: {repo.language}</p>
        </div>
    );
}

export default RepoCard;