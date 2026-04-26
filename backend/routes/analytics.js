const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const auth = require('../middleware/auth');

// Get system analytics (admin only)
router.get('/', auth(['admin']), async (req, res) => {
  try {
    // Get total students
    const [students] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'student'");
    
    // Get total faculty
    const [faculty] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'faculty'");
    
    // Get total classrooms
    const [classrooms] = await pool.query('SELECT COUNT(*) as count FROM classrooms');
    
    // Get total enrollments
    const [enrollments] = await pool.query('SELECT COUNT(*) as count FROM enrollments');
    
    // Get total circulars
    const [circulars] = await pool.query('SELECT COUNT(*) as count FROM circulars');
    
    // Get attendance statistics
    const [attendanceStats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent
      FROM attendance
    `);
    
    // Get marks distribution
    const [marksStats] = await pool.query(`
      SELECT 
        AVG(internal_marks) as avg_internal,
        AVG(test_marks) as avg_test,
        COUNT(*) as total_records
      FROM marks
    `);
    
    // Get department-wise student count
    const [deptStats] = await pool.query(`
      SELECT department, COUNT(*) as count 
      FROM users 
      WHERE role = 'student' AND department IS NOT NULL 
      GROUP BY department
    `);
    
    // Get recent activity (latest users)
    const [recentUsers] = await pool.query(`
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    res.json({
      totalStudents: students[0].count,
      totalFaculty: faculty[0].count,
      totalClassrooms: classrooms[0].count,
      totalEnrollments: enrollments[0].count,
      totalCirculars: circulars[0].count,
      attendance: {
        total: attendanceStats[0].total || 0,
        present: attendanceStats[0].present || 0,
        absent: attendanceStats[0].absent || 0,
        percentage: attendanceStats[0].total > 0 
          ? Math.round((attendanceStats[0].present / attendanceStats[0].total) * 100) 
          : 0
      },
      marks: {
        avgInternal: Math.round(marksStats[0].avg_internal || 0),
        avgTest: Math.round(marksStats[0].avg_test || 0),
        totalRecords: marksStats[0].total_records || 0
      },
      departmentStats: deptStats,
      recentUsers
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get faculty performance data
router.get('/faculty/:id', auth(['admin', 'faculty']), async (req, res) => {
  try {
    const facultyId = req.params.id;
    
    // Get classrooms created by faculty
    const [classrooms] = await pool.query(
      'SELECT * FROM classrooms WHERE faculty_id = ?',
      [facultyId]
    );
    
    // Get enrollment and attendance stats for each classroom
    const classroomStats = await Promise.all(
      classrooms.map(async (classroom) => {
        const [enrollCount] = await pool.query(
          'SELECT COUNT(*) as count FROM enrollments WHERE classroom_id = ?',
          [classroom.id]
        );
        
        const [attendanceStats] = await pool.query(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present
          FROM attendance 
          WHERE classroom_id = ?
        `, [classroom.id]);
        
        const [avgMarks] = await pool.query(`
          SELECT 
            AVG(internal_marks) as avg_internal,
            AVG(test_marks) as avg_test
          FROM marks 
          WHERE classroom_id = ?
        `, [classroom.id]);
        
        return {
          ...classroom,
          studentCount: enrollCount[0].count,
          attendance: attendanceStats[0],
          avgMarks: avgMarks[0]
        };
      })
    );
    
    res.json(classroomStats);
  } catch (error) {
    console.error('Faculty analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
