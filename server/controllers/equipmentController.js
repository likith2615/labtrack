import asyncHandler from '../middleware/asyncHandler.js';
import { query, getIsMysqlActive, inMemoryDB } from '../config/db.js';

/**
 * @desc   Get all equipment with optional search, lab, category, and status filters
 * @route  GET /api/equipment
 * @access Public
 */
export const getAllEquipment = asyncHandler(async (req, res) => {
  const { search, lab_id, category_id, status } = req.query;

  if (getIsMysqlActive()) {
    let sql = `
      SELECT 
        e.id, e.asset_tag, e.name, e.category_id, e.lab_id, e.serial_no,
        e.purchase_date, e.status, e.description, e.created_at, e.updated_at,
        c.name AS category_name,
        l.name AS lab_name,
        l.location AS lab_location
      FROM equipment e
      JOIN categories c ON e.category_id = c.id
      JOIN laboratories l ON e.lab_id = l.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND e.status = ?';
      params.push(status);
    }
    if (lab_id) {
      sql += ' AND e.lab_id = ?';
      params.push(Number(lab_id));
    }
    if (category_id) {
      sql += ' AND e.category_id = ?';
      params.push(Number(category_id));
    }
    if (search) {
      sql += ' AND (e.name LIKE ? OR e.asset_tag LIKE ? OR e.serial_no LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY e.created_at DESC';

    const results = await query(sql, params);
    return res.status(200).json({
      success: true,
      message: `Retrieved ${results.length} equipment items.`,
      data: results,
      errors: null
    });
  }

  // In-memory fallback
  let items = inMemoryDB.equipment.map(e => {
    const cat = inMemoryDB.categories.find(c => c.id === e.category_id);
    const lab = inMemoryDB.laboratories.find(l => l.id === e.lab_id);
    return {
      ...e,
      category_name: cat ? cat.name : 'Unknown Category',
      lab_name: lab ? lab.name : 'Unknown Lab',
      lab_location: lab ? lab.location : ''
    };
  });

  if (status) items = items.filter(e => e.status === status);
  if (lab_id) items = items.filter(e => e.lab_id === Number(lab_id));
  if (category_id) items = items.filter(e => e.category_id === Number(category_id));
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.asset_tag.toLowerCase().includes(q) ||
      e.serial_no.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    message: `Retrieved ${items.length} equipment items.`,
    data: items,
    errors: null
  });
});

/**
 * @desc   Get single equipment by ID
 * @route  GET /api/equipment/:id
 * @access Public
 */
export const getEquipmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (getIsMysqlActive()) {
    const sql = `
      SELECT 
        e.*,
        c.name AS category_name,
        l.name AS lab_name,
        l.location AS lab_location,
        u.name AS lab_incharge_name,
        u.email AS lab_incharge_email
      FROM equipment e
      JOIN categories c ON e.category_id = c.id
      JOIN laboratories l ON e.lab_id = l.id
      LEFT JOIN users u ON l.incharge_id = u.id
      WHERE e.id = ?
    `;
    const rows = await query(sql, [Number(id)]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Equipment with ID ${id} not found.`,
        data: null,
        errors: null
      });
    }

    // Fetch allocations & maintenance history
    const allocations = await query(
      'SELECT a.*, u.name as user_name FROM allocations a JOIN users u ON a.user_id = u.id WHERE a.equipment_id = ? ORDER BY a.allocated_on DESC',
      [Number(id)]
    );
    const maintenance = await query(
      'SELECT m.*, u.name as reporter_name FROM maintenance m LEFT JOIN users u ON m.reported_by = u.id WHERE m.equipment_id = ? ORDER BY m.reported_on DESC',
      [Number(id)]
    );

    return res.status(200).json({
      success: true,
      message: 'Equipment retrieved successfully.',
      data: {
        ...rows[0],
        allocations: allocations || [],
        maintenance: maintenance || []
      },
      errors: null
    });
  }

  const eq = inMemoryDB.equipment.find(e => e.id === Number(id));
  if (!eq) {
    return res.status(404).json({
      success: false,
      message: `Equipment with ID ${id} not found.`,
      data: null,
      errors: null
    });
  }

  const cat = inMemoryDB.categories.find(c => c.id === eq.category_id);
  const lab = inMemoryDB.laboratories.find(l => l.id === eq.lab_id);
  const allocations = inMemoryDB.allocations.filter(a => a.equipment_id === Number(id));
  const maintenance = inMemoryDB.maintenance.filter(m => m.equipment_id === Number(id));

  res.status(200).json({
    success: true,
    message: 'Equipment retrieved successfully.',
    data: {
      ...eq,
      category_name: cat ? cat.name : '',
      lab_name: lab ? lab.name : '',
      lab_location: lab ? lab.location : '',
      allocations,
      maintenance
    },
    errors: null
  });
});

