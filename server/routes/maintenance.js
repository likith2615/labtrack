import express from 'express';
import db, { inMemoryStore, getIsMysqlActive } from '../db.js';
import { validateMaintenancePayload } from '../middleware/validator.js';

const router = express.Router();

// GET all maintenance logs
router.get('/', async (req, res, next) => {
  try {
    const { equipment_id, service_type } = req.query;

    if (getIsMysqlActive()) {
      let sql = `
        SELECT 
          m.*,
          e.name AS equipment_name,
          e.asset_tag,
          e.model_number,
          l.name AS lab_name,
          l.code AS lab_code
        FROM maintenance_logs m
        JOIN equipment e ON m.equipment_id = e.id
        JOIN labs l ON e.lab_id = l.id
        WHERE 1=1
      `;
      const params = [];

      if (equipment_id) {
        sql += ' AND m.equipment_id = ?';
        params.push(Number(equipment_id));
      }
      if (service_type) {
        sql += ' AND m.service_type = ?';
        params.push(service_type);
      }

      sql += ' ORDER BY m.service_date DESC, m.created_at DESC';

      const logs = await db.query(sql, params);
      return res.json({ success: true, count: logs.length, data: logs });
    }

    // In-memory fallback
    let logs = inMemoryStore.maintenance_logs.map(log => {
      const eq = inMemoryStore.equipment.find(e => e.id === log.equipment_id);
      const lab = eq ? inMemoryStore.labs.find(l => l.id === eq.lab_id) : null;
      return {
        ...log,
        equipment_name: eq ? eq.name : 'Unknown Asset',
        asset_tag: eq ? eq.asset_tag : 'N/A',
        model_number: eq ? eq.model_number : '',
        lab_name: lab ? lab.name : 'N/A',
        lab_code: lab ? lab.code : ''
      };
    });

    if (equipment_id) {
      logs = logs.filter(l => l.equipment_id === Number(equipment_id));
    }
    if (service_type) {
      logs = logs.filter(l => l.service_type === service_type);
    }

    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
});

// POST new maintenance entry
router.post('/', validateMaintenancePayload, async (req, res, next) => {
  try {
    const {
      equipment_id,
      service_type,
      service_date,
      technician_name,
      cost = 0,
      findings,
      action_taken,
      status_after_service = 'available',
      next_service_due
    } = req.body;

    const eqId = Number(equipment_id);

    if (getIsMysqlActive()) {
      const sql = `
        INSERT INTO maintenance_logs (
          equipment_id, service_type, service_date, technician_name,
          cost, findings, action_taken, status_after_service
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await db.query(sql, [
        eqId,
        service_type,
        service_date,
        technician_name,
        parseFloat(cost) || 0.00,
        findings,
        action_taken,
        status_after_service
      ]);

      // Update equipment last_serviced, next_service_due, and status
      const updateEqSql = `
        UPDATE equipment 
        SET last_serviced = ?, 
            status = ?,
            ${next_service_due ? 'next_service_due = ?,' : ''}
            updated_at = NOW()
        WHERE id = ?
      `;
      const updateParams = next_service_due
        ? [service_date, status_after_service, next_service_due, eqId]
        : [service_date, status_after_service, eqId];

      await db.query(updateEqSql, updateParams);

      await db.logActivity(
        'MAINTENANCE_RECORDED',
        'equipment',
        eqId,
        `Service recorded: ${service_type.replace('_', ' ')} by ${technician_name}. Status: ${status_after_service}`
      );

      return res.status(201).json({
        success: true,
        data: { id: result.insertId, ...req.body }
      });
    }

    // In-memory fallback
    const eq = inMemoryStore.equipment.find(e => e.id === eqId);
    if (!eq) {
      return res.status(404).json({ success: false, error: { message: `Equipment ID ${eqId} not found.` } });
    }

    const newId = inMemoryStore.maintenance_logs.length > 0
      ? Math.max(...inMemoryStore.maintenance_logs.map(m => m.id)) + 1
      : 1;

    const newLog = {
      id: newId,
      equipment_id: eqId,
      service_type,
      service_date,
      technician_name,
      cost: parseFloat(cost) || 0.00,
      findings,
      action_taken,
      status_after_service,
      created_at: new Date()
    };

    inMemoryStore.maintenance_logs.unshift(newLog);

    // Update equipment
    eq.last_serviced = service_date;
    eq.status = status_after_service;
    if (next_service_due) {
      eq.next_service_due = next_service_due;
    }

    await db.logActivity(
      'MAINTENANCE_RECORDED',
      'equipment',
      eqId,
      `Service recorded: ${service_type.replace('_', ' ')} by ${technician_name}. Status: ${status_after_service}`
    );

    res.status(201).json({
      success: true,
      data: newLog
    });
  } catch (err) {
    next(err);
  }
});

export default router;
