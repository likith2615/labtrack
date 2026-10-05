-- =============================================================================
-- LABTRACK SEED DATA
-- College Laboratory Equipment Management System
-- =============================================================================

USE labtrack_db;

-- Clear previous data in correct foreign-key dependency order
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE maintenance;
TRUNCATE TABLE allocations;
TRUNCATE TABLE equipment;
TRUNCATE TABLE categories;
TRUNCATE TABLE laboratories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Seed: users (3 Users: 1 Admin, 1 Staff, 1 Student)
-- Passwords hashed with standard bcrypt format
-- -----------------------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
(1, 'Dr. Arthur Vance', 'admin@labtrack.edu', '$2a$12$e8M4v8Tj0xYfZb5x5TKnPeYJgA1i5bK0G2vj.9dO0S1vM5X5K8eSe', 'admin', '2024-01-10 08:30:00'),
(2, 'Elena Ramos', 'elena.ramos@labtrack.edu', '$2a$12$K8v9Tj0xYfZb5x5TKnPeYJgA1i5bK0G2vj.9dO0S1vM5X5K8eSe12', 'staff', '2024-01-15 09:15:00'),
(3, 'Liam Cooper', 'liam.cooper@student.labtrack.edu', '$2a$12$Z1v9Tj0xYfZb5x5TKnPeYJgA1i5bK0G2vj.9dO0S1vM5X5K8eSe99', 'student', '2024-02-01 10:00:00');

-- -----------------------------------------------------------------------------
-- 2. Seed: laboratories (5 Laboratories)
-- -----------------------------------------------------------------------------
INSERT INTO laboratories (id, name, location, incharge_id, created_at) VALUES
(1, 'Computer Lab 1', 'Room 201, Alan Turing Complex', 2, '2024-01-15 09:30:00'),
(2, 'Networking Lab', 'Room 204, Charles Babbage Hall', 2, '2024-01-15 09:45:00'),
(3, 'Electronics Lab', 'Room 305, Michael Faraday Wing', 1, '2024-01-15 10:00:00'),
(4, 'IoT & Embedded Systems Lab', 'Room 402, James Clerk Maxwell Hall', 2, '2024-01-15 10:15:00'),
(5, 'Mechanical Workshop', 'Ground Floor, Hangar 1 Engineering Annex', 1, '2024-01-15 10:30:00');

-- -----------------------------------------------------------------------------
-- 3. Seed: categories (6 Categories)
-- -----------------------------------------------------------------------------
INSERT INTO categories (id, name, description, created_at) VALUES
(1, 'Computing Systems', 'Desktop workstations, tower PCs, servers, and high-performance compute nodes', '2024-01-15 11:00:00'),
(2, 'Networking Equipment', 'Managed switches, edge routers, patch panels, wireless access points, and rack units', '2024-01-15 11:05:00'),
(3, 'Electronic Test & Measurement', 'Digital storage oscilloscopes, function generators, benchtop multimeters, and spectrum analyzers', '2024-01-15 11:10:00'),
(4, 'Microcontrollers & Development Kits', 'Single-board computers, ARM Cortex development boards, sensor breakout kits, and FPGA trainers', '2024-01-15 11:15:00'),
(5, 'Fabrication & Prototyping', '3D printers, CNC benchtop mills, reflow ovens, PCB plotters, and digital soldering stations', '2024-01-15 11:20:00'),
(6, 'Engineering Software Licences', 'Network floating licences, CAD design suites, computational mathematics and simulation tools', '2024-01-15 11:25:00');

