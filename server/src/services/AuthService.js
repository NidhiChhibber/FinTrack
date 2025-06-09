// server/src/services/AuthService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js'; // Updated path
import { Op } from 'sequelize';

const { User } = db; // Destructure User from db

export class AuthService {
  // server/src/services/AuthService.js
async register({ email, password, name, username }) { // Add username parameter
  // Check if user exists by email OR username
  const existingUser = await User.findOne({ 
    where: {
      [Op.or]: [
        { email },
        { username } // Check for username conflicts too
      ]
    }
  });
  
  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('User with this email already exists');
    }
    if (existingUser.username === username) {
      throw new Error('Username is already taken');
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user with the provided username (not generated from email)
  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    username // Use the actual username passed in, don't generate it
  });

  return user;
}

  // server/src/services/AuthService.js
async login(username, password) { // Changed parameter from email to username
  // Find user by username instead of email
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Update last login
  await user.update({ lastLoginAt: new Date() });

  // Generate token
  const token = this.generateToken(user.id);

  return { user, token };
}

  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}