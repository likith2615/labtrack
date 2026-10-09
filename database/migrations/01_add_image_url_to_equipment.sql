-- =============================================================================
-- MIGRATION: 01_add_image_url_to_equipment.sql
-- Adds optional image_url column to equipment table for real hardware photos
-- =============================================================================

ALTER TABLE equipment
ADD COLUMN image_url VARCHAR(500) NULL AFTER description;

-- Add index on image_url presence if needed
-- INDEX idx_equipment_image (image_url)