-- -----------------------------------------------------------------------------
-- 4. Seed: equipment (45 Realistic Laboratory Equipment Rows)
-- -----------------------------------------------------------------------------
INSERT INTO equipment (id, asset_tag, name, category_id, lab_id, serial_no, purchase_date, status, description) VALUES
-- Computing Systems in Computer Lab 1 (Lab 1)
(1, 'EQ-CS-001', 'Dell OptiPlex 7090 Tower', 1, 1, 'DL-7090-99411', '2023-05-10', 'available', 'Intel Core i7-11700, 32GB DDR4, 512GB NVMe SSD, Dual DisplayPort.'),
(2, 'EQ-CS-002', 'Dell OptiPlex 7090 Tower', 1, 1, 'DL-7090-99412', '2023-05-10', 'available', 'Intel Core i7-11700, 32GB DDR4, 512GB NVMe SSD, Dual DisplayPort.'),
(3, 'EQ-CS-003', 'Dell OptiPlex 7090 Tower', 1, 1, 'DL-7090-99413', '2023-05-10', 'allocated', 'Allocated to Senior AI Capstone workstation bench.'),
(4, 'EQ-CS-004', 'Dell OptiPlex 7090 Tower', 1, 1, 'DL-7090-99414', '2023-05-10', 'available', 'Intel Core i7-11700, 32GB DDR4, 512GB NVMe SSD.'),
(5, 'EQ-CS-005', 'HP Z4 G4 Workstation', 1, 1, 'HP-Z4G4-10293', '2022-09-14', 'available', 'Intel Xeon W-2223, 64GB ECC RAM, NVIDIA RTX A4000 GPU for simulation.'),
(6, 'EQ-CS-006', 'Apple Mac Studio M2 Max', 1, 1, 'AP-M2MAX-88210', '2023-11-20', 'allocated', 'Apple M2 Max 12-Core, 64GB Unified Memory. Assigned to ML research team.'),
(7, 'EQ-CS-007', 'Lenovo ThinkStation P340 Tiny', 1, 1, 'LN-P340-55102', '2022-08-01', 'under_maintenance', 'RAM diagnostic fault detected during memory stress test.'),
(8, 'EQ-CS-008', 'Intel NUC 11 Pro Mini PC', 1, 1, 'NUC-11-77192', '2023-02-18', 'retired', 'Mainboard power regulator failure. Decommissioned for spare parts.'),

-- Networking Equipment in Networking Lab (Lab 2)
(9, 'EQ-NET-001', 'Cisco Catalyst 2960-X 24-Port Gigabit Switch', 2, 2, 'FCW2145A089', '2022-03-15', 'available', '24x 10/100/1000 Ethernet ports + 4x 1G SFP uplinks. Rack 1-Slot A.'),
(10, 'EQ-NET-002', 'Cisco Catalyst 2960-X 24-Port Gigabit Switch', 2, 2, 'FCW2145A090', '2022-03-15', 'damaged', 'Port 4 and Port 7 physical pin damage from bent RJ45 connector.'),
(11, 'EQ-NET-003', 'Cisco Catalyst 2960-Plus 48-Port Fast Ethernet', 2, 2, 'FCW1933B012', '2021-06-10', 'available', '48x 10/100 ports, 2x T/SFP uplinks. LAN Base image.'),
(12, 'EQ-NET-004', 'Cisco 4331 Integrated Services Router', 2, 2, 'FGL2033109X', '2022-11-05', 'available', '100Mbps to 300Mbps aggregate throughput, 3 NIM slots, 1 ISC slot.'),
(13, 'EQ-NET-005', 'Cisco 4331 Integrated Services Router', 2, 2, 'FGL2033110Y', '2022-11-05', 'allocated', 'Allocated for Inter-VLAN Routing and OSPF multi-area lab project.'),
(14, 'EQ-NET-006', 'MikroTik Cloud Router Switch CRS328-24P-4S+RM', 2, 2, 'MT-CRS328-991', '2023-04-12', 'available', '24 Port Gigabit with PoE-Out 802.3af/at + 4x SFP+ 10G ports.'),
(15, 'EQ-NET-007', 'Ubiquiti UniFi USW-24-PoE Gen2', 2, 2, 'UB-USW24-4410', '2023-07-22', 'available', 'Managed Layer 2 Gigabit switch with 16 802.3at PoE+ ports.'),
(16, 'EQ-NET-008', 'Netgear ProSAFE GS724T 24-Port Smart Managed Switch', 2, 2, 'NG-GS724T-332', '2021-04-09', 'retired', 'Legacy model replaced by Cisco Catalyst units.'),

