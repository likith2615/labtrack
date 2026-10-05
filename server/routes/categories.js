import express from 'express';
import db, { inMemoryStore, getIsMysqlActive } from '../db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    if (getIsMysqlActive()) {
      const categories = await db.query('SELECT * FROM categories ORDER BY name ASC');
      return res.json({ success: true, count: categories.length, data: categories });
    }
    res.json({ success: true, count: inMemoryStore.categories.length, data: inMemoryStore.categories });
  } catch (err) {
    next(err);
  }
});

export default router;
