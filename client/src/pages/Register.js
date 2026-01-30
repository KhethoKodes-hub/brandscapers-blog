// client/src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // 1️⃣ Sign up with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Get Firebase ID token
      const token = await user.getIdToken(true);

      // 3️⃣ Save token and user info in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('userId', user.uid);

      // 4️⃣ Success feedback
      setSuccess('🎉 Registration successful! Welcome to our community.');

      // 5️⃣ Redirect after 2 seconds
      setTimeout(() => {
        navigate('/'); // home page
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message.includes('auth/email-already-in-use') 
        ? 'This email is already registered. Please try logging in.'
        : 'Registration failed. Please check your information and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="container py-5">
        <div className="register-card">
          {/* Register Header */}
          <div className="register-header">
            <h1 className="register-title">
              <span className="title-icon">🚀</span>
              Start Your Journey
            </h1>
            <p className="register-subtitle">Create an account to unlock exclusive features</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-alert">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="success-alert">
              <span className="success-icon">✅</span>
              <span className="success-text">{success}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="form-input"
                disabled={isLoading || success}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔑</span>
                Password
              </label>
              <input 
                type="password" 
                placeholder="Create a strong password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="form-input"
                disabled={isLoading || success}
              />
              <div className="password-hint">
                <span className="hint-icon">💡</span>
                <span className="hint-text">Use at least 8 characters with letters and numbers</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🔁</span>
                Confirm Password
              </label>
              <input 
                type="password" 
                placeholder="Re-enter your password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="form-input"
                disabled={isLoading || success}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="terms-section">
              <input 
                type="checkbox" 
                id="terms" 
                className="terms-checkbox"
                required
                disabled={isLoading || success}
              />
              <label htmlFor="terms" className="terms-label">
                I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
              </label>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading || success}
            >
              <span className="button-icon">
                {isLoading ? (
                  <span className="loading-spinner-small"></span>
                ) : (
                  success ? '✅' : '✨'
                )}
              </span>
              {isLoading ? 'Creating Account...' : success ? 'Success! Redirecting...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">Already have an account?</span>
            <span className="divider-line"></span>
          </div>

          {/* Login Redirect */}
          <div className="login-redirect-section">
            <Link to="/login" className="login-redirect-button">
              <span className="redirect-icon">🔓</span>
              Sign In to Your Account
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="feature-highlights">
            <h3 className="features-title">What you'll get:</h3>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">⭐</span>
                <span className="feature-text">Access to premium content</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💾</span>
                <span className="feature-text">Save and bookmark posts</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span className="feature-text">Join the community</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔔</span>
                <span className="feature-text">Personalized notifications</span>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="security-badge">
            <span className="badge-icon">🛡️</span>
            <span className="badge-text">Enterprise-grade security with Firebase Authentication</span>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .register-container {
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
          max-width: 550px;
          width: 100%;
          margin: 0 auto;
        }

        /* Register Card */
        .register-card {
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-radius: 24px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 25px 60px rgba(13, 71, 161, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          padding: 3rem;
          text-align: center;
        }

        /* Register Header */
        .register-header {
          margin-bottom: 2.5rem;
        }

        .register-title {
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

        .register-subtitle {
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

        /* Success Alert */
        .success-alert {
          background: linear-gradient(135deg, #c6f6d5, #48bb78);
          border: 2px solid #68d391;
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

        .error-icon, .success-icon {
          font-size: 1.2rem;
        }

        .error-text {
          color: #742a2a;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .success-text {
          color: #22543d;
          font-weight: 600;
          font-size: 0.95rem;
        }

        /* Register Form */
        .register-form {
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
          background: rgba(248, 250, 252, 0.8);
        }

        /* Password Hint */
        .password-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: rgba(66, 165, 245, 0.05);
          border-radius: 8px;
          border-left: 3px solid rgba(66, 165, 245, 0.3);
        }

        .hint-icon {
          font-size: 1rem;
          color: #4a5568;
        }

        .hint-text {
          color: #4a5568;
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Terms Section */
        .terms-section {
          margin: 2rem 0;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          text-align: left;
        }

        .terms-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(66, 165, 245, 0.3);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 0.2rem;
        }

        .terms-checkbox:checked {
          background: #42a5f5;
          border-color: #42a5f5;
        }

        .terms-checkbox:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .terms-label {
          color: #4a5568;
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.4;
        }

        .terms-link {
          color: #1976d2;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .terms-link:hover {
          color: #0d47a1;
          text-decoration: underline;
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
          opacity: 0.7;
          cursor: not-allowed;
          background: linear-gradient(135deg, #a0aec0, #718096);
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

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          margin: 2.5rem 0;
          color: #718096;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(66, 165, 245, 0.2);
        }

        .divider-text {
          padding: 0 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #718096;
        }

        /* Login Redirect */
        .login-redirect-section {
          margin-bottom: 2.5rem;
        }

        .login-redirect-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.9rem 2rem;
          border: 2px solid rgba(66, 165, 245, 0.3);
          border-radius: 12px;
          background: white;
          color: #1976d2;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .login-redirect-button:hover {
          background: rgba(66, 165, 245, 0.1);
          border-color: #42a5f5;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(66, 165, 245, 0.2);
        }

        .redirect-icon {
          font-size: 1.2rem;
        }

        /* Feature Highlights */
        .feature-highlights {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(66, 165, 245, 0.05), rgba(21, 101, 192, 0.05));
          border-radius: 16px;
          border: 2px solid rgba(66, 165, 245, 0.1);
        }

        .features-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
          text-align: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 10px;
          border: 1px solid rgba(66, 165, 245, 0.1);
        }

        .feature-icon {
          font-size: 1.2rem;
          color: #1976d2;
        }

        .feature-text {
          color: #4a5568;
          font-size: 0.9rem;
          font-weight: 500;
          text-align: left;
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
          .register-card {
            padding: 2.5rem 2rem;
          }

          .register-title {
            font-size: 2rem;
          }

          .title-icon {
            font-size: 1.8rem;
          }

          .register-subtitle {
            font-size: 1rem;
          }

          .form-input {
            padding: 0.9rem 1.25rem;
          }

          .submit-button {
            padding: 1rem;
            font-size: 1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .login-redirect-button {
            padding: 0.8rem 1.5rem;
            font-size: 0.95rem;
          }
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 2rem 1.5rem;
            border-radius: 20px;
          }

          .register-title {
            font-size: 1.75rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .title-icon {
            font-size: 1.5rem;
          }

          .register-subtitle {
            font-size: 0.95rem;
          }

          .error-alert, .success-alert {
            padding: 0.9rem 1.25rem;
          }

          .form-input {
            padding: 0.8rem 1rem;
            font-size: 0.95rem;
          }

          .terms-label {
            font-size: 0.9rem;
          }

          .submit-button {
            padding: 0.9rem;
            font-size: 0.95rem;
          }

          .login-redirect-button {
            width: 100%;
            padding: 0.8rem;
            font-size: 0.9rem;
          }

          .feature-item {
            padding: 0.6rem;
          }

          .feature-text {
            font-size: 0.85rem;
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
};

export default Register;