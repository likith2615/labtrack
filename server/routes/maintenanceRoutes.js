import express from 'express';
import { body, param, query } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import {
  getAllMaintenance,
  createMaintenanceTicket,
  updateMaintenanceStatus
} from '../controllers/maintenanceController.js';

const router = express.Router();

// GET /api/maintenance
router.get('/', getAllMaintenance);

// POST /api/maintenance
router.post(
  '/',
  [
    body('equipment_id').isInt({ min: 1 }).withMessage('Valid equipment_id is required'),
    body('issue_description').trim().isLength({ min: 5 }).withMessage('Issue description must be at least 5 characters'),
    body('severity')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Severity must be low, medium, or high')
  ],
  validateRequest,
  createMaintenanceTicket
);

// PATCH /api/maintenance/:id/status
router.patch(
  '/:id/status',
  [
    param('id').isInt().withMessage('Maintenance ticket ID must be an integer'),
    body('status')
      .isIn(['reported', 'in_progress', 'resolved'])
      .withMessage('Status must be reported, in_progress, or resolved')
  ],
  validateRequest,
  updateMaintenanceStatus
);

export default router;
