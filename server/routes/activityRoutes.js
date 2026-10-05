import express from 'express';
import { getRecentActivity } from '../controllers/activityController.js';

const router = express.Router();

// GET /api/activity
router.get('/', getRecentActivity);

export default router;
