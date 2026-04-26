-- EduOS Database Setup Script
-- Run this script in MySQL to create all tables

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS eduos_db;
USE eduos_db;

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS circulars;
DROP TABLE IF EXISTS classrooms;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'faculty', 'admin') NOT NULL,
  department VARCHAR(255),
  year INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Classrooms table
CREATE TABLE classrooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_name VARCHAR(255) NOT NULL,
  faculty_id INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enrollments table
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  classroom_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (student_id, classroom_id)
);

-- Attendance table
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  classroom_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('present', 'absent') NOT NULL,
  marked_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_attendance (student_id, classroom_id, date)
);

-- Marks table
CREATE TABLE marks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  classroom_id INT NOT NULL,
  internal_marks INT DEFAULT 0 CHECK (internal_marks >= 0 AND internal_marks <= 100),
  test_marks INT DEFAULT 0 CHECK (test_marks >= 0 AND test_marks <= 100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE,
  UNIQUE KEY unique_marks (student_id, classroom_id)
);

-- Circulars table
CREATE TABLE circulars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  target_role ENUM('student', 'faculty', 'all') NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_classrooms_faculty ON classrooms(faculty_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_classroom ON enrollments(classroom_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_classroom ON attendance(classroom_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_marks_student ON marks(student_id);
CREATE INDEX idx_marks_classroom ON marks(classroom_id);
CREATE INDEX idx_circulars_target ON circulars(target_role);
CREATE INDEX idx_circulars_created ON circulars(created_at);

-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, role, department) 
VALUES ('Admin', 'admin@eduos.com', '$2b$10$8K1p/a0dL3LXMIgoEDFrwOB1aXH5UqJ5rVqEJPmKU7yE3Y3GXcGu', 'admin', 'Administration');

-- Sample data for testing
-- INSERT INTO users (name, email, password, role, department, year) VALUES
-- ('John Doe', 'john@student.com', '$2b$10$hash', 'student', 'Computer Science', 3),
-- ('Jane Smith', 'jane@faculty.com', '$2b$10$hash', 'faculty', 'Computer Science', NULL),
-- ('Bob Wilson', 'bob@student.com', '$2b$10$hash', 'student', 'Computer Science', 2);

-- Display created tables
SHOW TABLES;

SELECT 'Database setup completed successfully!' AS message;