/**
 * @desc   Create new laboratory equipment item
 * @route  POST /api/equipment
 * @access Public
 */
export const createEquipment = asyncHandler(async (req, res) => {
  const { asset_tag, name, category_id, lab_id, serial_no, purchase_date, status = 'available', description } = req.body;

  if (getIsMysqlActive()) {
    const existing = await query('SELECT id FROM equipment WHERE asset_tag = ?', [asset_tag]);
    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Asset tag "${asset_tag}" already exists in the inventory.`,
        errors: [{ field: 'asset_tag', message: 'Asset tag must be unique.' }]
      });
    }

    const insertSql = `
      INSERT INTO equipment (asset_tag, name, category_id, lab_id, serial_no, purchase_date, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(insertSql, [
      asset_tag,
      name,
      Number(category_id),
      Number(lab_id),
      serial_no,
      purchase_date,
      status,
      description || null
    ]);

    return res.status(201).json({
      success: true,
      message: 'Equipment registered successfully.',
      data: { id: result.insertId, ...req.body },
      errors: null
    });
  }

  const duplicate = inMemoryDB.equipment.find(e => e.asset_tag.toLowerCase() === asset_tag.toLowerCase());
  if (duplicate) {
    return res.status(400).json({
      success: false,
      message: `Asset tag "${asset_tag}" already exists in the inventory.`,
      errors: [{ field: 'asset_tag', message: 'Asset tag must be unique.' }]
    });
  }

  const newId = inMemoryDB.equipment.length > 0 ? Math.max(...inMemoryDB.equipment.map(e => e.id)) + 1 : 1;
  const newEquipment = {
    id: newId,
    asset_tag,
    name,
    category_id: Number(category_id),
    lab_id: Number(lab_id),
    serial_no,
    purchase_date,
    status,
    description: description || ''
  };

  inMemoryDB.equipment.unshift(newEquipment);

  res.status(201).json({
    success: true,
    message: 'Equipment registered successfully.',
    data: newEquipment,
    errors: null
  });
});

/**
 * @desc   Update operational status of equipment
 * @route  PATCH /api/equipment/:id/status
 * @access Public
 */
export const updateEquipmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (getIsMysqlActive()) {
    const existing = await query('SELECT * FROM equipment WHERE id = ?', [Number(id)]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Equipment with ID ${id} not found.`,
        errors: null
      });
    }

    await query('UPDATE equipment SET status = ?, updated_at = NOW() WHERE id = ?', [status, Number(id)]);

    return res.status(200).json({
      success: true,
      message: `Equipment status updated to ${status}.`,
      data: { id: Number(id), status },
      errors: null
    });
  }

  const eq = inMemoryDB.equipment.find(e => e.id === Number(id));
  if (!eq) {
    return res.status(404).json({
      success: false,
      message: `Equipment with ID ${id} not found.`,
      errors: null
    });
  }

  eq.status = status;

  res.status(200).json({
    success: true,
    message: `Equipment status updated to ${status}.`,
    data: { id: Number(id), status },
    errors: null
  });
});

/**
 * @desc   Delete an equipment record
 * @route  DELETE /api/equipment/:id
 * @access Public
 */
export const deleteEquipment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (getIsMysqlActive()) {
    const existing = await query('SELECT * FROM equipment WHERE id = ?', [Number(id)]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Equipment with ID ${id} not found.`,
        errors: null
      });
    }

    await query('DELETE FROM equipment WHERE id = ?', [Number(id)]);

    return res.status(200).json({
      success: true,
      message: `Equipment with ID ${id} deleted from registry.`,
      errors: null
    });
  }

  const idx = inMemoryDB.equipment.findIndex(e => e.id === Number(id));
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      message: `Equipment with ID ${id} not found.`,
      errors: null
    });
  }

  inMemoryDB.equipment.splice(idx, 1);

  res.status(200).json({
    success: true,
    message: `Equipment with ID ${id} deleted from registry.`,
    errors: null
  });
});

export default {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipmentStatus,
  deleteEquipment
};
