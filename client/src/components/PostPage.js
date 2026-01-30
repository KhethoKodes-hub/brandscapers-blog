// client/src/components/PostPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [hoveredComment, setHoveredComment] = useState(null);
  const [commentReactions, setCommentReactions] = useState({});
  const [reactionAnimations, setReactionAnimations] = useState({});
  const [userReactedComments, setUserReactedComments] = useState({});
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [hoveredShare, setHoveredShare] = useState(null);
  const [sharePulse, setSharePulse] = useState(false);
  const [orbitActive, setOrbitActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [heartBurst, setHeartBurst] = useState([]);
  const [orbitalHearts, setOrbitalHearts] = useState([]);
  const [explosionParticles, setExplosionParticles] = useState([]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get(`/posts/slug/${slug}`);
        setPost({
          ...res.data,
          liked: res.data.liked || false
        });
        
        const storedReactions = JSON.parse(localStorage.getItem(`post_${slug}_reactions`)) || {};
        
        if (res.data.comments) {
          const initialReactions = { ...storedReactions };
          
          res.data.comments.forEach(comment => {
            if (comment._id && comment.reactions) {
              Object.entries(comment.reactions).forEach(([type, count]) => {
                const key = `${comment._id}-${type}`;
                if (!initialReactions[key]) {
                  initialReactions[key] = count;
                }
              });
            }
          });
          
          if (Object.keys(storedReactions).length === 0 && Object.keys(initialReactions).length > 0) {
            setCommentReactions(initialReactions);
            localStorage.setItem(`post_${slug}_reactions`, JSON.stringify(initialReactions));
          } else {
            setCommentReactions(storedReactions);
          }
        } else {
          setCommentReactions(storedReactions);
        }

        const userReactions = JSON.parse(localStorage.getItem(`user_reactions_${slug}`)) || {};
        setUserReactedComments(userReactions);
      } catch (err) {
        console.error('LOAD POST ERROR:', err);
      }
    }
    load();
  }, [slug]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSharePulse(true);
      setTimeout(() => setSharePulse(false), 1500);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = async () => {
    if (!post) return;

    try {
      const res = await API.put(`/posts/${post._id}/like`);
      setPost(prev => ({
        ...prev,
        likes: res.data.likes,
        liked: res.data.liked
      }));
      
      if (res.data.liked) {
        setShowHeartAnimation(true);
        
        // Create quantum heart burst with spiral pattern
        const burstHearts = [];
        const heartCount = isMobile ? 20 : 30;
        
        for (let i = 0; i < heartCount; i++) {
          const spiralTurns = 3;
          const angle = (Math.PI * 2 * spiralTurns * i) / heartCount;
          const distance = 60 + (i / heartCount) * 180;
          
          burstHearts.push({
            id: `burst-${Date.now()}-${i}`,
            angle: angle,
            distance: distance,
            size: 0.4 + Math.random() * 1.2,
            rotation: Math.random() * 720,
            delay: i * 25,
            color: ['#ff1744', '#f50057', '#ff4081', '#ff6b9d', '#ff8fab', '#ffa3ba'][Math.floor(Math.random() * 6)],
            type: ['❤️', '💖', '💕', '💗', '💓'][Math.floor(Math.random() * 5)]
          });
        }
        
        // Create orbital hearts
        const orbits = [];
        for (let i = 0; i < (isMobile ? 8 : 12); i++) {
          const orbitRadius = 100 + (i % 3) * 40;
          orbits.push({
            id: `orbit-${Date.now()}-${i}`,
            radius: orbitRadius,
            speed: 1 + Math.random() * 2,
            startAngle: (Math.PI * 2 * i) / (isMobile ? 8 : 12),
            size: 0.6 + Math.random() * 0.8,
            delay: i * 50
          });
        }
        
        // Create explosion particles
        const particles = [];
        for (let i = 0; i < (isMobile ? 30 : 50); i++) {
          const angle = Math.random() * Math.PI * 2;
          const velocity = 50 + Math.random() * 150;
          particles.push({
            id: `particle-${Date.now()}-${i}`,
            x: Math.cos(angle) * velocity,
            y: Math.sin(angle) * velocity,
            size: 2 + Math.random() * 6,
            color: ['#ff1744', '#f50057', '#ff4081', '#ffeb3b', '#fff'][Math.floor(Math.random() * 5)],
            delay: i * 10
          });
        }
        
        setHeartBurst(burstHearts);
        setOrbitalHearts(orbits);
        setExplosionParticles(particles);
        
        setTimeout(() => {
          setShowHeartAnimation(false);
          setHeartBurst([]);
          setOrbitalHearts([]);
          setExplosionParticles([]);
        }, 3000);
      }
    } catch (err) {
      console.error('LIKE POST ERROR:', err);
      alert('You must be logged in to like this post');
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await API.post(`/posts/${post._id}/comments`, { text: commentText });
      const res = await API.get(`/posts/slug/${slug}`);
      setPost(res.data);
      setCommentText('');
    } catch (err) {
      console.error('POST COMMENT ERROR:', err);
      alert('Failed to post comment');
    }
  };

  const handleCommentReaction = (commentId, reactionType, emoji) => {
    if (!post) return;
    
    const reactionKey = `${commentId}-${reactionType}`;
    const userReactionsKey = `${commentId}`;
    const currentUserReactions = { ...userReactedComments };
    
    const userHasReacted = currentUserReactions[userReactionsKey];
    
    if (userHasReacted === reactionType) {
      const updatedReactions = { ...commentReactions };
      const currentCount = updatedReactions[reactionKey] || 0;
      
      if (currentCount > 0) {
        updatedReactions[reactionKey] = currentCount - 1;
        delete currentUserReactions[userReactionsKey];
        
        setCommentReactions(updatedReactions);
        setUserReactedComments(currentUserReactions);
        
        localStorage.setItem(`post_${slug}_reactions`, JSON.stringify(updatedReactions));
        localStorage.setItem(`user_reactions_${slug}`, JSON.stringify(currentUserReactions));
      }
    } else if (userHasReacted) {
      const updatedReactions = { ...commentReactions };
      
      const previousReactionKey = `${commentId}-${userHasReacted}`;
      const previousCount = updatedReactions[previousReactionKey] || 0;
      if (previousCount > 0) {
        updatedReactions[previousReactionKey] = previousCount - 1;
      }
      
      const newReactionCount = updatedReactions[reactionKey] || 0;
      updatedReactions[reactionKey] = newReactionCount + 1;
      
      currentUserReactions[userReactionsKey] = reactionType;
      
      setCommentReactions(updatedReactions);
      setUserReactedComments(currentUserReactions);
      
      localStorage.setItem(`post_${slug}_reactions`, JSON.stringify(updatedReactions));
      localStorage.setItem(`user_reactions_${slug}`, JSON.stringify(currentUserReactions));
      
      triggerReactionAnimation(commentId, reactionType, emoji);
    } else {
      const updatedReactions = { ...commentReactions };
      const currentCount = updatedReactions[reactionKey] || 0;
      
      updatedReactions[reactionKey] = currentCount + 1;
      currentUserReactions[userReactionsKey] = reactionType;
      
      setCommentReactions(updatedReactions);
      setUserReactedComments(currentUserReactions);
      
      localStorage.setItem(`post_${slug}_reactions`, JSON.stringify(updatedReactions));
      localStorage.setItem(`user_reactions_${slug}`, JSON.stringify(currentUserReactions));
      
      triggerReactionAnimation(commentId, reactionType, emoji);
    }
  };

  const triggerReactionAnimation = (commentId, reactionType, emoji) => {
    const animKey = `${commentId}-${reactionType}-${Date.now()}`;
    setReactionAnimations(prev => ({ 
      ...prev, 
      [animKey]: { emoji, commentId, reactionType } 
    }));
    
    setTimeout(() => {
      setReactionAnimations(prev => {
        const newAnims = { ...prev };
        delete newAnims[animKey];
        return newAnims;
      });
    }, 1000);
  };

  // Social Sharing Functions
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(post?.title || 'Check out this post!')}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const text = `Check out this post: ${post?.title || 'Amazing article!'}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareOnInstagram = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('✨ Link copied to clipboard! Open Instagram and share the magic! 📱💫');
      })
      .catch(() => {
        alert('✨ Copy this link and share it on Instagram: ' + window.location.href);
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
      })
      .catch(() => {
        alert('Failed to copy link. Please copy it manually: ' + window.location.href);
      });
  };

  const shareViaEmail = () => {
    const subject = `✨ ${post?.title || 'Amazing article!'}`;
    const body = `🌟 I discovered this incredible article and thought you'd love it:\n\n${post?.title}\n\n🔗 Read it here: ${window.location.href}\n\nHappy reading! 📚`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaWhatsApp = () => {
    const text = `Check out this amazing post: ${post?.title || 'Great article!'}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaTelegram = () => {
    const text = `Check out this post: ${post?.title || 'Great article!'}\n${window.location.href}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaReddit = () => {
    const title = post?.title || 'Check out this post!';
    window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}`, '_blank');
  };

  const hasUserReacted = (commentId, reactionType) => {
    return userReactedComments[commentId] === reactionType;
  };

  // Optimized Social Sharing Platforms for Mobile
  const sharePlatforms = [
    { 
      platform: 'facebook', 
      icon: 'f', 
      color: '#1877F2', 
      hoverIcon: 'fb',
      action: shareOnFacebook, 
      label: 'Facebook',
      mobileIcon: '𝐟'
    },
    { 
      platform: 'twitter', 
      icon: '𝕏', 
      color: '#000000', 
      hoverIcon: '𝕏→',
      action: shareOnTwitter, 
      label: 'Twitter',
      mobileIcon: '𝕏'
    },
    { 
      platform: 'linkedin', 
      icon: 'in', 
      color: '#0077B5', 
      hoverIcon: 'in↗',
      action: shareOnLinkedIn, 
      label: 'LinkedIn',
      mobileIcon: 'in'
    },
    { 
      platform: 'instagram', 
      icon: '📸', 
      color: '#E4405F', 
      hoverIcon: '✨',
      action: shareOnInstagram, 
      label: 'Instagram',
      mobileIcon: '📸'
    },
    { 
      platform: 'whatsapp', 
      icon: '💬', 
      color: '#25D366', 
      hoverIcon: '📲',
      action: shareViaWhatsApp, 
      label: 'WhatsApp',
      mobileIcon: '💬'
    },
    { 
      platform: 'telegram', 
      icon: '✈️', 
      color: '#0088CC', 
      hoverIcon: '🚀',
      action: shareViaTelegram, 
      label: 'Telegram',
      mobileIcon: '✈️'
    },
    { 
      platform: 'reddit', 
      icon: '👾', 
      color: '#FF4500', 
      hoverIcon: '🔥',
      action: shareViaReddit, 
      label: 'Reddit',
      mobileIcon: '👾'
    },
    { 
      platform: 'email', 
      icon: '✉️', 
      color: '#EA4335', 
      hoverIcon: '📨',
      action: shareViaEmail, 
      label: 'Email',
      mobileIcon: '✉️'
    },
    { 
      platform: 'copy', 
      icon: '📋', 
      color: '#9C27B0', 
      hoverIcon: '✅',
      action: copyToClipboard, 
      label: 'Copy Link',
      mobileIcon: '📋'
    }
  ];

  // Container styles - Enhanced for mobile
  const containerStyle = {
    padding: isMobile ? '1rem' : 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 1.5rem)',
    minHeight: '100vh',
    background: 'linear-gradient(165deg, #0a1929 0%, #132f4c 15%, #1e4976 30%, #2563a0 45%, #3b82c9 60%, #5fa3db 75%, #8fc4ed 90%, #ffffff 100%)',
    backgroundAttachment: 'fixed',
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
      radial-gradient(circle at 20% 30%, rgba(37, 99, 160, 0.15) 0%, transparent 45%),
      radial-gradient(circle at 80% 20%, rgba(10, 25, 41, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 50% 70%, rgba(95, 163, 219, 0.12) 0%, transparent 55%),
      radial-gradient(circle at 30% 80%, rgba(255, 255, 255, 0.18) 0%, transparent 40%)
    `,
    pointerEvents: 'none',
    zIndex: 0,
    animation: 'meshDrift 25s ease-in-out infinite alternate'
  };

  const articleContainerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
    backdropFilter: 'blur(60px) saturate(180%)',
    WebkitBackdropFilter: 'blur(60px) saturate(180%)',
    borderRadius: isMobile ? '20px' : 'clamp(24px, 5vw, 40px)',
    padding: isMobile ? '1.5rem 1rem' : 'clamp(1.5rem, 5vw, 3.5rem)',
    boxShadow: `
      0 30px 90px rgba(10, 25, 41, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3)
    `,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'relative',
    zIndex: 1,
    wordWrap: 'break-word',
    overflowWrap: 'break-word'
  };

  const titleStyle = {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: isMobile ? '1.75rem' : 'clamp(1.75rem, 5vw, 3.5rem)',
    lineHeight: '1.2',
    marginBottom: '1.5rem',
    letterSpacing: '-0.03em',
    textShadow: '0 4px 12px rgba(10, 25, 41, 0.4)',
    background: 'linear-gradient(135deg, #ffffff 0%, #e3f2fd 40%, #90caf9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    wordWrap: 'break-word',
    overflowWrap: 'break-word'
  };

  const metaInfoStyle = {
    color: '#b3d9f2',
    fontSize: isMobile ? '0.9rem' : 'clamp(0.9rem, 2vw, 1rem)',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    textShadow: '0 1px 3px rgba(10, 25, 41, 0.3)'
  };

  const coverImageStyle = {
    width: '100%',
    borderRadius: isMobile ? '12px' : 'clamp(16px, 3vw, 24px)',
    marginBottom: '1.5rem',
    boxShadow: '0 20px 60px rgba(10, 25, 41, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'hidden'
  };

  const contentStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '1rem' : 'clamp(1rem, 2vw, 1.15rem)',
    lineHeight: '1.7',
    marginBottom: '2rem',
    textShadow: '0 1px 2px rgba(10, 25, 41, 0.2)',
    wordWrap: 'break-word',
    overflowWrap: 'break-word'
  };

  const likeButtonStyle = {
    position: 'relative',
    marginTop: '2rem',
    padding: isMobile ? '1rem 1.5rem' : '1.2rem 2.5rem',
    borderRadius: '24px',
    border: post?.liked ? '2px solid rgba(255, 107, 157, 0.5)' : '2px solid rgba(255, 255, 255, 0.3)',
    background: post?.liked 
      ? 'linear-gradient(135deg, #ff6b9d 0%, #ff4d7d 50%, #ff2e63 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
    backdropFilter: 'blur(40px)',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    boxShadow: post?.liked
      ? '0 20px 50px rgba(255, 107, 157, 0.4)'
      : '0 15px 40px rgba(10, 25, 41, 0.3)',
    width: '100%',
    maxWidth: '300px',
    display: 'block',
    margin: '2rem auto'
  };

  // Mobile-optimized social sharing
  const mobileShareBarStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center',
    margin: '2rem 0',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '20px',
    backdropFilter: 'blur(20px)'
  };

  const mobileShareButtonStyle = (platform) => ({
    flex: '1 0 calc(33.333% - 0.5rem)',
    minWidth: '70px',
    maxWidth: '90px',
    height: '60px',
    borderRadius: '12px',
    border: `1px solid ${platform.color}80`,
    background: `linear-gradient(135deg, ${platform.color}40 0%, ${platform.color}20 100%)`,
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    transition: 'all 0.3s ease',
    fontSize: '1.2rem',
    fontWeight: '600'
  });

  const commentsContainerStyle = {
    marginTop: isMobile ? '2rem' : 'clamp(2.5rem, 5vw, 4rem)',
    padding: isMobile ? '1.5rem 1rem' : 'clamp(1.5rem, 4vw, 2.5rem)',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    borderRadius: isMobile ? '16px' : 'clamp(20px, 4vw, 32px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 20px 60px rgba(10, 25, 41, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
  };

  const commentsHeaderStyle = {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: isMobile ? '1.3rem' : 'clamp(1.5rem, 4vw, 2rem)',
    marginBottom: '1rem',
    textShadow: '0 2px 8px rgba(10, 25, 41, 0.4)'
  };

  const commentCardStyle = (isHovered) => ({
    padding: isMobile ? '1rem' : 'clamp(1.2rem, 3vw, 1.8rem)',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: isHovered ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: isMobile ? '12px' : 'clamp(16px, 3vw, 20px)',
    marginBottom: '1rem',
    transition: 'all 0.3s ease'
  });

  const commentAuthorStyle = {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: isMobile ? '0.95rem' : 'clamp(1rem, 2vw, 1.1rem)',
    marginBottom: '0.5rem',
    textShadow: '0 1px 3px rgba(10, 25, 41, 0.3)'
  };

  const commentTextStyle = {
    color: '#ffffff',
    fontSize: isMobile ? '0.9rem' : 'clamp(0.95rem, 2vw, 1.05rem)',
    lineHeight: '1.6',
    marginTop: '0.75rem',
    marginBottom: '1rem',
    textShadow: '0 1px 2px rgba(10, 25, 41, 0.2)',
    wordWrap: 'break-word',
    overflowWrap: 'break-word'
  };

  const commentReactionsStyle = {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    flexWrap: 'wrap',
    position: 'relative'
  };

  const reactionButtonStyle = (isActive = false) => ({
    padding: isMobile ? '0.4rem 0.8rem' : 'clamp(0.5rem, 1.5vw, 0.6rem) clamp(0.8rem, 2vw, 1.2rem)',
    borderRadius: '12px',
    border: isActive 
      ? '2px solid rgba(255, 255, 255, 0.4)' 
      : '1px solid rgba(255, 255, 255, 0.2)',
    background: isActive
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: isMobile ? '0.8rem' : 'clamp(0.85rem, 1.8vw, 0.95rem)',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: isActive 
      ? '0 6px 20px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
      : '0 4px 15px rgba(10, 25, 41, 0.2)',
    whiteSpace: 'nowrap'
  });

  const textareaStyle = {
    width: '100%',
    padding: isMobile ? '0.8rem' : 'clamp(1rem, 2vw, 1.5rem)',
    borderRadius: isMobile ? '12px' : 'clamp(16px, 3vw, 20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    marginBottom: '1rem',
    color: '#ffffff',
    fontSize: isMobile ? '0.9rem' : 'clamp(0.95rem, 2vw, 1.05rem)',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(10, 25, 41, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    boxSizing: 'border-box',
    minHeight: '100px'
  };

  const submitButtonStyle = {
    padding: isMobile ? '0.8rem 1.5rem' : 'clamp(0.9rem, 2vw, 1.1rem) clamp(1.5rem, 4vw, 2.5rem)',
    borderRadius: isMobile ? '16px' : 'clamp(16px, 3vw, 20px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    background: commentText.trim() 
      ? 'linear-gradient(135deg, #0a1929 0%, #1e4976 50%, #2563a0 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    color: '#ffffff',
    cursor: commentText.trim() ? 'pointer' : 'not-allowed',
    fontWeight: '700',
    fontSize: isMobile ? '0.9rem' : 'clamp(0.95rem, 2vw, 1.05rem)',
    transition: 'all 0.3s ease',
    opacity: commentText.trim() ? 1 : 0.6,
    letterSpacing: '0.02em',
    width: '100%'
  };

  const noCommentsStyle = {
    textAlign: 'center',
    padding: isMobile ? '1.5rem' : 'clamp(2rem, 4vw, 3rem)',
    color: '#ffffff',
    fontSize: isMobile ? '0.9rem' : 'clamp(1rem, 2vw, 1.1rem)',
    opacity: 0.8
  };

  if (!post) {
    return (
      <div style={containerStyle}>
        <div style={meshOverlayStyle} />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: '2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            width: 'clamp(50px, 10vw, 70px)',
            height: 'clamp(50px, 10vw, 70px)',
            border: '5px solid rgba(255, 255, 255, 0.15)',
            borderTop: '5px solid #90caf9',
            borderRadius: '50%',
            animation: 'spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
          }}></div>
          <div style={{
            color: '#ffffff',
            fontWeight: '600',
            fontSize: isMobile ? '1rem' : 'clamp(1rem, 2vw, 1.2rem)',
            textShadow: '0 2px 8px rgba(10, 25, 41, 0.4)'
          }}>
            Loading article...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes meshDrift {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
            33% { transform: translate(6%, -4%) scale(1.08) rotate(2deg); opacity: 0.88; }
            66% { transform: translate(-4%, 5%) scale(0.96) rotate(-1deg); opacity: 0.92; }
            100% { transform: translate(-6%, -3%) scale(1.04) rotate(1deg); opacity: 0.9; }
          }
          
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          
          @keyframes quantumPulse {
            0% { 
              transform: translate(-50%, -50%) scale(0) rotate(0deg);
              opacity: 0;
              filter: hue-rotate(0deg) brightness(1);
            }
            15% { 
              transform: translate(-50%, -50%) scale(3) rotate(180deg);
              opacity: 1;
              filter: hue-rotate(45deg) brightness(1.5);
            }
            30% {
              transform: translate(-50%, -50%) scale(2.5) rotate(-90deg);
              opacity: 0.9;
              filter: hue-rotate(90deg) brightness(1.3);
            }
            50% {
              transform: translate(-50%, -50%) scale(2.8) rotate(45deg);
              opacity: 0.8;
              filter: hue-rotate(180deg) brightness(1.4);
            }
            70% {
              transform: translate(-50%, -50%) scale(2.2) rotate(-45deg);
              opacity: 0.6;
              filter: hue-rotate(270deg) brightness(1.2);
            }
            100% { 
              transform: translate(-50%, -50%) scale(0.1) rotate(360deg);
              opacity: 0;
              filter: hue-rotate(360deg) brightness(1);
            }
          }
          
          @keyframes spiralBurst {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0) rotate(0deg);
            }
            20% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1.3) rotate(var(--start-rotation));
            }
            100% {
              opacity: 0;
              transform: translate(
                calc(-50% + var(--x)),
                calc(-50% + var(--y))
              ) scale(0.1) rotate(calc(var(--start-rotation) + 720deg));
            }
          }
          
          @keyframes orbitalSpin {
            0% {
              transform: rotate(var(--start-angle)) translateX(var(--radius)) rotate(calc(-1 * var(--start-angle))) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
              transform: rotate(var(--start-angle)) translateX(var(--radius)) rotate(calc(-1 * var(--start-angle))) scale(1.2);
            }
            100% {
              opacity: 0.3;
              transform: rotate(calc(var(--start-angle) + 360deg * var(--speed))) translateX(var(--radius)) rotate(calc(-1 * (var(--start-angle) + 360deg * var(--speed)))) scale(0.3);
            }
          }
          
          @keyframes particleExplosion {
            0% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(0);
            }
          }
          
          @keyframes shockwave {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
            100% {
              transform: translate(-50%, -50%) scale(4);
              opacity: 0;
            }
          }
          
          @keyframes energyRing {
            0% {
              transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(3.5) rotate(180deg);
              opacity: 0;
            }
          }
          
          @keyframes reactionPop {
            0% { transform: scale(0) rotate(0deg); opacity: 0; }
            50% { transform: scale(1.5) rotate(15deg); opacity: 1; }
            100% { transform: translateY(-60px) scale(0.3) rotate(0deg); opacity: 0; }
          }
          
          @keyframes slideUp { 
            0% { transform: translate(-50%, 20px); opacity: 0; } 
            100% { transform: translate(-50%, 0); opacity: 1; } 
          }
          
          textarea::placeholder { color: rgba(255, 255, 255, 0.5); }
          textarea:focus { 
            outline: none; 
            border-color: rgba(255, 255, 255, 0.4); 
            boxShadow: 0 12px 35px rgba(10, 25, 41, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.25); 
          }
          
          button:hover:not(:disabled) { transform: translateY(-2px); }
          button:active:not(:disabled) { transform: translateY(-1px) scale(0.98); }
          
          /* Mobile specific styles */
          @media (max-width: 480px) {
            .mobile-share-label {
              font-size: 0.7rem;
              margin-top: 2px;
            }
            
            .comment-reaction {
              padding: 0.3rem 0.6rem !important;
              font-size: 0.75rem !important;
            }
          }
        `}
      </style>

      {/* Quantum Heart Animation System */}
      {showHeartAnimation && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          width: '100vw',
          height: '100vh'
        }}>
          {/* Shockwave rings */}
          {[0, 0.2, 0.4, 0.6].map((delay, i) => (
            <div
              key={`shock-${i}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200px',
                height: '200px',
                border: `${4 - i}px solid rgba(255, ${107 - i * 20}, ${157 - i * 20}, ${0.8 - i * 0.15})`,
                borderRadius: '50%',
                animation: `shockwave 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`
              }}
            />
          ))}

          {/* Energy rings */}
          {[0, 0.15, 0.3].map((delay, i) => (
            <div
              key={`energy-${i}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '180px',
                height: '180px',
                border: `3px solid rgba(255, 107, 157, ${0.6 - i * 0.15})`,
                borderRadius: '50%',
                borderStyle: 'dashed',
                animation: `energyRing 2s ease-out ${delay}s forwards`
              }}
            />
          ))}
          
          {/* Main quantum heart with morphing effect */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            fontSize: isMobile ? '5rem' : '10rem',
            animation: 'quantumPulse 3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            filter: 'drop-shadow(0 0 60px rgba(255, 107, 157, 1)) drop-shadow(0 0 120px rgba(255, 46, 99, 0.8))',
            textShadow: '0 0 40px rgba(255, 255, 255, 1)',
            willChange: 'transform, opacity, filter'
          }}>
            ❤️
          </div>
          
          {/* Spiral constellation burst */}
          {heartBurst.map((heart) => {
            const x = Math.cos(heart.angle) * heart.distance;
            const y = Math.sin(heart.angle) * heart.distance;
            
            return (
              <div
                key={heart.id}
                style={{
                  '--x': `${x}px`,
                  '--y': `${y}px`,
                  '--start-rotation': `${heart.rotation}deg`,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  fontSize: `${heart.size}rem`,
                  animation: `spiralBurst 2s cubic-bezier(0.34, 1.56, 0.64, 1) ${heart.delay}ms forwards`,
                  filter: `drop-shadow(0 0 20px ${heart.color}) drop-shadow(0 0 35px ${heart.color})`,
                  color: heart.color,
                  willChange: 'transform, opacity'
                }}
              >
                {heart.type}
              </div>
            );
          })}

          {/* Orbital hearts */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '1px',
            height: '1px'
          }}>
            {orbitalHearts.map((orbit) => (
              <div
                key={orbit.id}
                style={{
                  '--radius': `${orbit.radius}px`,
                  '--speed': orbit.speed,
                  '--start-angle': `${orbit.startAngle}rad`,
                  position: 'absolute',
                  fontSize: `${orbit.size}rem`,
                  animation: `orbitalSpin 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${orbit.delay}ms forwards`,
                  filter: 'drop-shadow(0 0 15px rgba(255, 107, 157, 0.8))',
                  willChange: 'transform, opacity'
                }}
              >
                💖
              </div>
            ))}
          </div>
          
          {/* Explosion particles */}
          {explosionParticles.map((particle) => (
            <div
              key={particle.id}
              style={{
                '--x': `${particle.x}px`,
                '--y': `${particle.y}px`,
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.color,
                borderRadius: '50%',
                animation: `particleExplosion 1.5s ease-out ${particle.delay}ms forwards`,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                willChange: 'transform, opacity'
              }}
            />
          ))}
          
          {/* Sparkle shower */}
          {[...Array(isMobile ? 15 : 25)].map((_, i) => {
            const angle = (Math.PI * 2 * i) / (isMobile ? 15 : 25);
            const distance = 120 + Math.random() * 100;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            return (
              <div
                key={`sparkle-${i}`}
                style={{
                  '--x': `${x}px`,
                  '--y': `${y}px`,
                  '--start-rotation': `${Math.random() * 360}deg`,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  fontSize: '2rem',
                  animation: `spiralBurst 1.8s ease-out ${i * 40}ms forwards`,
                  filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 1))',
                  opacity: 0.9
                }}
              >
                {['✨', '⭐', '💫', '🌟'][i % 4]}
              </div>
            );
          })}

          {/* Center glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255, 107, 157, 0.4) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'shockwave 2s ease-out forwards',
            filter: 'blur(30px)'
          }} />
        </div>
      )}

      {/* Reaction Animations */}
      {Object.entries(reactionAnimations).map(([key, { emoji }]) => (
        <div
          key={key}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            fontSize: isMobile ? '2rem' : '4rem',
            animation: 'reactionPop 1s ease-out',
            pointerEvents: 'none',
            zIndex: 9999,
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Copy Link Tooltip */}
      {showShareTooltip && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.9) 0%, rgba(123, 31, 162, 0.9) 100%)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '50px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
          zIndex: 10000,
          animation: 'slideUp 0.3s ease-out',
          fontWeight: '700',
          fontSize: '0.95rem',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✨</span> Link copied to clipboard!
        </div>
      )}

      <div style={meshOverlayStyle} />
      <div style={articleContainerStyle}>
        <h1 style={titleStyle}>{post.title}</h1>
        <p style={metaInfoStyle}>Posted: {new Date(post.createdAt).toLocaleString()}</p>
        
        {post.coverImage && (
          <img 
            src={post.coverImage} 
            alt="cover" 
            style={coverImageStyle}
          />
        )}
        
        <div 
          style={contentStyle}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* Like button */}
        <button
          onClick={handleLike}
          style={likeButtonStyle}
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.transform = 'scale(1.05) translateY(-3px)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {post.liked ? `❤️ Liked (${post.likes || 0})` : `🤍 Like (${post.likes || 0})`}
        </button>

        {/* Social Sharing Section */}
        <div style={{ margin: '3rem 0' }}>
          <h3 style={{
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: isMobile ? '1rem' : '1.5rem',
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: '700'
          }}>
            Share this post
          </h3>
          
          {isMobile ? (
            // Mobile Optimized Share Bar
            <div style={mobileShareBarStyle}>
              {sharePlatforms.slice(0, 6).map((platform) => (
                <button
                  key={platform.platform}
                  onClick={platform.action}
                  style={mobileShareButtonStyle(platform)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${platform.color}60 0%, ${platform.color}40 100%)`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${platform.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${platform.color}40 0%, ${platform.color}20 100%)`;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  title={platform.label}
                >
                  <span style={{ fontSize: '1.5rem' }}>{platform.mobileIcon}</span>
                  <span className="mobile-share-label" style={{
                    fontSize: '0.7rem',
                    color: '#ffffff',
                    fontWeight: '600'
                  }}>
                    {platform.platform}
                  </span>
                </button>
              ))}
              
              {/* More Options Button for Mobile */}
              <button
                onClick={copyToClipboard}
                style={{
                  flex: '1 0 calc(33.333% - 0.5rem)',
                  minWidth: '70px',
                  maxWidth: '90px',
                  height: '60px',
                  borderRadius: '12px',
                  border: '1px solid #9C27B080',
                  background: 'linear-gradient(135deg, #9C27B040 0%, #9C27B020 100%)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.3s ease',
                  fontSize: '1.2rem',
                  fontWeight: '600'
                }}
                title="More options"
              >
                <span>⋯</span>
                <span className="mobile-share-label" style={{
                  fontSize: '0.7rem',
                  color: '#ffffff',
                  fontWeight: '600'
                }}>
                  More
                </span>
              </button>
            </div>
          ) : (
            // Desktop Galaxy View
            <div style={{
              margin: '3rem 0',
              height: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, 
                  rgba(255, 107, 157, 0.1) 0%, 
                  rgba(95, 163, 219, 0.08) 40%,
                  rgba(37, 99, 160, 0.05) 70%,
                  transparent 100%)`,
                animation: 'meshDrift 8s ease-in-out infinite',
                filter: 'blur(20px)',
                opacity: 0.6
              }}></div>
              
              {sharePlatforms.map((platform, index) => {
                const angle = (index / sharePlatforms.length) * 360;
                const distance = 120;
                const x = Math.cos((angle * Math.PI) / 180) * distance;
                const y = Math.sin((angle * Math.PI) / 180) * distance;
                const isHovered = hoveredShare === platform.platform;
                
                return (
                  <button
                    key={platform.platform}
                    onClick={platform.action}
                    onMouseEnter={() => setHoveredShare(platform.platform)}
                    onMouseLeave={() => setHoveredShare(null)}
                    style={{
                      position: 'absolute',
                      top: `calc(50% + ${y}px)`,
                      left: `calc(50% + ${x}px)`,
                      transform: `translate(-50%, -50%) scale(${isHovered ? 1.3 : 1})`,
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: isHovered ? 
                        `radial-gradient(circle at 30% 30%, ${platform.color}80 0%, ${platform.color}60 70%, ${platform.color}40 100%)` :
                        `radial-gradient(circle at 30% 30%, ${platform.color}40 0%, ${platform.color}20 70%, ${platform.color}10 100%)`,
                      border: isHovered ? 
                        `2px solid ${platform.color}` :
                        `1.5px solid ${platform.color}80`,
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: isHovered ?
                        `0 0 30px ${platform.color}80, inset 0 1px 0 rgba(255, 255, 255, 0.4)` :
                        `0 8px 25px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                      zIndex: isHovered ? 20 : 5
                    }}
                    title={platform.label}
                  >
                    {isHovered ? platform.hoverIcon : platform.icon}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div style={commentsContainerStyle}>
          <h3 style={commentsHeaderStyle}>
            💬 Comments ({post.comments ? post.comments.length : 0})
          </h3>

          {(!post.comments || post.comments.length === 0) && (
            <p style={noCommentsStyle}>
              No comments yet. Be the first to share your thoughts! 💭
            </p>
          )}

          {post.comments && post.comments.map((c, index) => {
            const commentId = c._id || `comment-${index}`;
            return (
              <div 
                key={commentId} 
                style={commentCardStyle(hoveredComment === commentId)}
                onMouseEnter={() => !isMobile && setHoveredComment(commentId)}
                onMouseLeave={() => !isMobile && setHoveredComment(null)}
              >
                <div>
                  <strong style={commentAuthorStyle}>
                    {c.authorName || 'Guest'}
                  </strong>
                  <small style={{
                    color: '#90caf9',
                    fontSize: '0.8rem',
                    marginLeft: '0.5rem',
                    opacity: 0.8,
                    display: 'inline-block'
                  }}>
                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                  </small>
                </div>
                <p style={commentTextStyle}>
                  {c.text || c.content || String(c)}
                </p>
                
                {/* Comment Reactions */}
                <div style={commentReactionsStyle}>
                  <button 
                    style={reactionButtonStyle(hasUserReacted(commentId, 'like'))}
                    onClick={() => handleCommentReaction(commentId, 'like', '👍')}
                    className="comment-reaction"
                  >
                    👍 Like
                    {commentReactions[`${commentId}-like`] > 0 && (
                      <span style={{ marginLeft: '0.3rem', fontSize: '0.85em', opacity: 0.9 }}>
                        ({commentReactions[`${commentId}-like`]})
                      </span>
                    )}
                  </button>
                  <button 
                    style={reactionButtonStyle(hasUserReacted(commentId, 'love'))}
                    onClick={() => handleCommentReaction(commentId, 'love', '❤️')}
                    className="comment-reaction"
                  >
                    ❤️ Love
                    {commentReactions[`${commentId}-love`] > 0 && (
                      <span style={{ marginLeft: '0.3rem', fontSize: '0.85em', opacity: 0.9 }}>
                        ({commentReactions[`${commentId}-love`]})
                      </span>
                    )}
                  </button>
                  <button 
                    style={reactionButtonStyle(hasUserReacted(commentId, 'celebrate'))}
                    onClick={() => handleCommentReaction(commentId, 'celebrate', '🎉')}
                    className="comment-reaction"
                  >
                    🎉 Celebrate
                    {commentReactions[`${commentId}-celebrate`] > 0 && (
                      <span style={{ marginLeft: '0.3rem', fontSize: '0.85em', opacity: 0.9 }}>
                        ({commentReactions[`${commentId}-celebrate`]})
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Comment Form */}
          <form onSubmit={submitComment} style={{ marginTop: '2rem' }}>
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Share your thoughts and join the conversation..."
              style={textareaStyle}
              rows={isMobile ? 4 : 5}
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              style={submitButtonStyle}
            >
              💬 Post Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}