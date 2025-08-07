const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      short_description,
      description,
      price,
      compare_price,
      cost_price,
      sale_price,
      discount,
      // New retail pricing fields (optional)
      retailPrice,
      // Corporate pricing fields (optional)
      corporatePricing,
      sku,
      quantity,
      stock_status,
      type,
      unit,
      weight,
      requires_shipping,
      available_from,
      available_to,
      categories,
      tags,
      images,
      product_thumbnail_id,
      product_galleries_id,
      size_chart_image_id,
      meta_title,
      meta_description,
      product_meta_image_id,
      is_free_shipping,
      tax_id,
      estimated_delivery_text,
      return_policy_text,
      is_featured,
      is_popular,
      is_trending,
      is_return,
      status,
      // New fields from updated model
      variations,
      related_products,
      cross_sell_products,
      is_random_related_products,
      safe_checkout,
      secure_checkout,
      social_share,
      encourage_order,
      encourage_view,
      is_corporate_only
    } = req.body;

    // Required fields check
    if (!name || !description || !price || !categories || !categories.length) {
      return res.status(400).json({
        message: 'Missing required fields: name, description, price, or categories'
      });
    }

    const product = new Product({
      name,
      short_description,
      description,

      // Legacy Pricing (required for backward compatibility)
      price: parseFloat(price),
      compare_price,
      cost_price,
      sale_price,
      discount,

      // New Retail Pricing (optional, will default to legacy price)
      retailPrice: retailPrice ? {
        mrp: retailPrice.mrp || parseFloat(price),
        sellingPrice: retailPrice.sellingPrice || parseFloat(price),
        discount: retailPrice.discount || 0,
        currency: retailPrice.currency || 'INR'
      } : {
        mrp: parseFloat(price),
        sellingPrice: parseFloat(price),
        discount: 0,
        currency: 'INR'
      },

      // Corporate Pricing (optional)
      corporatePricing: corporatePricing ? {
        enabled: corporatePricing.enabled || false,
        minimumOrderQuantity: corporatePricing.minimumOrderQuantity || 1,
        priceTiers: corporatePricing.priceTiers || [],
        customQuoteThreshold: corporatePricing.customQuoteThreshold
      } : {
        enabled: false,
        minimumOrderQuantity: 1,
        priceTiers: []
      },

      // Inventory
      sku,
      quantity,
      stock_status,
      type: type || 'simple',
      unit,
      weight,
      requires_shipping,
      available_from,
      available_to,

      // Categories & Tags
      categories,
      tags,

      // Images
      images,
      product_thumbnail_id,
      product_galleries_id,
      size_chart_image_id,

      // SEO
      meta_title: meta_title || name,
      meta_description,
      product_meta_image_id,

      // Shipping & Tax
      is_free_shipping,
      tax_id,
      estimated_delivery_text,
      return_policy_text,

      // Flags
      is_featured,
      is_popular,
      is_trending,
      is_return,
      status,

      // New fields from updated model
      variations,
      related_products,
      cross_sell_products,
      is_random_related_products,
      safe_checkout,
      secure_checkout,
      social_share,
      encourage_order,
      encourage_view,
      is_corporate_only,
      createdBy: req.user?.id || req.adminUser?.id // Set admin who created the product
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct,
      product: savedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating product',
      error: error.message
    });
  }
});