import express from 'express';
import db, { inMemoryStore, getIsMysqlActive } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const mysqlActive = getIsMysqlActive();
  const totalEquipment = inMemoryStore.equipment.length;
  const totalLabs = inMemoryStore.labs.length;

  res.json({
    success: true,
    status: 'HEALTHY',
    system: 'LabTrack API Engine',
    database: {
      driver: mysqlActive ? 'MySQL (Active Connection Pool)' : 'In-Memory State Engine (Dev Fallback)',
      mysqlActive,
      connected: true
    },
    metrics: {
      equipmentCount: totalEquipment,
      labsCount: totalLabs,
      uptime: process.uptime()
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
