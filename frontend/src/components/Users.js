import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`/api/users/${editingUser.id}`, formData);
      } else {
        await axios.post('/api/users', formData);
      }
      setFormData({ name: '', email: '' });
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete user');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ name: '', email: '' });
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="container">
      <h2>Users Management</h2>
      
      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: '2rem' }}>
        <button 
          className="btn btn-success" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Add New User
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn">
              {editingUser ? 'Update User' : 'Add User'}
            </button>
            <button type="button" className="btn" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="grid">
        {users.map(user => (
          <div key={user.id} className="card">
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p className="meta">
              Created: {new Date(user.created_at).toLocaleDateString()}
            </p>
            <div>
              <button 
                className="btn" 
                onClick={() => handleEdit(user)}
                style={{ marginRight: '0.5rem' }}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="card">
          <p>No users found. Add your first user above!</p>
        </div>
      )}
    </div>
  );
};

export default Users;
