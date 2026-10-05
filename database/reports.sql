-- =============================================================================
-- LABTRACK ANALYTICAL REPORTS & SQL QUERIES
-- College Laboratory Equipment Management System
-- Demonstrates: JOIN, UPDATE, DELETE, COUNT, GROUP BY, Subqueries & Aggregations
-- =============================================================================

USE labtrack_db;

-- -----------------------------------------------------------------------------
-- REPORT 1: Equipment Count Per Laboratory
-- Demonstrates: LEFT JOIN, COUNT, GROUP BY, ORDER BY
-- Purpose: Overview of equipment inventory distribution across all facilities.
-- -----------------------------------------------------------------------------
SELECT 
  l.id AS lab_id,
  l.name AS lab_name,
  l.location AS lab_location,
  u.name AS faculty_incharge,
  COUNT(e.id) AS total_equipment_count,
  SUM(CASE WHEN e.status = 'available' THEN 1 ELSE 0 END) AS available_count,
  SUM(CASE WHEN e.status = 'allocated' THEN 1 ELSE 0 END) AS allocated_count,
  SUM(CASE WHEN e.status = 'under_maintenance' THEN 1 ELSE 0 END) AS maintenance_count,
  SUM(CASE WHEN e.status = 'damaged' THEN 1 ELSE 0 END) AS damaged_count,
  SUM(CASE WHEN e.status = 'retired' THEN 1 ELSE 0 END) AS retired_count
FROM laboratories l
LEFT JOIN users u ON l.incharge_id = u.id
LEFT JOIN equipment e ON l.id = e.lab_id
GROUP BY l.id, l.name, l.location, u.name
ORDER BY total_equipment_count DESC;

-- -----------------------------------------------------------------------------
-- REPORT 2: Equipment Count By Operational Status
-- Demonstrates: COUNT, GROUP BY, Percentage Calculation
-- Purpose: System fleet health summary and operational percentage.
-- -----------------------------------------------------------------------------
SELECT 
  e.status AS operational_status,
  COUNT(e.id) AS equipment_count,
  ROUND(COUNT(e.id) * 100.0 / (SELECT COUNT(*) FROM equipment), 2) AS percentage_of_inventory
FROM equipment e
GROUP BY e.status
ORDER BY equipment_count DESC;

-- -----------------------------------------------------------------------------
-- REPORT 3: Maintenance Records Per Category
-- Demonstrates: Multi-table INNER JOIN, COUNT, GROUP BY
-- Purpose: Evaluates which equipment categories require the highest service frequency.
-- -----------------------------------------------------------------------------
SELECT 
  c.id AS category_id,
  c.name AS category_name,
  COUNT(m.id) AS total_service_tickets,
  SUM(CASE WHEN m.severity = 'high' THEN 1 ELSE 0 END) AS high_severity_count,
  SUM(CASE WHEN m.status = 'reported' THEN 1 ELSE 0 END) AS pending_reported,
  SUM(CASE WHEN m.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress,
  SUM(CASE WHEN m.status = 'resolved' THEN 1 ELSE 0 END) AS resolved
FROM categories c
INNER JOIN equipment e ON c.id = e.category_id
INNER JOIN maintenance m ON e.id = m.equipment_id
GROUP BY c.id, c.name
ORDER BY total_service_tickets DESC;

-- -----------------------------------------------------------------------------
-- REPORT 4: Overdue Equipment Allocations
-- Demonstrates: Multi-table JOIN, Date functions (NOW, DATEDIFF), Filtering
-- Purpose: Identifies students/staff with unreturned items past the due date.
-- -----------------------------------------------------------------------------
SELECT 
  a.id AS allocation_id,
  e.asset_tag,
  e.name AS equipment_name,
  u.name AS borrower_name,
  u.email AS borrower_email,
  u.role AS user_role,
  l.name AS lab_location,
  a.allocated_on,
  a.due_date,
  DATEDIFF(NOW(), a.due_date) AS days_overdue,
  a.purpose
FROM allocations a
INNER JOIN equipment e ON a.equipment_id = e.id
INNER JOIN users u ON a.user_id = u.id
INNER JOIN laboratories l ON e.lab_id = l.id
WHERE a.returned_on IS NULL 
  AND a.due_date < NOW()
ORDER BY days_overdue DESC;

-- -----------------------------------------------------------------------------
-- REPORT 5: Most-Damaged / Fault-Prone Categories
-- Demonstrates: JOIN, COUNT, GROUP BY, HAVING
-- Purpose: Ranks hardware categories with the highest defect or repair rate.
-- -----------------------------------------------------------------------------
SELECT 
  c.id AS category_id,
  c.name AS category_name,
  COUNT(e.id) AS total_category_units,
  SUM(CASE WHEN e.status IN ('damaged', 'under_maintenance') THEN 1 ELSE 0 END) AS faulty_units_count,
  ROUND(
    SUM(CASE WHEN e.status IN ('damaged', 'under_maintenance') THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(COUNT(e.id), 0),
    2
  ) AS failure_rate_percentage
FROM categories c
INNER JOIN equipment e ON c.id = e.category_id
GROUP BY c.id, c.name
HAVING faulty_units_count > 0
ORDER BY failure_rate_percentage DESC, faulty_units_count DESC;

-- -----------------------------------------------------------------------------
-- QUERY 6: Synchronize Equipment Status on Maintenance Ticket Resolution
-- Demonstrates: UPDATE with JOIN
-- Purpose: When a maintenance ticket is marked 'resolved', automatically set
--          the equipment status back to 'available' if it is under_maintenance.
-- -----------------------------------------------------------------------------
UPDATE equipment e
INNER JOIN maintenance m ON e.id = m.equipment_id
SET 
  e.status = 'available',
  m.resolved_on = NOW()
WHERE m.id = 5 
  AND m.status = 'in_progress'
  AND e.status = 'under_maintenance';

-- -----------------------------------------------------------------------------
-- QUERY 7: Mark Returned Allocation and Restore Equipment Availability
-- Demonstrates: Transaction-safe UPDATE of allocation & equipment status
-- -----------------------------------------------------------------------------
START TRANSACTION;

UPDATE allocations 
SET returned_on = NOW() 
WHERE id = 1 AND returned_on IS NULL;

UPDATE equipment 
SET status = 'available' 
WHERE id = (SELECT equipment_id FROM allocations WHERE id = 1);

COMMIT;

-- -----------------------------------------------------------------------------
-- QUERY 8: Purge Resolved Maintenance Logs for Decommissioned/Retired Equipment
-- Demonstrates: DELETE with JOIN and condition
-- Purpose: Archive maintenance cleanup for equipment retired over 180 days ago.
-- -----------------------------------------------------------------------------
DELETE m
FROM maintenance m
INNER JOIN equipment e ON m.equipment_id = e.id
WHERE e.status = 'retired'
  AND m.status = 'resolved'
  AND m.resolved_on < DATE_SUB(NOW(), INTERVAL 180 DAY);
