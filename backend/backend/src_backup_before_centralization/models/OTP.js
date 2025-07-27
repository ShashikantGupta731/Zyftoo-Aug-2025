const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['signup', 'reset'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300  // TTL: expires after 5 minutes
  }
});

module.exports = mongoose.model('OTP', otpSchema);
