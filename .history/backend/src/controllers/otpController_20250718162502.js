const OTP = require('../models/OTP');
const User = require('../models/User'); // ✅ ADD THIS
const { encryptData, decryptData } = require('../utils/cryptoUtil');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

exports.sendOtp = async (req, res) => {
  const { phone, purpose } = req.body;

  if (!phone || !purpose) {
    return res.status(400).json({ error: 'Phone and purpose are required' });
  }

  try {
    // ✅ Check if user already exists when purpose is "signup"
    if (purpose === 'signup') {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }
    }

    const otp = generateOTP();
    console.log(`📲 Generating OTP for ${phone} with purpose: ${purpose}`);

    await OTP.create({ phone, otp, purpose });

    console.log(`📲 OTP for ${phone}: ${otp}`);

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('❌ Error sending OTP:', error.message);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  console.log('🔍 Verifying OTP...');
  const { phone, otp, purpose } = req.body;

  if (!phone || !otp || !purpose) {
    return res.status(400).json({ error: 'Phone, OTP, and purpose are required' });
  }

  try {
    const existingOtp = await OTP.findOne({ phone, otp, purpose });

    if (!existingOtp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    console.log(`✅ OTP verified for ${phone} with purpose: ${purpose}`);

    // ✅ Just verify, don't create user
    await OTP.deleteMany({ phone, purpose }); // optional: cleanup OTPs

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('❌ Error verifying OTP:', error.message);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

