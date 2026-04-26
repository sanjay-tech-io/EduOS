const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { pool } = require('../config/db');
const auth = require('../middleware/auth');
require('dotenv').config();

// AI Assistant endpoint
router.post('/assistant', auth(['student']), async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Please provide a message' });
    }

    // Get student data
    const [userResult] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult[0];

    // Get attendance data
    const [attendance] = await pool.query(
      `SELECT a.*, c.subject_name 
       FROM attendance a 
       JOIN classrooms c ON a.classroom_id = c.id 
       WHERE a.student_id = ?`,
      [req.user.id]
    );

    // Get marks data
    const [marks] = await pool.query(
      `SELECT m.*, c.subject_name 
       FROM marks m 
       JOIN classrooms c ON m.classroom_id = c.id 
       WHERE m.student_id = ?`,
      [req.user.id]
    );

    // Calculate attendance percentage
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    // Calculate average marks
    let totalMarks = 0;
    let totalSubjects = marks.length;
    marks.forEach(m => {
      totalMarks += (m.internal_marks || 0) + (m.test_marks || 0);
    });
    const averageMarks = totalSubjects > 0 ? Math.round(totalMarks / totalSubjects) : 0;

    // Prepare student profile for AI
    const studentProfile = `
      Student Name: ${user.name}
      Email: ${user.email}
      Department: ${user.department || 'Not specified'}
      Year: ${user.year || 'Not specified'}
      
      Attendance: ${attendancePercentage}% (${presentDays}/${totalDays} days)
      
      Marks by Subject:
      ${marks.map(m => `- ${m.subject_name}: Internal: ${m.internal_marks}, Test: ${m.test_marks}`).join('\n')}
      
      Average Score: ${averageMarks}
    `;

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Determine the type of request and craft appropriate prompt
    let systemPrompt = `You are an educational AI assistant for a college management system called EduOS. You help students with their academic concerns.`;
    
    let userPrompt = message;
    
    if (message.toLowerCase().includes('summarize') || message.toLowerCase().includes('performance')) {
      userPrompt = `Based on the following student data, summarize their academic performance and provide insights:\n\n${studentProfile}\n\nUser question: ${message}`;
    } else if (message.toLowerCase().includes('resume') || message.toLowerCase().includes('cv')) {
      userPrompt = `Based on the following student data, help create a resume/CV:\n\n${studentProfile}\n\nUser question: ${message}`;
    } else if (message.toLowerCase().includes('career') || message.toLowerCase().includes('job') || message.toLowerCase().includes('future')) {
      userPrompt = `Based on the following student data, suggest career improvements:\n\n${studentProfile}\n\nUser question: ${message}`;
    } else {
      userPrompt = `You are helping a student. Here is their academic data:\n\n${studentProfile}\n\nUser question: ${message}`;
    }

    // Make request to OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('AI Assistant error:', error);
    
    if (error.code === 'invalid_api_key') {
      return res.status(500).json({ message: 'AI service configuration error. Please contact administrator.' });
    }
    
    res.status(500).json({ message: 'Error processing AI request' });
  }
});

module.exports = router;
