// Navbar component - Display user info and logout button
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>📚 Task Manager</h1>
          <p className="role-badge">{user.role?.toUpperCase()}</p>
        </div>
        <div className="navbar-content">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="user-info">
            {user.profilePicture && (
              <img src={user.profilePicture} alt="Profile" className="user-profile-img" referrerPolicy="no-referrer" />
            )}
            <div className="user-details">
              <span className="user-name">{user.name || 'User'}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
