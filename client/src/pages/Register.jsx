// Register page - User account creation with Google Sign-In
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { authAPI } from '../services/api';
import '../styles/Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        name,
        email,
        password,
        role: 'student' // Default role is student
      });

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseGoogleSignUp = async () => {
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
      console.error('Firebase Google SignUp Error:', err);
      setError(err.response?.data?.message || 'Google Sign-Up failed or was cancelled. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>📚 Task Manager</h1>
          <p>Create Your Account</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <h2>Register for Free</h2>

          {error && <div className="error-alert">{error}</div>}
          {success && <div className="success-alert">{success}</div>}

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* GOOGLE SIGN-UP */}
        <button 
          className="firebase-google-btn" 
          onClick={handleFirebaseGoogleSignUp}
          disabled={loading}
          type="button"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google Logo" 
          />
          Sign up with Google
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
