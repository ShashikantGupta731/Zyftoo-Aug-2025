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
    // Decrypt the incoming data
    let decryptedData;
    if (req.body.encryptedData) {
      console.log('🔓 Decrypting OTP send data...');
      decryptedData = decryptData(req.body.encryptedData);
    } else {
      // Fallback to unencrypted data for backward compatibility
      decryptedData = req.body;
    }

    const { phone, email, purpose, userType } = decryptedData;
    console.log(`📲 OTP send request for ${email ? `email: ${email}` : `phone: ${phone}`} purpose: ${purpose} userType: ${userType}`);

    if ((!phone && !email) || !purpose) {
      return res.status(400).json({ success: false, error: 'Phone/Email and purpose are required' });
    }

    // Validate based on userType
    if (userType === 'Corporate') {
      if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required for Corporate users' });
      }
    } else {
      if (!phone) {
        return res.status(400).json({ success: false, error: 'Phone is required for Individual users' });
      }
    }

    try {
      // Check if user already exists when purpose is "signup"
      if (purpose === 'signup') {
        let existingUser;
        if (userType === 'Corporate' && email) {
          existingUser = await User.findOne({ email });
        } else if (phone) {
          existingUser = await User.findOne({ phone });
        }
        
        if (existingUser) {
          return res.status(409).json({ success: false, error: 'User already exists' });
        }
      }

      const otp = generateOTP();
      console.log(`📲 Generating OTP for ${email || phone} with purpose: ${purpose}`);

      // Create OTP record
      const otpData = {
        otp,
        purpose,
        userType: userType || 'Individual'
      };

      if (email) {
        otpData.email = email;
      }
      if (phone) {
        otpData.phone = phone;
      }

      // Clear existing OTPs
      if (email) {
        await OTP.deleteMany({ email, purpose });
      }
      if (phone) {
        await OTP.deleteMany({ phone, purpose });
      }

      // Save new OTP
      await OTP.create(otpData);

      // Send OTP via appropriate channel
      if (userType === 'Corporate' && email) {
        console.log(`📧 OTP for ${email}: ${otp}`);
        await sendOTPEmail(email, otp, purpose);
      } else if (phone) {
        console.log(`📲 OTP for ${phone}: ${otp}`);
        // SMS sending logic would go here
      }

      const message = userType === 'Corporate' ? 
        'OTP sent to your email address' : 
        'OTP sent to your phone number';

      return res.status(200).json({ success: true, message });
    } catch (error) {
      console.error('❌ Error sending OTP:', error.message);
      return res.status(500).json({ success: false, error: 'Failed to send OTP' });
    }
  } catch (decryptionError) {
    console.error('OTP send decryption error:', decryptionError);
    return res.status(400).json({ success: false, error: 'Invalid encrypted data' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    console.log('🔍 Verifying OTP...');
    
    // Decrypt the incoming data
    let decryptedData;
    if (req.body.encryptedData) {
      console.log('🔓 Decrypting OTP verification data...');
      decryptedData = decryptData(req.body.encryptedData);
    } else {
      // Fallback to unencrypted data for backward compatibility
      decryptedData = req.body;
    }

    const { phone, email, otp, purpose, userType } = decryptedData;
    console.log(`✅ OTP verification for ${email ? `email: ${email}` : `phone: ${phone}`} purpose: ${purpose}`);

    if ((!phone && !email) || !otp || !purpose) {
      return res.status(400).json({ success: false, error: 'Phone/Email, OTP, and purpose are required' });
    }

    try {
      // Build query based on userType
      let query = { otp, purpose };
      
      if (userType === 'Corporate' && email) {
        query.email = email;
      } else if (phone) {
        query.phone = phone;
      } else {
        return res.status(400).json({ success: false, error: 'Invalid verification parameters' });
      }

      const existingOtp = await OTP.findOne(query);

      if (!existingOtp) {
        return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
      }

      console.log(`✅ OTP verified for ${email || phone} with purpose: ${purpose}`);

      // Delete OTP after successful verification
      if (email) {
        await OTP.deleteMany({ email, purpose });
      }
      if (phone) {
        await OTP.deleteMany({ phone, purpose });
      }

      return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
      console.error('❌ Error verifying OTP:', error.message);
      return res.status(500).json({ success: false, error: 'Failed to verify OTP' });
    }
  } catch (decryptionError) {
    console.error('OTP verification decryption error:', decryptionError);
    return res.status(400).json({ success: false, error: 'Invalid encrypted data' });
  }
};

