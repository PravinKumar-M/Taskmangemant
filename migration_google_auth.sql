-- ============================================
-- Migration: Add Google Sign-In support
-- Run this on your existing database
-- ============================================

USE student_task_system;

-- Add google_id and profile_picture columns to users table
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) DEFAULT NULL AFTER role;
ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255) DEFAULT NULL AFTER google_id;

-- Verify the change
DESCRIBE users;
