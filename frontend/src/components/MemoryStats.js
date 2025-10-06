import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemoryStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/memory/stats');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!stats) {
    return <div className="card">No statistics available</div>;
  }

  const { overview, categoryBreakdown } = stats;

  return (
    <div className="container">
      <h2>📊 Memory Statistics</h2>
      
      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{overview.total_memories}</div>
          <div className="stat-label">Total Memories</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{overview.total_categories}</div>
          <div className="stat-label">Categories</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{overview.avg_importance ? overview.avg_importance.toFixed(1) : '0'}</div>
          <div className="stat-label">Avg Importance</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-label">Last Memory</div>
          <div className="stat-date">
            {overview.last_memory ? new Date(overview.last_memory).toLocaleDateString() : 'None'}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <h3>📂 Memory Distribution by Category</h3>
        {categoryBreakdown.length > 0 ? (
          <div className="category-stats">
            {categoryBreakdown.map(category => (
              <div key={category.category} className="category-stat">
                <div className="category-info">
                  <span className="category-name">{category.category}</span>
                  <span className="category-count">{category.count} memories</span>
                </div>
                <div className="category-bar">
                  <div 
                    className="category-fill"
                    style={{ 
                      width: `${(category.count / overview.total_memories) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No memories found to analyze.</p>
        )}
      </div>

      {/* Memory Timeline */}
      <div className="card">
        <h3>📅 Recent Activity</h3>
        <p>
          Your most recent memory was added on{' '}
          <strong>
            {overview.last_memory ? new Date(overview.last_memory).toLocaleDateString() : 'No memories yet'}
          </strong>
        </p>
        
        {overview.total_memories > 0 && (
          <div className="activity-insights">
            <h4>Insights:</h4>
            <ul>
              <li>
                You have an average importance rating of{' '}
                <strong>{overview.avg_importance ? overview.avg_importance.toFixed(1) : '0'}</strong> out of 5
              </li>
              <li>
                Your memories are spread across{' '}
                <strong>{overview.total_categories}</strong> different categories
              </li>
              <li>
                Most active category: <strong>{categoryBreakdown[0]?.category || 'None'}</strong> with{' '}
                <strong>{categoryBreakdown[0]?.count || 0}</strong> memories
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Tips and Suggestions */}
      <div className="card tips-card">
        <h3>💡 Tips for Better Memory Management</h3>
        <div className="tips-grid">
          <div className="tip">
            <h4>🏷️ Use Tags Effectively</h4>
            <p>Add relevant tags to your memories for easier searching and organization.</p>
          </div>
          
          <div className="tip">
            <h4>⭐ Rate Importance</h4>
            <p>Use the importance scale to prioritize your most valuable memories.</p>
          </div>
          
          <div className="tip">
            <h4>📝 Add Context</h4>
            <p>Include additional context to make your memories more meaningful and searchable.</p>
          </div>
          
          <div className="tip">
            <h4>🔍 Search Regularly</h4>
            <p>Use the search and filter features to quickly find relevant memories.</p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button className="btn" onClick={fetchStats}>
          🔄 Refresh Statistics
        </button>
      </div>
    </div>
  );
};

export default MemoryStats;
