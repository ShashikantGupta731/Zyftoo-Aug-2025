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


  // ✅ LOGIN CONTROLLER
  const loginUser = async (req, res) => {
    console.log('🚀 LOGIN REQUEST RECEIVED');
    console.log('📦 Raw request body:', JSON.stringify(req.body));
    console.log('🔑 Environment ENCRYPTION_KEY exists:', !!process.env.ENCRYPTION_KEY);
    console.log('🔑 ENCRYPTION_KEY length:', process.env.ENCRYPTION_KEY?.length || 0);
    
    try {
      // Decrypt the incoming data
      let decryptedData;
      if (req.body.encryptedData) {
        console.log('🔓 Attempting to decrypt login data...');
        console.log('📝 Encrypted data received:', req.body.encryptedData);
        
        try {
          decryptedData = decryptData(req.body.encryptedData);
          console.log('✅ Decryption successful:', decryptedData);
        } catch (decryptError) {
          console.error('❌ Decryption failed:', decryptError.message);
          throw decryptError;
        }
      } else {
        console.log('⚠️ No encrypted data found, using fallback...');
        decryptedData = req.body;
      }

      const { phone, password } = decryptedData;
      console.log('📱 Extracted phone:', phone);
      console.log('🔑 Password length:', password?.length || 0);

      if (!phone || !password) {
        console.log('❌ Missing phone or password');
        return res.status(400).json({ success: false, error: 'Phone and password are required' });
      }

      try {
        console.log('🔍 Looking up user with phone:', phone);
        const user = await User.findOne({ phone });
        
        if (!user) {
          console.log('❌ User not found for phone:', phone);
          return res.status(401).json({ success: false, error: 'User not found' });
        }

        console.log('✅ User found:', user.name);
        console.log('🔐 Comparing passwords...');
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log('❌ Password does not match');
          return res.status(401).json({ success: false, error: 'Invalid password' });
        }

        console.log('✅ Password matches, generating token...');
        
        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
        );

        console.log('✅ Token generated successfully');
        console.log('📤 STEP 1: Building response object...');

        const responseData = {
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              userType: user.userType,
              role: user.role,
              isEmailVerified: user.isEmailVerified
            }
          }
        };

        console.log('📋 STEP 2: Response data before encryption:', JSON.stringify(responseData, null, 2));

        // Encrypt the response with error handling
        let encryptedResponseData;
        try {
          console.log('🔐 STEP 3: Starting encryption process...');
          encryptedResponseData = encryptData(responseData);
          console.log('🔒 STEP 4: Encrypted response data:', encryptedResponseData);
          
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
        console.error('❌ Database/Auth error:', error.message);
        return res.status(500).json({ success: false, error: 'Login failed' });
      }
    } catch (decryptionError) {
      console.error('❌ Login decryption error:', decryptionError.message);
      console.error('❌ Decryption error stack:', decryptionError.stack);
      return res.status(400).json({ success: false, error: 'Invalid encrypted data: ' + decryptionError.message });
    }
  };

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.emailVerified  = true;
    user.emailVerificationToken = undefined;

    await user.save();

    const updatedUser = await User.findById(user._id); // confirm save
    console.log('✅ Email verified. Current DB state:', updatedUser);

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('❌ Email verification error:', error.message || error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

  // ✅ RESET PASSWORD CONTROLLER
 const resetPassword = async (req, res) => {
  try {
    // Decrypt the incoming data
    let decryptedData;
    if (req.body.encryptedData) {
      console.log('🔓 Decrypting password reset data...');
      decryptedData = decryptData(req.body.encryptedData);
    } else {
      // Fallback to unencrypted data for backward compatibility
      decryptedData = req.body;
    }

    const { phone, newPassword } = decryptedData;
    console.log('🔄 Password reset attempt for phone:', phone);

    if (!phone || !newPassword) {
      return res.status(400).json({ success: false, error: 'Phone and new password are required.' });
    }

    try {
      // Step 1: Find user by phone
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found.' });
      }

      // Step 2: Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Step 3: Update password only
      user.password = hashedPassword;
      await user.save();

      // Step 4: Clear OTPs related to password reset (optional but safe)
      await OTP.deleteMany({ phone, purpose: 'reset' });

      // Step 5: Respond with success
      return res.status(200).json({ success: true, message: 'Password updated successfully.' });

    } catch (err) {
      console.error('Reset password error:', err.message);
      return res.status(500).json({ success: false, error: 'Server error while resetting password.' });
    }
  } catch (decryptionError) {
    console.error('Password reset decryption error:', decryptionError);
    return res.status(400).json({ success: false, error: 'Invalid encrypted data' });
  }
};

const checkUser = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    return res.status(200).json({ exists: !!user });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

  module.exports = {
    signupUser,
    loginUser,
    resetPassword,
    verifyEmail,
    checkUser,
  };
