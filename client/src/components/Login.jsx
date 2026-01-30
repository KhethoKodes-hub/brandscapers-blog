// client/src/components/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      // 1️⃣ Login with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Get Firebase ID token
      const token = await user.getIdToken();

      // 3️⃣ Save token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userId', user.uid);

      // 4️⃣ Redirect to home
      navigate('/'); 
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container py-5">
        <div className="login-card">
          {/* Login Header */}
          <div className="login-header">
            <h1 className="login-title">
              <span className="title-icon">🔐</span>
              Welcome Back
            </h1>
            <p className="login-subtitle">Sign in to your account to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="form-input"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔑</span>
                Password
              </label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="form-input"
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              <span className="button-icon">
                {isLoading ? (
                  <span className="loading-spinner-small"></span>
                ) : (
                  '🔓'
                )}
              </span>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Additional Links */}
          <div className="login-links">
            <Link to="/register" className="link-item">
              <span className="link-icon">✨</span>
              Don't have an account? Sign Up
            </Link>
            <Link to="/forgot-password" className="link-item">
              <span className="link-icon">🔒</span>
              Forgot your password?
            </Link>
            <Link to="/admin-login" className="link-item admin-link">
              <span className="link-icon">⚡</span>
              Admin Login
            </Link>
          </div>

          {/* Security Badge */}
          <div className="security-badge">
            <span className="badge-icon">🛡️</span>
            <span className="badge-text">Secure authentication with Firebase</span>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a2463 0%, #1565c0 25%, #42a5f5 50%, #90caf9 75%, #e3f2fd 100%);
          background-size: 400% 400%;
          animation: gradientFlow 20s ease infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .container {
          max-width: 500px;
          width: 100%;
          margin: 0 auto;
        }

        /* Login Card */
        .login-card {
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-radius: 24px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 25px 60px rgba(13, 71, 161, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          padding: 3rem;
          text-align: center;
        }

        /* Login Header */
        .login-header {
          margin-bottom: 2.5rem;
        }

        .login-title {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #0d47a1, #1976d2, #42a5f5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .title-icon {
          font-size: 2rem;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .login-subtitle {
          color: #4a5568;
          font-size: 1.1rem;
          font-weight: 500;
        }

        /* Error Alert */
        .error-alert {
          background: linear-gradient(135deg, #fed7d7, #f56565);
          border: 2px solid #fc8181;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-icon {
          font-size: 1.2rem;
        }

        .error-text {
          color: #742a2a;
          font-weight: 600;
          font-size: 0.95rem;
        }

        /* Login Form */
        .login-form {
          width: 100%;
          margin-bottom: 2.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .form-label {
          color: #2d3748;
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .label-icon {
          font-size: 1.2rem;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.5rem;
          border: 2px solid rgba(66, 165, 245, 0.2);
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 500;
          color: #2d3748;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .form-input:focus {
          outline: none;
          border-color: #42a5f5;
          background: white;
          box-shadow: 0 8px 20px rgba(66, 165, 245, 0.2), 0 0 0 4px rgba(66, 165, 245, 0.1);
          transform: translateY(-2px);
        }

        .form-input::placeholder {
          color: #a0aec0;
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Submit Button */
        .submit-button {
          width: 100%;
          padding: 1.2rem;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #0d47a1, #1976d2, #42a5f5);
          background-size: 200% 200%;
          color: white;
          font-weight: 800;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 15px 35px rgba(13, 71, 161, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 20px 45px rgba(13, 71, 161, 0.5);
          background-position: 100% 0;
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(-1px);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .button-icon {
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-spinner-small {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Login Links */
        .login-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .link-item {
          color: #4a5568;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
        }

        .link-item:hover {
          background: rgba(66, 165, 245, 0.1);
          color: #1976d2;
          transform: translateY(-2px);
        }

        .link-icon {
          font-size: 1.1rem;
        }

        .admin-link {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
          color: #d97706;
          border: 2px solid rgba(255, 165, 0, 0.3);
        }

        .admin-link:hover {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 165, 0, 0.2));
          color: #b45309;
        }

        /* Security Badge */
        .security-badge {
          background: linear-gradient(135deg, rgba(66, 165, 245, 0.1), rgba(21, 101, 192, 0.1));
          border: 2px solid rgba(66, 165, 245, 0.2);
          border-radius: 16px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .badge-icon {
          font-size: 1.3rem;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .badge-text {
          color: #2d3748;
          font-size: 0.9rem;
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .login-card {
            padding: 2.5rem 2rem;
          }

          .login-title {
            font-size: 2rem;
          }

          .title-icon {
            font-size: 1.8rem;
          }

          .login-subtitle {
            font-size: 1rem;
          }

          .form-input {
            padding: 0.9rem 1.25rem;
          }

          .submit-button {
            padding: 1rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 2rem 1.5rem;
            border-radius: 20px;
          }

          .login-title {
            font-size: 1.75rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .title-icon {
            font-size: 1.5rem;
          }

          .login-subtitle {
            font-size: 0.95rem;
          }

          .error-alert {
            padding: 0.9rem 1.25rem;
          }

          .form-input {
            padding: 0.8rem 1rem;
            font-size: 0.95rem;
          }

          .submit-button {
            padding: 0.9rem;
            font-size: 0.95rem;
          }

          .link-item {
            font-size: 0.9rem;
            padding: 0.6rem 0.9rem;
          }

          .security-badge {
            padding: 0.9rem 1.25rem;
          }

          .badge-text {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}