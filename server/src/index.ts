import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pino from 'pino';
import mongoose from 'mongoose';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import orderRoutes from './routes/orders';
import adminRoutes from './routes/admin';
import settingsRoutes from './routes/settings';
import contactRoutes from './routes/contact';
import uploadRoutes from './routes/upload';
import deliveryZoneRoutes from './routes/deliveryZones';

const logger = pino();
const app = express();

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kingston-chicken';

  await mongoose.connect(mongoUri);
  logger.info('Connected to MongoDB');
}

async function startServer() {
  await connectDatabase();

  app.use(helmet());
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }));
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(rateLimiter);

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/delivery-zones', deliveryZoneRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Error handling
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  console.error('Full error:', error);
  process.exit(1);
});
