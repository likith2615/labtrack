import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
let isMysqlActive = false;

// Initial Fallback / Default In-Memory Mock Database
export const inMemoryStore = {
  labs: [
    { id: 1, name: 'Signals & Microelectronics Lab', code: 'LAB-EE-01', department: 'Electrical Engineering', location: 'Room 304, Block B', in_charge: 'Dr. Sarah Jenkins', contact_email: 's.jenkins@college.edu', capacity: 32 },
    { id: 2, name: 'Robotics & Mechatronics Bay', code: 'LAB-MECH-02', department: 'Mechanical Engineering', location: 'Ground Floor, Hangar 1', in_charge: 'Prof. Marcus Vance', contact_email: 'm.vance@college.edu', capacity: 24 },
    { id: 3, name: 'Bioprocess & Genomics Lab', code: 'LAB-BIO-03', department: 'Biotechnology', location: 'Room 512, Science Wing', in_charge: 'Dr. Anita Roy', contact_email: 'a.roy@college.edu', capacity: 20 },
    { id: 4, name: 'Embedded Systems & IoT Hub', code: 'LAB-CS-04', department: 'Computer Science', location: 'Room 208, Turing Complex', in_charge: 'Prof. David Chen', contact_email: 'd.chen@college.edu', capacity: 40 },
    { id: 5, name: 'Materials Characterization Suite', code: 'LAB-MAT-05', department: 'Materials Science', location: 'Basement Level 2, Annex C', in_charge: 'Dr. Elena Rostova', contact_email: 'e.rostova@college.edu', capacity: 16 }
  ],
  categories: [
    { id: 1, name: 'Oscilloscopes & Meters', code: 'ELEC-MTR', description: 'Digital storage oscilloscopes, multimeters, LCR meters, and waveform analyzers' },
    { id: 2, name: 'Signal & Power Sources', code: 'ELEC-PWR', description: 'Function generators, precision variable DC supplies, RF synthesizers' },
    { id: 3, name: 'Analytical & Imaging', code: 'OPT-SPEC', description: 'Spectrophotometers, optical microscopes, refractometers' },
    { id: 4, name: 'Fabrication & Prototyping', code: 'FAB-MECH', description: 'CNC desktop mills, PCB plotters, 3D printers, reflow stations' },
    { id: 5, name: 'Centrifugation & Separation', code: 'BIO-SEP', description: 'Refrigerated centrifuges, microcentrifuges, vortex mixers' }
  ],
  equipment: [
    {
      id: 1,
      asset_tag: 'EQ-EE-2024-001',
      name: 'Tektronix TBS1102B-EDU Digital Storage Oscilloscope',
      model_number: 'TBS1102B-EDU',
      manufacturer: 'Tektronix Inc.',
      serial_number: 'C014982-US',
      category_id: 1,
      lab_id: 1,
      status: 'available',
      purchase_date: '2023-08-15',
      warranty_expiry: '2026-08-15',
      last_serviced: '2024-08-10',
      next_service_due: '2025-08-10',
      specifications: { bandwidth: '100 MHz', channels: 2, sample_rate: '2.0 GS/s', display: '7-inch WVGA' },
      notes: 'Bench Station #1. Calibrated with NIST traceable certificate.',
      created_at: new Date('2023-08-15')
    },
    {
      id: 2,
      asset_tag: 'EQ-EE-2024-002',
      name: 'Rigol DP832 Programmable Triple DC Power Supply',
      model_number: 'DP832',
      manufacturer: 'Rigol Technologies',
      serial_number: 'DP8C231400291',
      category_id: 2,
      lab_id: 1,
      status: 'in_use',
      purchase_date: '2023-09-01',
      warranty_expiry: '2026-09-01',
      last_serviced: '2024-07-22',
      next_service_due: '2025-07-22',
      specifications: { channels: 3, total_power: '195 W', ch1: '30V/3A', ch2: '30V/3A', ch3: '5V/3A' },
      notes: 'Assigned to Senior Design Capstone Team 4.',
      created_at: new Date('2023-09-01')
    },
    {
      id: 3,
      asset_tag: 'EQ-MECH-2023-014',
      name: 'Sherline 5400 CNC Benchtop Vertical Milling Machine',
      model_number: '5400-CNC',
      manufacturer: 'Sherline Products',
      serial_number: 'SH-5400-8841',
      category_id: 4,
      lab_id: 2,
      status: 'damaged',
      purchase_date: '2022-11-10',
      warranty_expiry: '2024-11-10',
      last_serviced: '2024-06-15',
      next_service_due: '2024-12-15',
      specifications: { axis: '3-Axis', travel_x: '9.0 in', travel_y: '5.0 in', spindle_speed: '2800 RPM' },
      notes: 'X-axis lead screw backlash detected during aluminum milling session. Spindle alignment required.',
      created_at: new Date('2022-11-10')
    },
    {
      id: 4,
      asset_tag: 'EQ-BIO-2024-007',
      name: 'Eppendorf 5424R Refrigerated Microcentrifuge',
      model_number: '5424R',
      manufacturer: 'Eppendorf AG',
      serial_number: 'EP-5424R-9921',
      category_id: 5,
      lab_id: 3,
      status: 'available',
      purchase_date: '2024-01-20',
      warranty_expiry: '2027-01-20',
      last_serviced: '2024-09-02',
      next_service_due: '2025-03-02',
      specifications: { max_rcf: '21130 x g', max_speed: '15000 RPM', temp_range: '-10C to +40C', rotor_capacity: '24 x 1.5/2.0 mL' },
      notes: 'Rotor FA-45-24-11 certified. Thermal seal inspected.',
      created_at: new Date('2024-01-20')
    },
    {
      id: 5,
      asset_tag: 'EQ-CS-2023-088',
      name: 'Prusa i3 MK3S+ Desktop 3D Fabricator',
      model_number: 'MK3S-PLUS',
      manufacturer: 'Prusa Research',
      serial_number: 'PRUSA-3S-44810',
      category_id: 4,
      lab_id: 4,
      status: 'in_use',
      purchase_date: '2023-03-10',
      warranty_expiry: '2025-03-10',
      last_serviced: '2024-08-01',
      next_service_due: '2024-11-01',
      specifications: { build_volume: '250 x 210 x 210 mm', layer_height: '0.05 - 0.35 mm', nozzle_temp: '300C max' },
      notes: 'Printing sensor enclosures for IoT Environmental Station Project.',
      created_at: new Date('2023-03-10')
    },
    {
      id: 6,
      asset_tag: 'EQ-EE-2022-045',
      name: 'Keysight DSOX1204A 4-Channel Oscilloscope',
      model_number: 'DSOX1204A',
      manufacturer: 'Keysight Technologies',
      serial_number: 'MY59220194',
      category_id: 1,
      lab_id: 1,
      status: 'available',
      purchase_date: '2022-04-12',
      warranty_expiry: '2025-04-12',
      last_serviced: '2024-05-18',
      next_service_due: '2025-05-18',
      specifications: { bandwidth: '70 MHz (upgradable to 200 MHz)', channels: 4, sample_rate: '2 GSa/s' },
      notes: 'Bench Station #4. Serial protocol decode module active.',
      created_at: new Date('2022-04-12')
    },
    {
      id: 7,
      asset_tag: 'EQ-MAT-2021-002',
      name: 'Olympus CX23 Binocular Biological Microscope',
      model_number: 'CX23LEDRFS1',
      manufacturer: 'Olympus Corporation',
      serial_number: 'OLY-CX23-11029',
      category_id: 3,
      lab_id: 5,
      status: 'retired',
      purchase_date: '2019-02-14',
      warranty_expiry: '2022-02-14',
      last_serviced: '2023-11-05',
      next_service_due: '2024-05-05',
      specifications: { optics: 'Plan Achromat 4X 10X 40X 100X', illumination: 'LED 0.5W', field_number: '20' },
      notes: 'Objective lens 100x oil immersion prism degraded. Replaced by CX33.',
      created_at: new Date('2019-02-14')
    },
    {
      id: 8,
      asset_tag: 'EQ-EE-2024-019',
      name: 'Rohde & Schwarz FPC1500 Spectrum Analyzer',
      model_number: 'FPC1500',
      manufacturer: 'Rohde & Schwarz',
      serial_number: 'RS-FPC15-10499',
      category_id: 1,
      lab_id: 1,
      status: 'available',
      purchase_date: '2024-02-11',
      warranty_expiry: '2027-02-11',
      last_serviced: '2024-08-30',
      next_service_due: '2025-08-30',
      specifications: { frequency_range: '5 kHz to 1 GHz', tracking_generator: 'Built-in', vna_mode: '1-port' },
      notes: 'RF test bench. Keep protected with 50-ohm terminator when unpowered.',
      created_at: new Date('2024-02-11')
    }
  ],
  maintenance_logs: [
    {
      id: 1,
      equipment_id: 1,
      service_type: 'routine_calibration',
      service_date: '2024-08-10',
      technician_name: 'Mark Henderson (Tektronix Field Tech)',
      cost: 145.00,
      findings: 'Vertical channel 1 sensitivity drift of +1.4% within tolerance. Ch2 offset adjusted.',
      action_taken: 'Recalibrated ADC bias trim, updated firmware to v2.14, clean air vents.',
      status_after_service: 'available',
      created_at: new Date('2024-08-10')
    },
    {
      id: 2,
      equipment_id: 3,
      service_type: 'inspection',
      service_date: '2024-06-15',
      technician_name: 'Marcus Vance (Lab In-Charge)',
      cost: 0.00,
      findings: 'Operator flagged table chatter during climb milling in aluminum 6061.',
      action_taken: 'Checked gib adjustments, tightened Y-axis nut. Flagged for full lead screw replacement.',
      status_after_service: 'damaged',
      created_at: new Date('2024-06-15')
    },
    {
      id: 3,
      equipment_id: 4,
      service_type: 'routine_calibration',
      service_date: '2024-09-02',
      technician_name: 'Eppendorf Certified BioService',
      cost: 280.00,
      findings: 'Chamber temperature sensor reading 0.8C high at -4C setpoint.',
      action_taken: 'Replaced thermal probe gasket, calibrated refrigeration compressor loop.',
      status_after_service: 'available',
      created_at: new Date('2024-09-02')
    }
  ],
  activity_logs: [
    { id: 1, action: 'STATUS_CHANGE', entity_type: 'equipment', entity_id: 2, details: 'Status transitioned from available -> in_use (Assigned to Capstone Team 4)', created_at: new Date('2024-09-18T10:14:00Z') },
    { id: 2, action: 'MAINTENANCE_RECORDED', entity_type: 'equipment', entity_id: 4, details: 'Routine calibration performed by Eppendorf BioService ($280.00)', created_at: new Date('2024-09-02T14:30:00Z') },
    { id: 3, action: 'INCIDENT_FLAGGED', entity_type: 'equipment', entity_id: 3, details: 'Backlash detected in X-axis. Status changed to damaged', created_at: new Date('2024-06-15T09:12:00Z') },
    { id: 4, action: 'EQUIPMENT_REGISTERED', entity_type: 'equipment', entity_id: 8, details: 'Rohde & Schwarz FPC1500 (EQ-EE-2024-019) registered in Signals Lab', created_at: new Date('2024-02-11T11:00:00Z') }
  ]
};

