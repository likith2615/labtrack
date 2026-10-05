import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { inMemoryStore } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  console.log('[SEED] Starting LabTrack database provisioning...');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log('[SEED] Connected to MySQL host.');

    // Execute schema SQL
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('[SEED] Applying schema...');
    await connection.query(schemaSql);
    await connection.query('USE labtrack_db;');

    // Clear existing data in reverse order of foreign keys
    console.log('[SEED] Clearing existing records...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
    await connection.query('TRUNCATE TABLE activity_logs;');
    await connection.query('TRUNCATE TABLE maintenance_logs;');
    await connection.query('TRUNCATE TABLE equipment;');
    await connection.query('TRUNCATE TABLE categories;');
    await connection.query('TRUNCATE TABLE labs;');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

    // Insert Labs
    console.log('[SEED] Inserting Laboratories...');
    for (const lab of inMemoryStore.labs) {
      await connection.query(
        'INSERT INTO labs (id, name, code, department, location, in_charge, contact_email, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [lab.id, lab.name, lab.code, lab.department, lab.location, lab.in_charge, lab.contact_email, lab.capacity]
      );
    }

    // Insert Categories
    console.log('[SEED] Inserting Equipment Categories...');
    for (const cat of inMemoryStore.categories) {
      await connection.query(
        'INSERT INTO categories (id, name, code, description) VALUES (?, ?, ?, ?)',
        [cat.id, cat.name, cat.code, cat.description]
      );
    }

    // Insert Equipment
    console.log('[SEED] Inserting Laboratory Equipment Assets...');
    for (const eq of inMemoryStore.equipment) {
      await connection.query(
        `INSERT INTO equipment (
          id, asset_tag, name, model_number, manufacturer, serial_number,
          category_id, lab_id, status, purchase_date, warranty_expiry,
          last_serviced, next_service_due, specifications, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          eq.id,
          eq.asset_tag,
          eq.name,
          eq.model_number,
          eq.manufacturer,
          eq.serial_number,
          eq.category_id,
          eq.lab_id,
          eq.status,
          eq.purchase_date,
          eq.warranty_expiry,
          eq.last_serviced,
          eq.next_service_due,
          JSON.stringify(eq.specifications),
          eq.notes
        ]
      );
    }

    // Insert Maintenance Logs
    console.log('[SEED] Inserting Maintenance Logs...');
    for (const log of inMemoryStore.maintenance_logs) {
      await connection.query(
        `INSERT INTO maintenance_logs (
          id, equipment_id, service_type, service_date, technician_name,
          cost, findings, action_taken, status_after_service
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          log.id,
          log.equipment_id,
          log.service_type,
          log.service_date,
          log.technician_name,
          log.cost,
          log.findings,
          log.action_taken,
          log.status_after_service
        ]
      );
    }

    // Insert Activity Logs
    console.log('[SEED] Inserting Activity Logs...');
    for (const act of inMemoryStore.activity_logs) {
      await connection.query(
        'INSERT INTO activity_logs (id, action, entity_type, entity_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [act.id, act.action, act.entity_type, act.entity_id, act.details, act.created_at]
      );
    }

    await connection.end();
    console.log('✅ [SEED] LabTrack database successfully seeded with realistic laboratory assets!');
  } catch (err) {
    console.error('❌ [SEED] Failed to seed MySQL database:', err.message);
    console.log('Tip: Ensure MySQL server is running on localhost:3306 or check DB credentials in server/.env');
  }
}

runSeed();
