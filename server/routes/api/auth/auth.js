// server/routes/api/auth/auth.js
import express from 'express';
import { AuthController } from '../../../src/controllers/AuthController.js';
import { authMiddleware } from '../../../src/middleware/auth.middleware.js';

const router = express.Router();
const authController = new AuthController();

// Auth routes - bind the methods properly
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/verify', authMiddleware, authController.verify.bind(authController));

export default router;