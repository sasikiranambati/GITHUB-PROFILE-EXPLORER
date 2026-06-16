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
    <div className="page search-page">
      <div className="page-header">
        <p className="eyebrow">Search developers</p>
        <h1>Find GitHub profiles instantly</h1>
        <p className="page-copy">Enter a username to inspect public profiles, repositories, and activity with a clean dashboard.</p>
      </div>

      <div className="search-panel card">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="primary-btn" onClick={handleSearch}>Search</button>
        </div>
      </div>

      <section className="section trending-section">
        <div className="section-header">
          <p className="eyebrow">Trending</p>
          <h2>Popular developer usernames</h2>
        </div>
        <div className="tags-grid">
          {trendingUsers.map((user, index) => (
            <button key={index} className="tag-pill" onClick={() => navigate(`/profile/${user}`)}>
              {user}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Search;
