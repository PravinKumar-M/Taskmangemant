require('dotenv').config();
const pool = require('./models/db');

async function checkSchema() {
  try {
    const [rows] = await pool.query('DESCRIBE users');
    console.log('Users table schema:');
    console.table(rows);
    process.exit(0);
  } catch (err) {
    console.error('Error checking schema:', err);
    process.exit(1);
  }
}

checkSchema();
