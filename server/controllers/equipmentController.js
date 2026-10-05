import asyncHandler from '../middleware/asyncHandler.js';
import { query, getIsMysqlActive, inMemoryDB } from '../config/db.js';

/**
 * @desc   Get all equipment with query filtering and pagination
 * @route  GET /api/equipment
 * @query  search, lab, category, status, page, limit
 * @access Public
 */
export const getAllEquipment = asyncHandler(async (req, res) => {
  const { search, lab, category, status } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const offset = (page - 1) * limit;

  if (getIsMysqlActive()) {
    let baseSql = `
      FROM equipment e
      JOIN laboratories l ON e.lab_id = l.id
      JOIN categories c ON e.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by Status
    if (status && status !== 'all') {
      baseSql += ' AND e.status = ?';
      params.push(status);
    }

    // Filter by Lab (ID or Name)
    if (lab) {
      if (!isNaN(Number(lab))) {
        baseSql += ' AND e.lab_id = ?';
        params.push(Number(lab));
      } else {
        baseSql += ' AND l.name LIKE ?';
        params.push(`%${lab}%`);
      }
    }

    // Filter by Category (ID or Name)
    if (category) {
      if (!isNaN(Number(category))) {
        baseSql += ' AND e.category_id = ?';
        params.push(Number(category));
      } else {
        baseSql += ' AND c.name LIKE ?';
        params.push(`%${category}%`);
      }
    }

    // Search Filter
    if (search && search.trim()) {
      baseSql += ' AND (e.name LIKE ? OR e.asset_tag LIKE ? OR e.serial_no LIKE ? OR e.description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    // Count Total Matching Records
    const countSql = `SELECT COUNT(e.id) AS total ${baseSql}`;
    const countResult = await query(countSql, params);
    const total = countResult[0]?.total || 0;

    // Fetch Paginated Data
    const dataSql = `
      SELECT 
        e.id, 
        e.asset_tag, 
        e.name, 
        e.category_id, 
        e.lab_id, 
        e.serial_no,
        e.purchase_date, 
        e.status, 
        e.description, 
        e.created_at, 
        e.updated_at,
        c.name AS category_name,
        l.name AS lab_name,
        l.location AS lab_location
      ${baseSql}
      ORDER BY e.created_at DESC
      LIMIT ? OFFSET ?
    `;

    // Note: parameters for LIMIT & OFFSET
    const results = await query(dataSql, [...params, limit, offset]);

    return res.status(200).json({
      success: true,
      message: `Retrieved ${results.length} equipment records.`,
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      errors: null
    });
  }

  // In-Memory Fallback Implementation
  let items = inMemoryDB.equipment.map(e => {
    const cat = inMemoryDB.categories.find(c => c.id === e.category_id);
    const labItem = inMemoryDB.laboratories.find(l => l.id === e.lab_id);
    return {
      ...e,
      category_name: cat ? cat.name : 'Unknown Category',
      lab_name: labItem ? labItem.name : 'Unknown Lab',
      lab_location: labItem ? labItem.location : ''
    };
  });

  if (status && status !== 'all') {
    items = items.filter(e => e.status === status);
  }
  if (lab) {
    if (!isNaN(Number(lab))) {
      items = items.filter(e => e.lab_id === Number(lab));
    } else {
      items = items.filter(e => e.lab_name.toLowerCase().includes(lab.toLowerCase()));
    }
  }
  if (category) {
    if (!isNaN(Number(category))) {
      items = items.filter(e => e.category_id === Number(category));
    } else {
      items = items.filter(e => e.category_name.toLowerCase().includes(category.toLowerCase()));
    }
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    items = items.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.asset_tag.toLowerCase().includes(q) ||
      e.serial_no.toLowerCase().includes(q) ||
      (e.description && e.description.toLowerCase().includes(q))
    );
  }

  const total = items.length;
  const paginatedItems = items.slice(offset, offset + limit);

  res.status(200).json({
    success: true,
    message: `Retrieved ${paginatedItems.length} equipment records.`,
    data: paginatedItems,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    errors: null
  });
});

/**
 * @desc   Get single equipment by ID (with Category, Lab, Allocations, and Maintenance history)
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
        c.description AS category_description,
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
        message: `Equipment with ID ${id} not found in inventory.`,
        data: null,
        errors: null
      });
    }

    // Fetch allocations history
    const allocations = await query(
      `SELECT a.*, u.name AS user_name, u.email AS user_email, u.role AS user_role
       FROM allocations a
       JOIN users u ON a.user_id = u.id
       WHERE a.equipment_id = ?
       ORDER BY a.allocated_on DESC`,
      [Number(id)]
    );

    // Fetch maintenance history
    const maintenance = await query(
      `SELECT m.*, u.name AS reporter_name, u.email AS reporter_email
       FROM maintenance m
       LEFT JOIN users u ON m.reported_by = u.id
       WHERE m.equipment_id = ?
       ORDER BY m.reported_on DESC`,
      [Number(id)]
    );

    return res.status(200).json({
      success: true,
      message: 'Equipment details retrieved successfully.',
      data: {
        ...rows[0],
        allocations: allocations || [],
        maintenance: maintenance || []
      },
      errors: null
    });
  }

  // In-Memory Fallback
  const eq = inMemoryDB.equipment.find(e => e.id === Number(id));
  if (!eq) {
    return res.status(404).json({
      success: false,
      message: `Equipment with ID ${id} not found in inventory.`,
      data: null,
      errors: null
    });
  }

  const cat = inMemoryDB.categories.find(c => c.id === eq.category_id);
  const lab = inMemoryDB.laboratories.find(l => l.id === eq.lab_id);
  const incharge = lab ? inMemoryDB.users.find(u => u.id === lab.incharge_id) : null;
  const allocations = inMemoryDB.allocations.filter(a => a.equipment_id === Number(id));
  const maintenance = inMemoryDB.maintenance.filter(m => m.equipment_id === Number(id));

  res.status(200).json({
    success: true,
    message: 'Equipment details retrieved successfully.',
    data: {
      ...eq,
      category_name: cat ? cat.name : '',
      category_description: cat ? cat.description : '',
      lab_name: lab ? lab.name : '',
      lab_location: lab ? lab.location : '',
      lab_incharge_name: incharge ? incharge.name : '',
      lab_incharge_email: incharge ? incharge.email : '',
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
    // 1. Verify category exists
    const categoryCheck = await query('SELECT id FROM categories WHERE id = ?', [Number(category_id)]);
    if (!categoryCheck || categoryCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Category ID ${category_id} does not exist.`,
        errors: [{ field: 'category_id', message: 'Selected category does not exist in the database.' }]
      });
    }

    // 2. Verify lab exists
    const labCheck = await query('SELECT id FROM laboratories WHERE id = ?', [Number(lab_id)]);
    if (!labCheck || labCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Laboratory ID ${lab_id} does not exist.`,
        errors: [{ field: 'lab_id', message: 'Selected laboratory does not exist in the database.' }]
      });
    }

    // 3. Verify asset_tag is unique
    const tagCheck = await query('SELECT id FROM equipment WHERE asset_tag = ?', [asset_tag.trim()]);
    if (tagCheck && tagCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Asset tag "${asset_tag}" is already registered.`,
        errors: [{ field: 'asset_tag', message: 'Asset tag must be unique across all equipment.' }]
      });
    }

    const insertSql = `
      INSERT INTO equipment (asset_tag, name, category_id, lab_id, serial_no, purchase_date, status, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(insertSql, [
      asset_tag.trim(),
      name.trim(),
      Number(category_id),
      Number(lab_id),
      serial_no.trim(),
      purchase_date,
      status,
      description ? description.trim() : null
    ]);

    return res.status(201).json({
      success: true,
      message: 'Equipment registered successfully in inventory.',
      data: {
        id: result.insertId,
        asset_tag: asset_tag.trim(),
        name: name.trim(),
        category_id: Number(category_id),
        lab_id: Number(lab_id),
        serial_no: serial_no.trim(),
        purchase_date,
        status,
        description: description ? description.trim() : null
      },
      errors: null
    });
  }

  // In-Memory Fallback
  const duplicate = inMemoryDB.equipment.find(e => e.asset_tag.toLowerCase() === asset_tag.trim().toLowerCase());
  if (duplicate) {
    return res.status(400).json({
      success: false,
      message: `Asset tag "${asset_tag}" is already registered.`,
      errors: [{ field: 'asset_tag', message: 'Asset tag must be unique across all equipment.' }]
    });
  }

  const newId = inMemoryDB.equipment.length > 0 ? Math.max(...inMemoryDB.equipment.map(e => e.id)) + 1 : 1;
  const newEquipment = {
    id: newId,
    asset_tag: asset_tag.trim(),
    name: name.trim(),
    category_id: Number(category_id),
    lab_id: Number(lab_id),
    serial_no: serial_no.trim(),
    purchase_date,
    status,
    description: description ? description.trim() : ''
  };

  inMemoryDB.equipment.unshift(newEquipment);

  res.status(201).json({
    success: true,
    message: 'Equipment registered successfully in inventory.',
    data: newEquipment,
    errors: null
  });
});

/**
 * @desc   Update existing laboratory equipment item
 * @route  PUT /api/equipment/:id
 * @access Public
 */
export const updateEquipment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { asset_tag, name, category_id, lab_id, serial_no, purchase_date, status, description } = req.body;

  if (getIsMysqlActive()) {
    // 1. Check equipment exists
    const existing = await query('SELECT * FROM equipment WHERE id = ?', [Number(id)]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Equipment with ID ${id} not found.`,
        errors: null
      });
    }

    // 2. Verify category exists
    const categoryCheck = await query('SELECT id FROM categories WHERE id = ?', [Number(category_id)]);
    if (!categoryCheck || categoryCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Category ID ${category_id} does not exist.`,
        errors: [{ field: 'category_id', message: 'Category not found.' }]
      });
    }

    // 3. Verify lab exists
    const labCheck = await query('SELECT id FROM laboratories WHERE id = ?', [Number(lab_id)]);
    if (!labCheck || labCheck.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Laboratory ID ${lab_id} does not exist.`,
        errors: [{ field: 'lab_id', message: 'Laboratory not found.' }]
      });
    }

    // 4. Verify unique asset tag (excluding current equipment)
    const tagCheck = await query('SELECT id FROM equipment WHERE asset_tag = ? AND id != ?', [asset_tag.trim(), Number(id)]);
    if (tagCheck && tagCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Asset tag "${asset_tag}" is already in use by another equipment item.`,
        errors: [{ field: 'asset_tag', message: 'Asset tag must be unique.' }]
      });
    }

    const updateSql = `
      UPDATE equipment
      SET asset_tag = ?, name = ?, category_id = ?, lab_id = ?, serial_no = ?,
          purchase_date = ?, status = ?, description = ?, updated_at = NOW()
      WHERE id = ?
    `;

    await query(updateSql, [
      asset_tag.trim(),
      name.trim(),
      Number(category_id),
      Number(lab_id),
      serial_no.trim(),
      purchase_date,
      status,
      description ? description.trim() : null,
      Number(id)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Equipment updated successfully.',
      data: {
        id: Number(id),
        asset_tag: asset_tag.trim(),
        name: name.trim(),
        category_id: Number(category_id),
        lab_id: Number(lab_id),
        serial_no: serial_no.trim(),
        purchase_date,
        status,
        description: description ? description.trim() : null
      },
      errors: null
    });
  }

  // In-Memory Fallback
  const eq = inMemoryDB.equipment.find(e => e.id === Number(id));
  if (!eq) {
    return res.status(404).json({
      success: false,
      message: `Equipment with ID ${id} not found.`,
      errors: null
    });
  }

  const duplicate = inMemoryDB.equipment.find(e => e.asset_tag.toLowerCase() === asset_tag.trim().toLowerCase() && e.id !== Number(id));
  if (duplicate) {
    return res.status(400).json({
      success: false,
      message: `Asset tag "${asset_tag}" is already in use by another equipment item.`,
      errors: [{ field: 'asset_tag', message: 'Asset tag must be unique.' }]
    });
  }

  eq.asset_tag = asset_tag.trim();
  eq.name = name.trim();
  eq.category_id = Number(category_id);
  eq.lab_id = Number(lab_id);
  eq.serial_no = serial_no.trim();
  eq.purchase_date = purchase_date;
  eq.status = status;
  eq.description = description ? description.trim() : '';

  res.status(200).json({
    success: true,
    message: 'Equipment updated successfully.',
    data: eq,
    errors: null
  });
});

/**
 * @desc   Delete an equipment item (BLOCKED if active allocation exists)
 * @route  DELETE /api/equipment/:id
 * @access Public
 */
export const deleteEquipment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (getIsMysqlActive()) {
    // 1. Check equipment exists
    const existing = await query('SELECT * FROM equipment WHERE id = ?', [Number(id)]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Equipment with ID ${id} not found.`,
        errors: null
      });
    }

    // 2. Check for active allocations (returned_on IS NULL)
    const activeAllocations = await query(
      'SELECT id, user_id, due_date FROM allocations WHERE equipment_id = ? AND returned_on IS NULL',
      [Number(id)]
    );

    if (activeAllocations && activeAllocations.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete equipment "${existing[0].name}" [${existing[0].asset_tag}] because it currently has an active allocation checkout. Please return the equipment before deleting.`,
        errors: [
          {
            field: 'equipment_id',
            message: `Active allocation ID ${activeAllocations[0].id} is currently checked out.`
          }
        ]
      });
    }

    // 3. Delete equipment
    await query('DELETE FROM equipment WHERE id = ?', [Number(id)]);

    return res.status(200).json({
      success: true,
      message: `Equipment "${existing[0].name}" [${existing[0].asset_tag}] deleted successfully from inventory.`,
      errors: null
    });
  }

  // In-Memory Fallback
  const idx = inMemoryDB.equipment.findIndex(e => e.id === Number(id));
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      message: `Equipment with ID ${id} not found.`,
      errors: null
    });
  }

  const eq = inMemoryDB.equipment[idx];
  const activeAlloc = inMemoryDB.allocations.find(a => a.equipment_id === Number(id) && a.returned_on === null);
  if (activeAlloc) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete equipment "${eq.name}" [${eq.asset_tag}] because it currently has an active allocation checkout. Please return the equipment before deleting.`,
      errors: [
        {
          field: 'equipment_id',
          message: `Active allocation ID ${activeAlloc.id} is currently checked out.`
        }
      ]
    });
  }

  inMemoryDB.equipment.splice(idx, 1);

  res.status(200).json({
    success: true,
    message: `Equipment "${eq.name}" [${eq.asset_tag}] deleted successfully from inventory.`,
    errors: null
  });
});

export default {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
};
