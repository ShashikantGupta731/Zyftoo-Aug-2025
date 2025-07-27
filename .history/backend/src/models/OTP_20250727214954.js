const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: function() {
      return !this.email; // Phone required only if email is not provided
    }
  },
  email: {
    type: String,
    required: function() {
      return !this.phone; // Email required only if phone is not provided
    }
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['signup', 'reset', 'verification'],
    required: true
  },
  userType: {
    type: String,
    enum: ['Individual', 'Corporate', 'Admin', 'SuperAdmin'],
    default: 'Individual'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300  // TTL: expires after 5 minutes
  }
});

module.exports = mongoose.model('OTP', otpSchema);
