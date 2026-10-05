import express from 'express';
import { body, param, query } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from '../controllers/equipmentController.js';

const router = express.Router();

const validStatuses = ['available', 'allocated', 'under_maintenance', 'damaged', 'retired'];

// Validation chains for write operations
const equipmentWriteValidation = [
  body('asset_tag')
    .trim()
    .notEmpty()
    .withMessage('Asset tag is required (e.g. EQ-CS-001)')
    .isLength({ min: 3, max: 50 })
    .withMessage('Asset tag must be between 3 and 50 characters'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Equipment name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be between 2 and 150 characters'),
  body('category_id')
    .notEmpty()
    .withMessage('Category ID is required')
    .isInt({ min: 1 })
    .withMessage('category_id must be a positive integer corresponding to a valid category'),
  body('lab_id')
    .notEmpty()
    .withMessage('Laboratory ID is required')
    .isInt({ min: 1 })
    .withMessage('lab_id must be a positive integer corresponding to a valid laboratory'),
  body('serial_no')
    .trim()
    .notEmpty()
    .withMessage('Serial number is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Serial number must be between 2 and 100 characters'),
  body('purchase_date')
    .notEmpty()
    .withMessage('Purchase date is required')
    .isISO8601()
    .withMessage('Purchase date must be a valid date in YYYY-MM-DD format'),
  body('status')
    .optional()
    .isIn(validStatuses)
    .withMessage(`Status must be one of: ${validStatuses.join(', ')}`),
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be a string')
];

// GET /api/equipment
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be an integer >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
    query('status').optional().isIn([...validStatuses, 'all']).withMessage(`status must be one of: ${validStatuses.join(', ')}, all`)
  ],
  validateRequest,
  getAllEquipment
);

// GET /api/equipment/:id
router.get(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Equipment ID must be a positive integer')],
  validateRequest,
  getEquipmentById
);

// POST /api/equipment
router.post(
  '/',
  equipmentWriteValidation,
  validateRequest,
  createEquipment
);

// PUT /api/equipment/:id
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('Equipment ID must be a positive integer'),
    ...equipmentWriteValidation
  ],
  validateRequest,
  updateEquipment
);

// DELETE /api/equipment/:id
router.delete(
  '/:id',
  [param('id').isInt({ min: 1 }).withMessage('Equipment ID must be a positive integer')],
  validateRequest,
  deleteEquipment
);

export default router;
