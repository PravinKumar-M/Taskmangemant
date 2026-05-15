require('dotenv').config();
const pool = require('./models/db');

async function migrate() {
  try {
    console.log('Running migration: Adding type and options to tasks table...');
    try {
      await pool.query("ALTER TABLE tasks ADD COLUMN type ENUM('general', 'mcq', 'code') DEFAULT 'general' AFTER description");
      console.log('Added type column.');
    } catch(e) { if(e.code !== 'ER_DUP_FIELDNAME') throw e; }
    
    try {
      await pool.query("ALTER TABLE tasks ADD COLUMN options JSON DEFAULT NULL AFTER type");
      console.log('Added options column.');
    } catch(e) { if(e.code !== 'ER_DUP_FIELDNAME') throw e; }

    console.log('✅ Migration successful!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  }
  process.exit(0);
}

migrate();