-- Electronic Test & Measurement in Electronics Lab (Lab 3)
(17, 'EQ-EL-001', 'Tektronix TBS1052B Digital Storage Oscilloscope', 3, 3, 'C030911-US', '2023-01-15', 'available', '50 MHz bandwidth, 2 channels, 1.0 GS/s sample rate, 7-inch WVGA display.'),
(18, 'EQ-EL-002', 'Tektronix TBS1052B Digital Storage Oscilloscope', 3, 3, 'C030912-US', '2023-01-15', 'available', '50 MHz bandwidth, 2 channels, 1.0 GS/s sample rate. NIST calibrated.'),
(19, 'EQ-EL-003', 'Tektronix TBS1052B Digital Storage Oscilloscope', 3, 3, 'C030913-US', '2023-01-15', 'allocated', 'Allocated to EE202 Analog Filter Design Lab session.'),
(20, 'EQ-EL-004', 'Keysight DSOX1204A 4-Channel Oscilloscope', 3, 3, 'MY59220194', '2022-04-12', 'available', '70 MHz (upgradable to 200 MHz), 4 analog channels, 2 GSa/s.'),
(21, 'EQ-EL-005', 'Keysight 34461A 6½ Digit Digital Multimeter', 3, 3, 'MY53210988', '2023-08-20', 'available', 'True RMS AC/DC, Truevolt technology, USB/LAN connectivity.'),
(22, 'EQ-EL-006', 'Fluke 87V Industrial Multimeter', 3, 3, 'FLK-87V-44192', '2022-02-14', 'available', '6000 counts, 0.05% DC accuracy, thermocouple temperature probe included.'),
(23, 'EQ-EL-007', 'Rigol DG1022Z 25MHz Arbitrary Waveform Generator', 3, 3, 'DG1ZA220109', '2023-03-01', 'available', '2 output channels, 200 MSa/s sample rate, 14-bit vertical resolution.'),
(24, 'EQ-EL-008', 'Rigol DP832 Programmable Triple DC Power Supply', 3, 3, 'DP8C2314002', '2023-09-01', 'under_maintenance', 'Channel 2 over-voltage protection circuit tripped. Inspection scheduled.'),
(25, 'EQ-EL-009', 'Rohde & Schwarz FPC1500 Spectrum Analyzer', 3, 3, 'RS-FPC15-104', '2024-02-11', 'available', '5 kHz to 1 GHz frequency range, tracking generator and 1-port VNA mode.'),
(26, 'EQ-EL-010', 'Keithley 2450 SourceMeter Source Measure Unit (SMU)', 3, 3, 'KTH-2450-771', '2023-06-18', 'available', '0.1 fA to 1 A, 20 mV to 200 V, graphical touchscreen interface.'),
(27, 'EQ-EL-011', 'Siglent SDS1104X-E 100MHz 4-Channel Oscilloscope', 3, 3, 'SGL-1104-882', '2022-10-30', 'available', '100 MHz, 4 channels, 1 GSa/s, 14 Mpts memory depth.'),
(28, 'EQ-EL-012', 'Saleae Logic Pro 8 USB Logic Analyzer', 3, 3, 'SAL-PRO8-190', '2023-05-25', 'available', '8 digital/analog channels, 500 MS/s digital, 50 MS/s analog.'),

