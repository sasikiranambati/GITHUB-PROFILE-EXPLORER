import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import githubLogo from "../assets/github-mark.svg";

const words = ["instantly", "effortlessly", "seamlessly", "in real-time"];

function Home() {
  const brandRef = useRef(null);
  const [contentVisible, setContentVisible] = useState(false);
  const [brandStyle, setBrandStyle] = useState({ opacity: 0 });
  const [wordIndex, setWordIndex] = useState(0);
  const [fadeWord, setFadeWord] = useState(true);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setBrandStyle({ opacity: 1, transform: "none" });
      setContentVisible(true);
      return;
    }

    // Measure positions and trigger animation
    const timeout = setTimeout(() => {
      if (!brandRef.current) return;

      const rect = brandRef.current.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      const translateX = viewportCenterX - elementCenterX;
      const translateY = viewportCenterY - elementCenterY;

      // Position brand in the center, scaled up
      setBrandStyle({
        transform: `translate(${translateX}px, ${translateY}px) scale(2.8)`,
        opacity: 0,
        filter: "blur(6px)",
      });

      // Animate it back to normal position in subsequent frames
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setBrandStyle({
            transform: "translate(0, 0) scale(1)",
            opacity: 1,
            filter: "blur(0px)",
            transition: "transform 1.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), filter 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
          });

          // Stagger the remaining hero content
          setTimeout(() => {
            setContentVisible(true);
          }, 700);
        });
      });
    }, 80);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const interval = setInterval(() => {
      setFadeWord(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setFadeWord(true);
      }, 300);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page home-page">
      <div className="glow-container">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </div>

      <section className="hero-section">
        <div className="hero-copy">
          <div className="hero-brand" ref={brandRef} style={brandStyle}>
            <img src={githubLogo} alt="GitHub Logo" className="hero-logo" />
            <span className="hero-brand-name">GitHub Profile Explorer</span>
          </div>

          <h1 className={`animate-fade-up ${contentVisible ? "visible" : ""}`} style={{ transitionDelay: "0.15s" }}>
            Discover top developers and repositories{" "}
            <span className="cursor-container">
              <span className={`highlight-text rotator-word ${fadeWord ? "fade-in" : "fade-out"}`}>
                {words[wordIndex]}
              </span>
            </span>
          </h1>
          <p className={`hero-text animate-fade-up ${contentVisible ? "visible" : ""}`} style={{ transitionDelay: "0.3s" }}>
            Search GitHub usernames, inspect public profiles, and explore repository insights with a polished and professional experience.
          </p>
          <div className={`hero-actions animate-fade-up ${contentVisible ? "visible" : ""}`} style={{ transitionDelay: "0.45s" }}>
            <Link to="/search">
              <button className="primary-btn">Start searching</button>
            </Link>
            <Link to="/profile/octocat">
              <button className="secondary-btn">Try demo profile</button>
            </Link>
          </div>
        </div>

        <div className={`hero-visual card animate-fade-up ${contentVisible ? "visible" : ""}`} style={{ transitionDelay: "0.6s" }}>
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
          <div className="feature-card card">
            <h3>Profile lookup</h3>
            <p>Search GitHub users and view their public profile details instantly.</p>
          </div>
          <div className="feature-card card">
            <h3>Repository insights</h3>
            <p>Browse repos, counts, and activity without switching tools.</p>
          </div>
          <div className="feature-card card">
            <h3>Search history</h3>
            <p>See recent searches and jump back to profiles quickly.</p>
          </div>
        </div>
      </section>

      <section className="section stats-section">
        <div className="stats-grid">
          <div className="stat-card card">
            <h3>1M+</h3>
            <p>Profiles indexed</p>
          </div>
          <div className="stat-card card">
            <h3>Real-time</h3>
            <p>Live GitHub data</p>
          </div>
          <div className="stat-card card">
            <h3>Instant</h3>
            <p>Search responses</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
