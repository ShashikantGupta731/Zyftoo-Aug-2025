/**
 * Admin Authentication Service
 * Separate module for admin-specific authentication
 * This module is completely isolated and won't affect other auth modules
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { decryptData, encryptData } = require('../utils/cryptoUtil');

class AdminAuthService {
  /**
   * Admin Login Service
   * @param {Object} loginData - The login credentials
   * @returns {Object} Login response with token and user data
   */
  static async adminLogin(loginData) {
    console.log('🔐 [AdminAuthService] Processing admin login');
    
    try {
      const { phone, email, password, userType } = loginData;
      
      // Validate required fields
      if ((!phone && !email) || !password) {
        throw new Error('Phone/Email and password are required');
      }
      
      // Verify userType is Admin
      if (userType !== 'Admin') {
        throw new Error('Invalid user type for admin login');
      }
      
      // Build query for admin user
      let query = { role: 'admin' };
      if (phone) {
        query.phone = phone.trim();
      } else if (email) {
        query.email = email.trim();
      }
      
      console.log('🔍 [AdminAuthService] Searching for admin with query:', query);
      
      // Find admin user
      const admin = await User.findOne(query).select('+password');
      
      if (!admin) {
        throw new Error('Invalid credentials');
      }
      
      console.log('✅ [AdminAuthService] Admin user found:', admin.name);
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }
      
      console.log('✅ [AdminAuthService] Password verification successful');
      
      // Update last login
      admin.lastLogin = new Date();
      await admin.save();
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: admin._id,
          role: admin.role,
          userType: 'Admin'
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      console.log('✅ [AdminAuthService] JWT token generated');
      
      // Return admin data
      return {
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          role: admin.role,
          userType: 'Admin',
          status: admin.status
        }
      };
      
    } catch (error) {
      console.error('❌ [AdminAuthService] Login error:', error.message);
      throw error;
    }
  }
  
  /**
   * Verify Admin Token
   * @param {String} token - JWT token
   * @returns {Object} Admin user data
   */
  static async verifyAdminToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.userType !== 'Admin' || decoded.role !== 'admin') {
        throw new Error('Invalid admin token');
      }
      
      const admin = await User.findById(decoded.id);
      
      if (!admin || admin.role !== 'admin') {
        throw new Error('Admin user not found');
      }
      
      return admin;
      
    } catch (error) {
      console.error('❌ [AdminAuthService] Token verification error:', error.message);
      throw error;
    }
  }
}

module.exports = AdminAuthService;
