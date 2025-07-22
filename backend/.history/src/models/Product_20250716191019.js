const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  short_description: { type: String },
  description: { type: String, required: true },

  // Pricing
  price: { type: Number, required: true },
  compare_price: { type: Number },
  cost_price: { type: Number },
  sale_price: { type: Number },
  discount: { type: String }, // e.g., "20% off"

  // Inventory
  sku: { type: String },
  quantity: { type: Number, default: 0 },
  stock_status: {
    type: String,
    enum: ['in_stock', 'out_of_stock'],
    default: 'in_stock'
  },
  type: {
    type: String,
    enum: ['simple', 'variable'],
    default: 'simple'
  },
  unit: { type: String },
  weight: { type: Number },
  requires_shipping: { type: Boolean, default: true },
  available_from: { type: Date },
  available_to: { type: Date },

  // Categories & Tags
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  selectedCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  selectedSubcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: String }],

  // Product Relations
  related_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cross_sell_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  is_random_related_products: { type: Boolean, default: false },

  // Images
  images: [{ type: String }], // URLs
  product_thumbnail_id: { type: String },
  product_galleries_id: [{ type: String }],
  size_chart_image_id: { type: String },

  // SEO
  meta_title: { type: String },
  meta_description: { type: String },
  product_meta_image_id: { type: String },

  // Shipping & Tax
  is_free_shipping: { type: Boolean, default: false },
  tax_id: { type: String }, // could be ref if taxes are stored
  estimated_delivery_text: { type: String },
  return_policy_text: { type: String },

  // Flags
  is_featured: { type: Boolean, default: false },
  is_popular: { type: Boolean, default: false },
  is_trending: { type: Boolean, default: false },
  is_return: { type: Boolean, default: false },
  status: { type: Boolean, default: true }, // published/unpublished

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
