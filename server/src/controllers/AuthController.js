// server/src/controllers/AuthController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/AuthService.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  // server/src/controllers/AuthController.js
register = async (req, res) => {
  try {
    const { email, password, name, username } = req.body; // Extract username from request
    
    const user = await this.authService.register({ 
      email, 
      password, 
      name, 
      username // Pass the actual username
    });
    
    const token = this.authService.generateToken(user.id);
    
    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username, // Return the actual username
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

  // server/src/controllers/AuthController.js
login = async (req, res) => {
  try {
    const { username, password } = req.body; // Changed from email to username
    
    const { user, token } = await this.authService.login(username, password);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username, // Include username in response
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