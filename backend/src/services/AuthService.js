const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { encryptData } = require('../utils/cryptoUtil');

class AuthService {
  /**
   * User Registration Service
   */
  async register(requestData) {
    console.log('🔄 [AuthService] Processing registration via centralized service');

    // Data is already decrypted
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
    } = requestData;

    console.log('📝 [AuthService] Signup attempt for:', userType === 'Corporate' ? `email: ${email}` : `phone: ${phone}`);

    // 1. Basic required fields validation (modified for corporate users)
    if (
      !name ||
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

    // Additional validation based on userType
    if (userType === 'Corporate') {
      if (!email) throw new Error('Corporate signup requires email');
      if (!phone) throw new Error('Corporate signup requires phone');
    } else {
      if (!phone) throw new Error('Individual signup requires phone');
    }

    // 2. Password validation
    if (password !== confirmPassword) {
      throw new Error('Password and Confirm Password do not match');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // 3. Verify OTP before proceeding with registration
    console.log('🔍 [AuthService] Verifying OTP before registration...');
    let otpQuery = { otp, purpose: 'signup' };
    if (userType === 'Corporate') {
      otpQuery.email = email;
    } else {
      otpQuery.phone = phone;
    }
    const validOTP = await OTP.findOne(otpQuery);
    if (!validOTP) {
      throw new Error('Invalid or expired OTP');
    }

    // 4. Corporate user validation (if needed)
    // ...your corporate-specific logic...

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      userType,
      companyDetails,
      role,
      gender,
      dob,
      pincode
    });

    await user.save();

    // 7. Remove OTP after use
    await OTP.deleteOne({ _id: validOTP._id });

    // 8. Return success
    return {
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType
      }
    };
  }

  /**
   * User Login Service
   */
  async login(requestData) {
    console.log('🔄 [AuthService] Processing login via centralized service');
    const { phone, email, password, userType } = requestData;

    let user;
    if (["Admin", "SuperAdmin", "Corporate"].includes(userType)) {
      if (!email) throw new Error('Email is required');
      user = await User.findOne({ email, userType });
    } else if (userType === "Individual") {
      if (!phone) throw new Error('Phone is required');
      user = await User.findOne({ phone, userType });
    } else {
      throw new Error('Invalid userType');
    }

    if (!user) {
      throw { statusCode: 401, message: 'User not found or userType mismatch' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid credentials' };
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, userType: user.userType, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        role: user.role
      }
    };
  }

  /**
   * Password Reset Service
   */
  async resetPassword(requestData) {
    console.log('🔄 [AuthService] Processing password reset via centralized service');
    const { phone, email, newPassword, userType } = requestData;

    let user;
    if (["Admin", "SuperAdmin", "Corporate"].includes(userType)) {
      if (!email) throw new Error('Email is required');
      user = await User.findOne({ email, userType });
    } else if (userType === "Individual") {
      if (!phone) throw new Error('Phone is required');
      user = await User.findOne({ phone, userType });
    } else {
      throw new Error('Invalid userType');
    }

    if (!user) {
      throw { statusCode: 404, message: 'User not found' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return {
      success: true,
      message: 'Password reset successful'
    };
  }

  /**
   * Email Verification Service
   */
  async verifyEmail(token) {
    // ...your email verification logic...
    return { success: true, message: 'Email verified (stub)' };
  }

  /**
   * Check User Existence Service (by phone)
   */
  async checkUserExists(phone) {
    const user = await User.findOne({ phone });
    return { exists: !!user };
  }

  /**
   * Check User Existence Service (by email)
   */
  async checkUserByEmail(email) {
    const user = await User.findOne({ email });
    return { exists: !!user };
  }
}

module.exports = new AuthService();