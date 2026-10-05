import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
let isMysqlActive = false;

// Create connection pool
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'labtrack_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

export const initPool = async () => {
  try {
    pool = mysql.createPool(poolConfig);
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    isMysqlActive = true;
    console.log(`[DB] MySQL pool initialized successfully on ${poolConfig.host}:${poolConfig.port} (${poolConfig.database})`);
  } catch (err) {
    isMysqlActive = false;
    console.log(`[DB] Notice: MySQL not reachable at ${poolConfig.host}:${poolConfig.port} (${err.message}). Utilizing in-memory state engine fallback.`);
  }
};

/**
 * Execute parameterized query using pool connection
 * @param {string} sql - SQL query string with ? placeholders
 * @param {Array} params - Array of parameter values
 */
export const query = async (sql, params = []) => {
  if (isMysqlActive && pool) {
    const [results] = await pool.execute(sql, params);
    return results;
  }

  // Graceful in-memory fallback query handler
  return fallbackQueryHandler(sql, params);
};

export const getIsMysqlActive = () => isMysqlActive;
export const getPool = () => pool;

// In-Memory Fallback State (Aligned with database/seed.sql)
export const inMemoryDB = {
  users: [
    { id: 1, name: 'Dr. Arthur Vance', email: 'admin@labtrack.edu', role: 'admin', created_at: new Date('2024-01-10') },
    { id: 2, name: 'Elena Ramos', email: 'elena.ramos@labtrack.edu', role: 'staff', created_at: new Date('2024-01-15') },
    { id: 3, name: 'Liam Cooper', email: 'liam.cooper@student.labtrack.edu', role: 'student', created_at: new Date('2024-02-01') }
  ],
  laboratories: [
    { id: 1, name: 'Computer Lab 1', location: 'Room 201, Alan Turing Complex', incharge_id: 2 },
    { id: 2, name: 'Networking Lab', location: 'Room 204, Charles Babbage Hall', incharge_id: 2 },
    { id: 3, name: 'Electronics Lab', location: 'Room 305, Michael Faraday Wing', incharge_id: 1 },
    { id: 4, name: 'IoT & Embedded Systems Lab', location: 'Room 402, James Clerk Maxwell Hall', incharge_id: 2 },
    { id: 5, name: 'Mechanical Workshop', location: 'Ground Floor, Hangar 1 Annex', incharge_id: 1 }
  ],
  categories: [
    { id: 1, name: 'Computing Systems', description: 'Desktop workstations, tower PCs, and compute nodes' },
    { id: 2, name: 'Networking Equipment', description: 'Managed switches, edge routers, and patch panels' },
    { id: 3, name: 'Electronic Test & Measurement', description: 'Oscilloscopes, function generators, multimeters' },
    { id: 4, name: 'Microcontrollers & Development Kits', description: 'Single-board computers and embedded kits' },
    { id: 5, name: 'Fabrication & Prototyping', description: '3D printers, CNC mills, and soldering stations' },
    { id: 6, name: 'Engineering Software Licences', description: 'Network floating licences and simulation software' }
  ],
  equipment: [
    { id: 1, asset_tag: 'EQ-CS-001', name: 'Dell OptiPlex 7090 Tower', category_id: 1, lab_id: 1, serial_no: 'DL-7090-99411', purchase_date: '2023-05-10', status: 'available', description: 'Intel Core i7-11700, 32GB RAM, 512GB SSD.' },
    { id: 2, asset_tag: 'EQ-CS-002', name: 'Dell OptiPlex 7090 Tower', category_id: 1, lab_id: 1, serial_no: 'DL-7090-99412', purchase_date: '2023-05-10', status: 'available', description: 'Intel Core i7-11700, 32GB RAM, 512GB SSD.' },
    { id: 3, asset_tag: 'EQ-CS-003', name: 'Dell OptiPlex 7090 Tower', category_id: 1, lab_id: 1, serial_no: 'DL-7090-99413', purchase_date: '2023-05-10', status: 'allocated', description: 'Allocated to Senior Capstone workstation.' },
    { id: 9, asset_tag: 'EQ-NET-001', name: 'Cisco Catalyst 2960-X 24-Port Gigabit Switch', category_id: 2, lab_id: 2, serial_no: 'FCW2145A089', purchase_date: '2022-03-15', status: 'available', description: '24x 10/100/1000 Ethernet ports, 4x SFP uplinks.' },
    { id: 10, asset_tag: 'EQ-NET-002', name: 'Cisco Catalyst 2960-X 24-Port Gigabit Switch', category_id: 2, lab_id: 2, serial_no: 'FCW2145A090', purchase_date: '2022-03-15', status: 'damaged', description: 'Port 4 and Port 7 bent pin damage.' },
    { id: 17, asset_tag: 'EQ-EL-001', name: 'Tektronix TBS1052B Digital Storage Oscilloscope', category_id: 3, lab_id: 3, serial_no: 'C030911-US', purchase_date: '2023-01-15', status: 'available', description: '50 MHz bandwidth, 2 channels, 1 GS/s sample rate.' },
    { id: 29, asset_tag: 'EQ-IOT-001', name: 'Raspberry Pi 4 Model B (4GB) Lab Starter Kit', category_id: 4, lab_id: 4, serial_no: 'RPI4-4G-001', purchase_date: '2023-04-10', status: 'available', description: 'Quad-core Cortex-A72, 4GB RAM, official kit.' },
    { id: 37, asset_tag: 'EQ-MECH-001', name: 'Prusa i3 MK3S+ Desktop 3D Fabricator', category_id: 5, lab_id: 5, serial_no: 'PRUSA-3S-448', purchase_date: '2023-03-10', status: 'available', description: '250x210x210mm volume, heated PEI magnetic bed.' },
    { id: 43, asset_tag: 'EQ-SOFT-001', name: 'MATLAB Academic Campus 100-Seat Floating Licence', category_id: 6, lab_id: 1, serial_no: 'LIC-MATLAB-2024', purchase_date: '2024-01-01', status: 'available', description: 'Concurrent network licence with Simulink toolboxes.' }
  ],
  allocations: [
    { id: 1, equipment_id: 3, user_id: 3, allocated_on: '2024-09-15 10:00:00', due_date: '2024-10-15 17:00:00', returned_on: null, purpose: 'Deep Learning Computer Vision Semester Project' }
  ],
  maintenance: [
    { id: 1, equipment_id: 10, reported_by: 2, issue_description: 'Ethernet Ports 4 and 7 fail link negotiation.', severity: 'medium', status: 'in_progress', reported_on: '2024-09-28 14:15:00', resolved_on: null, technician_notes: 'Replacement module on order.' }
  ]
};

