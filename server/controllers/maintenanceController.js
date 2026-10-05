import asyncHandler from '../middleware/asyncHandler.js';
import { query, getIsMysqlActive, inMemoryDB } from '../config/db.js';

/**
 * @desc   Get all maintenance records
 * @route  GET /api/maintenance
 * @access Public
 */
export const getAllMaintenance = asyncHandler(async (req, res) => {
  const { status, severity, equipment_id } = req.query;

  if (getIsMysqlActive()) {
    let sql = `
      SELECT 
        m.id, m.equipment_id, m.reported_by, m.issue_description, m.severity,
        m.status, m.reported_on, m.resolved_on, m.technician_notes,
        e.asset_tag, e.name AS equipment_name,
        l.name AS lab_name,
        u.name AS reporter_name
      FROM maintenance m
      JOIN equipment e ON m.equipment_id = e.id
      JOIN laboratories l ON e.lab_id = l.id
      LEFT JOIN users u ON m.reported_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND m.status = ?';
      params.push(status);
    }
    if (severity) {
      sql += ' AND m.severity = ?';
      params.push(severity);
    }
    if (equipment_id) {
      sql += ' AND m.equipment_id = ?';
      params.push(Number(equipment_id));
    }

    sql += ' ORDER BY m.reported_on DESC';

    const results = await query(sql, params);
    return res.status(200).json({
      success: true,
      message: `Retrieved ${results.length} maintenance tickets.`,
      data: results,
      errors: null
    });
  }

  // In-memory fallback
  let items = inMemoryDB.maintenance.map(m => {
    const eq = inMemoryDB.equipment.find(e => e.id === m.equipment_id);
    const lab = eq ? inMemoryDB.laboratories.find(l => l.id === eq.lab_id) : null;
    const user = inMemoryDB.users.find(u => u.id === m.reported_by);
    return {
      ...m,
      equipment_name: eq ? eq.name : '',
      asset_tag: eq ? eq.asset_tag : '',
      lab_name: lab ? lab.name : '',
      reporter_name: user ? user.name : 'Staff'
    };
  });

  if (status) items = items.filter(m => m.status === status);
  if (severity) items = items.filter(m => m.severity === severity);
  if (equipment_id) items = items.filter(m => m.equipment_id === Number(equipment_id));

  res.status(200).json({
    success: true,
    message: `Retrieved ${items.length} maintenance tickets.`,
    data: items,
    errors: null
  });
});

/**
 * @desc   Create a maintenance service ticket
 * @route  POST /api/maintenance
 * @access Public
 */
export const createMaintenanceTicket = asyncHandler(async (req, res) => {
  const { equipment_id, reported_by, issue_description, severity = 'medium', technician_notes } = req.body;

  if (getIsMysqlActive()) {
    const insertSql = `
      INSERT INTO maintenance (equipment_id, reported_by, issue_description, severity, status, technician_notes)
      VALUES (?, ?, ?, ?, 'reported', ?)
    `;
    const result = await query(insertSql, [
      Number(equipment_id),
      reported_by ? Number(reported_by) : null,
      issue_description,
      severity,
      technician_notes || null
    ]);

    // Update equipment status to under_maintenance or damaged
    const nextStatus = severity === 'high' ? 'damaged' : 'under_maintenance';
    await query('UPDATE equipment SET status = ? WHERE id = ?', [nextStatus, Number(equipment_id)]);

    return res.status(201).json({
      success: true,
      message: 'Maintenance ticket created successfully.',
      data: { id: result.insertId, equipment_id, issue_description, severity, status: 'reported' },
      errors: null
    });
  }

  const nextStatus = severity === 'high' ? 'damaged' : 'under_maintenance';
  const eq = inMemoryDB.equipment.find(e => e.id === Number(equipment_id));
  if (eq) eq.status = nextStatus;

  const newId = inMemoryDB.maintenance.length > 0 ? Math.max(...inMemoryDB.maintenance.map(m => m.id)) + 1 : 1;
  const newTicket = {
    id: newId,
    equipment_id: Number(equipment_id),
    reported_by: reported_by ? Number(reported_by) : 1,
    issue_description,
    severity,
    status: 'reported',
    reported_on: new Date().toISOString(),
    resolved_on: null,
    technician_notes: technician_notes || ''
  };
  inMemoryDB.maintenance.unshift(newTicket);

  res.status(201).json({
    success: true,
    message: 'Maintenance ticket created successfully.',
    data: newTicket,
    errors: null
  });
});

/**
 * @desc   Update maintenance ticket status (in_progress, resolved)
 * @route  PATCH /api/maintenance/:id/status
 * @access Public
 */
export const updateMaintenanceStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, technician_notes } = req.body;

  if (getIsMysqlActive()) {
    const ticket = await query('SELECT * FROM maintenance WHERE id = ?', [Number(id)]);
    if (!ticket || ticket.length === 0) {
      return res.status(404).json({ success: false, message: 'Maintenance ticket not found.', errors: null });
    }

    const isResolved = status === 'resolved';
    const updateSql = `
      UPDATE maintenance 
      SET status = ?,
          resolved_on = ${isResolved ? 'NOW()' : 'resolved_on'},
          technician_notes = IFNULL(?, technician_notes)
      WHERE id = ?
    `;
    await query(updateSql, [status, technician_notes || null, Number(id)]);

    if (isResolved) {
      await query("UPDATE equipment SET status = 'available' WHERE id = ?", [ticket[0].equipment_id]);
    }

    return res.status(200).json({
      success: true,
      message: `Maintenance ticket status updated to ${status}.`,
      errors: null
    });
  }

  const ticket = inMemoryDB.maintenance.find(m => m.id === Number(id));
  if (!ticket) {
    return res.status(404).json({ success: false, message: 'Maintenance ticket not found.', errors: null });
  }

  ticket.status = status;
  if (technician_notes) ticket.technician_notes = technician_notes;
  if (status === 'resolved') {
    ticket.resolved_on = new Date().toISOString();
    const eq = inMemoryDB.equipment.find(e => e.id === ticket.equipment_id);
    if (eq) eq.status = 'available';
  }

  res.status(200).json({
    success: true,
    message: `Maintenance ticket status updated to ${status}.`,
    errors: null
  });
});

export default { getAllMaintenance, createMaintenanceTicket, updateMaintenanceStatus };
