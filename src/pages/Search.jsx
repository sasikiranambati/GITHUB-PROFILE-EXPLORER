import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Search() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (username.trim() !== "") {
            navigate(`/profile/${username}`);
        }
    };

    const trendingUsers = [
        "torvalds",
        "gaearon",
        "octocat",
        "yyx990803",
        "sindresorhus"
    ];

    return (
        <div className="search-page">
            <h1>Search GitHub Developers</h1>
            <p>Find profiles, repositories and coding stats instantly.</p>

            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search GitHub username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className="recent-box">
                <h3>Trending Developers</h3>
                <div className="tags">
                    {trendingUsers.map((user, index) => (
                        <span key={index} onClick={() => navigate(`/profile/${user}`)}>
                            {user}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Search;