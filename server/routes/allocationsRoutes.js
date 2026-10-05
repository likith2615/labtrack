import express from 'express';
import { body, param, query } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import {
  getAllAllocations,
  createAllocation,
  returnAllocation
} from '../controllers/allocationsController.js';

const router = express.Router();

// GET /api/allocations
router.get(
  '/',
  [
    query('status').optional().isIn(['active', 'returned', 'overdue']).withMessage('status must be active, returned, or overdue')
  ],
  validateRequest,
  getAllAllocations
);

// POST /api/allocations
router.post(
  '/',
  [
    body('equipment_id')
      .notEmpty().withMessage('equipment_id is required')
      .isInt({ min: 1 }).withMessage('equipment_id must be a valid positive integer'),
    body('user_id')
      .notEmpty().withMessage('user_id is required')
      .isInt({ min: 1 }).withMessage('user_id must be a valid positive integer'),
    body('due_date')
      .notEmpty().withMessage('due_date is required')
      .isISO8601().withMessage('due_date must be in ISO8601 or YYYY-MM-DD HH:mm:ss format'),
    body('purpose')
      .trim()
      .notEmpty().withMessage('purpose is required')
      .isLength({ min: 3, max: 255 }).withMessage('purpose must be between 3 and 255 characters')
  ],
  validateRequest,
  createAllocation
);

// PUT /api/allocations/:id/return
router.put(
  '/:id/return',
  [
    param('id').isInt({ min: 1 }).withMessage('Allocation ID must be a positive integer')
  ],
  validateRequest,
  returnAllocation
);

// PATCH /api/allocations/:id/return (for compatibility)
router.patch(
  '/:id/return',
  [
    param('id').isInt({ min: 1 }).withMessage('Allocation ID must be a positive integer')
  ],
  validateRequest,
  returnAllocation
);

export default router;
