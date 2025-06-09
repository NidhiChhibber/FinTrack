// server/src/controllers/AuthController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/AuthService.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res) => {
    try {
      console.log("Logging");
      const { email, password, name } = req.body;
      
      const user = await this.authService.register({ email, password, name });
      const token = this.authService.generateToken(user.id);
      
      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar
          }
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const { user, token } = await this.authService.login(email, password);
      
      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar
          }
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  };

  verify = async (req, res) => {
    try {
      const user = req.user; // Set by auth middleware
      
      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar
          }
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }
  };

  googleCallback = async (req, res) => {
    try {
      const user = req.user;
      const token = this.authService.generateToken(user.id);
      
      // Redirect to frontend with token
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_error`);
    }
  };
}