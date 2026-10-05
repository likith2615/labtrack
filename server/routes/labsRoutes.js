import express from 'express';
import { body, param } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';
import { getAllLabs, getLabById, createLab } from '../controllers/labsController.js';

const router = express.Router();

// GET /api/labs
router.get('/', getAllLabs);

// GET /api/labs/:id
router.get(
  '/:id',
  [param('id').isInt().withMessage('Laboratory ID must be an integer')],
  validateRequest,
  getLabById
);

// POST /api/labs
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Laboratory name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('incharge_id').optional({ nullable: true }).isInt().withMessage('incharge_id must be a user ID')
  ],
  validateRequest,
  createLab
);

export default router;