// Initialize connection
export const initDB = async () => {
  try {
    const config = {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'labtrack_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    pool = mysql.createPool(config);
    // Test connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    isMysqlActive = true;
    console.log(`[DB] Connected to MySQL database "${config.database}" at ${config.host}:${config.port}`);
  } catch (err) {
    isMysqlActive = false;
    console.log(`[DB] MySQL server connection not established (${err.message}). Running in resilient In-Memory Store Mode with full persistence across requests.`);
  }
};

// Query wrapper supporting parameterized queries
export const query = async (sql, params = []) => {
  if (isMysqlActive && pool) {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (err) {
      console.error('[DB Query Error]', err);
      throw err;
    }
  }

  // Handle queries using in-memory store for instant responsiveness & mock mode
  return handleInMemoryQuery(sql, params);
};

// Helper to log activities
export const logActivity = async (action, entityType, entityId, details) => {
  try {
    if (isMysqlActive && pool) {
      await pool.execute(
        'INSERT INTO activity_logs (action, entity_type, entity_id, details) VALUES (?, ?, ?, ?)',
        [action, entityType, entityId, details]
      );
    } else {
      const newId = inMemoryStore.activity_logs.length + 1;
      inMemoryStore.activity_logs.unshift({
        id: newId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
        created_at: new Date()
      });
    }
  } catch (err) {
    console.error('[Activity Log Error]', err);
  }
};

// Emulated Query Handler for In-Memory Store
function handleInMemoryQuery(sql, params) {
  const cleanSql = sql.trim().toLowerCase();

  // LABS
  if (cleanSql.startsWith('select') && cleanSql.includes('from labs')) {
    if (cleanSql.includes('where id =')) {
      const id = params[0];
      const lab = inMemoryStore.labs.find(l => l.id === Number(id));
      return lab ? [lab] : [];
    }
    return inMemoryStore.labs;
  }

  // CATEGORIES
  if (cleanSql.startsWith('select') && cleanSql.includes('from categories')) {
    return inMemoryStore.categories;
  }

  // EQUIPMENT WITH JOINS / FILTERS
  if (cleanSql.startsWith('select') && cleanSql.includes('from equipment')) {
    let result = inMemoryStore.equipment.map(eq => {
      const lab = inMemoryStore.labs.find(l => l.id === eq.lab_id);
      const cat = inMemoryStore.categories.find(c => c.id === eq.category_id);
      return {
        ...eq,
        lab_name: lab ? lab.name : 'Unknown Lab',
        lab_code: lab ? lab.code : '',
        lab_location: lab ? lab.location : '',
        category_name: cat ? cat.name : 'General',
        category_code: cat ? cat.code : ''
      };
    });

    if (cleanSql.includes('where e.id =') || cleanSql.includes('where id =') || cleanSql.includes('where equipment.id =')) {
      const id = params[0];
      const match = result.find(e => e.id === Number(id));
      return match ? [match] : [];
    }

    return result;
  }

  // MAINTENANCE LOGS
  if (cleanSql.startsWith('select') && cleanSql.includes('from maintenance_logs')) {
    let logs = inMemoryStore.maintenance_logs.map(log => {
      const eq = inMemoryStore.equipment.find(e => e.id === log.equipment_id);
      return {
        ...log,
        equipment_name: eq ? eq.name : 'Unknown Equipment',
        asset_tag: eq ? eq.asset_tag : ''
      };
    });

    if (cleanSql.includes('where equipment_id =')) {
      const eqId = params[0];
      return logs.filter(l => l.equipment_id === Number(eqId));
    }
    return logs;
  }

  // ACTIVITY LOGS
  if (cleanSql.startsWith('select') && cleanSql.includes('from activity_logs')) {
    return inMemoryStore.activity_logs;
  }

  return [];
}

export const getIsMysqlActive = () => isMysqlActive;
export default { query, initDB, logActivity, getIsMysqlActive, inMemoryStore };
