-- ============================================
-- Cura AI - Database Setup Script
-- MySQL Database Schema
-- ============================================

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS cura_ai 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE cura_ai;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Unique user identifier',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique username for login',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT 'User email address',
    hashed_password VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
    is_active BOOLEAN DEFAULT TRUE NOT NULL COMMENT 'User account status',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    -- Indexes for performance
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
    
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_unicode_ci
COMMENT='User authentication and profile table';

-- Verify table creation
DESCRIBE users;

-- Show all tables
SHOW TABLES;

-- ============================================
-- Sample Query Examples
-- ============================================

-- Count total users
-- SELECT COUNT(*) as total_users FROM users;

-- List all users
-- SELECT id, username, email, is_active, created_at FROM users;

-- Find user by username
-- SELECT * FROM users WHERE username = 'your_username';

-- Find active users
-- SELECT * FROM users WHERE is_active = TRUE;

-- ============================================
-- Success Message
-- ============================================
SELECT '✓ Cura AI database setup completed successfully!' as Status;
