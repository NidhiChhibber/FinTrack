// server/routes/api/ml/ml.js - Simple version
import express from 'express';
import { MLController } from '../../../src/controllers/MLController.js';

const router = express.Router();
const mlController = new MLController();

// POST /api/ml/predict - predict category for transaction description
router.post('/predict', mlController.predictCategory);

export default router;