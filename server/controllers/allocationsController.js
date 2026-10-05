import asyncHandler from '../middleware/asyncHandler.js';
import { query, withTransaction, getIsMysqlActive, inMemoryDB } from '../config/db.js';

/**
 * @desc   Get all allocations with optional status filtering
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
 * @desc   Create equipment allocation (checkout) in a database transaction
 *         Only permitted if equipment status is 'available'. Transitions status to 'allocated'.
 * @route  POST /api/allocations
 * @access Public
 */
export const createAllocation = asyncHandler(async (req, res) => {
  const { equipment_id, user_id, due_date, purpose } = req.body;

  if (getIsMysqlActive()) {
    const result = await withTransaction(async (tx) => {
      // 1. Lock and check equipment status
      const eqRows = await tx.execute('SELECT id, name, asset_tag, status FROM equipment WHERE id = ? FOR UPDATE', [Number(equipment_id)]);
      if (!eqRows || eqRows.length === 0) {
        const err = new Error(`Equipment ID ${equipment_id} not found.`);
        err.statusCode = 404;
        throw err;
      }

      const equipment = eqRows[0];
      if (equipment.status !== 'available') {
        const err = new Error(`Equipment "${equipment.name}" [${equipment.asset_tag}] cannot be allocated. Current status is "${equipment.status}". Only available items can be checked out.`);
        err.statusCode = 400;
        err.errors = [{ field: 'equipment_id', message: `Equipment status is "${equipment.status}". Expected "available".` }];
        throw err;
      }

      // 2. Verify user exists
      const userRows = await tx.execute('SELECT id, name FROM users WHERE id = ?', [Number(user_id)]);
      if (!userRows || userRows.length === 0) {
        const err = new Error(`Borrower user ID ${user_id} not found.`);
        err.statusCode = 404;
        throw err;
      }

      // 3. Insert allocation record
      const insertSql = 'INSERT INTO allocations (equipment_id, user_id, due_date, purpose) VALUES (?, ?, ?, ?)';
      const allocResult = await tx.execute(insertSql, [Number(equipment_id), Number(user_id), due_date, purpose.trim()]);

      // 4. Update equipment status to 'allocated'
      await tx.execute("UPDATE equipment SET status = 'allocated', updated_at = NOW() WHERE id = ?", [Number(equipment_id)]);

      return {
        id: allocResult.insertId,
        equipment_id: Number(equipment_id),
        user_id: Number(user_id),
        due_date,
        purpose: purpose.trim(),
        equipment_name: equipment.name,
        asset_tag: equipment.asset_tag,
        user_name: userRows[0].name
      };
    });

    return res.status(201).json({
      success: true,
      message: `Equipment allocated successfully to user.`,
      data: result,
      errors: null
    });
  }

  // In-memory Fallback
  const eq = inMemoryDB.equipment.find(e => e.id === Number(equipment_id));
  if (!eq) {
    return res.status(404).json({ success: false, message: `Equipment ID ${equipment_id} not found.`, errors: null });
  }

  if (eq.status !== 'available') {
    return res.status(400).json({
      success: false,
      message: `Equipment "${eq.name}" [${eq.asset_tag}] cannot be allocated. Current status is "${eq.status}". Only available items can be checked out.`,
      errors: [{ field: 'equipment_id', message: `Equipment status is "${eq.status}". Expected "available".` }]
    });
  }

  const user = inMemoryDB.users.find(u => u.id === Number(user_id));
  if (!user) {
    return res.status(404).json({ success: false, message: `User ID ${user_id} not found.`, errors: null });
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
    purpose: purpose.trim(),
    equipment_name: eq.name,
    asset_tag: eq.asset_tag,
    user_name: user.name
  };
  inMemoryDB.allocations.unshift(newAlloc);

  res.status(201).json({
    success: true,
    message: 'Equipment allocated successfully to user.',
    data: newAlloc,
    errors: null
  });
});

/**
 * @desc   Mark an allocation returned and restore equipment to 'available' in a transaction
 * @route  PUT /api/allocations/:id/return
 * @access Public
 */
export const returnAllocation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (getIsMysqlActive()) {
    const result = await withTransaction(async (tx) => {
      // 1. Lock allocation record
      const allocRows = await tx.execute('SELECT * FROM allocations WHERE id = ? FOR UPDATE', [Number(id)]);
      if (!allocRows || allocRows.length === 0) {
        const err = new Error(`Allocation with ID ${id} not found.`);
        err.statusCode = 404;
        throw err;
      }

      const alloc = allocRows[0];
      if (alloc.returned_on) {
        const err = new Error(`Allocation #${id} has already been returned on ${alloc.returned_on}.`);
        err.statusCode = 400;
        throw err;
      }

      // 2. Set returned_on = NOW()
      await tx.execute('UPDATE allocations SET returned_on = NOW() WHERE id = ?', [Number(id)]);

      // 3. Set equipment status back to 'available'
      await tx.execute("UPDATE equipment SET status = 'available', updated_at = NOW() WHERE id = ?", [alloc.equipment_id]);

      return {
        allocation_id: Number(id),
        equipment_id: alloc.equipment_id,
        returned_on: new Date().toISOString(),
        status: 'available'
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Equipment returned successfully and restored to available status.',
      data: result,
      errors: null
    });
  }

  // In-memory fallback
  const alloc = inMemoryDB.allocations.find(a => a.id === Number(id));
  if (!alloc) {
    return res.status(404).json({ success: false, message: `Allocation with ID ${id} not found.`, errors: null });
  }

  if (alloc.returned_on) {
    return res.status(400).json({ success: false, message: `Allocation #${id} has already been returned on ${alloc.returned_on}.`, errors: null });
  }

  alloc.returned_on = new Date().toISOString();
  const eq = inMemoryDB.equipment.find(e => e.id === alloc.equipment_id);
  if (eq) eq.status = 'available';

  res.status(200).json({
    success: true,
    message: 'Equipment returned successfully and restored to available status.',
    data: { allocation_id: Number(id), equipment_id: alloc.equipment_id, status: 'available' },
    errors: null
  });
});

export default { getAllAllocations, createAllocation, returnAllocation };
