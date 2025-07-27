  const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { encryptData, decryptData } = require('../utils/cryptoUtil');
const AuthService = require('../services/AuthService');

// ✅ SIGNUP CONTROLLER - Now using centralized AuthService
const signupUser = async (req, res) => {
  try {
    console.log('� [Controller] Signup request received - delegating to AuthService');
    
    // Use centralized AuthService
    const result = await AuthService.register(req.body);
    
    console.log('✅ [Controller] Registration successful via AuthService');
    return res.status(201).json(result);
    
  } catch (error) {
    console.error('❌ [Controller] Signup error:', error.message);
    
    // Preserve exact error status codes
    const statusCode = error.statusCode || (error.message.includes('Invalid encrypted data') ? 400 : 500);
    const errorMessage = error.message.includes('Invalid encrypted data') 
      ? 'Invalid encrypted data' 
      : error.message;
    
    return res.status(statusCode).json({ 
      success: false, 
      error: errorMessage 
    });
  }
};


  // ✅ LOGIN CONTROLLER - Now using centralized AuthService
  const loginUser = async (req, res) => {
    console.log('🚀 LOGIN REQUEST RECEIVED');
    console.log('📦 Raw request body:', JSON.stringify(req.body));
    console.log('🔑 Environment ENCRYPTION_KEY exists:', !!process.env.ENCRYPTION_KEY);
    console.log('🔑 ENCRYPTION_KEY length:', process.env.ENCRYPTION_KEY?.length || 0);
    
    try {
      console.log('� [Controller] Delegating to AuthService...');
      
      // Use centralized AuthService
      const result = await AuthService.login(req.body);
      
      console.log('� [Controller] AuthService response received');

      const responseData = {
        success: true,
        message: 'Login successful',
        data: result
      };

      console.log('📋 STEP 2: Response data before encryption:', JSON.stringify(responseData, null, 2));

      // Encrypt the response with error handling (preserving existing encryption logic)
      let encryptedResponseData;
      try {
        console.log('🔐 STEP 3: Starting encryption process...');
        encryptedResponseData = encryptData(responseData);
        console.log('🔒 STEP 4: Encrypted response data created');
        
        if (!encryptedResponseData) {
          throw new Error('Encryption returned null/undefined');
        }
      } catch (encryptError) {
        console.error('❌ Encryption failed:', encryptError.message);
        console.error('❌ Encryption error stack:', encryptError.stack);
        
        // Fallback: send unencrypted response if encryption fails
        console.log('⚠️ STEP 5A: Falling back to unencrypted response');
        return res.status(200).json(responseData);
      }

      console.log('📨 STEP 5B: Sending encrypted response...');
      return res.status(200).json({ 
        success: true, 
        encryptedData: encryptedResponseData 
      });
        
    } catch (error) {
      console.error('❌ [Controller] Login error:', error.message);
      
      // Preserve exact error status codes and messages
      const statusCode = error.statusCode || (error.message.includes('Invalid encrypted data') ? 400 : 500);
      const errorMessage = error.message.includes('Invalid encrypted data') 
        ? `Invalid encrypted data: ${error.message}` 
        : (error.statusCode === 401 ? error.message : 'Login failed');
      
      return res.status(statusCode).json({ 
        success: false, 
        error: errorMessage 
      });
    }
  };

const verifyEmail = async (req, res) => {
  try {
    console.log('📧 [Controller] Email verification request - delegating to AuthService');
    
    // Use centralized AuthService
    const result = await AuthService.verifyEmail(req.params.token);
    
    console.log('✅ [Controller] Email verification successful via AuthService');
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('❌ [Controller] Email verification error:', error.message);
    return res.status(400).json({ error: error.message });
  }
};

  // ✅ RESET PASSWORD CONTROLLER - Now using centralized AuthService
 const resetPassword = async (req, res) => {
  try {
    console.log('� [Controller] Password reset request - delegating to AuthService');
    
    // Use centralized AuthService
    const result = await AuthService.resetPassword(req.body);
    
    console.log('✅ [Controller] Password reset successful via AuthService');
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('❌ [Controller] Password reset error:', error.message);
    
    // Preserve exact error status codes
    const statusCode = error.statusCode || (error.message.includes('Invalid encrypted data') ? 400 : 500);
    const errorMessage = error.message.includes('Invalid encrypted data') 
      ? 'Invalid encrypted data' 
      : error.message;
    
    return res.status(statusCode).json({ 
      success: false, 
      error: errorMessage 
    });
  }
};

const checkUser = async (req, res) => {
  try {
    console.log('🔍 [Controller] Check user request - delegating to AuthService');
    
    // Use centralized AuthService
    const result = await AuthService.checkUserExists(req.params.phone);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ [Controller] Check user error:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
};

const checkUserByEmail = async (req, res) => {
  try {
    console.log('🔍 [Controller] Check user by email request - delegating to AuthService');
    
    // Use centralized AuthService
    const result = await AuthService.checkUserByEmail(req.params.email);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ [Controller] Check user by email error:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
};

  module.exports = {
    signupUser,
    loginUser,
    resetPassword,
    verifyEmail,
    checkUser,
    checkUserByEmail,
  };
