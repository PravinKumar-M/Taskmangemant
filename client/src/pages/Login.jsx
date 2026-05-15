import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { authAPI } from '../services/api';
import '../styles/Auth.css';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/student-dashboard');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // 1. Trigger Firebase Google Popup
      const result = await signInWithPopup(auth, googleProvider);
      
      // 2. Get the Google ID Token from the OAuth credential
      const authCredential = GoogleAuthProvider.credentialFromResult(result);
      const credential = authCredential.idToken;

      // 3. Send token to backend
      const response = await authAPI.googleLogin({
        credential: credential
      });

      const { token, user } = response.data;

      // 4. Store in local storage and redirect
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (err) {
      console.error('Firebase Google Login Error:', err);
      setError(err.response?.data?.message || 'Google Sign-In failed or was cancelled. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <form onSubmit={handleLogin} className="auth-form">
          <h2>Login to Your Account</h2>

          {error && <div className="error-alert">{error}</div>}

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* GOOGLE SIGN-IN */}
        <button 
          className="firebase-google-btn" 
          onClick={handleFirebaseGoogleLogin}
          disabled={loading}
          type="button"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google Logo" 
          />
          Continue with Google
        </button>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}