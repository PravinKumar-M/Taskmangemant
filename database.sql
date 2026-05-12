-- Create database
CREATE DATABASE IF NOT EXISTS student_task_system;
USE student_task_system;

-- Create users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create submissions table
CREATE TABLE submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  student_id INT NOT NULL,
  answer LONGTEXT NOT NULL,
  marks INT DEFAULT NULL,
  feedback LONGTEXT DEFAULT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_submission (task_id, student_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_task ON submissions(task_id);
CREATE INDEX idx_submissions_marks ON submissions(marks);

-- Insert demo admin user (password: admin123 hashed with bcryptjs)
-- For actual implementation, hash the password using bcryptjs
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$SysxSQHCuoHeXcxtFm8.hODmHJT2i1F5I/EhudE.oh/HC0Y30qk62', 'admin');

-- Insert demo student user (password: student123 hashed with bcryptjs)
INSERT INTO users (name, email, password, role) VALUES 
('John Doe', 'student@example.com', '$2a$10$zol/u4/TmtzQKqbrBLk26Ox.IEvWAfWHwsNTb1TgJjA6NX2UfeuHu', 'student');

-- Insert sample tasks
INSERT INTO tasks (title, description) VALUES 
('Introduction to Databases', 'Explain the basic concepts of relational databases including tables, rows, columns, and keys.'),
('SQL Query Writing', 'Write SQL queries to join multiple tables and retrieve specific data with WHERE clauses.'),
('Database Design', 'Design a normalized database schema for a student management system with at least 4 tables.'),
('Query Optimization', 'Identify slow queries and write optimized versions using proper indexing strategies.');

-- Sample submission for demonstration
INSERT INTO submissions (task_id, student_id, answer, marks, feedback) VALUES 
(1, 2, 'A relational database is a collection of organized data stored in the form of related tables. Each table contains rows and columns where rows represent records and columns represent fields.', 85, 'Good explanation! You covered the basic concepts well. Could have included more about primary and foreign keys.');

-- Display data to verify
SELECT 'Users' as section;
SELECT * FROM users;

SELECT 'Tasks' as section;
SELECT * FROM tasks;

SELECT 'Submissions' as section;
SELECT * FROM submissions;
