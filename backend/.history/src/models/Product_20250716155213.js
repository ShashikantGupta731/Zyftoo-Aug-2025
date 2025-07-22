const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // GeneralTab
  name: { type: String, required: true },
  short_description: { type: String, maxlength: 300 },
  compare_price: { type: Number }, // For showing discounts
  cost_price: { type: Number }, // For profit calculation
  description: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs or paths

  // InventoryTab
  type: { type: String, enum: ['simple', 'classified'], required: true },
  unit: { type: String },
  weight: { type: Number }, // in grams
  requires_shipping: { type: Boolean, default: true },
  stock_status: { type: String, enum: ['in_stock', 'out_of_stock'] },
  sku: { type: String },
  quantity: { type: Number },
  price: { type: Number },
  discount: { type: Number, min: 0, max: 100 },
  sale_price: { type: Number }, // auto-calculated
  available_from: { type: Date },
  available_to: { type: Date },
  variations: [{  // only for classified
    variation_name: String,
    sku: String,
    quantity: Number,
    price: Number,
    sale_price: Number,
    discount: Number
  }],

  // SetupTab
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  is_random_related_products: { type: Boolean, default: false },
  related_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cross_sell_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

  // ImagesTab
  product_thumbnail_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
  product_galleries_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }],
  size_chart_image_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },

  // SeoTab
  meta_title: { type: String },
  meta_description: { type: String },
  product_meta_image_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },

  // ShippingTaxTab
  is_free_shipping: { type: Boolean, default: false },
  tax_id: { type: String }, // Changed from ObjectId to String for now
  estimated_delivery_text: { type: String },
  return_policy_text: { type: String },

  // OptionsTab
  is_featured: { type: Boolean, default: false },
  is_popular: { type: Boolean, default: false },
  is_trending: { type: Boolean, default: false },
  is_return: { type: Boolean, default: false },
  status: { type: Boolean, default: true }, // true = active

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
