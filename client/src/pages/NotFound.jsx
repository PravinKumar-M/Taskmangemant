// 404 Not Found page
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/login" className="back-link">
          Go to Login
        </Link>
      </div>
    </div>
  );
}
