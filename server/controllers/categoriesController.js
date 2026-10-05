import asyncHandler from '../middleware/asyncHandler.js';
import { query, getIsMysqlActive, inMemoryDB } from '../config/db.js';

/**
 * @desc   Get all equipment categories
 * @route  GET /api/categories
 * @access Public
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  if (getIsMysqlActive()) {
    const results = await query('SELECT * FROM categories ORDER BY name ASC');
    return res.status(200).json({
      success: true,
      message: `Retrieved ${results.length} equipment categories.`,
      data: results,
      errors: null
    });
  }

  res.status(200).json({
    success: true,
    message: `Retrieved ${inMemoryDB.categories.length} equipment categories.`,
    data: inMemoryDB.categories,
    errors: null
  });
});

export default { getAllCategories };
