import express from 'express';
import cors from 'cors';
import requestLogger from './middleware/requestLogger.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';
import apiRoutes from './routes/index.js';

const app = express();

// Global Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Telemetry Logger
app.use(requestLogger);

// API Routes
app.use('/api', apiRoutes);

// Root Health Route Redirect / Direct response
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LabTrack API Server Online',
    documentation: '/api/health',
    timestamp: new Date().toISOString()
  });
});

// 404 & Central Error Handler
app.use(notFound);
app.use(errorHandler);

export default app;
