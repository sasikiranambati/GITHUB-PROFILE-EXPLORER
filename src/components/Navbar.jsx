import { Link } from 'react-router-dom';
import githubLogo from '../assets/github-mark.svg';

export default function Navbar() {
  return (
    <nav className='nav'>
      <div className='nav-title'>
        <img src={githubLogo} alt="GitHub Logo" className="github-logo" />
        <span>GitHub Explorer</span>
      </div>
      <div className='nav-links'>
        <Link to='/'>
          <button className='nav-btn home-btn'>Home</button>
        </Link>
        <Link to='/search' className='nav-link'>Search</Link>
      </div>
    </nav>
  );
}