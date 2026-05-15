require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  try {
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

    console.log('Creating app_feedbacks table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS app_feedbacks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        year VARCHAR(50) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        feedback_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log('Successfully created app_feedbacks table in TiDB!');
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
