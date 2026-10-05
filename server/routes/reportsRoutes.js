import express from 'express';
import { getReportsSummary } from '../controllers/reportsController.js';

const router = express.Router();

// GET /api/reports/summary
router.get('/summary', getReportsSummary);

export default router;
