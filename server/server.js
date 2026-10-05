import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './db.js';
import healthRoutes from './routes/health.js';
import labsRoutes from './routes/labs.js';
import categoriesRoutes from './routes/categories.js';
import equipmentRoutes from './routes/equipment.js';
import maintenanceRoutes from './routes/maintenance.js';
import activityRoutes from './routes/activity.js';
import { notFoundHandler, centralErrorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Compact Technical Format)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Mount Routes
app.use('/api/health', healthRoutes);
app.use('/api/labs', labsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/activity', activityRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(centralErrorHandler);

// Startup Server
const startServer = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 LabTrack Express Backend Running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`⚙️  API Endpoints: /api/equipment, /api/labs, /api/maintenance`);
    console.log(`======================================================\n`);
  });
};

startServer();

export default app;
