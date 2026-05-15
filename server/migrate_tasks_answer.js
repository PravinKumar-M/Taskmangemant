require('dotenv').config();
const pool = require('./models/db');

async function migrate() {
  try {
    console.log('Running migration: Adding correct_answer to tasks table...');
    try {
      await pool.query("ALTER TABLE tasks ADD COLUMN correct_answer VARCHAR(255) DEFAULT NULL AFTER options");
      console.log('Added correct_answer column.');
    } catch(e) { if(e.code !== 'ER_DUP_FIELDNAME') throw e; }
    console.log('✅ Migration successful!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
  process.exit(0);
}

migrate();
