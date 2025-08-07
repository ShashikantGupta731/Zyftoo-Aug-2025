const OTP = require('../models/OTP');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { encryptData, decryptData } = require('../utils/cryptoUtil');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Helper function to send OTP via email
const sendOTPEmail = async (email, otp, purpose) => {
  const subject = purpose === 'signup' ? 'Verify Your Corporate Registration' : 'Password Reset OTP';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your OTP Code</h2>
      <p>Your verification code is:</p>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in 5 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    html
  });
};

exports.sendOtp = async (req, res) => {
  try {
    console.log('📲 OTP send request received');
    console.log('📦 Request body:', req.body);
    
    // ✅ UPDATE: Expect decrypted data directly
    // Since middleware has already decrypted the data
    const { phone, email, purpose, userType } = req.body;
    
    // Validate required fields
    if (!purpose) {
      return res.status(400).json({ 
        success: false,
        message: 'Purpose is required' 
      });
    }

    console.log(`📲 OTP send request for ${email ? `email: ${email}` : `phone: ${phone}`} purpose: ${purpose} userType: ${userType || 'Individual'}`);

    // Validate based on userType
    if (userType === 'Corporate') {
      if (!email) {
        return res.status(400).json({ 
          success: false,
          message: 'Email is required for Corporate users' 
        });
      }
    } else {
      if (!phone) {
        return res.status(400).json({ 
          success: false,
          message: 'Phone is required for Individual users' 
        });
      }
    }

    // Generate 6-digit OTP
    const otpCode = generateOTP();
    console.log(`📲 Generated OTP: ${otpCode} for ${email || phone}`);

    // Create OTP record
    const otpData = {
      otp: otpCode,
      purpose: purpose || 'signup'
    };

    if (email) {
      otpData.email = email;
      // Clear existing OTPs for this email
      await OTP.deleteMany({ email, purpose: otpData.purpose });
    }
    if (phone) {
      otpData.phone = phone;
      // Clear existing OTPs for this phone
      await OTP.deleteMany({ phone, purpose: otpData.purpose });
    }

    // Save new OTP
    const newOTP = new OTP(otpData);
    await newOTP.save();

    // Send OTP via appropriate channel
    if (userType === 'Corporate' && email) {
      // Send OTP via email for corporate users
      console.log(`📧 Sending OTP to email: ${email}`);
      await sendOTPEmail(email, otpCode, purpose);
    } else if (phone) {
      // Send OTP via SMS for individual users (for now just log it)
      console.log(`📲 OTP for phone ${phone}: ${otpCode}`);
      // TODO: Implement SMS sending
    }

    res.json({
      success: true,
      message: userType === 'Corporate' ? 
        'OTP sent to your email address' : 
        'OTP sent to your phone number'
    });

  } catch (error) {
    console.error('❌ Send OTP error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to send OTP'
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    console.log('🔍 Verifying OTP...');
    console.log('📦 Request body:', req.body);
    
    // ✅ UPDATE: Expect decrypted data directly
    const { phone, email, otp, purpose, userType } = req.body;
    
    // Validate required fields
    if (!otp || !purpose) {
      return res.status(400).json({ 
        success: false,
        message: 'OTP and purpose are required' 
      });
    }

    console.log(`✅ OTP verification for ${email ? `email: ${email}` : `phone: ${phone}`} purpose: ${purpose}`);

    // Build query based on userType
    let query = { otp, purpose: purpose || 'signup' };
    
    if (userType === 'Corporate' && email) {
      query.email = email;
    } else if (phone) {
      query.phone = phone;
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification parameters' 
      });
    }

    const otpRecord = await OTP.findOne(query);

    if (!otpRecord) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }

    // Check if OTP is expired (5 minutes)
    const otpAge = Date.now() - otpRecord.createdAt.getTime();
    if (otpAge > 5 * 60 * 1000) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired' 
      });
    }

    // OTP is valid
    console.log(`✅ OTP verified successfully for ${email || phone}`);

    // Don't delete OTP here as it might be needed by the registration process
    // It will be deleted after successful registration

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'OTP verification failed'
    });
  }
};