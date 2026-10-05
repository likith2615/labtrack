import dotenv from 'dotenv';
import app from './app.js';
import { initPool } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start Server and Initialize Database Connection
const startServer = async () => {
  try {
    await initPool();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 LabTrack Express Server listening on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📦 Equipment API: http://localhost:${PORT}/api/equipment`);
      console.log(`🏢 Labs API: http://localhost:${PORT}/api/labs`);
      console.log(`🔧 Maintenance API: http://localhost:${PORT}/api/maintenance`);
      console.log(`🔄 Allocations API: http://localhost:${PORT}/api/allocations`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Fatal Server Startup Error:', err);
    process.exit(1);
  }
};

startServer();
