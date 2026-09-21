import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import Doctor from './models/Doctor.js';
import { seedCareSyncData } from './utils/seeder.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Allowed Origins
const allowedOrigins = [
  'https://caresync-vjzg.vercel.app',
  'https://caresync-a1x8.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

// CORS Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.options('*', cors());
app.use(express.json());

// Real-time Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  const dbStatus = states[dbState] || 'unknown';

  res.status(dbState === 1 ? 200 : 503).json({
    status: dbState === 1 ? 'ok' : 'degraded',
    database: dbStatus,
    platform: 'CareSync Healthcare API',
    timestamp: new Date().toISOString(),
  });
});

// Database Readiness Guard for all other API endpoints
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection is not ready. Please verify MONGODB_URI environment variable and MongoDB Atlas Network Access (0.0.0.0/0).',
      dbState: mongoose.connection.readyState,
    });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend build in production
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Global API 404
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'CareSync API Route Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[CareSync Server Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
const startServer = async () => {
  const isConnected = await connectDB();
  
  if (isConnected) {
    try {
      const doctorCount = await Doctor.countDocuments();
      if (doctorCount === 0) {
        console.log('[CareSync Auto-Seed] Database empty, seeding initial records...');
        await seedCareSyncData();
      }
    } catch (seedErr) {
      console.warn('[CareSync Auto-Seed Warning]', seedErr.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`[CareSync Server] Server running on http://localhost:${PORT}`);
  });
};

startServer();
