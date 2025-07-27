const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true }, // Relative path from public folder
  url: { type: String, required: true }, // Full URL to access the file
  category: { type: String, enum: ['category', 'subcategory', 'product', 'other'], default: 'other' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  alt: { type: String, default: '' }, // Alt text for accessibility
  status: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
