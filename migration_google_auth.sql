-- ============================================
-- Migration: Add Google Sign-In support
-- Run this on your existing database
-- ============================================

USE student_task_system;

-- Add google_id column to users table
ALTER TABLE users ADD COLUMN google_id VARCHAR(255) DEFAULT NULL AFTER role;

-- Verify the change
DESCRIBE users;
