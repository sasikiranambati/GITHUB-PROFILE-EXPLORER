import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">GitHub profile explorer</p>
          <h1>Discover top developers and repositories instantly.</h1>
          <p className="hero-text">
            Search GitHub usernames, inspect public profiles, and explore repository insights with a polished and professional experience.
          </p>
          <div className="hero-actions">
            <Link to="/search">
              <button className="primary-btn">Start searching</button>
            </Link>
            <Link to="/profile/octocat">
              <button className="secondary-btn">Try demo profile</button>
            </Link>
          </div>
        </div>

        <div className="hero-visual card">
          <div className="panel-header">
            <p className="eyebrow">Fast insights</p>
            <h2>Search, review, and understand GitHub data</h2>
          </div>
          <div className="panel-grid">
            <div className="panel-card">
              <span>User profiles</span>
              <strong>Search by username</strong>
            </div>
            <div className="panel-card">
              <span>Repositories</span>
              <strong>View stars & forks</strong>
            </div>
            <div className="panel-card">
              <span>History</span>
              <strong>Return to recent searches</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section features-section">
        <div className="section-header">
          <p className="eyebrow">What this app offers</p>
          <h2>Powerful GitHub search in one clean workspace</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Profile lookup</h3>
            <p>Search GitHub users and view their public profile details instantly.</p>
          </div>
          <div className="feature-card">
            <h3>Repository insights</h3>
            <p>Browse repos, counts, and activity without switching tools.</p>
          </div>
          <div className="feature-card">
            <h3>Search history</h3>
            <p>See recent searches and jump back to profiles quickly.</p>
          </div>
        </div>
      </section>

      <section className="section stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>1M+</h3>
            <p>Profiles indexed</p>
          </div>
          <div className="stat-card">
            <h3>Real-time</h3>
            <p>Live GitHub data</p>
          </div>
          <div className="stat-card">
            <h3>Instant</h3>
            <p>Search responses</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
