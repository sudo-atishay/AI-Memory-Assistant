import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemoryAssistant = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    category: 'general',
    tags: '',
    importance: 1,
    context: ''
  });
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    importance: ''
  });
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, limit: 20, offset: 0, hasMore: false });

  useEffect(() => {
    fetchMemories();
    fetchCategories();
  }, [filters, pagination.offset]);

  const fetchMemories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
        ...(filters.category !== 'all' && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        ...(filters.importance && { importance: filters.importance })
      });

      const response = await axios.get(`/api/memory/recall?${params}`);
      setMemories(response.data.memories);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to fetch memories');
      console.error('Error fetching memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/memory/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMemory) {
        await axios.put(`/api/memory/update/${editingMemory.id}`, formData);
      } else {
        await axios.post('/api/memory/remember', formData);
      }
      setFormData({ content: '', category: 'general', tags: '', importance: 1, context: '' });
      setShowForm(false);
      setEditingMemory(null);
      fetchMemories();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save memory');
    }
  };

  const handleEdit = (memory) => {
    setEditingMemory(memory);
    setFormData({
      content: memory.content,
      category: memory.category,
      tags: memory.tags,
      importance: memory.importance,
      context: memory.context
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this memory?')) {
      try {
        await axios.delete(`/api/memory/delete/${id}`);
        fetchMemories();
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete memory');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMemory(null);
    setFormData({ content: '', category: 'general', tags: '', importance: 1, context: '' });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const loadMore = () => {
    setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }));
  };

  const getImportanceColor = (importance) => {
    const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#27ae60'];
    return colors[importance - 1] || '#95a5a6';
  };

  const getImportanceText = (importance) => {
    const texts = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    return texts[importance - 1] || 'Unknown';
  };

  if (loading && memories.length === 0) {
    return <div className="loading">Loading memories...</div>;
  }

  return (
    <div className="container">
      <h2>🧠 Memory Assistant</h2>
      
      {error && <div className="error">{error}</div>}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select
            id="category-filter"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search-filter">Search:</label>
          <input
            id="search-filter"
            type="text"
            placeholder="Search memories..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="importance-filter">Min Importance:</label>
          <select
            id="importance-filter"
            value={filters.importance}
            onChange={(e) => handleFilterChange('importance', e.target.value)}
          >
            <option value="">Any</option>
            <option value="1">1+ (Very Low)</option>
            <option value="2">2+ (Low)</option>
            <option value="3">3+ (Medium)</option>
            <option value="4">4+ (High)</option>
            <option value="5">5 (Very High)</option>
          </select>
        </div>
      </div>

      {/* Add Memory Button */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          className="btn btn-success" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          💾 Add New Memory
        </button>
      </div>

      {/* Memory Form */}
      {showForm && (
        <div className="card memory-form">
          <h3>{editingMemory ? 'Edit Memory' : 'Add New Memory'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="content">Memory Content *:</label>
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows="4"
                placeholder="What do you want to remember?"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="ideas">Ideas</option>
                  <option value="learning">Learning</option>
                  <option value="contacts">Contacts</option>
                  <option value="tasks">Tasks</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="importance">Importance (1-5):</label>
                <select
                  id="importance"
                  value={formData.importance}
                  onChange={(e) => setFormData({ ...formData, importance: parseInt(e.target.value) })}
                >
                  <option value="1">1 - Very Low</option>
                  <option value="2">2 - Low</option>
                  <option value="3">3 - Medium</option>
                  <option value="4">4 - High</option>
                  <option value="5">5 - Very High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated):</label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., important, project, meeting"
              />
            </div>

            <div className="form-group">
              <label htmlFor="context">Additional Context:</label>
              <textarea
                id="context"
                value={formData.context}
                onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                rows="2"
                placeholder="Any additional context or notes..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn">
                {editingMemory ? 'Update Memory' : 'Save Memory'}
              </button>
              <button type="button" className="btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Memories List */}
      <div className="memories-grid">
        {memories.map(memory => (
          <div key={memory.id} className="card memory-card">
            <div className="memory-header">
              <span 
                className="importance-badge"
                style={{ backgroundColor: getImportanceColor(memory.importance) }}
              >
                {memory.importance} - {getImportanceText(memory.importance)}
              </span>
              <span className="category-badge">{memory.category}</span>
            </div>
            
            <div className="memory-content">
              <p>{memory.content}</p>
            </div>

            {memory.tags && (
              <div className="memory-tags">
                {memory.tags.split(',').map(tag => (
                  <span key={tag.trim()} className="tag">{tag.trim()}</span>
                ))}
              </div>
            )}

            {memory.context && (
              <div className="memory-context">
                <strong>Context:</strong> {memory.context}
              </div>
            )}

            <div className="memory-meta">
              <span className="meta">
                {new Date(memory.created_at).toLocaleDateString()} at {new Date(memory.created_at).toLocaleTimeString()}
              </span>
            </div>

            <div className="memory-actions">
              <button 
                className="btn btn-sm" 
                onClick={() => handleEdit(memory)}
              >
                Edit
              </button>
              <button 
                className="btn btn-sm btn-danger" 
                onClick={() => handleDelete(memory.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {memories.length === 0 && !loading && (
        <div className="card">
          <p>No memories found. Add your first memory above!</p>
        </div>
      )}

      {pagination.hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn" onClick={loadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {memories.length > 0 && (
        <div className="pagination-info">
          Showing {memories.length} of {pagination.total} memories
        </div>
      )}
    </div>
  );
};

export default MemoryAssistant;
