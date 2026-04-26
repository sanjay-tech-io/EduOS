const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'eduos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const initDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'eduos'}`);
  await connection.query(`USE ${process.env.DB_NAME || 'eduos'}`);

  // Create USERS table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('student', 'faculty', 'admin') NOT NULL,
      department VARCHAR(255),
      year INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create CLASSROOMS table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS classrooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      subject_name VARCHAR(255) NOT NULL,
      faculty_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (faculty_id) REFERENCES users(id)
    )
  `);

  // Create ENROLLMENTS table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      classroom_id INT NOT NULL,
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
      UNIQUE KEY unique_enrollment (student_id, classroom_id)
    )
  `);

  // Create ATTENDANCE table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      classroom_id INT NOT NULL,
      date DATE NOT NULL,
      status ENUM('present', 'absent') NOT NULL,
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
      UNIQUE KEY unique_attendance (student_id, classroom_id, date)
    )
  `);

  // Create MARKS table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS marks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      classroom_id INT NOT NULL,
      internal_marks INT DEFAULT 0,
      test_marks INT DEFAULT 0,
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
      UNIQUE KEY unique_marks (student_id, classroom_id)
    )
  `);

  // Create CIRCULARS table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS circulars (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      target_role ENUM('student', 'faculty', 'all') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await connection.end();
  console.log('Database initialized successfully');
};

module.exports = { pool, initDatabase };
