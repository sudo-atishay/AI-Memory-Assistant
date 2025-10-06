import React from 'react';

const Home = () => {
  return (
    <div className="container">
      <h1>🧠 AI Memory Assistant</h1>
      <p>
        Your personal AI-powered memory assistant to help you remember, organize, and retrieve information.
      </p>
      
      <div className="feature-grid">
        <div className="feature-card">
          <h3>💾 Remember</h3>
          <p>Save important notes, ideas, and information with categories, tags, and importance levels.</p>
        </div>
        
        <div className="feature-card">
          <h3>🔍 Recall</h3>
          <p>Search and retrieve your memories by category, tags, or keywords with smart filtering.</p>
        </div>
        
        <div className="feature-card">
          <h3>📊 Analytics</h3>
          <p>Track your memory patterns and get insights about your stored information.</p>
        </div>
        
        <div className="feature-card">
          <h3>🤖 AI Ready</h3>
          <p>Built with modular architecture ready for AI-powered context retrieval and suggestions.</p>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Getting Started</h2>
        <p>
          Start by adding your first memory using the Memory Assistant, then explore your stored memories and analytics.
        </p>
        
        <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <h3>Features:</h3>
          <ul>
            <li><strong>Smart Categories:</strong> Organize memories by type (work, personal, ideas, etc.)</li>
            <li><strong>Tag System:</strong> Add custom tags for easy searching and filtering</li>
            <li><strong>Importance Levels:</strong> Rate memories from 1-5 for priority</li>
            <li><strong>Context Notes:</strong> Add additional context to your memories</li>
            <li><strong>Search & Filter:</strong> Find memories quickly with powerful search</li>
            <li><strong>Statistics:</strong> Track your memory patterns and usage</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