-- Microcontrollers & Development Kits in IoT & Embedded Lab (Lab 4)
(29, 'EQ-IOT-001', 'Raspberry Pi 4 Model B (4GB) Lab Starter Kit', 4, 4, 'RPI4-4G-001', '2023-04-10', 'available', 'Broadcom BCM2711 quad-core Cortex-A72, Official Case, 32GB MicroSD, Power.'),
(30, 'EQ-IOT-002', 'Raspberry Pi 4 Model B (4GB) Lab Starter Kit', 4, 4, 'RPI4-4G-002', '2023-04-10', 'allocated', 'Allocated for Smart Campus Weather Station Capstone Project.'),
(31, 'EQ-IOT-003', 'STM32 Nucleo-F401RE Development Board', 4, 4, 'NUCLEO-F401-1', '2023-01-20', 'available', 'ARM Cortex-M4 @ 84 MHz with FPU, Arduino Uno Rev3 connectivity.'),
(32, 'EQ-IOT-004', 'STM32 Nucleo-F401RE Development Board', 4, 4, 'NUCLEO-F401-2', '2023-01-20', 'available', 'ARM Cortex-M4 @ 84 MHz with FPU, integrated ST-LINK/V2-1 debugger.'),
(33, 'EQ-IOT-005', 'Arduino Mega 2560 R3 Lab Training Board', 4, 4, 'ARD-MEGA-101', '2022-07-15', 'available', 'ATmega2560 microcontroller, 54 digital I/O pins, 16 analog inputs.'),
(34, 'EQ-IOT-006', 'TI MSP430 LaunchPad Development Kit', 4, 4, 'TI-MSP430-881', '2022-11-10', 'available', 'MSP-EXP430FR5969 ultra-low-power evaluation board with 64KB FRAM.'),
(35, 'EQ-IOT-007', 'NVIDIA Jetson Nano 4GB Developer Kit', 4, 4, 'NV-JETNAN-332', '2023-08-05', 'available', '128-core Maxwell GPU, Quad-core ARM A57, 4GB LPDDR4 for Edge AI.'),
(36, 'EQ-IOT-008', 'NVIDIA Jetson Orin Nano Super Kit', 4, 4, 'NV-ORIN-90112', '2024-03-01', 'available', 'Up to 40 TOPS AI compute, Ampere architecture GPU, 8GB memory.'),

-- Fabrication & Prototyping in Mechanical Workshop (Lab 5)
(37, 'EQ-MECH-001', 'Prusa i3 MK3S+ Desktop 3D Fabricator', 5, 5, 'PRUSA-3S-448', '2023-03-10', 'available', '250x210x210mm volume, magnetic heatbed with PEI sheet, 0.4mm nozzle.'),
(38, 'EQ-MECH-002', 'Bambu Lab X1-Carbon Combo 3D Printer', 5, 5, 'BAMBU-X1C-01', '2023-12-05', 'available', 'CoreXY 20000mm/s2 acceleration, Dual auto-bed leveling, AMS multi-color.'),
(39, 'EQ-MECH-003', 'Sherline 5400 CNC Benchtop Vertical Milling Machine', 5, 5, 'SH-5400-8841', '2022-11-10', 'damaged', 'Backlash on X-axis lead screw assembly. Spindle alignment required.'),
(40, 'EQ-MECH-004', 'Weller WE1010 Digital Soldering Station', 5, 5, 'WEL-WE10-109', '2022-05-18', 'available', '70W digital temperature controlled station, 100C to 450C range.'),
(41, 'EQ-MECH-005', 'Hakko FX-888D Digital Soldering Station', 5, 5, 'HAK-FX88-221', '2022-05-18', 'available', '65W soldering iron station with digital display and password lock.'),
(42, 'EQ-MECH-006', 'Creality Ender-3 V2 Pro 3D Printer', 5, 5, 'CRL-END3-991', '2021-10-15', 'retired', 'Hotend carriage warped, replaced by Bambu Lab X1C.'),

