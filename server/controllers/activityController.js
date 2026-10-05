import asyncHandler from '../middleware/asyncHandler.js';
import { query, getIsMysqlActive, inMemoryDB } from '../config/db.js';

/**
 * @desc   Get recent system activity trail (allocations + maintenance events)
 * @route  GET /api/activity
 * @access Public
 */
export const getRecentActivity = asyncHandler(async (req, res) => {
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

  if (getIsMysqlActive()) {
    // Union recent maintenance and allocations for a live activity stream
    const sql = `
      SELECT 
        'MAINTENANCE' AS activity_type,
        m.id,
        CONCAT('Maintenance ticket [', m.severity, ']: ', m.issue_description, ' for ', e.name, ' (', e.asset_tag, ')') AS details,
        m.reported_on AS created_at
      FROM maintenance m
      JOIN equipment e ON m.equipment_id = e.id
      UNION ALL
      SELECT 
        'ALLOCATION' AS activity_type,
        a.id,
        CONCAT('Equipment checkout: ', e.name, ' (', e.asset_tag, ') allocated to ', u.name, ' - ', a.purpose) AS details,
        a.allocated_on AS created_at
      FROM allocations a
      JOIN equipment e ON a.equipment_id = e.id
      JOIN users u ON a.user_id = u.id
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const results = await query(sql, [limit]);
    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
      errors: null
    });
  }

  // In-Memory Fallback Activity Stream
  const events = [];
  inMemoryDB.maintenance.forEach(m => {
    const eq = inMemoryDB.equipment.find(e => e.id === m.equipment_id);
    events.push({
      id: `m-${m.id}`,
      activity_type: 'MAINTENANCE',
      details: `Maintenance report [${m.severity}]: ${m.issue_description} for ${eq?.name || 'Equipment'} (${eq?.asset_tag || ''})`,
      created_at: m.reported_on
    });
  });

  inMemoryDB.allocations.forEach(a => {
    const eq = inMemoryDB.equipment.find(e => e.id === a.equipment_id);
    const user = inMemoryDB.users.find(u => u.id === a.user_id);
    events.push({
      id: `a-${a.id}`,
      activity_type: 'ALLOCATION',
      details: `Equipment checkout: ${eq?.name || 'Equipment'} (${eq?.asset_tag || ''}) assigned to ${user?.name || 'Student'} - ${a.purpose}`,
      created_at: a.allocated_on
    });
  });

  events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const trimmed = events.slice(0, limit);

  res.status(200).json({
    success: true,
    count: trimmed.length,
    data: trimmed,
    errors: null
  });
});

export default { getRecentActivity };
