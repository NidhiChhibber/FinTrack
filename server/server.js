// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './src/middleware/error.middleware.js';

// Import route files
import transactionRoutes from './routes/api/transaction/transaction.js';
import plaidRoutes from './routes/api/plaid/plaid.js';
import db from './models/index.js'
import mlRoutes from './routes/api/ml/ml.js';



// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (simple)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/plaid', plaidRoutes);
app.use('/api/ml', mlRoutes);


// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

try {
  await db.sequelize.sync({ force: true }); // Use force: true to recreate tables
  console.log('Database synced successfully');
} catch (error) {
  console.error('Database sync failed:', error);
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🏦 Plaid Environment: ${process.env.PLAID_ENV || 'sandbox'}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;