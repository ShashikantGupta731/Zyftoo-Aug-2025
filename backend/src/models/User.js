const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true
  },
  phone: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['SuperAdmin', 'Admin', 'Individual', 'Corporate'],
    default: 'Individual'
  },
  status: {
    type: String,
    enum: ['Active', 'Blocked'],
    default: 'Active'
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'tempAdmin'],
    default: 'user'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others']
  },
  dob: {
    type: Date
  },
  pincode: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  companyDetails: {
    companyName: String,
    gstNumber: String,
    address: String
  },
  deleted: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
