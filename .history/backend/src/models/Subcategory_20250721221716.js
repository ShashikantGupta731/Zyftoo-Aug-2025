const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  image: {
    url: String,
    path: String,
    filename: String
  },
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
subcategorySchema.index({ parent: 1, status: 1 });
subcategorySchema.index({ name: 1 });

module.exports = mongoose.model('Subcategory', subcategorySchema);
