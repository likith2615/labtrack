import asyncHandler from '../middleware/asyncHandler.js';
import { query, getIsMysqlActive, inMemoryDB } from '../config/db.js';

/**
 * @desc   Get all equipment categories (for dropdowns and listings)
 * @route  GET /api/categories
 * @access Public
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  if (getIsMysqlActive()) {
    const sql = `
      SELECT 
        c.id, 
        c.name, 
        c.description, 
        c.created_at,
        COUNT(e.id) AS equipment_count
      FROM categories c
      LEFT JOIN equipment e ON c.id = e.category_id
      GROUP BY c.id, c.name, c.description, c.created_at
      ORDER BY c.name ASC
    `;
    const results = await query(sql);
    return res.status(200).json({
      success: true,
      message: `Retrieved ${results.length} equipment categories.`,
      data: results,
      errors: null
    });
  }

  const categoriesWithCounts = inMemoryDB.categories.map(cat => ({
    ...cat,
    equipment_count: inMemoryDB.equipment.filter(e => e.category_id === cat.id).length
  }));

  res.status(200).json({
    success: true,
    message: `Retrieved ${categoriesWithCounts.length} equipment categories.`,
    data: categoriesWithCounts,
    errors: null
  });
});

export default { getAllCategories };
