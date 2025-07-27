const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  image: { 
    url: { type: String, default: null }, // Full URL to the image
    path: { type: String, default: null }, // File system path for deletion
    filename: { type: String, default: null } // Original filename
  },
  status: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
