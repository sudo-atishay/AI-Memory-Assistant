import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', user_id: '' });

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts');
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...formData,
        user_id: formData.user_id || null
      };
      
      if (editingPost) {
        await axios.put(`/api/posts/${editingPost.id}`, postData);
      } else {
        await axios.post('/api/posts', postData);
      }
      setFormData({ title: '', content: '', user_id: '' });
      setShowForm(false);
      setEditingPost(null);
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({ 
      title: post.title, 
      content: post.content, 
      user_id: post.user_id || '' 
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`/api/posts/${id}`);
        fetchPosts();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete post');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPost(null);
    setFormData({ title: '', content: '', user_id: '' });
  };

  if (loading) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="container">
      <h2>Posts Management</h2>
      
      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: '2rem' }}>
        <button 
          className="btn btn-success" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Add New Post
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingPost ? 'Edit Post' : 'Add New Post'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="user_id">Author (optional):</label>
              <select
                id="user_id"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              >
                <option value="">Select an author</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn">
              {editingPost ? 'Update Post' : 'Add Post'}
            </button>
            <button type="button" className="btn" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="grid">
        {posts.map(post => (
          <div key={post.id} className="card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.author_name && (
              <p className="meta"><strong>Author:</strong> {post.author_name}</p>
            )}
            <p className="meta">
              Created: {new Date(post.created_at).toLocaleDateString()}
            </p>
            <div>
              <button 
                className="btn" 
                onClick={() => handleEdit(post)}
                style={{ marginRight: '0.5rem' }}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="card">
          <p>No posts found. Add your first post above!</p>
        </div>
      )}
    </div>
  );
};

export default Posts;
