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

  // Corporate Specific
  is_corporate_only: {
    type: Boolean,
    default: false
  },

  // Inventory
  sku: { type: String },
  quantity: { type: Number, default: 0 },
  stock_status: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'pre_order', 'back_order'],
    default: 'in_stock'
  },
  type: {
    type: String,
    enum: ['simple', 'variable', 'grouped'],
    default: 'simple'
  },
  unit: { type: String },
  weight: { type: Number },
  requires_shipping: { type: Boolean, default: true },
  available_from: { type: Date },
  available_to: { type: Date },

  // Product Variations (for variable products)
  variations: [{
    variation_name: String,
    sku: String,
    quantity: Number,
    price: Number,
    sale_price: Number,
    discount: String,
    attributes: [{
      name: String, // Color, Size, etc.
      value: String // Red, Large, etc.
    }]
  }],

  // Categories & Tags
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: String }],

  // Product Relations
  related_products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  cross_sell_products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  is_random_related_products: { 
    type: Boolean, 
    default: false 
  },

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

  // Additional Business Features
  safe_checkout: { type: Boolean, default: true },
  secure_checkout: { type: Boolean, default: true },
  social_share: { type: Boolean, default: true },
  encourage_order: { type: Boolean, default: false },
  encourage_view: { type: Boolean, default: false },

  // Reviews & Ratings
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    isVerifiedBuyer: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },

  // Sales Analytics
  sales_count: {
    type: Number,
    default: 0
  },

  // Admin Management
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  },

  // NEW: Analytics and tracking (completely optional - no breaking changes)
  analytics: {
    views: {
      total: { type: Number, default: 0 },
      individual: { type: Number, default: 0 }, // Individual user views
      corporate: { type: Number, default: 0 },   // Corporate user views
      anonymous: { type: Number, default: 0 }    // Non-logged-in views
    },
    lastViewed: { type: Date },
    popularityScore: { type: Number, default: 0 }, // Calculated score
    dailyViews: [{
      date: { type: Date },
      count: { type: Number, default: 0 },
      userTypes: {
        individual: { type: Number, default: 0 },
        corporate: { type: Number, default: 0 },
        anonymous: { type: Number, default: 0 }
      }
    }],
    weeklyViews: { type: Number, default: 0 },
    monthlyViews: { type: Number, default: 0 }
  },

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Virtual properties for backward compatibility
productSchema.virtual('displayPrice').get(function() {
  return this.retailPrice?.sellingPrice || this.price || 0;
});

productSchema.virtual('hasActiveCorporatePricing').get(function() {
  return this.corporatePricing?.enabled && 
         this.corporatePricing?.priceTiers && 
         this.corporatePricing.priceTiers.length > 0;
});

// Virtual for popularity ranking
productSchema.virtual('popularityRank').get(function() {
  const totalViews = this.analytics?.views?.total || 0;
  const recentViews = this.analytics?.weeklyViews || 0;
  const corporateViews = this.analytics?.views?.corporate || 0;
  
  // Weighted popularity score (recent views count more, corporate views have higher weight)
  return (totalViews * 0.3) + (recentViews * 0.5) + (corporateViews * 0.2);
});

// Additional useful virtuals
productSchema.virtual('isOnSale').get(function() {
  return this.sale_price && this.sale_price < this.price;
});

productSchema.virtual('finalPrice').get(function() {
  return this.sale_price || this.retailPrice?.sellingPrice || this.price;
});

productSchema.virtual('isInStock').get(function() {
  return this.quantity > 0 && this.stock_status === 'in_stock';
});

productSchema.virtual('averageRating').get(function() {
  if (!this.reviews || this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10; // Round to 1 decimal
});

// Pre-save middleware for review calculations and timestamps
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Update review statistics
  if (this.reviews && this.reviews.length > 0) {
    this.numReviews = this.reviews.length;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = Math.round((sum / this.reviews.length) * 10) / 10;
  } else {
    this.numReviews = 0;
    this.rating = 0;
  }
  
  next();
});

// Add indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ categories: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ is_featured: 1, status: 1 });
productSchema.index({ is_popular: 1, status: 1 });
productSchema.index({ is_trending: 1, status: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ rating: -1 });
productSchema.index({ sales_count: -1 });
productSchema.index({ 'analytics.views.total': -1 });
productSchema.index({ 'analytics.popularityScore': -1 });

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
