import express from 'express';
import db, { inMemoryStore, getIsMysqlActive } from '../db.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 20;

    if (getIsMysqlActive()) {
      const logs = await db.query('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?', [limit]);
      return res.json({ success: true, count: logs.length, data: logs });
    }

    const logs = inMemoryStore.activity_logs.slice(0, limit);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
});

export default router;
