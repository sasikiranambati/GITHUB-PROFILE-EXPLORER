import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProfileCard from '../components/ProfileCard';

const githubApi = axios.create({
  baseURL: '/api'
});

function getFavoriteUsers() {
  return JSON.parse(localStorage.getItem('favoriteUsers') || '[]');
}

function setFavoriteUsers(favorites) {
  localStorage.setItem('favoriteUsers', JSON.stringify(favorites));
}

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getFavoriteUsers();
    setFavorites(stored);
  }, []);

  useEffect(() => {
    if (!favorites.length) {
      setUsers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(
      favorites.map((username) =>
        githubApi
          .get(`/users/${username}`)
          .then((res) => res.data)
          .catch(() => null)
      )
    )
      .then((results) => {
        setUsers(results.filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, [favorites]);

  const handleRemove = (username) => {
    const next = favorites.filter((value) => value !== username.toLowerCase());
    setFavoriteUsers(next);
    setFavorites(next);
    setUsers((current) => current.filter((user) => user.login.toLowerCase() !== username.toLowerCase()));
  };

  return (
    <div className='page'>
      <div className='section-header'>
        <p className='eyebrow'>Favorites</p>
        <h1>Saved GitHub profiles</h1>
        <p className='page-copy'>Quick access to the profiles you marked as favorite.</p>
      </div>

      {loading ? (
        <p>Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <div className='card'>
          <h2>No favorites yet</h2>
          <p>Mark profiles as favorite from their profile page to save them here.</p>
          <Link to='/search'>
            <button className='primary-btn'>Search GitHub</button>
          </Link>
        </div>
      ) : (
        <div className='grid'>
          {users.map((user) => (
            <div key={user.id} className='card favorite-card'>
              <ProfileCard user={user} />
              <div className='favorite-actions'>
                <Link to={`/profile/${user.login}`}>
                  <button className='secondary-btn'>View profile</button>
                </Link>
                <button className='primary-btn' onClick={() => handleRemove(user.login)}>
                  Remove favorite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
