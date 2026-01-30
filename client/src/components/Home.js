// client/src/components/Home.js
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Sophisticated navy-blue-white gradient background
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(165deg, #0a1929 0%, #132f4c 15%, #1e4976 30%, #2563a0 45%, #3b82c9 60%, #5fa3db 75%, #8fc4ed 90%, #ffffff 100%)',
    backgroundAttachment: 'fixed',
    padding: '3rem 1rem',
    position: 'relative',
    overflow: 'hidden'
  };

  // Animated gradient mesh overlay
  const meshOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 15% 25%, rgba(37, 99, 160, 0.15) 0%, transparent 45%),
      radial-gradient(circle at 85% 15%, rgba(10, 25, 41, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 50% 60%, rgba(95, 163, 219, 0.12) 0%, transparent 55%),
      radial-gradient(circle at 25% 85%, rgba(255, 255, 255, 0.18) 0%, transparent 40%),
      radial-gradient(circle at 75% 75%, rgba(19, 47, 76, 0.15) 0%, transparent 48%)
    `,
    pointerEvents: 'none',
    zIndex: 0,
    animation: 'meshDrift 25s ease-in-out infinite alternate'
  };

  // Hero section
  const heroStyle = {
    textAlign: 'center',
    marginBottom: '5rem',
    padding: '5rem 1.5rem',
    position: 'relative',
    zIndex: 1
  };

  const heroBackgroundStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '92%',
    height: '95%',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
    backdropFilter: 'blur(80px) saturate(180%)',
    WebkitBackdropFilter: 'blur(80px) saturate(180%)',
    borderRadius: '48px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    boxShadow: `
      0 30px 90px rgba(10, 25, 41, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.4),
      0 0 120px rgba(95, 163, 219, 0.15)
    `,
    zIndex: 0
  };

  const headerStyle = {
    color: '#ffffff',
    fontWeight: '900',
    marginBottom: '1.5rem',
    fontSize: 'clamp(2.8rem, 7vw, 5rem)',
    letterSpacing: '-0.04em',
    background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 25%, #90caf9 50%, #5fa3db 75%, #2563a0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: '1.1',
    position: 'relative',
    zIndex: 1,
    textShadow: '0 8px 24px rgba(255, 255, 255, 0.2)',
    filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.3))'
  };

  const subheaderStyle = {
    color: '#e3f2fd',
    fontSize: 'clamp(1.15rem, 2.8vw, 1.65rem)',
    fontWeight: '500',
    maxWidth: '750px',
    margin: '0 auto 2.5rem',
    lineHeight: '1.7',
    position: 'relative',
    zIndex: 1,
    textShadow: '0 2px 8px rgba(10, 25, 41, 0.4)',
    opacity: 0.95
  };

  const statsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '2.5rem',
    flexWrap: 'wrap',
    marginTop: '3.5rem',
    position: 'relative',
    zIndex: 1
  };

  const statStyle = {
    textAlign: 'center',
    padding: '2.5rem 3rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)',
    backdropFilter: 'blur(60px) saturate(180%)',
    WebkitBackdropFilter: 'blur(60px) saturate(180%)',
    borderRadius: '28px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: `
      0 20px 50px rgba(10, 25, 41, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.3)
    `,
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: '160px',
    cursor: 'pointer'
  };

  const statNumberStyle = {
    fontSize: '3rem',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #ffffff 0%, #90caf9 50%, #5fa3db 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '0.5rem',
    filter: 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.3))'
  };

  const statLabelStyle = {
    color: '#b3d9f2',
    fontWeight: '600',
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    textShadow: '0 2px 4px rgba(10, 25, 41, 0.3)'
  };

  // Modern grid layout
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
    gap: '3rem',
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '0 1.5rem',
    position: 'relative',
    zIndex: 1
  };

  // Enhanced card styles with sophisticated glassmorphism
  const getCardStyle = (isHovered, index) => ({
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
    backdropFilter: 'blur(60px) saturate(180%)',
    WebkitBackdropFilter: 'blur(60px) saturate(180%)',
    borderRadius: '36px',
    border: isHovered 
      ? '1px solid rgba(255, 255, 255, 0.35)' 
      : '1px solid rgba(255, 255, 255, 0.18)',
    boxShadow: isHovered 
      ? `
        0 50px 120px rgba(10, 25, 41, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        0 0 100px rgba(95, 163, 219, 0.3)
      `
      : `
        0 25px 70px rgba(10, 25, 41, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.25)
      `,
    transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transform: isHovered ? 'translateY(-24px) scale(1.02)' : 'translateY(0) scale(1)',
    cursor: 'pointer',
    position: 'relative',
    animation: `cardAppear 0.9s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s both`
  });

  const imageContainerStyle = {
    position: 'relative',
    overflow: 'hidden',
    height: '280px',
    background: 'linear-gradient(135deg, rgba(10, 25, 41, 0.9) 0%, rgba(37, 99, 160, 0.85) 50%, rgba(95, 163, 219, 0.8) 100%)'
  };

  const getImageStyle = (isHovered) => ({
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered ? 'scale(1.18) rotate(1deg)' : 'scale(1.08)',
    filter: isHovered 
      ? 'brightness(1.1) contrast(1.08) saturate(1.15)' 
      : 'brightness(0.98) contrast(1.02) saturate(1.05)'
  });

  const gradientOverlayStyle = (isHovered) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: isHovered 
      ? 'linear-gradient(180deg, rgba(10, 25, 41, 0.2) 0%, rgba(37, 99, 160, 0.4) 100%)'
      : 'linear-gradient(180deg, rgba(10, 25, 41, 0.35) 0%, rgba(37, 99, 160, 0.5) 100%)',
    backdropFilter: 'blur(2px)',
    transition: 'all 0.6s ease',
    zIndex: 1
  });

  const contentStyle = {
    padding: '2.8rem 2.4rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.4rem',
    position: 'relative',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)'
  };

  const cardTitleStyle = {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 'clamp(1.4rem, 2.2vw, 1.75rem)',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    letterSpacing: '-0.02em',
    textShadow: '0 2px 8px rgba(10, 25, 41, 0.4)'
  };

  const cardTextStyle = (isHovered) => ({
    color: '#b3d9f2',
    lineHeight: '1.75',
    fontSize: '1.05rem',
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: isHovered ? '8' : '3',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    transition: 'all 0.5s ease',
    marginBottom: '0.5rem',
    textShadow: '0 1px 3px rgba(10, 25, 41, 0.3)',
    opacity: 0.92
  });

  const metaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1.8rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
    marginTop: 'auto'
  };

  const buttonStyle = (isHovered) => ({
    borderRadius: '20px',
    padding: '1.1rem 2.4rem',
    fontWeight: '700',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    background: isHovered 
      ? 'linear-gradient(135deg, #0a1929 0%, #132f4c 50%, #1e4976 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    color: isHovered ? '#ffffff' : '#e3f2fd',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isHovered 
      ? `
        0 25px 50px rgba(10, 25, 41, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `
      : `
        0 12px 35px rgba(10, 25, 41, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.15)
      `,
    transform: isHovered ? 'translateY(-4px) scale(1.03)' : 'translateY(0) scale(1)',
    fontSize: '1rem',
    letterSpacing: '0.03em',
    textShadow: isHovered ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(10, 25, 41, 0.2)'
  });

  const likeStyle = {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#ff6b9d',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.85rem 1.5rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    borderRadius: '18px',
    transition: 'all 0.4s ease',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: `
      0 10px 25px rgba(255, 107, 157, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `
  };

  const tagStyle = {
    position: 'absolute',
    top: '1.8rem',
    right: '1.8rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
    backdropFilter: 'blur(30px) saturate(180%)',
    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
    padding: '0.7rem 1.4rem',
    borderRadius: '22px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ffffff',
    zIndex: 2,
    boxShadow: `
      0 10px 25px rgba(10, 25, 41, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3)
    `,
    border: '1px solid rgba(255, 255, 255, 0.25)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    textShadow: '0 2px 4px rgba(10, 25, 41, 0.4)'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
    flexDirection: 'column',
    gap: '2.5rem',
    position: 'relative',
    zIndex: 1
  };

  const loadingSpinnerStyle = {
    width: '70px',
    height: '70px',
    border: '5px solid rgba(255, 255, 255, 0.15)',
    borderTop: '5px solid #90caf9',
    borderRadius: '50%',
    animation: 'spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 25px rgba(144, 202, 249, 0.3)'
  };

  const noPostsStyle = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
    backdropFilter: 'blur(60px) saturate(180%)',
    WebkitBackdropFilter: 'blur(60px) saturate(180%)',
    borderRadius: '40px',
    padding: 'clamp(3.5rem, 7vw, 6rem)',
    textAlign: 'center',
    color: '#e3f2fd',
    fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)',
    boxShadow: `
      0 30px 80px rgba(10, 25, 41, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    maxWidth: '700px',
    margin: '0 auto',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    zIndex: 1
  };

  return (
    <div style={containerStyle}>
      <div style={meshOverlayStyle} />
      <style>
        {`
          @keyframes meshDrift {
            0% { 
              transform: translate(0, 0) scale(1) rotate(0deg);
              opacity: 1;
            }
            33% { 
              transform: translate(6%, -4%) scale(1.08) rotate(2deg);
              opacity: 0.88;
            }
            66% { 
              transform: translate(-4%, 5%) scale(0.96) rotate(-1deg);
              opacity: 0.92;
            }
            100% { 
              transform: translate(-6%, -3%) scale(1.04) rotate(1deg);
              opacity: 0.9;
            }
          }
          
          @keyframes cardAppear {
            from {
              opacity: 0;
              transform: translateY(60px) scale(0.88);
              filter: blur(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(3deg); }
          }
          
          .floating-emoji {
            animation: float 3.5s ease-in-out infinite;
          }
          
          div[style*="statStyle"]:hover {
            transform: translateY(-6px) scale(1.05);
            box-shadow: 0 30px 70px rgba(10, 25, 41, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
            border-color: rgba(255, 255, 255, 0.35);
          }
        `}
      </style>

      {/* Hero Section */}
      <div style={heroStyle}>
        <div style={heroBackgroundStyle} />
        <h1 style={headerStyle}>
          Welcome to<br />
          Brandscapers Africa Blog
        </h1>
        <p style={subheaderStyle}>
          Discover transformative insights, innovative strategies, and inspiring stories 
          that shape the future of branding in Africa and beyond.
        </p>
        
        <div style={statsContainerStyle}>
          <div style={statStyle}>
            <div style={statNumberStyle}>{posts.length}</div>
            <div style={statLabelStyle}>Articles</div>
          </div>
          <div style={statStyle}>
            <div style={statNumberStyle}>
              {posts.reduce((total, post) => total + (post.likes || 0), 0)}
            </div>
            <div style={statLabelStyle}>Total Likes</div>
          </div>
          <div style={statStyle}>
            <div style={statNumberStyle}>
              {posts.filter(p => p.published).length}
            </div>
            <div style={statLabelStyle}>Published</div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={loadingStyle}>
          <div style={loadingSpinnerStyle}></div>
          <div style={{ 
            color: '#90caf9', 
            fontWeight: '600', 
            fontSize: '1.2rem', 
            textShadow: '0 2px 8px rgba(10, 25, 41, 0.4)',
            letterSpacing: '0.02em'
          }}>
            Loading amazing content...
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && posts.length > 0 ? (
        <div style={gridStyle}>
          {posts.map((p, index) => {
            const isHovered = hoveredCard === p._id;
            return (
              <div 
                key={p._id}
                style={getCardStyle(isHovered, index)}
                onMouseEnter={() => setHoveredCard(p._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={imageContainerStyle}>
                  <div style={gradientOverlayStyle(isHovered)} />
                  {p.coverImage ? (
                    <img 
                      src={p.coverImage} 
                      alt={p.title} 
                      style={getImageStyle(isHovered)}
                    />
                  ) : (
                    <div style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4.5rem',
                      transform: isHovered ? 'scale(1.35) rotate(6deg)' : 'scale(1)',
                      transition: 'transform 0.5s ease',
                      filter: 'drop-shadow(0 8px 16px rgba(10, 25, 41, 0.4))'
                    }} className="floating-emoji">
                      📝
                    </div>
                  )}
                  <div style={tagStyle}>
                    {p.published ? '📢 Published' : '📝 Draft'}
                  </div>
                </div>

                <div style={contentStyle}>
                  <h5 style={cardTitleStyle}>{p.title}</h5>
                  <p style={cardTextStyle(isHovered)}>
                    {p.excerpt || (p.content && p.content.slice(0, 200) + '...')}
                  </p>
                  
                  <div style={metaStyle}>
                    <Link 
                      style={buttonStyle(isHovered)} 
                      to={`/post/${p.slug}`}
                    >
                      Read Story →
                    </Link>
                    <div style={likeStyle}>
                      <span>{p.likes || 0}</span>
                      <span>❤️</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : !loading && (
        <div style={noPostsStyle}>
          <div style={{ 
            fontSize: '5.5rem', 
            marginBottom: '2.5rem',
            filter: 'drop-shadow(0 8px 16px rgba(10, 25, 41, 0.3))'
          }} className="floating-emoji">📚</div>
          <h3 style={{ 
            color: '#ffffff', 
            marginBottom: '1.2rem', 
            fontWeight: '800', 
            textShadow: '0 3px 10px rgba(10, 25, 41, 0.4)',
            fontSize: '1.8rem'
          }}>
            No Stories Yet
          </h3>
          <p style={{ 
            color: '#b3d9f2', 
            lineHeight: '1.75',
            opacity: 0.9
          }}>
            Our content team is working on creating amazing stories for you. 
            Check back soon for inspiring content!
          </p>
        </div>
      )}
    </div>
  );
}