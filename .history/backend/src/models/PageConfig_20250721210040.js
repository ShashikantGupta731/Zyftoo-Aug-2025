const mongoose = require('mongoose');

// Schema for individual section configuration
const SectionConfigSchema = new mongoose.Schema({
  sectionType: {
    type: String,
    required: true,
    enum: ['categorySection', 'bannerSection', 'dealSection', 'productSection', 'sliderSection']
  },
  enabled: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  config: {
    type: mongoose.Schema.Types.Mixed, // Flexible config object for each section type
    default: {}
  }
}, {
  _id: false // Don't create separate _id for subdocuments
});

// Main page configuration schema
const PageConfigSchema = new mongoose.Schema({
  _id: {
    type: String, // Use string ID like "home", "corporate" etc.
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  sections: [SectionConfigSchema],
  lastModified: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Update lastModified on save
PageConfigSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

module.exports = mongoose.model('PageConfig', PageConfigSchema);
