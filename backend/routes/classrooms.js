const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const auth = require('../middleware/auth');

// Create classroom (faculty only)
router.post('/', auth(['faculty']), async (req, res) => {
  try {
    const { subject_name } = req.body;
    
    if (!subject_name) {
      return res.status(400).json({ message: 'Subject name is required' });
    }

    const [result] = await pool.query(
      'INSERT INTO classrooms (subject_name, faculty_id) VALUES (?, ?)',
      [subject_name, req.user.id]
    );

    res.status(201).json({
      message: 'Classroom created successfully',
      classroom: { id: result.insertId, subject_name, faculty_id: req.user.id }
    });
  } catch (error) {
    console.error('Create classroom error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all classrooms (for faculty/admin) or enrolled classrooms (for students)
router.get('/', auth(), async (req, res) => {
  try {
    let classrooms;
    
    if (req.user.role === 'student') {
      const [enrollments] = await pool.query(
        `SELECT c.* FROM classrooms c 
         JOIN enrollments e ON c.id = e.classroom_id 
         WHERE e.student_id = ?`,
        [req.user.id]
      );
      classrooms = enrollments;
    } else if (req.user.role === 'faculty') {
      const [result] = await pool.query(
        'SELECT * FROM classrooms WHERE faculty_id = ?',
        [req.user.id]
      );
      classrooms = result;
    } else {
      const [result] = await pool.query('SELECT * FROM classrooms');
      classrooms = result;
    }

    res.json(classrooms);
  } catch (error) {
    console.error('Get classrooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get classroom by ID with students
router.get('/:id', auth(), async (req, res) => {
  try {
    const [classrooms] = await pool.query('SELECT * FROM classrooms WHERE id = ?', [req.params.id]);
    
    if (classrooms.length === 0) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    const [students] = await pool.query(
      `SELECT u.id, u.name, u.email, u.department, u.year 
       FROM users u 
       JOIN enrollments e ON u.id = e.student_id 
       WHERE e.classroom_id = ?`,
      [req.params.id]
    );

    res.json({ ...classrooms[0], students });
  } catch (error) {
    console.error('Get classroom error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll student in classroom
router.post('/:id/enroll', auth(['faculty', 'admin']), async (req, res) => {
  try {
    const { student_id } = req.body;

    const [existing] = await pool.query(
      'SELECT id FROM enrollments WHERE student_id = ? AND classroom_id = ?',
      [student_id, req.params.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Student already enrolled' });
    }

    await pool.query(
      'INSERT INTO enrollments (student_id, classroom_id) VALUES (?, ?)',
      [student_id, req.params.id]
    );

    // Initialize marks for the student
    await pool.query(
      'INSERT INTO marks (student_id, classroom_id) VALUES (?, ?)',
      [student_id, req.params.id]
    );

    res.status(201).json({ message: 'Student enrolled successfully' });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark attendance
router.post('/:id/attendance', auth(['faculty']), async (req, res) => {
  try {
    const { student_id, date, status } = req.body;

    if (!student_id || !date || !status) {
      return res.status(400).json({ message: 'Please provide student_id, date, and status' });
    }

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await pool.query(
      `INSERT INTO attendance (student_id, classroom_id, date, status) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE status = ?`,
      [student_id, req.params.id, date, status, status]
    );

    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance for a classroom
router.get('/:id/attendance', auth(['faculty', 'admin']), async (req, res) => {
  try {
    const [attendance] = await pool.query(
      `SELECT a.*, u.name as student_name 
       FROM attendance a 
       JOIN users u ON a.student_id = u.id 
       WHERE a.classroom_id = ?`,
      [req.params.id]
    );

    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's own attendance
router.get('/attendance/my', auth(['student']), async (req, res) => {
  try {
    const [attendance] = await pool.query(
      `SELECT a.*, c.subject_name 
       FROM attendance a 
       JOIN classrooms c ON a.classroom_id = c.id 
       WHERE a.student_id = ?`,
      [req.user.id]
    );

    res.json(attendance);
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enter/update marks (new format with exam_type)
router.post('/:id/marks', auth(['faculty']), async (req, res) => {
  try {
    const { student_id, exam_type, marks, subject_code, subject_title } = req.body;

    if (!student_id || !exam_type || marks === undefined) {
      return res.status(400).json({ message: 'Please provide student_id, exam_type, and marks' });
    }

    // Convert marks to number to avoid string issues
    const marksValue = Number(marks) || 0;

    await pool.query(
      `INSERT INTO marks (student_id, classroom_id, exam_type, marks, subject_code, subject_title) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [student_id, req.params.id, exam_type, marksValue, subject_code || null, subject_title || null]
    );

    res.json({ message: 'Marks updated successfully' });
  } catch (error) {
    console.error('Enter marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get marks for a classroom
router.get('/:id/marks', auth(['faculty', 'admin']), async (req, res) => {
  try {
    const [marks] = await pool.query(
      `SELECT m.*, u.name as student_name, c.subject_name 
       FROM marks m 
       JOIN users u ON m.student_id = u.id 
       JOIN classrooms c ON m.classroom_id = c.id 
       WHERE m.classroom_id = ?`,
      [req.params.id]
    );

    res.json(marks);
  } catch (error) {
    console.error('Get marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's own marks
router.get('/marks/my', auth(['student']), async (req, res) => {
  try {
    const [marks] = await pool.query(
      `SELECT m.*, c.subject_name 
       FROM marks m 
       JOIN classrooms c ON m.classroom_id = c.id 
       WHERE m.student_id = ?`,
      [req.user.id]
    );

    res.json(marks);
  } catch (error) {
    console.error('Get my marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
