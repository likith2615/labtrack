-- =============================================================================
-- LABTRACK SEED DATA
-- College Laboratory Equipment Management System
-- =============================================================================

USE labtrack_db;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE activity_logs;
TRUNCATE TABLE maintenance_logs;
TRUNCATE TABLE equipment;
TRUNCATE TABLE categories;
TRUNCATE TABLE labs;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Laboratories
INSERT INTO labs (id, name, code, department, location, in_charge, contact_email, capacity) VALUES
(1, 'Signals & Microelectronics Lab', 'LAB-EE-01', 'Electrical Engineering', 'Room 304, Block B', 'Dr. Sarah Jenkins', 's.jenkins@college.edu', 32),
(2, 'Robotics & Mechatronics Bay', 'LAB-MECH-02', 'Mechanical Engineering', 'Ground Floor, Hangar 1', 'Prof. Marcus Vance', 'm.vance@college.edu', 24),
(3, 'Bioprocess & Genomics Lab', 'LAB-BIO-03', 'Biotechnology', 'Room 512, Science Wing', 'Dr. Anita Roy', 'a.roy@college.edu', 20),
(4, 'Embedded Systems & IoT Hub', 'LAB-CS-04', 'Computer Science', 'Room 208, Turing Complex', 'Prof. David Chen', 'd.chen@college.edu', 40),
(5, 'Materials Characterization Suite', 'LAB-MAT-05', 'Materials Science', 'Basement Level 2, Annex C', 'Dr. Elena Rostova', 'e.rostova@college.edu', 16);

-- 2. Insert Categories
INSERT INTO categories (id, name, code, description) VALUES
(1, 'Oscilloscopes & Meters', 'ELEC-MTR', 'Digital storage oscilloscopes, multimeters, LCR meters, and waveform analyzers'),
(2, 'Signal & Power Sources', 'ELEC-PWR', 'Function generators, precision variable DC supplies, RF synthesizers'),
(3, 'Analytical & Imaging', 'OPT-SPEC', 'Spectrophotometers, optical microscopes, refractometers'),
(4, 'Fabrication & Prototyping', 'FAB-MECH', 'CNC desktop mills, PCB plotters, 3D printers, reflow stations'),
(5, 'Centrifugation & Separation', 'BIO-SEP', 'Refrigerated centrifuges, microcentrifuges, vortex mixers');

