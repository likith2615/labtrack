import express from 'express';
import { body, param, query } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipmentStatus,
  deleteEquipment
} from '../controllers/equipmentController.js';

const router = express.Router();

// GET /api/equipment
router.get('/', getAllEquipment);

// GET /api/equipment/:id
router.get(
  '/:id',
  [param('id').isInt().withMessage('Equipment ID must be a valid integer')],
  validateRequest,
  getEquipmentById
);

// POST /api/equipment
router.post(
  '/',
  [
    body('asset_tag').trim().notEmpty().withMessage('Asset tag is required (e.g. EQ-CS-001)'),
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('category_id').isInt({ min: 1 }).withMessage('Valid category_id is required'),
    body('lab_id').isInt({ min: 1 }).withMessage('Valid lab_id is required'),
    body('serial_no').trim().notEmpty().withMessage('Serial number is required'),
    body('purchase_date').isISO8601().toDate().withMessage('Purchase date must be in YYYY-MM-DD format'),
    body('status')
      .optional()
      .isIn(['available', 'allocated', 'under_maintenance', 'damaged', 'retired'])
      .withMessage('Status must be available, allocated, under_maintenance, damaged, or retired')
  ],
  validateRequest,
  createEquipment
);

// PATCH /api/equipment/:id/status
router.patch(
  '/:id/status',
  [
    param('id').isInt().withMessage('Equipment ID must be a valid integer'),
    body('status')
      .isIn(['available', 'allocated', 'under_maintenance', 'damaged', 'retired'])
      .withMessage('Status must be available, allocated, under_maintenance, damaged, or retired')
  ],
  validateRequest,
  updateEquipmentStatus
);

// DELETE /api/equipment/:id
router.delete(
  '/:id',
  [param('id').isInt().withMessage('Equipment ID must be a valid integer')],
  validateRequest,
  deleteEquipment
);

export default router;
