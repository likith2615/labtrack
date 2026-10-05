import asyncHandler from '../middleware/asyncHandler.js';
import { query, getIsMysqlActive, inMemoryDB } from '../config/db.js';

/**
 * @desc   Get all laboratories with assigned equipment count (for dropdowns and overview)
 * @route  GET /api/labs
 * @access Public
 */
export const getAllLabs = asyncHandler(async (req, res) => {
  if (getIsMysqlActive()) {
    const sql = `
      SELECT 
        l.id, 
        l.name, 
        l.location, 
        l.incharge_id, 
        l.created_at,
        u.name AS incharge_name,
        u.email AS incharge_email,
        COUNT(e.id) AS total_equipment,
        SUM(CASE WHEN e.status = 'available' THEN 1 ELSE 0 END) AS available_count,
        SUM(CASE WHEN e.status = 'allocated' THEN 1 ELSE 0 END) AS allocated_count,
        SUM(CASE WHEN e.status = 'under_maintenance' THEN 1 ELSE 0 END) AS maintenance_count,
        SUM(CASE WHEN e.status = 'damaged' THEN 1 ELSE 0 END) AS damaged_count,
        SUM(CASE WHEN e.status = 'retired' THEN 1 ELSE 0 END) AS retired_count
      FROM laboratories l
      LEFT JOIN users u ON l.incharge_id = u.id
      LEFT JOIN equipment e ON l.id = e.lab_id
      GROUP BY l.id, l.name, l.location, l.incharge_id, l.created_at, u.name, u.email
      ORDER BY l.name ASC
    `;
    const results = await query(sql);
    return res.status(200).json({
      success: true,
      message: `Retrieved ${results.length} laboratory facilities.`,
      data: results,
      errors: null
    });
  }

  // In-memory fallback
  const labsWithCounts = inMemoryDB.laboratories.map(lab => {
    const incharge = inMemoryDB.users.find(u => u.id === lab.incharge_id);
    const labEquipment = inMemoryDB.equipment.filter(e => e.lab_id === lab.id);
    return {
      ...lab,
      incharge_name: incharge ? incharge.name : 'Unassigned',
      incharge_email: incharge ? incharge.email : '',
      total_equipment: labEquipment.length,
      available_count: labEquipment.filter(e => e.status === 'available').length,
      allocated_count: labEquipment.filter(e => e.status === 'allocated').length,
      maintenance_count: labEquipment.filter(e => e.status === 'under_maintenance').length,
      damaged_count: labEquipment.filter(e => e.status === 'damaged').length,
      retired_count: labEquipment.filter(e => e.status === 'retired').length
    };
  });

  res.status(200).json({
    success: true,
    message: `Retrieved ${labsWithCounts.length} laboratory facilities.`,
    data: labsWithCounts,
    errors: null
  });
});

/**
 * @desc   Get single laboratory by ID with full inventory list
 * @route  GET /api/labs/:id
 * @access Public
 */
export const getLabById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (getIsMysqlActive()) {
    const labSql = `
      SELECT l.*, u.name AS incharge_name, u.email AS incharge_email
      FROM laboratories l
      LEFT JOIN users u ON l.incharge_id = u.id
      WHERE l.id = ?
    `;
    const labs = await query(labSql, [Number(id)]);

    if (!labs || labs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Laboratory with ID ${id} not found.`,
        errors: null
      });
    }

    const equipment = await query(
      `SELECT e.*, c.name AS category_name 
       FROM equipment e 
       JOIN categories c ON e.category_id = c.id 
       WHERE e.lab_id = ? 
       ORDER BY e.name ASC`,
      [Number(id)]
    );

    return res.status(200).json({
      success: true,
      message: 'Laboratory facility details retrieved.',
      data: {
        ...labs[0],
        equipment: equipment || []
      },
      errors: null
    });
  }

  const lab = inMemoryDB.laboratories.find(l => l.id === Number(id));
  if (!lab) {
    return res.status(404).json({
      success: false,
      message: `Laboratory with ID ${id} not found.`,
      errors: null
    });
  }

  const incharge = inMemoryDB.users.find(u => u.id === lab.incharge_id);
  const equipment = inMemoryDB.equipment
    .filter(e => e.lab_id === Number(id))
    .map(e => ({
      ...e,
      category_name: inMemoryDB.categories.find(c => c.id === e.category_id)?.name || ''
    }));

  res.status(200).json({
    success: true,
    message: 'Laboratory facility details retrieved.',
    data: {
      ...lab,
      incharge_name: incharge ? incharge.name : 'Unassigned',
      incharge_email: incharge ? incharge.email : '',
      equipment
    },
    errors: null
  });
});

/**
 * @desc   Create a new laboratory facility
 * @route  POST /api/labs
 * @access Public
 */
export const createLab = asyncHandler(async (req, res) => {
  const { name, location, incharge_id } = req.body;

  if (getIsMysqlActive()) {
    if (incharge_id) {
      const userCheck = await query('SELECT id FROM users WHERE id = ?', [Number(incharge_id)]);
      if (!userCheck || userCheck.length === 0) {
        return res.status(400).json({
          success: false,
          message: `In-charge user ID ${incharge_id} does not exist.`,
          errors: [{ field: 'incharge_id', message: 'Assigned incharge_id must reference a valid user.' }]
        });
      }
    }

    const insertSql = 'INSERT INTO laboratories (name, location, incharge_id) VALUES (?, ?, ?)';
    const result = await query(insertSql, [name.trim(), location.trim(), incharge_id ? Number(incharge_id) : null]);

    return res.status(201).json({
      success: true,
      message: 'Laboratory facility registered successfully.',
      data: { id: result.insertId, name: name.trim(), location: location.trim(), incharge_id: incharge_id ? Number(incharge_id) : null },
      errors: null
    });
  }

  const newId = inMemoryDB.laboratories.length > 0 ? Math.max(...inMemoryDB.laboratories.map(l => l.id)) + 1 : 1;
  const newLab = {
    id: newId,
    name: name.trim(),
    location: location.trim(),
    incharge_id: incharge_id ? Number(incharge_id) : null
  };

  inMemoryDB.laboratories.push(newLab);

  res.status(201).json({
    success: true,
    message: 'Laboratory facility registered successfully.',
    data: newLab,
    errors: null
  });
});

export default { getAllLabs, getLabById, createLab };
