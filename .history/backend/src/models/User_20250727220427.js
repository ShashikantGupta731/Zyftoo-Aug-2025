const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: function() {
      return this.userType === 'Corporate' || this.userType === 'Admin' || this.userType === 'SuperAdmin';
    },
    unique: true,
    sparse: true
  },
  phone: {
    type: String,
    required: function() {
      return this.userType === 'Individual' || this.userType === 'Corporate';
    },
    unique: true,
    sparse: true
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
    enum: ['male', 'female', 'others'],
    required: true
  },
  dob: {
    type: Date,
    required: true
  },
  pincode: {
    type: String,
    required: true
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
