import asyncHandler from '../middleware/asyncHandler.js';
import { query, getIsMysqlActive, inMemoryDB } from '../config/db.js';

/**
 * @desc   Get comprehensive inventory and operational reports summary
 * @route  GET /api/reports/summary
 * @access Public
 */
export const getReportsSummary = asyncHandler(async (req, res) => {
  if (getIsMysqlActive()) {
    // 1. Status Counts
    const statusSql = `
      SELECT 
        status, 
        COUNT(*) AS count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM equipment), 2) AS percentage
      FROM equipment
      GROUP BY status
      ORDER BY count DESC
    `;
    const statusCounts = await query(statusSql);

    // 2. Breakdown Grouped By Laboratory
    const labSql = `
      SELECT 
        l.id, 
        l.name AS lab_name, 
        l.location,
        u.name AS incharge_name,
        COUNT(e.id) AS total_equipment,
        SUM(CASE WHEN e.status = 'available' THEN 1 ELSE 0 END) AS available_count,
        SUM(CASE WHEN e.status = 'allocated' THEN 1 ELSE 0 END) AS allocated_count,
        SUM(CASE WHEN e.status = 'under_maintenance' THEN 1 ELSE 0 END) AS maintenance_count,
        SUM(CASE WHEN e.status = 'damaged' THEN 1 ELSE 0 END) AS damaged_count,
        SUM(CASE WHEN e.status = 'retired' THEN 1 ELSE 0 END) AS retired_count
      FROM laboratories l
      LEFT JOIN users u ON l.incharge_id = u.id
      LEFT JOIN equipment e ON l.id = e.lab_id
      GROUP BY l.id, l.name, l.location, u.name
      ORDER BY total_equipment DESC
    `;
    const labBreakdown = await query(labSql);

    // 3. Breakdown Grouped By Category
    const categorySql = `
      SELECT 
        c.id, 
        c.name AS category_name, 
        COUNT(e.id) AS total_equipment,
        SUM(CASE WHEN e.status = 'available' THEN 1 ELSE 0 END) AS available_count,
        SUM(CASE WHEN e.status = 'allocated' THEN 1 ELSE 0 END) AS allocated_count,
        SUM(CASE WHEN e.status = 'damaged' OR e.status = 'under_maintenance' THEN 1 ELSE 0 END) AS faulty_count
      FROM categories c
      LEFT JOIN equipment e ON c.id = e.category_id
      GROUP BY c.id, c.name
      ORDER BY total_equipment DESC
    `;
    const categoryBreakdown = await query(categorySql);

    // 4. Overdue Allocations
    const overdueSql = `
      SELECT 
        a.id AS allocation_id,
        a.allocated_on,
        a.due_date,
        a.purpose,
        DATEDIFF(NOW(), a.due_date) AS days_overdue,
        e.id AS equipment_id,
        e.asset_tag,
        e.name AS equipment_name,
        u.id AS user_id,
        u.name AS borrower_name,
        u.email AS borrower_email,
        u.role AS borrower_role,
        l.name AS lab_name
      FROM allocations a
      JOIN equipment e ON a.equipment_id = e.id
      JOIN users u ON a.user_id = u.id
      JOIN laboratories l ON e.lab_id = l.id
      WHERE a.returned_on IS NULL 
        AND a.due_date < NOW()
      ORDER BY days_overdue DESC
    `;
    const overdueAllocations = await query(overdueSql);

    // 5. Most-Damaged Categories
    const damagedCatSql = `
      SELECT 
        c.id AS category_id,
        c.name AS category_name,
        COUNT(e.id) AS total_units,
        SUM(CASE WHEN e.status IN ('damaged', 'under_maintenance') THEN 1 ELSE 0 END) AS faulty_count,
        ROUND(SUM(CASE WHEN e.status IN ('damaged', 'under_maintenance') THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(COUNT(e.id), 0), 2) AS failure_rate_pct
      FROM categories c
      JOIN equipment e ON c.id = e.category_id
      GROUP BY c.id, c.name
      HAVING faulty_count > 0
      ORDER BY failure_rate_pct DESC
    `;
    const mostDamagedCategories = await query(damagedCatSql);

    return res.status(200).json({
      success: true,
      message: 'Operational reports summary generated successfully.',
      data: {
        totalInventoryCount: statusCounts.reduce((acc, curr) => acc + Number(curr.count), 0),
        statusCounts,
        labBreakdown,
        categoryBreakdown,
        overdueAllocations: {
          count: overdueAllocations.length,
          items: overdueAllocations
        },
        mostDamagedCategories
      },
      errors: null
    });
  }

  // In-Memory Fallback
  const total = inMemoryDB.equipment.length;
  const statusMap = {};
  inMemoryDB.equipment.forEach(e => {
    statusMap[e.status] = (statusMap[e.status] || 0) + 1;
  });

  const statusCounts = Object.entries(statusMap).map(([status, count]) => ({
    status,
    count,
    percentage: total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0
  }));

  const labBreakdown = inMemoryDB.laboratories.map(lab => {
    const labEq = inMemoryDB.equipment.filter(e => e.lab_id === lab.id);
    const incharge = inMemoryDB.users.find(u => u.id === lab.incharge_id);
    return {
      id: lab.id,
      lab_name: lab.name,
      location: lab.location,
      incharge_name: incharge ? incharge.name : 'Unassigned',
      total_equipment: labEq.length,
      available_count: labEq.filter(e => e.status === 'available').length,
      allocated_count: labEq.filter(e => e.status === 'allocated').length,
      maintenance_count: labEq.filter(e => e.status === 'under_maintenance').length,
      damaged_count: labEq.filter(e => e.status === 'damaged').length,
      retired_count: labEq.filter(e => e.status === 'retired').length
    };
  });

  const categoryBreakdown = inMemoryDB.categories.map(cat => {
    const catEq = inMemoryDB.equipment.filter(e => e.category_id === cat.id);
    return {
      id: cat.id,
      category_name: cat.name,
      total_equipment: catEq.length,
      available_count: catEq.filter(e => e.status === 'available').length,
      allocated_count: catEq.filter(e => e.status === 'allocated').length,
      faulty_count: catEq.filter(e => e.status === 'damaged' || e.status === 'under_maintenance').length
    };
  });

  const now = new Date();
  const overdueAllocations = inMemoryDB.allocations
    .filter(a => a.returned_on === null && new Date(a.due_date) < now)
    .map(a => {
      const eq = inMemoryDB.equipment.find(e => e.id === a.equipment_id);
      const user = inMemoryDB.users.find(u => u.id === a.user_id);
      const lab = eq ? inMemoryDB.laboratories.find(l => l.id === eq.lab_id) : null;
      const daysOverdue = Math.max(0, Math.floor((now - new Date(a.due_date)) / (1000 * 60 * 60 * 24)));
      return {
        allocation_id: a.id,
        allocated_on: a.allocated_on,
        due_date: a.due_date,
        purpose: a.purpose,
        days_overdue: daysOverdue,
        equipment_id: a.equipment_id,
        asset_tag: eq ? eq.asset_tag : '',
        equipment_name: eq ? eq.name : '',
        user_id: a.user_id,
        borrower_name: user ? user.name : 'Unknown User',
        borrower_email: user ? user.email : '',
        borrower_role: user ? user.role : 'student',
        lab_name: lab ? lab.name : ''
      };
    });

  const mostDamagedCategories = categoryBreakdown
    .filter(c => c.faulty_count > 0)
    .map(c => ({
      category_id: c.id,
      category_name: c.category_name,
      total_units: c.total_equipment,
      faulty_count: c.faulty_count,
      failure_rate_pct: c.total_equipment > 0 ? Number(((c.faulty_count / c.total_equipment) * 100).toFixed(2)) : 0
    }));

  res.status(200).json({
    success: true,
    message: 'Operational reports summary generated successfully.',
    data: {
      totalInventoryCount: total,
      statusCounts,
      labBreakdown,
      categoryBreakdown,
      overdueAllocations: {
        count: overdueAllocations.length,
        items: overdueAllocations
      },
      mostDamagedCategories
    },
    errors: null
  });
});

export default { getReportsSummary };