-- Engineering Software Licences (Categorized under Category 6, deployed across labs)
(43, 'EQ-SOFT-001', 'MATLAB Academic Campus 100-Seat Floating Licence', 6, 1, 'LIC-MATLAB-2024', '2024-01-01', 'available', 'Concurrent network licence with Simulink, Signal Processing, and Control System Toolboxes.'),
(44, 'EQ-SOFT-002', 'LabVIEW Professional Development System Licence', 6, 3, 'LIC-LABVIEW-24', '2024-01-01', 'available', 'National Instruments LabVIEW full development environment with DAQmx drivers.'),
(45, 'EQ-SOFT-003', 'SolidWorks Education Edition 50-Seat Network Licence', 6, 5, 'LIC-SOLIDWORKS', '2024-01-01', 'available', '3D CAD, Simulation Professional, Motion Analysis, and Plastics simulation modules.');

-- -----------------------------------------------------------------------------
-- 5. Seed: allocations (Allocations with Active, Returned, and Overdue states)
-- -----------------------------------------------------------------------------
INSERT INTO allocations (id, equipment_id, user_id, allocated_on, due_date, returned_on, purpose) VALUES
-- Active Allocation (In Use)
(1, 3, 3, '2024-09-15 10:00:00', '2024-10-15 17:00:00', NULL, 'Deep Learning Computer Vision Semester Project'),
-- Returned Allocation
(2, 1, 3, '2024-08-01 09:00:00', '2024-08-20 17:00:00', '2024-08-19 16:30:00', 'Parallel Computing Benchmarking Experiment'),
-- Active Allocation (In Use)
(3, 13, 2, '2024-09-20 11:30:00', '2024-10-25 18:00:00', NULL, 'Campus Core Backbone Routing Reconfiguration & Student Demo'),
-- Active Allocation (In Use)
(4, 19, 3, '2024-09-28 14:00:00', '2024-10-12 16:00:00', NULL, 'Analog Active Bandpass Filter Tuning & Bode Plot Verification'),
-- Active Allocation (In Use)
(5, 30, 3, '2024-09-10 13:00:00', '2024-10-30 18:00:00', NULL, 'IoT Environmental Telemetry Node Deployment'),
-- Overdue Allocation (Past due_date with returned_on IS NULL)
(6, 6, 3, '2024-08-10 09:00:00', '2024-09-01 17:00:00', NULL, 'Large Language Model Fine-tuning Research Sandbox');

-- -----------------------------------------------------------------------------
-- 6. Seed: maintenance (Records across severity and status states)
-- -----------------------------------------------------------------------------
INSERT INTO maintenance (id, equipment_id, reported_by, issue_description, severity, status, reported_on, resolved_on, technician_notes) VALUES
-- High severity, Reported status
(1, 39, 1, 'X-axis lead screw experiencing 0.25mm mechanical backlash during aluminum milling passes.', 'high', 'reported', '2024-09-25 11:30:00', NULL, 'Scheduled vendor replacement of anti-backlash nut assembly.'),
-- Medium severity, In Progress status
(2, 10, 2, 'Ethernet Ports 4 and 7 fail link negotiation due to deformed internal gold pins.', 'medium', 'in_progress', '2024-09-28 14:15:00', NULL, 'Technician desoldered RJ45 magjack module. Replacement module on order.'),
-- Low severity, Resolved status
(3, 17, 2, 'Channel 1 DC offset drift (+1.2%) observed during periodic NIST baseline verification.', 'low', 'resolved', '2024-08-10 09:00:00', '2024-08-10 15:30:00', 'Recalibrated internal DAC reference, updated firmware to v2.14, verified within 0.1% tolerance.'),
-- High severity, In Progress status
(4, 24, 1, 'Channel 2 over-voltage protection circuit triggers intermittently under 15V/2A load.', 'high', 'in_progress', '2024-10-01 10:00:00', NULL, 'Investigating feedback optocoupler and current sense resistor.'),
-- Medium severity, Resolved status
(5, 7, 2, 'Intermittent kernel panic during memory-intensive simulation runs.', 'medium', 'in_progress', '2024-09-29 16:20:00', NULL, 'MemTest86 identified error in DDR4 SODIMM Slot 1.');
