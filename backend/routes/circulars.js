const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const auth = require('../middleware/auth');

// Create circular (admin only)
router.post('/', auth(['admin']), async (req, res) => {
  try {
    const { title, description, target_role } = req.body;

    if (!title || !description || !target_role) {
      return res.status(400).json({ message: 'Please provide title, description, and target_role' });
    }

    if (!['student', 'faculty', 'all'].includes(target_role)) {
      return res.status(400).json({ message: 'Invalid target_role' });
    }

    const [result] = await pool.query(
      'INSERT INTO circulars (title, description, target_role) VALUES (?, ?, ?)',
      [title, description, target_role]
    );

    res.status(201).json({
      message: 'Circular created successfully',
      circular: { id: result.insertId, title, description, target_role }
    });
  } catch (error) {
    console.error('Create circular error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all circulars (filtered by role for students/faculty)
router.get('/', auth(), async (req, res) => {
  try {
    let circulars;
    
    if (req.user.role === 'student') {
      const [result] = await pool.query(
        'SELECT * FROM circulars WHERE target_role IN (?, ?) ORDER BY created_at DESC',
        ['student', 'all']
      );
      circulars = result;
    } else if (req.user.role === 'faculty') {
      const [result] = await pool.query(
        'SELECT * FROM circulars WHERE target_role IN (?, ?) ORDER BY created_at DESC',
        ['faculty', 'all']
      );
      circulars = result;
    } else {
      const [result] = await pool.query('SELECT * FROM circulars ORDER BY created_at DESC');
      circulars = result;
    }

    res.json(circulars);
  } catch (error) {
    console.error('Get circulars error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single circular
router.get('/:id', auth(), async (req, res) => {
  try {
    const [circulars] = await pool.query('SELECT * FROM circulars WHERE id = ?', [req.params.id]);
    
    if (circulars.length === 0) {
      return res.status(404).json({ message: 'Circular not found' });
    }

    res.json(circulars[0]);
  } catch (error) {
    console.error('Get circular error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
