const OTP = require('../models/OTP');
const User = require('../models/User'); // ✅ ADD THIS
const { encryptData, decryptData } = require('../utils/cryptoUtil');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
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

    const { phone, purpose } = decryptedData;
    console.log('📲 OTP send request for phone:', phone, 'purpose:', purpose);

    if (!phone || !purpose) {
      return res.status(400).json({ success: false, error: 'Phone and purpose are required' });
    }

    try {
      // ✅ Check if user already exists when purpose is "signup"
      if (purpose === 'signup') {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
          return res.status(409).json({ success: false, error: 'User already exists' });
        }
      }

      const otp = generateOTP();
      console.log(`📲 Generating OTP for ${phone} with purpose: ${purpose}`);

      await OTP.create({ phone, otp, purpose });

      console.log(`📲 OTP for ${phone}: ${otp}`);

      return res.status(200).json({ success: true, message: 'OTP sent successfully' });
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

    const { phone, otp, purpose } = decryptedData;
    console.log('✅ OTP verification for phone:', phone, 'purpose:', purpose);

    if (!phone || !otp || !purpose) {
      return res.status(400).json({ success: false, error: 'Phone, OTP, and purpose are required' });
    }

    try {
      const existingOtp = await OTP.findOne({ phone, otp, purpose });

      if (!existingOtp) {
        return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
      }

      console.log(`✅ OTP verified for ${phone} with purpose: ${purpose}`);

      // ✅ Just verify, don't create user
      await OTP.deleteMany({ phone, purpose }); // optional: cleanup OTPs

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

