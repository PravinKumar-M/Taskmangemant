require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDB() {
  try {
    console.log('Connecting to TiDB...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'test',
      port: process.env.DB_PORT || 4000,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      }
    });

    console.log('Connected! Creating users table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'admin') DEFAULT 'student',
        google_id VARCHAR(255) DEFAULT NULL,
        profile_picture VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating tasks table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'general',
        options JSON DEFAULT NULL,
        correct_answer TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating submissions table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        student_id INT NOT NULL,
        answer TEXT NOT NULL,
        marks INT DEFAULT NULL,
        feedback TEXT DEFAULT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('All tables created successfully in TiDB!');
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables:', err);
    process.exit(1);
  }
}

initDB();