-- 3. Insert Equipment
INSERT INTO equipment (id, asset_tag, name, model_number, manufacturer, serial_number, category_id, lab_id, status, purchase_date, warranty_expiry, last_serviced, next_service_due, specifications, notes) VALUES
(1, 'EQ-EE-2024-001', 'Tektronix TBS1102B-EDU Digital Storage Oscilloscope', 'TBS1102B-EDU', 'Tektronix Inc.', 'C014982-US', 1, 1, 'available', '2023-08-15', '2026-08-15', '2024-08-10', '2025-08-10', '{"bandwidth": "100 MHz", "channels": 2, "sample_rate": "2.0 GS/s"}', 'Bench Station #1. Calibrated with NIST traceable certificate.'),
(2, 'EQ-EE-2024-002', 'Rigol DP832 Programmable Triple DC Power Supply', 'DP832', 'Rigol Technologies', 'DP8C231400291', 2, 1, 'in_use', '2023-09-01', '2026-09-01', '2024-07-22', '2025-07-22', '{"channels": 3, "total_power": "195 W", "ch1": "30V/3A"}', 'Assigned to Senior Design Capstone Team 4.'),
(3, 'EQ-MECH-2023-014', 'Sherline 5400 CNC Benchtop Vertical Milling Machine', '5400-CNC', 'Sherline Products', 'SH-5400-8841', 4, 2, 'damaged', '2022-11-10', '2024-11-10', '2024-06-15', '2024-12-15', '{"axis": "3-Axis", "travel_x": "9.0 in", "travel_y": "5.0 in"}', 'X-axis lead screw backlash detected during aluminum milling. Spindle alignment required.'),
(4, 'EQ-BIO-2024-007', 'Eppendorf 5424R Refrigerated Microcentrifuge', '5424R', 'Eppendorf AG', 'EP-5424R-9921', 5, 3, 'available', '2024-01-20', '2027-01-20', '2024-09-02', '2025-03-02', '{"max_rcf": "21130 x g", "max_speed": "15000 RPM", "temp_range": "-10C to +40C"}', 'Rotor FA-45-24-11 certified. Thermal seal inspected.'),
(5, 'EQ-CS-2023-088', 'Prusa i3 MK3S+ Desktop 3D Fabricator', 'MK3S-PLUS', 'Prusa Research', 'PRUSA-3S-44810', 4, 4, 'in_use', '2023-03-10', '2025-03-10', '2024-08-01', '2024-11-01', '{"build_volume": "250 x 210 x 210 mm", "layer_height": "0.05 - 0.35 mm"}', 'Printing sensor enclosures for IoT Environmental Station Project.'),
(6, 'EQ-EE-2022-045', 'Keysight DSOX1204A 4-Channel Oscilloscope', 'DSOX1204A', 'Keysight Technologies', 'MY59220194', 1, 1, 'available', '2022-04-12', '2025-04-12', '2024-05-18', '2025-05-18', '{"bandwidth": "70 MHz", "channels": 4, "sample_rate": "2 GSa/s"}', 'Bench Station #4. Serial protocol decode module active.'),
(7, 'EQ-MAT-2021-002', 'Olympus CX23 Binocular Biological Microscope', 'CX23LEDRFS1', 'Olympus Corporation', 'OLY-CX23-11029', 3, 5, 'retired', '2019-02-14', '2022-02-14', '2023-11-05', '2024-05-05', '{"optics": "Plan Achromat 4X 10X 40X 100X", "illumination": "LED 0.5W"}', 'Objective lens 100x oil immersion prism degraded. Replaced by CX33.'),
(8, 'EQ-EE-2024-019', 'Rohde & Schwarz FPC1500 Spectrum Analyzer', 'FPC1500', 'Rohde & Schwarz', 'RS-FPC15-10499', 1, 1, 'available', '2024-02-11', '2027-02-11', '2024-08-30', '2025-08-30', '{"frequency_range": "5 kHz to 1 GHz", "tracking_generator": "Built-in"}', 'RF test bench. Keep protected with 50-ohm terminator when unpowered.');

-- 4. Insert Maintenance Logs
INSERT INTO maintenance_logs (id, equipment_id, service_type, service_date, technician_name, cost, findings, action_taken, status_after_service) VALUES
(1, 1, 'routine_calibration', '2024-08-10', 'Mark Henderson (Tektronix Field Tech)', 145.00, 'Vertical channel 1 sensitivity drift of +1.4% within tolerance. Ch2 offset adjusted.', 'Recalibrated ADC bias trim, updated firmware to v2.14, cleaned air vents.', 'available'),
(2, 3, 'inspection', '2024-06-15', 'Marcus Vance (Lab In-Charge)', 0.00, 'Operator flagged table chatter during climb milling in aluminum 6061.', 'Checked gib adjustments, tightened Y-axis nut. Flagged for full lead screw replacement.', 'damaged'),
(3, 4, 'routine_calibration', '2024-09-02', 'Eppendorf Certified BioService', 280.00, 'Chamber temperature sensor reading 0.8C high at -4C setpoint.', 'Replaced thermal probe gasket, calibrated refrigeration compressor loop.', 'available');

-- 5. Insert Activity Logs
INSERT INTO activity_logs (id, action, entity_type, entity_id, details, created_at) VALUES
(1, 'STATUS_CHANGE', 'equipment', 2, 'Status transitioned from available -> in_use (Assigned to Capstone Team 4)', '2024-09-18 10:14:00'),
(2, 'MAINTENANCE_RECORDED', 'equipment', 4, 'Routine calibration performed by Eppendorf BioService ($280.00)', '2024-09-02 14:30:00'),
(3, 'INCIDENT_FLAGGED', 'equipment', 3, 'Backlash detected in X-axis. Status changed to damaged', '2024-06-15 09:12:00'),
(4, 'EQUIPMENT_REGISTERED', 'equipment', 8, 'Rohde & Schwarz FPC1500 (EQ-EE-2024-019) registered in Signals Lab', '2024-02-11 11:00:00');
