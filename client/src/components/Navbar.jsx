// Navbar component - Display user info and logout button
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
          <div className="user-info">
            <span className="user-name">{user.name || 'User'}</span>
            <span className="user-email">{user.email}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
