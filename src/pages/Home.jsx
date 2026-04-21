import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">

                <h1 className="highlighted-title">Discover GitHub Developers</h1>

                <Link to="/search">
                    <button className="start-btn">Start Searching</button>
                </Link>
            </section>

            {/* Features */}
            <section className="features">
                <div className="feature-card">
                    <h2> Search Profiles</h2>
                    <p>Find any GitHub user instantly with username search.</p>
                </div>

                <div className="feature-card">
                    <h2> Explore Repositories</h2>
                    <p>View repositories, stars, forks and languages.</p>
                </div>

                <div className="feature-card">
                    <h2>Developer Stats</h2>
                    <p>Analyze followers, activity and profile insights.</p>
                </div>
            </section>

            {/* Stats */}
            <section className="stats">
                <div className="stat-box">
                    <h2>1M+</h2>
                    <p>Developers</p>
                </div>

                <div className="stat-box">
                    <h2>Unlimited</h2>
                    <p>Searches</p>
                </div>

                <div className="stat-box">
                    <h2>Real-Time</h2>
                    <p>GitHub Data</p>
                </div>
            </section>
        </div>
    );
}

export default Home;