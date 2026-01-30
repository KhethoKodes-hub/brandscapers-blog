import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const location = useLocation();

  // check if logged in and role
  const logged = !!localStorage.getItem('token');
  const role = localStorage.getItem('role'); // "admin" or "user"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (loginDropdownOpen && !event.target.closest('.login-dropdown-container')) {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [loginDropdownOpen]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          <Link to="/" className="brand">
            <span className="brand-icon">✨</span>Brandscapers Africa
          </Link>

          <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className={`line ${mobileMenuOpen ? 'rotate1' : ''}`}></span>
            <span className={`line ${mobileMenuOpen ? 'fade' : ''}`}></span>
            <span className={`line ${mobileMenuOpen ? 'rotate2' : ''}`}></span>
          </div>

          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <Link className={location.pathname === '/' ? 'active' : ''} to="/">
              Home
            </Link>

            {/* Admin dashboard link only */}
            {logged && role === 'admin' && (
              <Link className={location.pathname === '/admin' ? 'active' : ''} to="/admin">
                Dashboard <span className="badge">Admin</span>
              </Link>
            )}

            {/* =========================================== */}
            {/* ADMIN LOGIN BUTTON - CURRENTLY COMMENTED OUT */}
            {/* =========================================== */}
            
            {/* Admin login link if not logged in */}
            {/* 
            {!logged && (
              <Link className={location.pathname === '/admin-login' ? 'active' : ''} to="/admin-login">
                Admin Login
              </Link>
            )}
            */}

            {/* =========================================== */}
            {/* TO RE-ENABLE: Remove the comment markers above */}
            {/* =========================================== */}

            {/* User login dropdown if not logged in */}
            {!logged && (
              <div className="login-dropdown-container">
                <button 
                  className={`login-dropdown-btn ${location.pathname === '/login' || location.pathname === '/register' ? 'active' : ''}`}
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                >
                  Login
                  <span className="dropdown-arrow">▾</span>
                </button>
                {loginDropdownOpen && (
                  <div className="login-dropdown-menu">
                    <Link
                      className={`dropdown-item ${location.pathname === '/login' ? 'active' : ''}`}
                      to="/login"
                      onClick={() => {
                        setLoginDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      className={`dropdown-item ${location.pathname === '/register' ? 'active' : ''}`}
                      to="/register"
                      onClick={() => {
                        setLoginDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Logout button */}
            {logged && (
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      <style jsx="true">{`
        /* Navbar general */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(40px) saturate(180%);
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: center;
          transition: all 0.4s ease;
        }
        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(50px) saturate(200%);
          padding: 0.75rem 1.5rem;
          box-shadow: 0 15px 40px rgba(21, 101, 192, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .navbar-container {
          width: 100%;
          max-width: 1200px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Brand */
        .brand {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 1.8rem;
          text-decoration: none;
          background: linear-gradient(135deg, #0d47a1, #42a5f5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: flex;
          align-items: center;
        }
        .brand-icon {
          margin-right: 0.5rem;
          font-size: 1.3em;
          animation: float 3s ease-in-out infinite;
        }

        /* Nav links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .nav-links a {
          text-decoration: none;
          padding: 0.55rem 1rem;
          border-radius: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          color: #1565c0;
          white-space: nowrap;
        }
        .nav-links a.active {
          color: #0d47a1;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(30px) saturate(180%);
          border: 2px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 8px 20px rgba(21, 101, 192, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          font-weight: 700;
        }

        /* Login Dropdown */
        .login-dropdown-container {
          position: relative;
        }
        
        .login-dropdown-btn {
          padding: 0.55rem 1rem 0.55rem 1.5rem;
          border-radius: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
          color: #1565c0;
          white-space: nowrap;
          border: 2px solid rgba(255, 255, 255, 0.6);
          background: linear-gradient(135deg, #0d47a1, #1976d2);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: inherit;
          font-family: inherit;
        }
        
        .login-dropdown-btn.active {
          color: #0d47a1;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(30px) saturate(180%);
          border: 2px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 8px 20px rgba(21, 101, 192, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8);
          font-weight: 700;
          color: white;
        }
        
        .login-dropdown-btn:hover {
          background: linear-gradient(135deg, #1565c0, #0d47a1);
          transform: translateY(-1px);
          box-shadow: 0 10px 25px rgba(21, 101, 192, 0.2);
        }
        
        .dropdown-arrow {
          font-size: 1.2em;
          transition: transform 0.3s ease;
          line-height: 0.8;
        }
        
        .login-dropdown-container:hover .dropdown-arrow {
          transform: rotate(180deg);
        }
        
        .login-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 140px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(30px) saturate(200%);
          border-radius: 16px;
          border: 2px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 15px 40px rgba(21, 101, 192, 0.2), 
                      0 5px 15px rgba(0, 0, 0, 0.1);
          z-index: 1001;
          overflow: hidden;
          animation: dropdownFade 0.2s ease;
        }
        
        .dropdown-item {
          display: block;
          padding: 0.8rem 1.2rem;
          text-decoration: none;
          color: #1565c0;
          font-weight: 600;
          transition: all 0.2s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          text-align: center;
        }
        
        .dropdown-item:last-child {
          border-bottom: none;
        }
        
        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.5);
          color: #0d47a1;
        }
        
        .dropdown-item.active {
          background: rgba(255, 255, 255, 0.5);
          color: #0d47a1;
          font-weight: 700;
        }

        .badge {
          font-size: 0.55rem;
          font-weight: 700;
          padding: 0.15rem 0.35rem;
          margin-left: 0.25rem;
          border-radius: 10px;
          background: linear-gradient(135deg, #1976d2, #42a5f5);
          color: white;
        }

        .logout-btn {
          margin-left: 0.5rem;
          padding: 0.55rem 1.5rem;
          font-weight: 700;
          border-radius: 16px;
          border: 2px solid rgba(255, 255, 255, 0.6);
          background: linear-gradient(135deg, #0d47a1, #1976d2);
          color: white;
          cursor: pointer;
        }

        /* Hamburger */
        .mobile-toggle {
          display: none;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
        }
        .line {
          width: 22px;
          height: 2px;
          background: linear-gradient(135deg, #0d47a1, #1976d2);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .rotate1 {
          transform: translateY(6px) rotate(45deg);
        }
        .rotate2 {
          transform: translateY(-6px) rotate(-45deg);
        }
        .fade {
          opacity: 0;
        }

        /* Mobile */
        @media (max-width: 992px) {
          .mobile-toggle {
            display: flex;
          }
          .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(40px) saturate(180%);
            flex-direction: column;
            align-items: center;
            padding: 1rem 0;
            gap: 0.5rem;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
          }
          .nav-links.open {
            max-height: 600px;
          }
          
          .login-dropdown-container {
            width: 85%;
            text-align: center;
          }
          
          .login-dropdown-btn {
            width: 100%;
            justify-content: center;
            margin: 0.25rem 0;
          }
          
          .login-dropdown-menu {
            position: static;
            width: 100%;
            margin-top: 0.5rem;
            background: rgba(255, 255, 255, 0.8);
            animation: none;
          }
          
          .dropdown-item {
            text-align: center;
            padding: 0.7rem 1rem;
          }
        }

        /* Super small devices <360px */
        @media (max-width: 360px) {
          .brand {
            font-size: 1.5rem;
          }
          .nav-links a, .logout-btn, .login-dropdown-btn {
            font-size: 0.85rem;
            padding: 0.45rem 0.75rem;
          }
          .badge {
            font-size: 0.45rem;
            padding: 0.1rem 0.25rem;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(5deg); }
        }
        
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}