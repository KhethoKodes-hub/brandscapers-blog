// client/src/components/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../firebase'; // make sure you have src/firebase.js configured
import API from '../services/api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeEffect, setShakeEffect] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add a slight delay for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Save Firebase ID token to localStorage for API calls
      localStorage.setItem('token', idToken);

      // ✅ NEW: store role so NavBar knows this is an admin
      localStorage.setItem('role', 'admin');

      // Trigger the unlock animation
      document.body.classList.add('admin-unlock-effect');
      
      // Wait for animation to complete before navigating
      setTimeout(() => {
        alert('🔓 ACCESS GRANTED! Welcome back, Administrator.');
        nav('/admin');
      }, 1800);
      
    } catch (err) {
      console.error(err);
      setShakeEffect(true);
      setTimeout(() => setShakeEffect(false), 500);
      alert('⚠️ ACCESS DENIED! Invalid credentials detected.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ------------------ ENHANCED STYLES ------------------
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 30%, #42a5f5 70%, #bbdefb 100%)',
    position: 'relative',
    overflow: 'hidden'
  };

  const meshOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(66, 165, 245, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 60% 20%, rgba(13, 71, 161, 0.08) 0%, transparent 50%)
    `,
    animation: 'meshFloat 8s ease-in-out infinite alternate'
  };

  const cardStyle = {
    position: 'relative',
    zIndex: 10,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
    backdropFilter: 'blur(40px) saturate(200%)',
    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
    borderRadius: '32px',
    padding: '3rem 2.5rem',
    maxWidth: '480px',
    width: '100%',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    boxShadow: `
      0 20px 60px rgba(0, 0, 0, 0.3),
      0 8px 32px rgba(66, 165, 245, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
    `,
    transform: shakeEffect ? 'translateX(0)' : 'translateX(0)',
    animation: shakeEffect ? 'shake 0.5s ease-in-out' : 'none'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #ffffff 0%, #bbdefb 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: '2.5rem',
    fontWeight: '900',
    marginBottom: '1rem',
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif",
    textShadow: '0 4px 20px rgba(66, 165, 245, 0.4)',
    letterSpacing: '-0.5px'
  };

  const subheaderStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: '2.5rem',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    fontWeight: '400',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    padding: '1rem 1.5rem',
    color: 'white',
    fontSize: '1rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: '1.5rem',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(187, 222, 251, 0.9) 100%)',
    border: 'none',
    borderRadius: '25px',
    padding: '1.2rem 2.5rem',
    color: '#0d47a1',
    fontSize: '1.1rem',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
    marginTop: '1rem',
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    boxShadow: '0 10px 30px rgba(255, 255, 255, 0.2)'
  };

  const iconStyle = {
    fontSize: '4rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
    display: 'block',
    filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))'
  };

  const securityBadgeStyle = {
    marginTop: '2rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)'
  };

  // Glass morphism particles
  const particles = Array.from({ length: 15 }, (_, i) => {
    const size = Math.random() * 60 + 20;
    return {
      style: {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        background: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`,
        borderRadius: '50%',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        filter: 'blur(20px)',
        animation: `floatParticle ${Math.random() * 10 + 10}s ease-in-out infinite`
      }
    };
  });

  return (
    <div style={containerStyle}>
      <div style={meshOverlayStyle} />
      
      {particles.map((particle, i) => (
        <div key={i} style={particle.style} />
      ))}
      
      {/* Animated lock elements */}
      <div className="lock-shards" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        opacity: 0
      }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="shard" style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(66,165,245,0.8) 100%)',
            borderRadius: '4px',
            transformOrigin: 'center'
          }} />
        ))}
      </div>

      <style>
        {`
          @keyframes meshFloat { 
            0%, 100% { 
              transform: translate(0,0) scale(1); 
              opacity: 1; 
            } 
            25% { 
              transform: translate(2%, -2%) scale(1.02); 
              opacity: 0.9;
            } 
            50% { 
              transform: translate(-1%,1%) scale(0.99); 
              opacity: 0.95;
            } 
            75% { 
              transform: translate(-2%,-1%) scale(1.01); 
              opacity: 0.92;
            } 
          }
          
          @keyframes float { 
            0%, 100% { 
              transform: translateY(0px) rotate(0deg); 
            } 
            50% { 
              transform: translateY(-15px) rotate(3deg); 
            } 
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          
          @keyframes floatParticle {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg); 
            }
            33% { 
              transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(120deg); 
            }
            66% { 
              transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(240deg); 
            }
          }
          
          @keyframes pulseGlow {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); 
            }
            50% { 
              box-shadow: 0 0 40px rgba(66, 165, 245, 0.6), 0 0 60px rgba(255, 255, 255, 0.4); 
            }
          }
          
          @keyframes unlockExplosion {
            0% { 
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
            100% { 
              opacity: 0;
              transform: scale(0) rotate(720deg);
            }
          }
          
          @keyframes shardExplode {
            0% {
              opacity: 0;
              transform: translate(0, 0) rotate(0deg) scale(1);
            }
            20% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: 
                translate(
                  ${Math.random() * 400 - 200}px, 
                  ${Math.random() * 400 - 200}px
                ) 
                rotate(${Math.random() * 720}deg) 
                scale(0);
            }
          }
          
          .form-control {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }
          
          .form-control:focus {
            background: rgba(255, 255, 255, 0.25) !important;
            border-color: rgba(255, 255, 255, 0.8) !important;
            box-shadow: 
              0 15px 40px rgba(66, 165, 245, 0.3), 
              inset 0 2px 0 rgba(255, 255, 255, 0.9) !important;
            transform: translateY(-4px) !important;
            color: white !important;
            outline: none !important;
            animation: pulseGlow 2s infinite !important;
          }
          
          .form-control::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
          
          .unlock-icon {
            animation: float 3s ease-in-out infinite;
          }
          
          button:hover:not(:disabled) {
            background: linear-gradient(135deg, #ffffff 0%, #90caf9 100%) !important;
            transform: translateY(-4px) scale(1.02) !important;
            box-shadow: 
              0 20px 50px rgba(255, 255, 255, 0.4),
              0 10px 40px rgba(66, 165, 245, 0.6) !important;
            letter-spacing: 2px !important;
          }
          
          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          button:active:not(:disabled) {
            transform: translateY(-2px) scale(0.98) !important;
            transition: all 0.1s ease !important;
          }
          
          /* Unlock Animation Effect */
          .admin-unlock-effect .unlock-icon {
            animation: unlockExplosion 1.5s ease-in-out forwards !important;
          }
          
          .admin-unlock-effect .lock-shards {
            opacity: 1;
          }
          
          .admin-unlock-effect .lock-shards .shard {
            animation: shardExplode 1.5s ease-out forwards;
            animation-delay: ${Math.random() * 0.5}s;
          }
          
          .admin-unlock-effect {
            animation: unlockPageReveal 2s ease-out forwards !important;
          }
          
          @keyframes unlockPageReveal {
            0% {
              background: linear-gradient(135deg, #0d47a1 0%, #1565c0 100%);
            }
            20% {
              background: linear-gradient(135deg, #42a5f5 0%, #bbdefb 100%);
            }
            100% {
              background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%);
            }
          }
          
          /* Crystal effect for inputs */
          .form-control {
            position: relative;
            overflow: hidden;
          }
          
          .form-control::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(
              45deg,
              transparent 30%,
              rgba(255, 255, 255, 0.1) 50%,
              transparent 70%
            );
            transform: rotate(45deg);
            transition: transform 0.6s ease;
          }
          
          .form-control:focus::after {
            transform: rotate(45deg) translate(50%, 50%);
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            .container {
              padding: 1rem !important;
            }
            
            .card {
              padding: 2rem 1.5rem !important;
              border-radius: 24px !important;
            }
            
            h1 {
              font-size: 2rem !important;
            }
          }
        `}
      </style>

      <div style={cardStyle}>
        <div className="unlock-icon" style={iconStyle}>🔐</div>
        <h1 style={headerStyle}>ADMIN SANCTUM</h1>
        <p style={subheaderStyle}>
          <strong>Warning:</strong> This terminal is restricted to authorized personnel only.<br/>
          Unauthorized access attempts are monitored and logged.
        </p>

        <form onSubmit={submit}>
          <div className="mb-4">
            <input 
              className="form-control"
              style={inputStyle}
              placeholder="⚡ ADMIN IDENTIFIER"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input 
              className="form-control"
              style={inputStyle}
              placeholder="🔑 CRYPTIC CIPHER"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            style={buttonStyle} 
            type="submit" 
            disabled={!email.trim() || !password.trim() || isSubmitting}
          >
            {isSubmitting ? '🔓 DECRYPTING...' : '⚡ INITIATE ACCESS SEQUENCE'}
          </button>
        </form>

        <div style={securityBadgeStyle}>
          <small style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.9rem',
            fontWeight: '600',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span style={{
              fontSize: '1.2rem',
              animation: 'float 2s ease-in-out infinite',
              animationDelay: '0.5s'
            }}>🛡️</span>
            QUANTUM-ENCRYPTED ACCESS PORTAL • TIER 9 CLEARANCE REQUIRED
          </small>
        </div>
      </div>
    </div>
  );
}