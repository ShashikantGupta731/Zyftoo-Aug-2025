  const User = require('../models/User');
  const OTP = require('../models/OTP');
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const crypto = require('crypto');
  const sendEmail = require('../utils/sendEmail');
  const { encryptData, decryptData } = require('../utils/cryptoUtil');

  // ✅ SIGNUP CONTROLLER
const signupUser = async (req, res) => {
  try {
    // Decrypt the incoming data
    let decryptedData;
    if (req.body.encryptedData) {
      console.log('🔓 Decrypting signup data...');
      decryptedData = decryptData(req.body.encryptedData);
    } else {
      // Fallback to unencrypted data for backward compatibility
      decryptedData = req.body;
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

    console.log('📝 Signup attempt for phone:', phone);

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
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 2. Password match check
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Password and Confirm Password do not match' });
  }

  // 3. Corporate user validation
  if (userType === 'corporate') {
    if (
      !companyDetails ||
      !companyDetails.companyName ||
      !companyDetails.gstNumber ||
      !companyDetails.address
    ) {
      return res.status(400).json({ error: 'Corporate details are required' });
    }
  }

  try {
    // 4. Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 5. Admin role restriction
    if ((role === 'admin' || role === 'tempAdmin') && (!email || !email.endsWith('@zyftoo.com'))) {
      return res.status(403).json({ error: 'Only @zyftoo.com emails allowed for admin roles' });
    }

    // 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Email verification token
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');

    // 8. Prepare user data
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

    // 9. Send verification email
    const verificationUrl = `http://localhost:5000/api/auth/verify-email/${emailVerificationToken}`;
    console.log(`🔗 Email verification URL: ${verificationUrl}`);

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

    // 10. Remove OTP
    await OTP.deleteMany({ phone, purpose: 'signup' });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Verification email sent.',
      emailVerificationToken // for dev testing
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, error: 'Signup failed' });
  }
  } catch (decryptionError) {
    console.error('Decryption error:', decryptionError);
    return res.status(400).json({ success: false, error: 'Invalid encrypted data' });
  }
};


  // ✅ LOGIN CONTROLLER
  const loginUser = async (req, res) => {
    try {
      // Decrypt the incoming data
      let decryptedData;
      if (req.body.encryptedData) {
        console.log('🔓 Decrypting login data...');
        decryptedData = decryptData(req.body.encryptedData);
      } else {
        // Fallback to unencrypted data for backward compatibility
        decryptedData = req.body;
      }

      const { phone, password } = decryptedData;
      console.log('🔍 Login attempt with phone:', phone);

      if (!phone || !password) {
        return res.status(400).json({ success: false, error: 'Phone and password are required' });
      }

      try {
        const user = await User.findOne({ phone });
        if (!user) {
          return res.status(401).json({ success: false, error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ success: false, error: 'Invalid password' });
        }

        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
        );

        return res.status(200).json({
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
        });
      } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ success: false, error: 'Login failed' });
      }
    } catch (decryptionError) {
      console.error('Login decryption error:', decryptionError);
      return res.status(400).json({ success: false, error: 'Invalid encrypted data' });
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
