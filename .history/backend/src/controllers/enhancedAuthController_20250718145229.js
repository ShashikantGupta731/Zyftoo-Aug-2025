const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { generateToken } = require('../middleware/authMiddleware');

// ✅ ENHANCED SIGNUP CONTROLLER WITH ENCRYPTION SUPPORT
const signupUser = async (req, res) => {
  try {
    // Use decryptedBody if available, otherwise use body
    const data = req.decryptedBody || req.body;
    
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
    } = data;

    console.log('🔍 Signup attempt for phone:', phone);

    // 1. Basic required fields validation
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
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields',
        required: ['name', 'phone', 'password', 'confirmPassword', 'otp', 'userType', 'gender', 'dob', 'pincode']
      });
    }

    // 2. Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        error: 'Password and Confirm Password do not match' 
      });
    }

    // 3. Corporate user validation
    if (userType === 'corporate') {
      if (
        !companyDetails ||
        !companyDetails.companyName ||
        !companyDetails.gstNumber ||
        !companyDetails.address
      ) {
        return res.status(400).json({ 
          success: false,
          error: 'Corporate details are required',
          required: ['companyDetails.companyName', 'companyDetails.gstNumber', 'companyDetails.address']
        });
      }
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: 'User already exists with this phone number' 
      });
    }

    // 5. Admin role restriction
    if ((role === 'admin' || role === 'tempAdmin') && (!email || !email.endsWith('@zyftoo.com'))) {
      return res.status(403).json({ 
        success: false,
        error: 'Only @zyftoo.com emails allowed for admin roles' 
      });
    }

    // 6. Verify OTP before creating user
    const validOTP = await OTP.findOne({ 
      phone, 
      otp,
      purpose: 'registration',
      expiresAt: { $gt: new Date() }
    });

    if (!validOTP) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid or expired OTP' 
      });
    }

    // 7. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 8. Email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // 9. Prepare user data
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

    // 10. Delete used OTP
    await OTP.deleteOne({ phone, otp });

    // 11. Generate JWT token
    const token = generateToken(newUser._id);

    // 12. Send verification email if email provided
    if (email) {
      try {
        const verificationUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/verify-email/${emailVerificationToken}`;
        
        await sendEmail({
          to: email,
          subject: 'Verify Your Email - Ninico',
          html: `
            <h2>Welcome to Ninico!</h2>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>If you didn't create this account, please ignore this email.</p>
          `
        });
        
        console.log(`📧 Verification email sent to: ${email}`);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail the registration if email fails
      }
    }

    // 13. Return success response (encrypted)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        userType: newUser.userType,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified
      }
    });

  } catch (error) {
    console.error('🚨 Signup error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Registration failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// ✅ ENHANCED LOGIN CONTROLLER WITH ENCRYPTION SUPPORT
const loginUser = async (req, res) => {
  try {
    // Use decryptedBody if available, otherwise use body
    const data = req.decryptedBody || req.body;
    const { phone, email, password } = data;
    
    console.log('🔍 Login attempt for:', phone || email);

    if ((!phone && !email) || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Phone/Email and password are required' 
      });
    }

    // Find user by phone or email
    const query = phone ? { phone } : { email };
    const user = await User.findOne(query);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return success response (encrypted)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        profileComplete: !!(user.name && user.email && user.phone)
      }
    });

  } catch (error) {
    console.error('🚨 Login error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Login failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// ✅ ENHANCED EMAIL VERIFICATION
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid or expired verification token' 
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Email verification failed' 
    });
  }
};

// ✅ FORGOT PASSWORD WITH ENCRYPTION SUPPORT
const forgotPassword = async (req, res) => {
  try {
    const data = req.decryptedBody || req.body;
    const { email } = data;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found with this email' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Password Reset - Ninico',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to process password reset request' 
    });
  }
};

// ✅ RESET PASSWORD WITH ENCRYPTION SUPPORT
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const data = req.decryptedBody || req.body;
    const { password } = data;

    if (!password) {
      return res.status(400).json({ 
        success: false,
        error: 'Password is required' 
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid or expired reset token' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to reset password' 
    });
  }
};

// ✅ GET USER PROFILE WITH ENCRYPTION SUPPORT
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        role: user.role,
        gender: user.gender,
        dob: user.dob,
        pincode: user.pincode,
        companyDetails: user.companyDetails,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to get user profile' 
    });
  }
};

module.exports = {
  signupUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getUserProfile
};
