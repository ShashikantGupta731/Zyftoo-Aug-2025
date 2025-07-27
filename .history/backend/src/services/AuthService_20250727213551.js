const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { encryptData, decryptData } = require('../utils/cryptoUtil');

/**
 * Centralized Authentication Service
 * This service contains all authentication logic extracted from authController
 * while preserving the exact same functionality and behavior
 */
class AuthService {
  
  /**
   * User Registration Service
   * Handles individual, corporate, and admin user registration
   */
  async register(requestData) {
    console.log('🔄 [AuthService] Processing registration via centralized service');
    
    // Decrypt the incoming data (preserving existing encryption logic)
    let decryptedData;
    if (requestData.encryptedData) {
      console.log('🔓 [AuthService] Decrypting signup data...');
      decryptedData = decryptData(requestData.encryptedData);
    } else {
      // Fallback to unencrypted data for backward compatibility
      decryptedData = requestData;
    }

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      otp,
      userType,
      companyDetails,
      role,
      gender,
      dob,
      pincode
    } = decryptedData;

    console.log('📝 [AuthService] Signup attempt for phone:', phone);

    // 1. Basic required fields validation (preserving exact validation)
    if (
      !name ||
      !phone ||
      !password ||
      !confirmPassword ||
      !otp ||
      !userType ||
      !gender ||
      !dob ||
      !pincode
    ) {
      throw new Error('Missing required fields');
    }

    // 2. Password match check
    if (password !== confirmPassword) {
      throw new Error('Password and Confirm Password do not match');
    }