function fallbackQueryHandler(sql, params) {
  const clean = sql.trim().toLowerCase();

  // Categories
  if (clean.includes('from categories')) {
    return inMemoryDB.categories;
  }

  // Laboratories
  if (clean.includes('from laboratories')) {
    if (clean.includes('where l.id =') || clean.includes('where id =')) {
      const match = inMemoryDB.laboratories.find(l => l.id === Number(params[0]));
      return match ? [match] : [];
    }
    return inMemoryDB.laboratories.map(lab => {
      const incharge = inMemoryDB.users.find(u => u.id === lab.incharge_id);
      const eqCount = inMemoryDB.equipment.filter(e => e.lab_id === lab.id).length;
      return {
        ...lab,
        incharge_name: incharge ? incharge.name : 'Unassigned',
        incharge_email: incharge ? incharge.email : '',
        total_equipment: eqCount
      };
    });
  }

  // Equipment
  if (clean.includes('from equipment')) {
    const list = inMemoryDB.equipment.map(e => {
      const cat = inMemoryDB.categories.find(c => c.id === e.category_id);
      const lab = inMemoryDB.laboratories.find(l => l.id === e.lab_id);
      return {
        ...e,
        category_name: cat ? cat.name : '',
        lab_name: lab ? lab.name : '',
        lab_location: lab ? lab.location : ''
      };
    });

    if (clean.includes('where e.id =') || clean.includes('where id =')) {
      const match = list.find(e => e.id === Number(params[0]));
      return match ? [match] : [];
    }
    return list;
  }

  // Allocations
  if (clean.includes('from allocations')) {
    return inMemoryDB.allocations.map(a => {
      const eq = inMemoryDB.equipment.find(e => e.id === a.equipment_id);
      const user = inMemoryDB.users.find(u => u.id === a.user_id);
      return {
        ...a,
        equipment_name: eq ? eq.name : '',
        asset_tag: eq ? eq.asset_tag : '',
        user_name: user ? user.name : '',
        user_email: user ? user.email : ''
      };
    });
  }

  // Maintenance
  if (clean.includes('from maintenance')) {
    return inMemoryDB.maintenance.map(m => {
      const eq = inMemoryDB.equipment.find(e => e.id === m.equipment_id);
      const user = inMemoryDB.users.find(u => u.id === m.reported_by);
      return {
        ...m,
        equipment_name: eq ? eq.name : '',
        asset_tag: eq ? eq.asset_tag : '',
        reported_by_name: user ? user.name : ''
      };
    });
  }

  // Users
  if (clean.includes('from users')) {
    return inMemoryDB.users;
  }

  return [];
}

export default { query, initPool, getIsMysqlActive, getPool };
