-- =============================================================================
-- LABTRACK DATABASE SCHEMA
-- College Laboratory Equipment Management System
-- =============================================================================

CREATE DATABASE IF NOT EXISTS labtrack_db;
USE labtrack_db;

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'staff', 'student') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: laboratories
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS laboratories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(120) NOT NULL,
  incharge_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_labs_incharge
    FOREIGN KEY (incharge_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX idx_labs_incharge (incharge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: categories
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_categories_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table: equipment
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asset_tag VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  category_id INT NOT NULL,
  lab_id INT NOT NULL,
  serial_no VARCHAR(100) NOT NULL,
  purchase_date DATE NOT NULL,
  status ENUM('available', 'allocated', 'under_maintenance', 'damaged', 'retired') NOT NULL DEFAULT 'available',
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_equipment_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_equipment_lab
    FOREIGN KEY (lab_id) REFERENCES laboratories(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  INDEX idx_equipment_asset_tag (asset_tag),
  INDEX idx_equipment_status (status),
  INDEX idx_equipment_category (category_id),
  INDEX idx_equipment_lab (lab_id),
  INDEX idx_equipment_serial (serial_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table: allocations
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS allocations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT NOT NULL,
  user_id INT NOT NULL,
  allocated_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date DATETIME NOT NULL,
  returned_on DATETIME NULL,
  purpose VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_allocations_equipment
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_allocations_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  INDEX idx_allocations_equipment (equipment_id),
  INDEX idx_allocations_user (user_id),
  INDEX idx_allocations_due_date (due_date),
  INDEX idx_allocations_returned (returned_on)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Table: maintenance
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS maintenance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT NOT NULL,
  reported_by INT NULL,
  issue_description TEXT NOT NULL,
  severity ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  status ENUM('reported', 'in_progress', 'resolved') NOT NULL DEFAULT 'reported',
  reported_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_on DATETIME NULL,
  technician_notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_maintenance_equipment
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_maintenance_user
    FOREIGN KEY (reported_by) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  INDEX idx_maintenance_equipment (equipment_id),
  INDEX idx_maintenance_reported_by (reported_by),
  INDEX idx_maintenance_status (status),
  INDEX idx_maintenance_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
