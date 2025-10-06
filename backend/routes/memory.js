const express = require('express');
const router = express.Router();
const { runQuery, runInsert, runUpdate } = require('../config/database');

// POST /api/memory/remember - Save a new memory/note
router.post('/remember', async (req, res) => {
  try {
    const { content, category = 'general', tags = '', importance = 1, context = '' } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const result = await runInsert(
      'INSERT INTO memories (content, category, tags, importance, context) VALUES (?, ?, ?, ?, ?)',
      [content.trim(), category, tags, importance, context]
    );
    
    res.status(201).json({ 
      id: result.id,
      content: content.trim(),
      category,
      tags,
      importance,
      context,
      message: 'Memory saved successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error saving memory:', error);
    res.status(500).json({ error: 'Failed to save memory' });
  }
});

// GET /api/memory/recall - Fetch memories/notes
router.get('/recall', async (req, res) => {
  try {
    const { category, limit = 50, offset = 0, search, importance } = req.query;
    
    let sql = 'SELECT * FROM memories WHERE 1=1';
    const params = [];
    
    // Filter by category if provided
    if (category && category !== 'all') {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    // Filter by importance if provided
    if (importance) {
      sql += ' AND importance >= ?';
      params.push(parseInt(importance));
    }
    
    // Search in content if provided
    if (search) {
      sql += ' AND (content LIKE ? OR tags LIKE ? OR context LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    // Order by creation date (newest first) and apply pagination
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const memories = await runQuery(sql, params);
    
    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM memories WHERE 1=1';
    const countParams = [];
    
    if (category && category !== 'all') {
      countSql += ' AND category = ?';
      countParams.push(category);
    }
    
    if (importance) {
      countSql += ' AND importance >= ?';
      countParams.push(parseInt(importance));
    }
    
    if (search) {
      countSql += ' AND (content LIKE ? OR tags LIKE ? OR context LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    const countResult = await runQuery(countSql, countParams);
    const total = countResult[0].total;
    
    res.json({
      memories,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('Error fetching memories:', error);
    res.status(500).json({ error: 'Failed to fetch memories' });
  }
});

// GET /api/memory/recall/:id - Get specific memory by ID
router.get('/recall/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const memories = await runQuery('SELECT * FROM memories WHERE id = ?', [id]);
    
    if (memories.length === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    res.json(memories[0]);
  } catch (error) {
    console.error('Error fetching memory:', error);
    res.status(500).json({ error: 'Failed to fetch memory' });
  }
});

// PUT /api/memory/update/:id - Update a memory
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, category, tags, importance, context } = req.body;
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    const result = await runUpdate(
      'UPDATE memories SET content = ?, category = ?, tags = ?, importance = ?, context = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [content.trim(), category, tags, importance, context, id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    res.json({ message: 'Memory updated successfully' });
  } catch (error) {
    console.error('Error updating memory:', error);
    res.status(500).json({ error: 'Failed to update memory' });
  }
});

// DELETE /api/memory/delete/:id - Delete a memory
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await runUpdate('DELETE FROM memories WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Memory not found' });
    }
    
    res.json({ message: 'Memory deleted successfully' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    res.status(500).json({ error: 'Failed to delete memory' });
  }
});

// GET /api/memory/categories - Get all unique categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await runQuery('SELECT DISTINCT category FROM memories ORDER BY category');
    res.json(categories.map(row => row.category));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/memory/stats - Get memory statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await runQuery(`
      SELECT 
        COUNT(*) as total_memories,
        COUNT(DISTINCT category) as total_categories,
        AVG(importance) as avg_importance,
        MAX(created_at) as last_memory
      FROM memories
    `);
    
    const categoryStats = await runQuery(`
      SELECT category, COUNT(*) as count 
      FROM memories 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    res.json({
      overview: stats[0],
      categoryBreakdown: categoryStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
