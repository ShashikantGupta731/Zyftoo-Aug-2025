const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  short_description: { type: String },
  description: { type: String, required: true },

  // Legacy Pricing (kept for backward compatibility)
  price: { type: Number, required: true },
  compare_price: { type: Number },
  cost_price: { type: Number },
  sale_price: { type: Number },
  discount: { type: String },

  // New Retail Pricing Structure
  retailPrice: {
    mrp: { 
      type: Number,
      default: function() { return this.price || 0; }
    },
    sellingPrice: { 
      type: Number,
      default: function() { return this.price || 0; }
    },
    discount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' }
  },

  // Corporate/Bulk Pricing
  corporatePricing: {
    enabled: { type: Boolean, default: false },
    minimumOrderQuantity: { type: Number, default: 1 },
    priceTiers: [{
      minQuantity: { type: Number, required: true },
      maxQuantity: { type: Number }, // null means no upper limit
      pricePerUnit: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      description: { type: String } // e.g., "Best value for large orders"
    }],
    customQuoteThreshold: { type: Number } // Quantity above which to show "Request Quote"
  },

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
  tags: [{ type: String }],

  // Images
  images: [{ type: String }],
  product_thumbnail_id: { type: String },
  product_galleries_id: [{ type: String }],
  size_chart_image_id: { type: String },

  // SEO
  meta_title: { type: String },
  meta_description: { type: String },
  product_meta_image_id: { type: String },

  // Shipping & Tax
  is_free_shipping: { type: Boolean, default: false },
  tax_id: { type: String },
  estimated_delivery_text: { type: String },
  return_policy_text: { type: String },

  // Flags
  is_featured: { type: Boolean, default: false },
  is_popular: { type: Boolean, default: false },
  is_trending: { type: Boolean, default: false },
  is_return: { type: Boolean, default: false },
  status: { type: Boolean, default: true },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
