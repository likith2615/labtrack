-- database: :memory:
-- LabTrack Database Schema
-- College Laboratory Equipment Management System

CREATE DATABASE IF NOT EXISTS labtrack_db;
USE labtrack_db;

-- 1. Labs Table
CREATE TABLE IF NOT EXISTS labs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  department VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  in_charge VARCHAR(100) NOT NULL,
  contact_email VARCHAR(100),
  capacity INT DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Equipment Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asset_tag VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  model_number VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100) NOT NULL,
  serial_number VARCHAR(100) NOT NULL,
  category_id INT NOT NULL,
  lab_id INT NOT NULL,
  status ENUM('available', 'in_use', 'damaged', 'retired') DEFAULT 'available',
  purchase_date DATE,
  warranty_expiry DATE,
  last_serviced DATE,
  next_service_due DATE,
  specifications JSON,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Maintenance Logs Table
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT NOT NULL,
  service_type ENUM('routine_calibration', 'repair', 'inspection', 'emergency_fix') NOT NULL,
  service_date DATE NOT NULL,
  technician_name VARCHAR(100) NOT NULL,
  cost DECIMAL(10, 2) DEFAULT 0.00,
  findings TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  status_after_service ENUM('available', 'in_use', 'damaged', 'retired') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT,
  details TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
