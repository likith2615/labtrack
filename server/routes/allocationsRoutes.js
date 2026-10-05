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
router.get('/', getAllAllocations);

// POST /api/allocations
router.post(
  '/',
  [
    body('equipment_id').isInt({ min: 1 }).withMessage('Valid equipment_id is required'),
    body('user_id').isInt({ min: 1 }).withMessage('Valid user_id is required'),
    body('due_date').notEmpty().withMessage('due_date is required'),
    body('purpose').trim().isLength({ min: 3 }).withMessage('Purpose must be at least 3 characters')
  ],
  validateRequest,
  createAllocation
);

// PATCH /api/allocations/:id/return
router.patch(
  '/:id/return',
  [param('id').isInt().withMessage('Allocation ID must be an integer')],
  validateRequest,
  returnAllocation
);

export default router;
