const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const auth = require('../middleware/auth');

// Get all students (for faculty/admin)
router.get('/students', auth(['faculty', 'admin']), async (req, res) => {
  try {
    const { department } = req.query;
    let query = "SELECT id, name, email, department, year, created_at FROM users WHERE role = 'student'";
    let params = [];
    
    if (department) {
      query += " AND department = ?";
      params.push(department);
    }
    
    query += " ORDER BY name ASC";
    
    const [students] = await pool.query(query, params);
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single student by ID
router.get('/students/:id', auth(['faculty', 'admin']), async (req, res) => {
  try {
    const [students] = await pool.query(
      "SELECT id, name, email, department, year, created_at FROM users WHERE id = ? AND role = 'student'",
      [req.params.id]
    );
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(students[0]);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all faculty
router.get('/faculty', auth(['admin']), async (req, res) => {
  try {
    const [faculty] = await pool.query(
      "SELECT id, name, email, department FROM users WHERE role = 'faculty'"
    );
    res.json(faculty);
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
