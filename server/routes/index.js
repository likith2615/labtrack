import express from 'express';
import healthRoutes from './healthRoutes.js';
import equipmentRoutes from './equipmentRoutes.js';
import labsRoutes from './labsRoutes.js';
import categoriesRoutes from './categoriesRoutes.js';
import allocationsRoutes from './allocationsRoutes.js';
import maintenanceRoutes from './maintenanceRoutes.js';
import activityRoutes from './activityRoutes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/labs', labsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/allocations', allocationsRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/activity', activityRoutes);

export default router;
