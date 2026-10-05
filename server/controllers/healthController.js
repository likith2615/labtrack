import asyncHandler from '../middleware/asyncHandler.js';
import { getIsMysqlActive, query } from '../config/db.js';

/**
 * @desc   System health check endpoint
 * @route  GET /api/health
 * @access Public
 */
export const getHealth = asyncHandler(async (req, res) => {
  const isMysql = getIsMysqlActive();
  let dbStatus = isMysql ? 'connected' : 'in-memory-fallback';
  let latencyMs = 0;

  try {
    const start = Date.now();
    await query('SELECT 1');
    latencyMs = Date.now() - start;
  } catch (err) {
    dbStatus = 'error';
  }

  res.status(200).json({
    success: true,
    message: 'LabTrack API service is operational',
    data: {
      status: 'UP',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: {
        driver: isMysql ? 'MySQL2 Connection Pool' : 'In-Memory State Engine',
        status: dbStatus,
        latency: `${latencyMs}ms`
      },
      environment: process.env.NODE_ENV || 'development'
    },
    errors: null
  });
});

export default { getHealth };
