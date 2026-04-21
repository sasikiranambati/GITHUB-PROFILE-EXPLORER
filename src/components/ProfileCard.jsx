function ProfileCard({ user }) {
    return (
        <div className="card">
            <img src={user.avatar_url} alt="profile" width="150" />
            <h2>{user.name}</h2>
            <h3>{user.login}</h3>
            <p>{user.bio}</p>

            <p>Followers: {user.followers}</p>
            <p>Following: {user.following}</p>
            <p>Public Repos: {user.public_repos}</p>
        </div>
    );
}

export default ProfileCard;