// models/CorporateEmployeeList.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  address: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
});

const corporateEmployeeListSchema = new mongoose.Schema({
  corporateUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deliveryMode: { type: String, enum: ['office', 'employee'], default: 'employee' },
  employees: [employeeSchema],
  expiresAt: { type: Date, default: () => Date.now() + 1000 * 60 * 60 * 24 } // 24hr TTL
});

module.exports = mongoose.model('CorporateEmployeeList', corporateEmployeeListSchema);