    // 3. Corporate user validation
    if (userType === 'Corporate') {
      if (
        !companyDetails ||
        !companyDetails.companyName ||
        !companyDetails.gstNumber ||
        !companyDetails.address
      ) {
        throw new Error('Corporate details are required');
      }
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // 5. Admin role restriction (preserving exact validation)
    if ((role === 'admin' || role === 'tempAdmin') && (!email || !email.endsWith('@zyftoo.com'))) {
      const error = new Error('Only @zyftoo.com emails allowed for admin roles');
      error.statusCode = 403;
      throw error;
    }

    // 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Email verification token
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');

    // 8. Prepare user data (preserving exact structure)
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      userType,
      role: role || 'user',
      gender,
      dob,
      pincode,
      companyDetails: userType === 'corporate' ? {
        companyName: companyDetails.companyName,
        gstNumber: companyDetails.gstNumber,
        address: companyDetails.address
      } : undefined,
      isEmailVerified: false,
      emailVerificationToken
    });

    await newUser.save();

    // 9. Send verification email (preserving exact email logic)
    const verificationUrl = `http://localhost:5000/api/auth/verify-email/${emailVerificationToken}`;
    console.log(`🔗 [AuthService] Email verification URL: ${verificationUrl}`);

    const html = `
      <p>Hi ${newUser.name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `;

    await sendEmail({
      to: newUser.email,
      subject: 'Verify your email for Zyftoo',
      html,
    });

    // 10. Remove OTP (preserving exact cleanup logic)
    await OTP.deleteMany({ phone, purpose: 'signup' });

    console.log('✅ [AuthService] Registration completed successfully');

    return {
      success: true,
      message: 'User registered successfully. Verification email sent.',
      emailVerificationToken // for dev testing
    };
  }

  /**
   * User Login Service
   * Handles authentication for all user types (phone or email)
   */
  async login(requestData) {
    console.log('🔄 [AuthService] Processing login via centralized service');
    console.log('📦 [AuthService] Raw request data keys:', Object.keys(requestData));
    
    // Decrypt the incoming data (preserving existing decryption logic)
    let decryptedData;
    if (requestData.encryptedData) {
      console.log('🔓 [AuthService] Attempting to decrypt login data...');
      console.log('📝 [AuthService] Encrypted data received:', requestData.encryptedData);
      
      try {
        decryptedData = decryptData(requestData.encryptedData);
        console.log('✅ [AuthService] Decryption successful:', decryptedData);
      } catch (decryptError) {
        console.error('❌ [AuthService] Decryption failed:', decryptError.message);
        throw decryptError;
      }
    } else {
      console.log('⚠️ [AuthService] No encrypted data found, using fallback...');
      decryptedData = requestData;
    }

    const { phone, email, password, userType } = decryptedData;
    console.log('📱 [AuthService] Extracted phone:', phone);
    console.log('� [AuthService] Extracted email:', email);
    console.log('👤 [AuthService] Extracted userType:', userType);
    console.log('�🔑 [AuthService] Password length:', password?.length || 0);

    if ((!phone && !email) || !password) {
      console.log('❌ [AuthService] Missing login credentials');
      throw new Error('Phone/Email and password are required');
    }

    // Build query based on available credentials
    let query = {};
    if (email && userType === 'Corporate') {
      console.log('🔍 [AuthService] Corporate email login for:', email);
      query = { email, userType: 'Corporate' };
    } else if (phone) {
      console.log('🔍 [AuthService] Phone login for:', phone);
      query = { phone };
    } else {
      console.log('❌ [AuthService] Invalid login method');
      throw new Error('Invalid login credentials');
    }

    console.log('🔍 [AuthService] Looking up user with query:', query);
    const user = await User.findOne(query);
    
    if (!user) {
      console.log('❌ [AuthService] User not found for query:', query);
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    console.log('✅ [AuthService] User found:', user.name);
    console.log('🔐 [AuthService] Comparing passwords...');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ [AuthService] Password does not match');
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }

    console.log('✅ [AuthService] Password matches, generating token...');
    
    // Generate JWT token (preserving exact token structure)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    console.log('✅ [AuthService] Token generated successfully');

    // Return user data (preserving exact response structure)
    return {
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
    };
  }

  /**
   * Password Reset Service
   */
  async resetPassword(requestData) {
    console.log('🔄 [AuthService] Processing password reset via centralized service');
    
    // Decrypt the incoming data (preserving existing decryption logic)
    let decryptedData;
    if (requestData.encryptedData) {
      console.log('🔓 [AuthService] Decrypting password reset data...');
      decryptedData = decryptData(requestData.encryptedData);
    } else {
      // Fallback to unencrypted data for backward compatibility
      decryptedData = requestData;
    }

    const { phone, newPassword } = decryptedData;
    console.log('🔄 [AuthService] Password reset attempt for phone:', phone);

    if (!phone || !newPassword) {
      throw new Error('Phone and new password are required.');
    }

    // Step 1: Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    // Step 2: Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Step 3: Update password only
    user.password = hashedPassword;
    await user.save();

    // Step 4: Clear OTPs related to password reset (optional but safe)
    await OTP.deleteMany({ phone, purpose: 'reset' });

    console.log('✅ [AuthService] Password reset completed successfully');

    // Step 5: Return success response
    return {
      success: true,
      message: 'Password updated successfully.'
    };
  }

  /**
   * Email Verification Service
   */
  async verifyEmail(token) {
    console.log('🔄 [AuthService] Processing email verification via centralized service');
    console.log('📧 [AuthService] Verification token:', token);

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;

    await user.save();

    const updatedUser = await User.findById(user._id); // confirm save
    console.log('✅ [AuthService] Email verified. Current DB state:', updatedUser.emailVerified);

    return {
      message: 'Email verified successfully'
    };
  }

  /**
   * Check User Existence Service (by phone)
   */
  async checkUserExists(phone) {
    console.log('🔄 [AuthService] Checking user existence for phone:', phone);
    
    const user = await User.findOne({ phone });
    const exists = !!user;
    
    console.log('🔍 [AuthService] User exists:', exists);
    
    return {
      exists
    };
  }

  /**
   * Check User Existence Service (by email)
   * For corporate user flow
   */
  async checkUserByEmail(email) {
    console.log('🔄 [AuthService] Checking user existence for email:', email);
    
    const user = await User.findOne({ email });
    const exists = !!user;
    
    console.log('🔍 [AuthService] User exists by email:', exists);
    
    return {
      exists,
      userType: user ? user.userType : null,
      userId: user ? user._id : null,
      phone: user ? user.phone : null
    };
  }
}

// Export single instance (Singleton pattern)
module.exports = new AuthService();
