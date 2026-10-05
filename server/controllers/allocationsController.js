import asyncHandler from '../middleware/asyncHandler.js';
import { query, getIsMysqlActive, inMemoryDB } from '../config/db.js';

/**
 * @desc   Get all allocations with equipment and borrower info
 * @route  GET /api/allocations
 * @access Public
 */
export const getAllAllocations = asyncHandler(async (req, res) => {
  const { status } = req.query; // 'active' | 'returned' | 'overdue'

  if (getIsMysqlActive()) {
    let sql = `
      SELECT 
        a.id, a.equipment_id, a.user_id, a.allocated_on, a.due_date, a.returned_on, a.purpose,
        e.asset_tag, e.name AS equipment_name,
        u.name AS user_name, u.email AS user_email, u.role AS user_role,
        l.name AS lab_name
      FROM allocations a
      JOIN equipment e ON a.equipment_id = e.id
      JOIN users u ON a.user_id = u.id
      JOIN laboratories l ON e.lab_id = l.id
      WHERE 1=1
    `;
    const params = [];

    if (status === 'active') {
      sql += ' AND a.returned_on IS NULL';
    } else if (status === 'returned') {
      sql += ' AND a.returned_on IS NOT NULL';
    } else if (status === 'overdue') {
      sql += ' AND a.returned_on IS NULL AND a.due_date < NOW()';
    }

    sql += ' ORDER BY a.allocated_on DESC';

    const results = await query(sql, params);
    return res.status(200).json({
      success: true,
      message: `Retrieved ${results.length} equipment allocations.`,
      data: results,
      errors: null
    });
  }

  // In-memory fallback
  let items = inMemoryDB.allocations.map(a => {
    const eq = inMemoryDB.equipment.find(e => e.id === a.equipment_id);
    const user = inMemoryDB.users.find(u => u.id === a.user_id);
    const lab = eq ? inMemoryDB.laboratories.find(l => l.id === eq.lab_id) : null;
    return {
      ...a,
      equipment_name: eq ? eq.name : '',
      asset_tag: eq ? eq.asset_tag : '',
      user_name: user ? user.name : '',
      user_email: user ? user.email : '',
      user_role: user ? user.role : 'student',
      lab_name: lab ? lab.name : ''
    };
  });

  if (status === 'active') items = items.filter(a => a.returned_on === null);
  if (status === 'returned') items = items.filter(a => a.returned_on !== null);
  if (status === 'overdue') {
    const now = new Date();
    items = items.filter(a => a.returned_on === null && new Date(a.due_date) < now);
  }

  res.status(200).json({
    success: true,
    message: `Retrieved ${items.length} equipment allocations.`,
    data: items,
    errors: null
  });
});

/**
 * @desc   Create equipment allocation (checkout)
 * @route  POST /api/allocations
 * @access Public
 */
export const createAllocation = asyncHandler(async (req, res) => {
  const { equipment_id, user_id, due_date, purpose } = req.body;

  if (getIsMysqlActive()) {
    // Check if equipment is available
    const eq = await query('SELECT status FROM equipment WHERE id = ?', [Number(equipment_id)]);
    if (!eq || eq.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found.',
        errors: null
      });
    }

    if (eq[0].status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Cannot allocate equipment. Current status is "${eq[0].status}".`,
        errors: [{ field: 'equipment_id', message: 'Item is not currently available for checkout.' }]
      });
    }

    // Insert allocation
    const insertSql = 'INSERT INTO allocations (equipment_id, user_id, due_date, purpose) VALUES (?, ?, ?, ?)';
    const result = await query(insertSql, [Number(equipment_id), Number(user_id), due_date, purpose]);

    // Update equipment status to allocated
    await query("UPDATE equipment SET status = 'allocated' WHERE id = ?", [Number(equipment_id)]);

    return res.status(201).json({
      success: true,
      message: 'Equipment successfully allocated.',
      data: { id: result.insertId, equipment_id, user_id, due_date, purpose },
      errors: null
    });
  }

  // In-memory fallback
  const eq = inMemoryDB.equipment.find(e => e.id === Number(equipment_id));
  if (!eq) {
    return res.status(404).json({ success: false, message: 'Equipment not found.', errors: null });
  }

  eq.status = 'allocated';
  const newId = inMemoryDB.allocations.length > 0 ? Math.max(...inMemoryDB.allocations.map(a => a.id)) + 1 : 1;
  const newAlloc = {
    id: newId,
    equipment_id: Number(equipment_id),
    user_id: Number(user_id),
    allocated_on: new Date().toISOString(),
    due_date,
    returned_on: null,
    purpose
  };
  inMemoryDB.allocations.unshift(newAlloc);

  res.status(201).json({
    success: true,
    message: 'Equipment successfully allocated.',
    data: newAlloc,
    errors: null
  });
});

/**
 * @desc   Mark an allocation returned and restore equipment availability
 * @route  PATCH /api/allocations/:id/return
 * @access Public
 */
export const returnAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (getIsMysqlActive()) {
    const alloc = await query('SELECT * FROM allocations WHERE id = ?', [Number(id)]);
    if (!alloc || alloc.length === 0) {
      return res.status(404).json({ success: false, message: 'Allocation record not found.', errors: null });
    }

    if (alloc[0].returned_on) {
      return res.status(400).json({ success: false, message: 'This item has already been marked returned.', errors: null });
    }

    await query('UPDATE allocations SET returned_on = NOW() WHERE id = ?', [Number(id)]);
    await query("UPDATE equipment SET status = 'available' WHERE id = ?", [alloc[0].equipment_id]);

    return res.status(200).json({
      success: true,
      message: 'Equipment returned successfully and marked available.',
      errors: null
    });
  }

  const alloc = inMemoryDB.allocations.find(a => a.id === Number(id));
  if (!alloc) {
    return res.status(404).json({ success: false, message: 'Allocation record not found.', errors: null });
  }

  alloc.returned_on = new Date().toISOString();
  const eq = inMemoryDB.equipment.find(e => e.id === alloc.equipment_id);
  if (eq) eq.status = 'available';

  res.status(200).json({
    success: true,
    message: 'Equipment returned successfully and marked available.',
    errors: null
  });
});

export default { getAllAllocations, createAllocation, returnAllocation };
