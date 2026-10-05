import asyncHandler from '../middleware/asyncHandler.js';
import { query, withTransaction, getIsMysqlActive, inMemoryDB } from '../config/db.js';

/**
 * @desc   Get all maintenance records with optional status filter
 * @route  GET /api/maintenance
 * @query  status, severity, equipment_id
 * @access Public
 */
export const getAllMaintenance = asyncHandler(async (req, res) => {
  const { status, severity, equipment_id } = req.query;

  if (getIsMysqlActive()) {
    let sql = `
      SELECT 
        m.id, 
        m.equipment_id, 
        m.reported_by, 
        m.issue_description, 
        m.severity,
        m.status, 
        m.reported_on, 
        m.resolved_on, 
        m.technician_notes,
        e.asset_tag, 
        e.name AS equipment_name,
        l.name AS lab_name,
        u.name AS reporter_name,
        u.email AS reporter_email
      FROM maintenance m
      JOIN equipment e ON m.equipment_id = e.id
      JOIN laboratories l ON e.lab_id = l.id
      LEFT JOIN users u ON m.reported_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND m.status = ?';
      params.push(status);
    }
    if (severity && severity !== 'all') {
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
      message: `Retrieved ${results.length} maintenance records.`,
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
      equipment_name: eq ? eq.name : 'Unknown Asset',
      asset_tag: eq ? eq.asset_tag : '',
      lab_name: lab ? lab.name : '',
      reporter_name: user ? user.name : 'Staff',
      reporter_email: user ? user.email : ''
    };
  });

  if (status && status !== 'all') items = items.filter(m => m.status === status);
  if (severity && severity !== 'all') items = items.filter(m => m.severity === severity);
  if (equipment_id) items = items.filter(m => m.equipment_id === Number(equipment_id));

  res.status(200).json({
    success: true,
    message: `Retrieved ${items.length} maintenance records.`,
    data: items,
    errors: null
  });
});

/**
 * @desc   Report damage / submit maintenance request in a database transaction
 *         Sets equipment status to 'damaged'.
 * @route  POST /api/maintenance/report (or POST /api/maintenance)
 * @access Public
 */
export const reportDamage = asyncHandler(async (req, res) => {
  const { equipment_id, reported_by, issue_description, severity = 'medium', technician_notes } = req.body;

  if (getIsMysqlActive()) {
    const result = await withTransaction(async (tx) => {
      // 1. Lock and check equipment exists
      const eqRows = await tx.execute('SELECT id, name, asset_tag, status FROM equipment WHERE id = ? FOR UPDATE', [Number(equipment_id)]);
      if (!eqRows || eqRows.length === 0) {
        const err = new Error(`Equipment ID ${equipment_id} not found.`);
        err.statusCode = 404;
        throw err;
      }

      const equipment = eqRows[0];

      // 2. Insert maintenance record with status = 'reported'
      const insertSql = `
        INSERT INTO maintenance (equipment_id, reported_by, issue_description, severity, status, technician_notes)
        VALUES (?, ?, ?, ?, 'reported', ?)
      `;
      const insertResult = await tx.execute(insertSql, [
        Number(equipment_id),
        reported_by ? Number(reported_by) : null,
        issue_description.trim(),
        severity,
        technician_notes ? technician_notes.trim() : null
      ]);

      // 3. Update equipment status to 'damaged'
      await tx.execute("UPDATE equipment SET status = 'damaged', updated_at = NOW() WHERE id = ?", [Number(equipment_id)]);

      return {
        id: insertResult.insertId,
        equipment_id: Number(equipment_id),
        reported_by: reported_by ? Number(reported_by) : null,
        issue_description: issue_description.trim(),
        severity,
        status: 'reported',
        equipment_name: equipment.name,
        asset_tag: equipment.asset_tag,
        equipment_status: 'damaged'
      };
    });

    return res.status(201).json({
      success: true,
      message: 'Damage report logged successfully. Equipment status set to damaged.',
      data: result,
      errors: null
    });
  }

  // In-memory fallback
  const eq = inMemoryDB.equipment.find(e => e.id === Number(equipment_id));
  if (!eq) {
    return res.status(404).json({ success: false, message: `Equipment ID ${equipment_id} not found.`, errors: null });
  }

  eq.status = 'damaged';
  const newId = inMemoryDB.maintenance.length > 0 ? Math.max(...inMemoryDB.maintenance.map(m => m.id)) + 1 : 1;
  const newRecord = {
    id: newId,
    equipment_id: Number(equipment_id),
    reported_by: reported_by ? Number(reported_by) : 1,
    issue_description: issue_description.trim(),
    severity,
    status: 'reported',
    reported_on: new Date().toISOString(),
    resolved_on: null,
    technician_notes: technician_notes ? technician_notes.trim() : ''
  };
  inMemoryDB.maintenance.unshift(newRecord);

  res.status(201).json({
    success: true,
    message: 'Damage report logged successfully. Equipment status set to damaged.',
    data: { ...newRecord, equipment_name: eq.name, asset_tag: eq.asset_tag, equipment_status: 'damaged' },
    errors: null
  });
});

/**
 * @desc   Update maintenance ticket status in a transaction
 *         If status is 'resolved', automatically sets equipment status back to 'available' and records resolved_on.
 * @route  PUT /api/maintenance/:id/status (or PATCH /api/maintenance/:id/status)
 * @access Public
 */
export const updateMaintenanceStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, technician_notes } = req.body;

  if (getIsMysqlActive()) {
    const result = await withTransaction(async (tx) => {
      // 1. Lock maintenance ticket
      const ticketRows = await tx.execute('SELECT * FROM maintenance WHERE id = ? FOR UPDATE', [Number(id)]);
      if (!ticketRows || ticketRows.length === 0) {
        const err = new Error(`Maintenance ticket with ID ${id} not found.`);
        err.statusCode = 404;
        throw err;
      }

      const ticket = ticketRows[0];
      const isResolved = status === 'resolved';

      // 2. Update maintenance record
      const updateSql = `
        UPDATE maintenance 
        SET status = ?,
            resolved_on = ${isResolved ? 'NOW()' : 'NULL'},
            technician_notes = IFNULL(?, technician_notes)
        WHERE id = ?
      `;
      await tx.execute(updateSql, [status, technician_notes ? technician_notes.trim() : null, Number(id)]);

      // 3. If resolved, set equipment status back to 'available'
      if (isResolved) {
        await tx.execute("UPDATE equipment SET status = 'available', updated_at = NOW() WHERE id = ?", [ticket.equipment_id]);
      } else if (status === 'in_progress') {
        await tx.execute("UPDATE equipment SET status = 'under_maintenance', updated_at = NOW() WHERE id = ?", [ticket.equipment_id]);
      }

      return {
        id: Number(id),
        equipment_id: ticket.equipment_id,
        status,
        resolved_on: isResolved ? new Date().toISOString() : null,
        equipment_status: isResolved ? 'available' : (status === 'in_progress' ? 'under_maintenance' : 'damaged')
      };
    });

    return res.status(200).json({
      success: true,
      message: `Maintenance status updated to "${status}".${status === 'resolved' ? ' Equipment restored to available status.' : ''}`,
      data: result,
      errors: null
    });
  }

  // In-memory fallback
  const ticket = inMemoryDB.maintenance.find(m => m.id === Number(id));
  if (!ticket) {
    return res.status(404).json({ success: false, message: `Maintenance ticket with ID ${id} not found.`, errors: null });
  }

  ticket.status = status;
  if (technician_notes) ticket.technician_notes = technician_notes.trim();

  const eq = inMemoryDB.equipment.find(e => e.id === ticket.equipment_id);
  if (status === 'resolved') {
    ticket.resolved_on = new Date().toISOString();
    if (eq) eq.status = 'available';
  } else if (status === 'in_progress') {
    if (eq) eq.status = 'under_maintenance';
  }

  res.status(200).json({
    success: true,
    message: `Maintenance status updated to "${status}".${status === 'resolved' ? ' Equipment restored to available status.' : ''}`,
    data: {
      id: Number(id),
      equipment_id: ticket.equipment_id,
      status,
      resolved_on: ticket.resolved_on,
      equipment_status: eq ? eq.status : 'available'
    },
    errors: null
  });
});

export default {
  getAllMaintenance,
  reportDamage,
  updateMaintenanceStatus
};
