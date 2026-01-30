// client/src/components/AdminDashboard.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);
  const [files, setFiles] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('create');
  const [previewPost, setPreviewPost] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const contentRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  // Initialize content when component mounts
  useEffect(() => {
    if (contentRef.current && content) {
      contentRef.current.innerHTML = content;
    }
  }, []);

  async function loadPosts() {
    try {
      setIsLoading(true);
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFiles = (e) => {
    setFiles(e.target.files);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !slug || !content) return alert('Title, slug and content required');

    const token = localStorage.getItem('token');
    if (!token) return alert('You are not logged in as admin!');

    try {
      const form = new FormData();
      form.append('title', title);
      form.append('slug', slug);
      form.append('content', content);
      form.append('excerpt', content.replace(/<[^>]*>/g, '').slice(0, 200));
      form.append('tags', tags);
      form.append('published', published ? 'true' : 'false');

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          form.append('files', files[i]);
        }
      }

      const res = await API.post('/posts', form, { 
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        } 
      });

      console.log('Post created:', res.data);
      alert('Post created successfully!');
      setTitle(''); setSlug(''); setContent(''); setTags(''); setFiles([]);
      if (contentRef.current) contentRef.current.innerHTML = '';
      loadPosts();
      setActiveTab('manage');
    } catch (err) {
      console.error('CREATE POST ERROR:', err.response?.data || err.message);
      alert('Failed to create post. Check console for details.');
    }
  };

  const formatText = (command, value = null) => {
    if (contentRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        contentRef.current.focus();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand(command, false, value);
        updateContent();
        contentRef.current.focus();
      } else {
        contentRef.current.focus();
        document.execCommand(command, false, value);
        updateContent();
      }
    }
  };

  const insertHTML = (html) => {
    if (contentRef.current) {
      contentRef.current.focus();
      document.execCommand('insertHTML', false, html);
      updateContent();
    }
  };

  const updateContent = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };

  const handleContentInput = (e) => {
    setContent(e.currentTarget.innerHTML);
  };

  const togglePreview = () => {
    if (isPreviewMode) {
      if (contentRef.current) {
        contentRef.current.innerHTML = content;
      }
    }
    setIsPreviewMode(!isPreviewMode);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        await API.delete(`/posts/${id}`);
        alert('Post deleted successfully');
        loadPosts();
      } catch (err) {
        console.error(err);
        alert('Failed to delete post');
      }
    }
  };

  const handleTogglePublish = async (post) => {
    try {
      await API.put(`/posts/${post._id}`, { published: !post.published });
      alert(`Post ${!post.published ? 'published' : 'unpublished'} successfully`);
      loadPosts();
    } catch (err) {
      console.error(err);
      alert('Failed to update post status');
    }
  };

  const handlePreview = (post) => {
    setPreviewPost(post);
    setActiveTab('preview');
  };

  return (
    <div className="admin-container">
      <div className="container py-5">
        {/* Animated Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">
              <span className="title-icon">⚡</span>
              Admin Command Center
            </h1>
            <p className="dashboard-subtitle">Manage your content with power and precision</p>
          </div>
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-value">{posts.length}</div>
              <div className="stat-label">Total Posts</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{posts.filter(p => p.published).length}</div>
              <div className="stat-label">Published</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{posts.filter(p => !p.published).length}</div>
              <div className="stat-label">Drafts</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="main-card">
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
            >
              <span className="tab-icon">✨</span>
              Create New Post
            </button>
            <button 
              className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              <span className="tab-icon">📊</span>
              Manage Posts
              <span className="tab-badge">{posts.length}</span>
            </button>
            <button 
              className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
              disabled={!previewPost}
            >
              <span className="tab-icon">👁️</span>
              Preview Post
            </button>
          </div>

          {/* Create Post Tab */}
          {activeTab === 'create' && (
            <div className="tab-content">
              <div className="section-header">
                <h2 className="section-title">Create New Blog Post</h2>
                <p className="section-description">Craft engaging content that resonates with your audience</p>
              </div>

              <form onSubmit={submit} className="form-container">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">📝</span>
                      Title
                    </label>
                    <input 
                      className="form-input"
                      placeholder="Enter an engaging title..." 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">🔗</span>
                      Slug
                    </label>
                    <input 
                      className="form-input"
                      placeholder="unique-post-slug" 
                      value={slug} 
                      onChange={(e) => setSlug(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="editor-header">
                    <label className="form-label">
                      <span className="label-icon">✍️</span>
                      Content
                    </label>
                    <button
                      type="button"
                      className={`preview-toggle ${isPreviewMode ? 'active' : ''}`}
                      onClick={togglePreview}
                    >
                      {isPreviewMode ? '✏️ Edit Mode' : '👁️ Preview Mode'}
                    </button>
                  </div>

                  {!isPreviewMode && (
                    <div className="toolbar">
                      <div className="toolbar-group">
                        <button type="button" className="toolbar-btn" onClick={() => formatText('bold')} title="Bold">
                          <strong>B</strong>
                        </button>
                        <button type="button" className="toolbar-btn" onClick={() => formatText('italic')} title="Italic">
                          <em>I</em>
                        </button>
                        <button type="button" className="toolbar-btn" onClick={() => formatText('underline')} title="Underline">
                          <u>U</u>
                        </button>
                        <button type="button" className="toolbar-btn" onClick={() => formatText('strikeThrough')} title="Strikethrough">
                          <s>S</s>
                        </button>
                      </div>

                      <div className="toolbar-divider"></div>

                      <div className="toolbar-group">
                        <select
                          className="toolbar-select"
                          onChange={(e) => {
                            const value = e.target.value;
                            formatText('formatBlock', value === 'p' ? '<p>' : `<${value}>`);
                          }}
                          title="Heading"
                        >
                          <option value="p">Paragraph</option>
                          <option value="h1">Heading 1</option>
                          <option value="h2">Heading 2</option>
                          <option value="h3">Heading 3</option>
                          <option value="h4">Heading 4</option>
                        </select>
                      </div>

                      <div className="toolbar-divider"></div>

                      <div className="toolbar-group">
                        <button type="button" className="toolbar-btn" onClick={() => formatText('insertUnorderedList')} title="Bullet List">
                          • List
                        </button>
                        <button type="button" className="toolbar-btn" onClick={() => formatText('insertOrderedList')} title="Numbered List">
                          1. List
                        </button>
                      </div>

                      <div className="toolbar-divider"></div>

                      <div className="toolbar-group">
                        <button type="button" className="toolbar-btn" onClick={() => formatText('justifyLeft')} title="Align Left">
                          ⬅️
                        </button>
                        <button type="button" className="toolbar-btn" onClick={() => formatText('justifyCenter')} title="Align Center">
                          ↔️
                        </button>
                        <button type="button" className="toolbar-btn" onClick={() => formatText('justifyRight')} title="Align Right">
                          ➡️
                        </button>
                      </div>

                      <div className="toolbar-divider"></div>

                      <div className="toolbar-group">
                        <button
                          type="button"
                          className="toolbar-btn"
                          onClick={() => {
                            const url = prompt('Enter URL:');
                            if (url) formatText('createLink', url);
                          }}
                          title="Insert Link"
                        >
                          🔗
                        </button>
                        <button type="button" className="toolbar-btn" onClick={() => formatText('unlink')} title="Remove Link">
                          🔗❌
                        </button>
                        <button
                          type="button"
                          className="toolbar-btn"
                          onClick={() => {
                            const selection = window.getSelection();
                            if (selection.toString()) {
                              insertHTML('<code>' + selection.toString() + '</code>');
                            } else {
                              insertHTML('<code>code</code>');
                            }
                          }}
                          title="Insert Code"
                        >
                          {'</>'}
                        </button>
                        <button type="button" className="toolbar-btn" onClick={() => formatText('formatBlock', 'blockquote')} title="Blockquote">
                          ❝
                        </button>
                      </div>

                      <div className="toolbar-divider"></div>

                      <div className="toolbar-group">
                        <button type="button" className="toolbar-btn danger" onClick={() => formatText('removeFormat')} title="Clear Formatting">
                          🧹 Clear
                        </button>
                      </div>
                    </div>
                  )}

                  {!isPreviewMode ? (
                    <div
                      ref={contentRef}
                      contentEditable
                      className="content-editor"
                      onInput={handleContentInput}
                      data-placeholder="Start crafting your masterpiece..."
                      suppressContentEditableWarning={true}
                    />
                  ) : (
                    <div
                      className="content-preview"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">🏷️</span>
                      Tags
                    </label>
                    <input 
                      className="form-input"
                      placeholder="technology, business, design" 
                      value={tags} 
                      onChange={(e) => setTags(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">🖼️</span>
                      Cover Image
                    </label>
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFiles}
                      className="form-input file-input"
                    />
                  </div>
                </div>
                
                <div className="publish-toggle">
                  <input 
                    type="checkbox" 
                    checked={published} 
                    onChange={(e) => setPublished(e.target.checked)} 
                    id="pub"
                    className="toggle-input"
                  />
                  <label htmlFor="pub" className="toggle-label">
                    <span className="toggle-switch"></span>
                    <span className="toggle-text">Publish immediately</span>
                  </label>
                </div>
                
                <button className="submit-button" type="submit">
                  <span className="button-icon">🚀</span>
                  Create Post
                </button>
              </form>
            </div>
          )}

          {/* Manage Posts Tab */}
          {activeTab === 'manage' && (
            <div className="tab-content">
              <div className="section-header">
                <h2 className="section-title">Manage Your Posts</h2>
                <div className="post-stats">
                  <span className="stat-chip published">{posts.filter(p => p.published).length} published</span>
                  <span className="stat-chip draft">{posts.filter(p => !p.published).length} drafts</span>
                </div>
              </div>

              {isLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">Loading posts...</p>
                </div>
              ) : (
                <div className="posts-grid">
                  {posts.map(post => (
                    <div key={post._id} className="post-card">
                      {post.coverImage && (
                        <div className="post-image-container">
                          <img src={post.coverImage} alt={post.title} className="post-image" />
                          <div className="post-overlay">
                            <span className={`status-badge ${post.published ? 'published' : 'draft'}`}>
                              {post.published ? '📢 Published' : '📝 Draft'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="post-content">
                        <h3 className="post-title">{post.title}</h3>
                        
                        <div className="post-meta">
                          <span className="meta-item">🔗 {post.slug}</span>
                          <span className="meta-item">📅 {new Date(post.createdAt).toLocaleDateString()}</span>
                          <span className="meta-item">❤️ {post.likes || 0} likes</span>
                        </div>
                        
                        <p className="post-excerpt">{post.excerpt}</p>
                        
                        <div className="post-actions">
                          <button className="action-btn preview" onClick={() => handlePreview(post)}>
                            <span>👁️</span> Preview
                          </button>
                          <button className="action-btn toggle" onClick={() => handleTogglePublish(post)}>
                            <span>{post.published ? '📝' : '📢'}</span>
                            {post.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button className="action-btn delete" onClick={() => handleDelete(post._id)}>
                            <span>🗑️</span> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {posts.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-icon">📝</div>
                      <h3 className="empty-title">No posts yet</h3>
                      <p className="empty-description">Create your first blog post to get started!</p>
                      <button className="submit-button" onClick={() => setActiveTab('create')}>
                        <span className="button-icon">✨</span>
                        Create Your First Post
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && previewPost && (
            <div className="tab-content">
              <div className="preview-header">
                <button className="back-button" onClick={() => setActiveTab('manage')}>
                  ← Back to Manage
                </button>
              </div>

              <div className="preview-container">
                {previewPost.coverImage && (
                  <div className="preview-cover">
                    <img src={previewPost.coverImage} alt={previewPost.title} />
                  </div>
                )}
                
                <h1 className="preview-title">{previewPost.title}</h1>
                
                <div className="preview-meta">
                  <span className="preview-meta-item">📅 {new Date(previewPost.createdAt).toLocaleString()}</span>
                  <span className="preview-meta-item">❤️ {previewPost.likes || 0} likes</span>
                  <span className={`preview-status ${previewPost.published ? 'published' : 'draft'}`}>
                    {previewPost.published ? '📢 Published' : '📝 Draft'}
                  </span>
                </div>

                <div className="preview-content" dangerouslySetInnerHTML={{ __html: previewPost.content }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .admin-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a2463 0%, #1565c0 25%, #42a5f5 50%, #90caf9 75%, #e3f2fd 100%);
          background-size: 400% 400%;
          animation: gradientFlow 20s ease infinite;
          padding: 2rem 0;
        }

        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Dashboard Header */
        .dashboard-header {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          border: 2px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 25px 60px rgba(13, 71, 161, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .header-content {
          text-align: center;
          margin-bottom: 2rem;
        }

        .dashboard-title {
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #0d47a1, #1976d2, #42a5f5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .title-icon {
          font-size: 2.5rem;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .dashboard-subtitle {
          color: #4a5568;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 3rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #0d47a1, #42a5f5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          color: #718096;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Main Card */
        .main-card {
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-radius: 24px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 25px 60px rgba(13, 71, 161, 0.3);
          overflow: hidden;
        }

        /* Tabs */
        .tab-navigation {
          display: flex;
          border-bottom: 2px solid rgba(66, 165, 245, 0.2);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.8));
          padding: 0.5rem;
          gap: 0.5rem;
        }

        .tab-button {
          flex: 1;
          padding: 1.2rem 2rem;
          border: none;
          background: transparent;
          color: #718096;
          font-weight: 700;
          font-size: 1rem;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          position: relative;
        }

        .tab-button:hover:not(:disabled) {
          background: rgba(66, 165, 245, 0.1);
          color: #1976d2;
          transform: translateY(-2px);
        }

        .tab-button.active {
          background: linear-gradient(135deg, #0d47a1, #1976d2, #42a5f5);
          color: white;
          box-shadow: 0 8px 20px rgba(13, 71, 161, 0.4);
        }

        .tab-button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .tab-icon {
          font-size: 1.3rem;
        }

        .tab-badge {
          background: rgba(255, 255, 255, 0.3);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 800;
          margin-left: 0.5rem;
        }

        /* Tab Content */
        .tab-content {
          padding: 3rem;
        }

        .section-header {
          margin-bottom: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d47a1, #42a5f5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-description {
          color: #718096;
          font-size: 1.1rem;
          margin-top: 0.5rem;
        }

        .post-stats {
          display: flex;
          gap: 1rem;
        }

        .stat-chip {
          padding: 0.5rem 1.2rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .stat-chip.published {
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
        }

        .stat-chip.draft {
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
        }

        /* Loading State */
        .loading-state {
          text-align: center;
          padding: 4rem;
        }

        .loading-spinner {
          border: 4px solid rgba(66, 165, 245, 0.1);
          border-top: 4px solid #42a5f5;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          color: #718096;
          font-size: 1.1rem;
          font-weight: 600;
        }

        /* Form */
        .form-container {
          width: 100%;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          color: #2d3748;
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .label-icon {
          font-size: 1.2rem;
        }

        .form-input {
          padding: 1rem 1.5rem;
          border: 2px solid rgba(66, 165, 245, 0.2);
          border-radius: 16px;
          font-size: 1rem;
          font-weight: 500;
          color: #2d3748;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
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

        .file-input {
          cursor: pointer;
          padding: 0.8rem 1.5rem;
        }

        /* Editor */
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .preview-toggle {
          padding: 0.75rem 1.5rem;
          border: 2px solid rgba(66, 165, 245, 0.3);
          border-radius: 12px;
          background: white;
          color: #1976d2;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .preview-toggle:hover {
          background: linear-gradient(135deg, #42a5f5, #1976d2);
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
        }

        .preview-toggle.active {
          background: linear-gradient(135deg, #0d47a1, #1976d2);
          color: white;
          border-color: transparent;
        }

        /* Toolbar */
        .toolbar {
          background: linear-gradient(135deg, #f8fafc, #edf2f7);
          border: 2px solid rgba(66, 165, 245, 0.2);
          border-bottom: none;
          border-radius: 16px 16px 0 0;
          padding: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .toolbar-group {
          display: flex;
          gap: 0.25rem;
        }

        .toolbar-divider {
          width: 2px;
          height: 32px;
          background: rgba(66, 165, 245, 0.2);
          margin: 0 0.5rem;
        }

        .toolbar-btn {
          padding: 0.6rem 1rem;
          border: 2px solid rgba(66, 165, 245, 0.2);
          border-radius: 10px;
          background: white;
          color: #4a5568;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .toolbar-btn:hover {
          background: linear-gradient(135deg, #42a5f5, #1976d2);
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(66, 165, 245, 0.3);
        }

        .toolbar-btn.danger:hover {
          background: linear-gradient(135deg, #f56565, #e53e3e);
        }

        .toolbar-select {
          padding: 0.6rem 1rem;
          border: 2px solid rgba(66, 165, 245, 0.2);
          border-radius: 10px;
          background: white;
          color: #4a5568;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .toolbar-select:hover {
          border-color: #42a5f5;
          box-shadow: 0 4px 12px rgba(66, 165, 245, 0.2);
        }

        /* Content Editor */
        .content-editor {
          min-height: 500px;
          border: 2px solid rgba(66, 165, 245, 0.2);
          border-top: none;
          border-radius: 0 0 16px 16px;
          padding: 2rem;
          background: white;
          font-size: 1.05rem;
          line-height: 1.8;
          color: #2d3748;
          outline: none;
          overflow-y: auto;
          width: 100%;
        }

        .content-editor:focus {
          border-color: #42a5f5;
          box-shadow: 0 8px 20px rgba(66, 165, 245, 0.15);
        }

        .content-editor[data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #a0aec0;
          font-style: italic;
        }

        .content-editor h1 { font-size: 2.5rem; font-weight: 700; color: #2d3748; margin: 1.5rem 0 1rem; }
        .content-editor h2 { font-size: 2rem; font-weight: 600; color: #2d3748; margin: 1.25rem 0 0.75rem; }
        .content-editor h3 { font-size: 1.5rem; font-weight: 600; color: #2d3748; margin: 1rem 0 0.5rem; }
        .content-editor h4 { font-size: 1.25rem; font-weight: 600; color: #2d3748; margin: 0.75rem 0 0.5rem; }
        .content-editor p { line-height: 1.8; margin-bottom: 1rem; }
        .content-editor ul, .content-editor ol { margin: 1rem 0; padding-left: 2rem; }
        .content-editor li { margin-bottom: 0.5rem; }
        .content-editor blockquote { border-left: 4px solid #42a5f5; padding-left: 1rem; margin: 1rem 0; color: #718096; font-style: italic; }
        .content-editor code { background: #edf2f7; padding: 0.2rem 0.4rem; border-radius: 6px; font-family: 'Courier New', monospace; }
        .content-editor a { color: #1976d2; text-decoration: underline; }

        .content-preview {
          min-height: 500px;
          border: 2px solid rgba(66, 165, 245, 0.2);
          border-radius: 16px;
          padding: 2rem;
          background: #f7fafc;
          font-size: 1.05rem;
          line-height: 1.8;
          overflow-y: auto;
          width: 100%;
        }

        .content-preview h1 { font-size: 2.5rem; font-weight: 700; color: #2d3748; margin: 1.5rem 0 1rem; }
        .content-preview h2 { font-size: 2rem; font-weight: 600; color: #2d3748; margin: 1.25rem 0 0.75rem; }
        .content-preview h3 { font-size: 1.5rem; font-weight: 600; color: #2d3748; margin: 1rem 0 0.5rem; }
        .content-preview p { line-height: 1.8; margin-bottom: 1rem; color: #4a5568; }
        .content-preview img { border-radius: 12px; max-width: 100%; margin: 1rem 0; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1); }

        /* Publish Toggle */
        .publish-toggle {
          margin: 2rem 0;
          display: flex;
          align-items: center;
        }

        .toggle-input {
          display: none;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          user-select: none;
        }

        .toggle-switch {
          width: 60px;
          height: 32px;
          background: #cbd5e0;
          border-radius: 20px;
          position: relative;
          transition: all 0.3s ease;
        }

        .toggle-switch::after {
          content: '';
          position: absolute;
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          top: 4px;
          left: 4px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .toggle-input:checked + .toggle-label .toggle-switch {
          background: linear-gradient(135deg, #48bb78, #38a169);
        }

        .toggle-input:checked + .toggle-label .toggle-switch::after {
          left: 32px;
        }

        .toggle-text {
          color: #2d3748;
          font-weight: 700;
          font-size: 1.05rem;
        }

        /* Submit Button */
        .submit-button {
          padding: 1.2rem 3rem;
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
          gap: 0.75rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .submit-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 45px rgba(13, 71, 161, 0.5);
          background-position: 100% 0;
        }

        .submit-button:active {
          transform: translateY(-1px);
        }

        .button-icon {
          font-size: 1.3rem;
        }

        /* Posts Grid */
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .post-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9));
          border-radius: 20px;
          border: 2px solid rgba(66, 165, 245, 0.2);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 25px rgba(13, 71, 161, 0.15);
        }

        .post-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(13, 71, 161, 0.3);
          border-color: #42a5f5;
        }

        .post-image-container {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
        }

        .post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .post-card:hover .post-image {
          transform: scale(1.1);
        }

        .post-overlay {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.85rem;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .status-badge.published {
          background: linear-gradient(135deg, rgba(72, 187, 120, 0.9), rgba(56, 161, 105, 0.9));
          color: white;
        }

        .status-badge.draft {
          background: linear-gradient(135deg, rgba(237, 137, 54, 0.9), rgba(221, 107, 32, 0.9));
          color: white;
        }

        .post-content {
          padding: 1.5rem;
        }

        .post-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .post-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }

        .meta-item {
          color: #718096;
          font-weight: 600;
        }

        .post-excerpt {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .post-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1;
          min-width: fit-content;
          padding: 0.7rem 1rem;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .action-btn.preview {
          background: linear-gradient(135deg, #4facfe, #00f2fe);
          color: white;
        }

        .action-btn.toggle {
          background: linear-gradient(135deg, #a0aec0, #718096);
          color: white;
        }

        .action-btn.delete {
          background: linear-gradient(135deg, #fc5c7d, #b81229);
          color: white;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.8));
          border-radius: 20px;
          border: 2px dashed rgba(66, 165, 245, 0.3);
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .empty-title {
          font-size: 2rem;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .empty-description {
          font-size: 1.1rem;
          color: #718096;
          margin-bottom: 2rem;
        }

        /* Preview Section */
        .preview-header {
          margin-bottom: 2rem;
        }

        .back-button {
          padding: 0.8rem 1.5rem;
          border: 2px solid rgba(66, 165, 245, 0.3);
          border-radius: 12px;
          background: white;
          color: #1976d2;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: linear-gradient(135deg, #42a5f5, #1976d2);
          color: white;
          border-color: transparent;
          transform: translateX(-5px);
        }

        .preview-container {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 15px 40px rgba(13, 71, 161, 0.2);
        }

        .preview-cover {
          width: 100%;
          margin-bottom: 2rem;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .preview-cover img {
          width: 100%;
          height: auto;
          display: block;
        }

        .preview-title {
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #0d47a1, #1976d2, #42a5f5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .preview-meta {
          display: flex;
          gap: 2rem;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid rgba(66, 165, 245, 0.2);
          flex-wrap: wrap;
        }

        .preview-meta-item {
          color: #718096;
          font-size: 1.05rem;
          font-weight: 600;
        }

        .preview-status {
          padding: 0.5rem 1.2rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .preview-status.published {
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
        }

        .preview-status.draft {
          background: linear-gradient(135deg, #ed8936, #dd6b20);
          color: white;
        }

        .preview-content {
          font-size: 1.1rem;
          line-height: 1.9;
          color: #2d3748;
        }

        .preview-content h1 { font-size: 2.5rem; font-weight: 700; margin: 2rem 0 1rem; color: #2d3748; }
        .preview-content h2 { font-size: 2rem; font-weight: 600; margin: 1.75rem 0 0.75rem; color: #2d3748; }
        .preview-content h3 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: #2d3748; }
        .preview-content p { margin-bottom: 1.5rem; line-height: 1.9; }
        .preview-content img { border-radius: 12px; max-width: 100%; margin: 2rem 0; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15); }
        .preview-content blockquote { border-left: 4px solid #42a5f5; padding-left: 1.5rem; margin: 2rem 0; color: #718096; font-style: italic; font-size: 1.2rem; }
        .preview-content code { background: #edf2f7; padding: 0.3rem 0.6rem; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 0.95rem; }

        /* Responsive */
        @media (max-width: 1024px) {
          .posts-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .dashboard-header {
            padding: 2rem 1.5rem;
          }

          .dashboard-title {
            font-size: 2rem;
          }

          .stats-bar {
            gap: 1.5rem;
          }

          .stat-value {
            font-size: 2rem;
          }

          .tab-content {
            padding: 2rem 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .toolbar {
            padding: 0.75rem;
          }

          .toolbar-group {
            flex-wrap: wrap;
          }

          .posts-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .preview-container {
            padding: 2rem 1.5rem;
          }

          .preview-title {
            font-size: 2rem;
          }
        }

        @media (max-width: 480px) {
          .dashboard-header {
            padding: 1.5rem 1rem;
          }

          .dashboard-title {
            font-size: 1.5rem;
            flex-direction: column;
            gap: 0.5rem;
          }

          .title-icon {
            font-size: 2rem;
          }

          .dashboard-subtitle {
            font-size: 1rem;
          }

          .stats-bar {
            flex-direction: column;
            gap: 1rem;
          }

          .tab-navigation {
            flex-direction: column;
          }

          .tab-button {
            padding: 1rem 1.5rem;
          }

          .tab-content {
            padding: 1.5rem 1rem;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .toolbar {
            gap: 0.25rem;
          }

          .toolbar-btn, .toolbar-select {
            padding: 0.5rem 0.75rem;
            font-size: 0.85rem;
          }

          .content-editor, .content-preview {
            min-height: 300px;
            padding: 1.5rem;
          }

          .submit-button {
            padding: 1rem 2rem;
            font-size: 1rem;
          }

          .preview-container {
            padding: 1.5rem 1rem;
          }

          .preview-title {
            font-size: 1.75rem;
          }

          .post-actions {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}