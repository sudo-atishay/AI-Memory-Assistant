const express = require('express');
const router = express.Router();
const { runQuery, runInsert, runUpdate } = require('../config/database');

// GET /api/posts - Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await runQuery(`
      SELECT p.*, u.name as author_name 
      FROM posts p 
      LEFT JOIN users u ON p.user_id = u.id 
      ORDER BY p.created_at DESC
    `);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/:id - Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await runQuery(`
      SELECT p.*, u.name as author_name 
      FROM posts p 
      LEFT JOIN users u ON p.user_id = u.id 
      WHERE p.id = ?
    `, [id]);
    
    if (posts.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(posts[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/posts - Create new post
router.post('/', async (req, res) => {
  try {
    const { title, content, user_id } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const result = await runInsert(
      'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
      [title, content, user_id || null]
    );
    
    res.status(201).json({ 
      id: result.id, 
      title, 
      content, 
      user_id,
      message: 'Post created successfully' 
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT /api/posts/:id - Update post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, user_id } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const result = await runUpdate(
      'UPDATE posts SET title = ?, content = ?, user_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, user_id, id]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:id - Delete post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await runUpdate('DELETE FROM posts WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
