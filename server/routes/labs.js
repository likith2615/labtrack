import express from 'express';
import db, { inMemoryStore, getIsMysqlActive } from '../db.js';

const router = express.Router();

// GET all labs with equipment stats
router.get('/', async (req, res, next) => {
  try {
    if (getIsMysqlActive()) {
      const sql = `
        SELECT 
          l.*,
          COUNT(e.id) AS total_equipment,
          SUM(CASE WHEN e.status = 'available' THEN 1 ELSE 0 END) AS available_count,
          SUM(CASE WHEN e.status = 'in_use' THEN 1 ELSE 0 END) AS in_use_count,
          SUM(CASE WHEN e.status = 'damaged' THEN 1 ELSE 0 END) AS damaged_count,
          SUM(CASE WHEN e.status = 'retired' THEN 1 ELSE 0 END) AS retired_count
        FROM labs l
        LEFT JOIN equipment e ON l.id = e.lab_id
        GROUP BY l.id
        ORDER BY l.name ASC
      `;
      const labs = await db.query(sql);
      return res.json({ success: true, count: labs.length, data: labs });
    }

    // In-memory fallback
    const labsWithStats = inMemoryStore.labs.map(lab => {
      const labEquipment = inMemoryStore.equipment.filter(e => e.lab_id === lab.id);
      return {
        ...lab,
        total_equipment: labEquipment.length,
        available_count: labEquipment.filter(e => e.status === 'available').length,
        in_use_count: labEquipment.filter(e => e.status === 'in_use').length,
        damaged_count: labEquipment.filter(e => e.status === 'damaged').length,
        retired_count: labEquipment.filter(e => e.status === 'retired').length
      };
    });

    res.json({ success: true, count: labsWithStats.length, data: labsWithStats });
  } catch (err) {
    next(err);
  }
});

// GET single lab by ID
router.get('/:id', async (req, res, next) => {
  try {
    const labId = Number(req.params.id);
    if (getIsMysqlActive()) {
      const labs = await db.query('SELECT * FROM labs WHERE id = ?', [labId]);
      if (!labs || labs.length === 0) {
        return res.status(404).json({ success: false, error: { message: `Lab ID ${labId} not found` } });
      }
      const equipment = await db.query('SELECT * FROM equipment WHERE lab_id = ?', [labId]);
      return res.json({ success: true, data: { ...labs[0], equipment } });
    }

    const lab = inMemoryStore.labs.find(l => l.id === labId);
    if (!lab) {
      return res.status(404).json({ success: false, error: { message: `Lab ID ${labId} not found` } });
    }
    const equipment = inMemoryStore.equipment.filter(e => e.lab_id === labId);
    res.json({ success: true, data: { ...lab, equipment } });
  } catch (err) {
    next(err);
  }
});

// POST new lab
router.post('/', async (req, res, next) => {
  try {
    const { name, code, department, location, in_charge, contact_email, capacity } = req.body;
    if (!name || !code || !department || !location || !in_charge) {
      return res.status(400).json({
        success: false,
        error: { message: 'name, code, department, location, and in_charge are required' }
      });
    }

    if (getIsMysqlActive()) {
      const result = await db.query(
        'INSERT INTO labs (name, code, department, location, in_charge, contact_email, capacity) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, code, department, location, in_charge, contact_email || '', Number(capacity) || 30]
      );
      await db.logActivity('LAB_CREATED', 'lab', result.insertId, `Registered laboratory room: ${name} (${code})`);
      return res.status(201).json({ success: true, data: { id: result.insertId, ...req.body } });
    }

    const newId = inMemoryStore.labs.length > 0 ? Math.max(...inMemoryStore.labs.map(l => l.id)) + 1 : 1;
    const newLab = {
      id: newId,
      name,
      code,
      department,
      location,
      in_charge,
      contact_email: contact_email || '',
      capacity: Number(capacity) || 30,
      created_at: new Date()
    };
    inMemoryStore.labs.push(newLab);
    await db.logActivity('LAB_CREATED', 'lab', newId, `Registered laboratory room: ${name} (${code})`);
    res.status(201).json({ success: true, data: newLab });
  } catch (err) {
    next(err);
  }
});

export default router;
