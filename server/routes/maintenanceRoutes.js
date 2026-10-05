import express from 'express';
import { body, param, query } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import {
  getAllMaintenance,
  reportDamage,
  updateMaintenanceStatus
} from '../controllers/maintenanceController.js';

const router = express.Router();

const validStatuses = ['reported', 'in_progress', 'resolved'];
const validSeverities = ['low', 'medium', 'high'];

// GET /api/maintenance (filter by status)
router.get(
  '/',
  [
    query('status').optional().isIn([...validStatuses, 'all']).withMessage(`status must be one of: ${validStatuses.join(', ')}, all`),
    query('severity').optional().isIn([...validSeverities, 'all']).withMessage(`severity must be one of: ${validSeverities.join(', ')}, all`),
    query('equipment_id').optional().isInt({ min: 1 }).withMessage('equipment_id must be a positive integer')
  ],
  validateRequest,
  getAllMaintenance
);

// POST /api/maintenance/report
router.post(
  '/report',
  [
    body('equipment_id')
      .notEmpty().withMessage('equipment_id is required')
      .isInt({ min: 1 }).withMessage('equipment_id must be a positive integer corresponding to an equipment item'),
    body('reported_by')
      .optional({ nullable: true })
      .isInt({ min: 1 }).withMessage('reported_by must be a valid user ID'),
    body('issue_description')
      .trim()
      .notEmpty().withMessage('issue_description is required')
      .isLength({ min: 5 }).withMessage('issue_description must be at least 5 characters long'),
    body('severity')
      .optional()
      .isIn(validSeverities).withMessage(`severity must be one of: ${validSeverities.join(', ')}`),
    body('technician_notes')
      .optional({ nullable: true })
      .isString().withMessage('technician_notes must be a string')
  ],
  validateRequest,
  reportDamage
);

// POST /api/maintenance (alias for reporting damage)
router.post(
  '/',
  [
    body('equipment_id')
      .notEmpty().withMessage('equipment_id is required')
      .isInt({ min: 1 }).withMessage('equipment_id must be a positive integer corresponding to an equipment item'),
    body('issue_description')
      .trim()
      .notEmpty().withMessage('issue_description is required')
      .isLength({ min: 5 }).withMessage('issue_description must be at least 5 characters long'),
    body('severity')
      .optional()
      .isIn(validSeverities).withMessage(`severity must be one of: ${validSeverities.join(', ')}`)
  ],
  validateRequest,
  reportDamage
);

// PUT /api/maintenance/:id/status
router.put(
  '/:id/status',
  [
    param('id').isInt({ min: 1 }).withMessage('Maintenance ticket ID must be a positive integer'),
    body('status')
      .notEmpty().withMessage('status is required')
      .isIn(validStatuses).withMessage(`status must be one of: ${validStatuses.join(', ')}`),
    body('technician_notes')
      .optional({ nullable: true })
      .isString().withMessage('technician_notes must be a string')
  ],
  validateRequest,
  updateMaintenanceStatus
);

// PATCH /api/maintenance/:id/status (for compatibility)
router.patch(
  '/:id/status',
  [
    param('id').isInt({ min: 1 }).withMessage('Maintenance ticket ID must be a positive integer'),
    body('status')
      .notEmpty().withMessage('status is required')
      .isIn(validStatuses).withMessage(`status must be one of: ${validStatuses.join(', ')}`)
  ],
  validateRequest,
  updateMaintenanceStatus
);

export default router;
