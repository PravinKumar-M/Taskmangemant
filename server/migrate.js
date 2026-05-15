// Quick migration script - Run once to add google_id column
require('dotenv').config();
const pool = require('./models/db');

async function migrate() {
  try {
    console.log('Running migration: Adding profile_picture column...');
    await pool.query(
      "ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) DEFAULT NULL AFTER google_id"
    );
    console.log('✅ Migration successful! profile_picture column added.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('✅ Column profile_picture already exists. No changes needed.');
    } else {
      console.error('❌ Migration failed:', err.message);
    }
  }
  process.exit(0);
}

migrate();
