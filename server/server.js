// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import transactionRoutes from './routes/api/transaction/transaction.js';
import plaidRoutes from './routes/api/plaid/plaid.js';
import retrainRoute from './routes/api/ml/retrain-model.js'

import { sequelize } from './models/index.js';

const app = express();
app.use(express.json()); // Middleware to parse JSON


await sequelize.sync();


// Serve static files from the Angular app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client/dist/client')));

// Import routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/plaid', plaidRoutes);
app.use('/api/ml', retrainRoute);


// The "catchall" handler: for any request that doesn't match an API route, send back Angular's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/client', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
