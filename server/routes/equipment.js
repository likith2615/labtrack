import express from 'express';
import db, { inMemoryStore, getIsMysqlActive } from '../db.js';
import { validateEquipmentPayload, validateStatusPayload } from '../middleware/validator.js';

const router = express.Router();

// GET all equipment with filters
router.get('/', async (req, res, next) => {
  try {
    const { search, status, lab_id, category_id, sort = 'created_at', order = 'DESC' } = req.query;

    if (getIsMysqlActive()) {
      let sql = `
        SELECT 
          e.*,
          l.name AS lab_name,
          l.code AS lab_code,
          l.location AS lab_location,
          c.name AS category_name,
          c.code AS category_code
        FROM equipment e
        JOIN labs l ON e.lab_id = l.id
        JOIN categories c ON e.category_id = c.id
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
        sql += ' AND (e.name LIKE ? OR e.asset_tag LIKE ? OR e.model_number LIKE ? OR e.manufacturer LIKE ? OR e.serial_number LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term, term);
      }

      const allowedSorts = ['name', 'asset_tag', 'status', 'created_at', 'last_serviced', 'next_service_due'];
      const sortColumn = allowedSorts.includes(sort) ? `e.${sort}` : 'e.created_at';
      const sortDirection = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      sql += ` ORDER BY ${sortColumn} ${sortDirection}`;

      const equipment = await db.query(sql, params);
      return res.json({ success: true, count: equipment.length, data: equipment });
    }

    // In-memory fallback
    let items = inMemoryStore.equipment.map(eq => {
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

    if (status) {
      items = items.filter(e => e.status === status);
    }
    if (lab_id) {
      items = items.filter(e => e.lab_id === Number(lab_id));
    }
    if (category_id) {
      items = items.filter(e => e.category_id === Number(category_id));
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.asset_tag.toLowerCase().includes(q) ||
        e.model_number.toLowerCase().includes(q) ||
        e.manufacturer.toLowerCase().includes(q) ||
        e.serial_number.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
});

// GET single equipment by ID (with maintenance history)
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (getIsMysqlActive()) {
      const sql = `
        SELECT 
          e.*,
          l.name AS lab_name,
          l.code AS lab_code,
          l.location AS lab_location,
          l.in_charge AS lab_in_charge,
          l.contact_email AS lab_contact_email,
          c.name AS category_name,
          c.code AS category_code
        FROM equipment e
        JOIN labs l ON e.lab_id = l.id
        JOIN categories c ON e.category_id = c.id
        WHERE e.id = ?
      `;
      const rows = await db.query(sql, [id]);
      if (!rows || rows.length === 0) {
        return res.status(404).json({ success: false, error: { message: `Equipment ID ${id} not found.` } });
      }

      const maintenance = await db.query(
        'SELECT * FROM maintenance_logs WHERE equipment_id = ? ORDER BY service_date DESC',
        [id]
      );

      return res.json({
        success: true,
        data: {
          ...rows[0],
          maintenance_logs: maintenance || []
        }
      });
    }

    // In-memory fallback
    const eq = inMemoryStore.equipment.find(e => e.id === id);
    if (!eq) {
      return res.status(404).json({ success: false, error: { message: `Equipment ID ${id} not found.` } });
    }

    const lab = inMemoryStore.labs.find(l => l.id === eq.lab_id);
    const cat = inMemoryStore.categories.find(c => c.id === eq.category_id);
    const maintenance = inMemoryStore.maintenance_logs.filter(m => m.equipment_id === id);

    res.json({
      success: true,
      data: {
        ...eq,
        lab_name: lab ? lab.name : 'Unknown Lab',
        lab_code: lab ? lab.code : '',
        lab_location: lab ? lab.location : '',
        lab_in_charge: lab ? lab.in_charge : '',
        lab_contact_email: lab ? lab.contact_email : '',
        category_name: cat ? cat.name : 'General',
        category_code: cat ? cat.code : '',
        maintenance_logs: maintenance
      }
    });
  } catch (err) {
    next(err);
  }
});

// POST register new equipment
router.post('/', validateEquipmentPayload, async (req, res, next) => {
  try {
    const {
      asset_tag,
      name,
      model_number,
      manufacturer,
      serial_number,
      category_id,
      lab_id,
      status = 'available',
      purchase_date,
      warranty_expiry,
      last_serviced,
      next_service_due,
      specifications,
      notes
    } = req.body;

    if (getIsMysqlActive()) {
      const existing = await db.query('SELECT id FROM equipment WHERE asset_tag = ?', [asset_tag]);
      if (existing && existing.length > 0) {
        return res.status(400).json({
          success: false,
          error: { message: `Asset Tag "${asset_tag}" is already registered in the system.` }
        });
      }

      const sql = `
        INSERT INTO equipment (
          asset_tag, name, model_number, manufacturer, serial_number,
          category_id, lab_id, status, purchase_date, warranty_expiry,
          last_serviced, next_service_due, specifications, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await db.query(sql, [
        asset_tag,
        name,
        model_number,
        manufacturer,
        serial_number,
        Number(category_id),
        Number(lab_id),
        status,
        purchase_date || null,
        warranty_expiry || null,
        last_serviced || null,
        next_service_due || null,
        specifications ? JSON.stringify(specifications) : null,
        notes || null
      ]);

      await db.logActivity('EQUIPMENT_REGISTERED', 'equipment', result.insertId, `Registered new asset: ${name} [${asset_tag}]`);

      return res.status(201).json({
        success: true,
        data: { id: result.insertId, ...req.body }
      });
    }

    // In-memory fallback
    const duplicate = inMemoryStore.equipment.find(e => e.asset_tag.toLowerCase() === asset_tag.toLowerCase());
    if (duplicate) {
      return res.status(400).json({
        success: false,
        error: { message: `Asset Tag "${asset_tag}" is already registered in the system.` }
      });
    }

    const newId = inMemoryStore.equipment.length > 0 ? Math.max(...inMemoryStore.equipment.map(e => e.id)) + 1 : 1;
    const newEquipment = {
      id: newId,
      asset_tag,
      name,
      model_number,
      manufacturer,
      serial_number,
      category_id: Number(category_id),
      lab_id: Number(lab_id),
      status,
      purchase_date: purchase_date || null,
      warranty_expiry: warranty_expiry || null,
      last_serviced: last_serviced || null,
      next_service_due: next_service_due || null,
      specifications: specifications || {},
      notes: notes || '',
      created_at: new Date()
    };

    inMemoryStore.equipment.unshift(newEquipment);
    await db.logActivity('EQUIPMENT_REGISTERED', 'equipment', newId, `Registered new asset: ${name} [${asset_tag}]`);

    res.status(201).json({
      success: true,
      data: newEquipment
    });
  } catch (err) {
    next(err);
  }
});

// PATCH equipment status (available | in_use | damaged | retired)
router.patch('/:id/status', validateStatusPayload, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status, note } = req.body;

    if (getIsMysqlActive()) {
      const rows = await db.query('SELECT * FROM equipment WHERE id = ?', [id]);
      if (!rows || rows.length === 0) {
        return res.status(404).json({ success: false, error: { message: `Equipment ID ${id} not found.` } });
      }

      const prevStatus = rows[0].status;
      await db.query('UPDATE equipment SET status = ?, notes = CONCAT(IFNULL(notes, ""), ?) WHERE id = ?', [
        status,
        note ? `\n[${new Date().toISOString().slice(0, 10)}] Status change note: ${note}` : '',
        id
      ]);

      await db.logActivity(
        'STATUS_CHANGE',
        'equipment',
        id,
        `Status changed from ${prevStatus} -> ${status} for "${rows[0].name}" [${rows[0].asset_tag}]${note ? ` Note: ${note}` : ''}`
      );

      return res.json({
        success: true,
        message: `Status updated to ${status}`,
        data: { id, status, previousStatus: prevStatus }
      });
    }

    // In-memory fallback
    const eq = inMemoryStore.equipment.find(e => e.id === id);
    if (!eq) {
      return res.status(404).json({ success: false, error: { message: `Equipment ID ${id} not found.` } });
    }

    const prevStatus = eq.status;
    eq.status = status;
    if (note) {
      eq.notes = `${eq.notes ? eq.notes + '\n' : ''}[${new Date().toISOString().slice(0, 10)}] Status change note: ${note}`;
    }

    await db.logActivity(
      'STATUS_CHANGE',
      'equipment',
      id,
      `Status changed from ${prevStatus} -> ${status} for "${eq.name}" [${eq.asset_tag}]${note ? ` Note: ${note}` : ''}`
    );

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: { id, status, previousStatus: prevStatus }
    });
  } catch (err) {
    next(err);
  }
});

// DELETE equipment
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (getIsMysqlActive()) {
      const rows = await db.query('SELECT * FROM equipment WHERE id = ?', [id]);
      if (!rows || rows.length === 0) {
        return res.status(404).json({ success: false, error: { message: `Equipment ID ${id} not found.` } });
      }

      await db.query('DELETE FROM equipment WHERE id = ?', [id]);
      await db.logActivity('EQUIPMENT_DELETED', 'equipment', id, `Removed equipment "${rows[0].name}" [${rows[0].asset_tag}]`);

      return res.json({ success: true, message: `Equipment ${rows[0].asset_tag} removed from registry.` });
    }

    const idx = inMemoryStore.equipment.findIndex(e => e.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: { message: `Equipment ID ${id} not found.` } });
    }

    const removed = inMemoryStore.equipment.splice(idx, 1)[0];
    await db.logActivity('EQUIPMENT_DELETED', 'equipment', id, `Removed equipment "${removed.name}" [${removed.asset_tag}]`);

    res.json({ success: true, message: `Equipment ${removed.asset_tag} removed from registry.` });
  } catch (err) {
    next(err);
  }
});

export default router;
