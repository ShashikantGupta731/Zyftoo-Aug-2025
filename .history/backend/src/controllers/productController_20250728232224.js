const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const { getProductPrice } = require('../utils/productPricing');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin only)
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

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      featured, 
      popular, 
      trending, 
      status = true,
      userType,
      corporateOnly,
      minPrice,
      maxPrice,
      stockStatus,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Status filter (default to active products)
    filter.status = status === 'true';
    
    // Category filter
    if (category) {
      filter.categories = { $in: [category] };
    }
    
    // Flag filters
    if (featured === 'true') filter.is_featured = true;
    if (popular === 'true') filter.is_popular = true;
    if (trending === 'true') filter.is_trending = true;
    
    // Corporate filter
    if (corporateOnly === 'true') {
      filter.is_corporate_only = true;
    } else if (userType !== 'corporate') {
      // Hide corporate-only products from individual users
      filter.is_corporate_only = { $ne: true };
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Stock status filter
    if (stockStatus) {
      filter.stock_status = stockStatus;
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { short_description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get products with pagination
    const products = await Product.find(filter)
      .populate([
        {
          path: 'categories',
          select: 'name slug parent',
          populate: {
            path: 'parent',
            model: 'Category',
            select: 'name slug'
          }
        },
        {
          path: 'related_products',
          select: 'name price images stock_status',
          match: { status: true }
        },
        {
          path: 'cross_sell_products',
          select: 'name price images stock_status',
          match: { status: true }
        }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    
    // Add calculated fields for frontend
    const enhancedProducts = products.map(product => {
      const productObj = product.toObject();
      
      // Add pricing summary
      productObj.pricingSummary = {
        hasRetailPrice: !!(productObj.retailPrice?.sellingPrice),
        hasCorporatePrice: !!(productObj.corporatePricing?.enabled),
        lowestPrice: productObj.retailPrice?.sellingPrice || productObj.price,
        hasDiscount: (productObj.retailPrice?.discount > 0) || 
                    (productObj.compare_price && productObj.compare_price > productObj.price)
      };
      
      // Add stock summary
      productObj.stockSummary = {
        isAvailable: productObj.stock_status === 'in_stock' && productObj.quantity > 0,
        isLowStock: productObj.quantity > 0 && productObj.quantity <= 5,
        allowsPreOrder: productObj.stock_status === 'pre_order',
        allowsBackOrder: productObj.stock_status === 'back_order'
      };
      
      return productObj;
    });

    res.status(200).json({ 
      success: true,
      data: enhancedProducts,
      products: enhancedProducts,
      count: enhancedProducts.length,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / parseInt(limit)),
        totalProducts,
        productsPerPage: parseInt(limit),
        hasNext: skip + parseInt(limit) < totalProducts,
        hasPrev: parseInt(page) > 1
      },
      filters: {
        category,
        featured,
        popular,
        trending,
        corporateOnly,
        priceRange: { minPrice, maxPrice },
        stockStatus,
        search
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching products',
      error: error.message
    });
  }
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  try {
    const { userType, userId } = req.query;
    
    const product = await Product.findById(req.params.id)
      .populate([
        {
          path: 'categories',
          select: 'name slug parent',
          populate: {
            path: 'parent',
            model: 'Category',
            select: 'name slug'
          }
        },
        {
          path: 'related_products',
          select: 'name price images stock_status retailPrice corporatePricing is_corporate_only',
          match: { status: true }
        },
        {
          path: 'cross_sell_products',
          select: 'name price images stock_status retailPrice corporatePricing is_corporate_only',
          match: { status: true }
        }
      ]);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check access permissions
    if (product.is_corporate_only && userType !== 'corporate') {
      return res.status(403).json({ 
        message: 'This product is only available to corporate customers' 
      });
    }

    // Update analytics
    const updateData = {
      $inc: {
        'analytics.views.total': 1,
        'analytics.weeklyViews': 1,
        'analytics.monthlyViews': 1
      },
      'analytics.lastViewed': new Date()
    };

    // Increment user-type specific views
    if (userType === 'corporate') {
      updateData.$inc['analytics.views.corporate'] = 1;
    } else if (userType === 'individual') {
      updateData.$inc['analytics.views.individual'] = 1;
    } else {
      updateData.$inc['analytics.views.anonymous'] = 1;
    }

    // Add daily view tracking
    const today = new Date().toISOString().split('T')[0];
    updateData.$push = {
      'analytics.dailyViews': {
        $each: [{ date: today, count: 1 }],
        $slice: -30 // Keep last 30 days
      }
    };

    // Update analytics in background (don't wait)
    Product.findByIdAndUpdate(req.params.id, updateData).exec();

    // Get product object with calculated fields
    const productObj = product.toObject();
    
    // Add calculated pricing information
    if (userType === 'corporate' && productObj.corporatePricing?.enabled) {
      const { getProductPrice } = require('../utils/productPricing');
      productObj.calculatedPricing = {
        retail: getProductPrice(productObj, 'individual', 1),
        corporate: getProductPrice(productObj, 'corporate', 1),
        tiers: productObj.corporatePricing.priceTiers.map(tier => ({
          ...tier,
          calculatedPrice: getProductPrice(productObj, 'corporate', tier.minQuantity)
        }))
      };
    } else {
      productObj.calculatedPricing = {
        retail: getProductPrice(productObj, 'individual', 1)
      };
    }

    // Add stock information
    productObj.stockInfo = {
      isAvailable: productObj.stock_status === 'in_stock' && productObj.quantity > 0,
      isLowStock: productObj.quantity > 0 && productObj.quantity <= 5,
      allowsPreOrder: productObj.stock_status === 'pre_order',
      allowsBackOrder: productObj.stock_status === 'back_order',
      estimatedRestockDate: productObj.available_from || null
    };

    // Filter related products based on user access
    if (productObj.related_products) {
      productObj.related_products = productObj.related_products.filter(relatedProduct => 
        !relatedProduct.is_corporate_only || userType === 'corporate'
      );
    }

    if (productObj.cross_sell_products) {
      productObj.cross_sell_products = productObj.cross_sell_products.filter(crossSellProduct => 
        !crossSellProduct.is_corporate_only || userType === 'corporate'
      );
    }

    res.status(200).json({ 
      success: true,
      data: productObj,
      product: productObj,
      viewTracked: true,
      userAccess: {
        canPurchase: !productObj.is_corporate_only || userType === 'corporate',
        canViewPrice: true,
        userType: userType || 'anonymous'
      }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching product',
      error: error.message
    });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      short_description,
      description,
      price,
      compare_price,
      cost_price,
      sale_price,
      discount,
      retailPrice,
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

    // Update basic fields
    if (name !== undefined) product.name = name;
    if (short_description !== undefined) product.short_description = short_description;
    if (description !== undefined) product.description = description;

    // Update legacy pricing
    if (price !== undefined) product.price = parseFloat(price);
    if (compare_price !== undefined) product.compare_price = compare_price;
    if (cost_price !== undefined) product.cost_price = cost_price;
    if (sale_price !== undefined) product.sale_price = sale_price;
    if (discount !== undefined) product.discount = discount;

    // Update retail pricing structure
    if (retailPrice !== undefined) {
      product.retailPrice = {
        mrp: retailPrice.mrp || product.price,
        sellingPrice: retailPrice.sellingPrice || product.price,
        discount: retailPrice.discount || 0,
        currency: retailPrice.currency || 'INR'
      };
    }

    // Update corporate pricing
    if (corporatePricing !== undefined) {
      product.corporatePricing = {
        enabled: corporatePricing.enabled || false,
        minimumOrderQuantity: corporatePricing.minimumOrderQuantity || 1,
        priceTiers: corporatePricing.priceTiers || [],
        customQuoteThreshold: corporatePricing.customQuoteThreshold
      };
    }

    // Update inventory fields
    if (sku !== undefined) product.sku = sku;
    if (quantity !== undefined) product.quantity = quantity;
    if (stock_status !== undefined) product.stock_status = stock_status;
    if (type !== undefined) product.type = type;
    if (unit !== undefined) product.unit = unit;
    if (weight !== undefined) product.weight = weight;
    if (requires_shipping !== undefined) product.requires_shipping = requires_shipping;
    if (available_from !== undefined) product.available_from = available_from;
    if (available_to !== undefined) product.available_to = available_to;

    // Update categories and tags
    if (categories !== undefined) product.categories = categories;
    if (tags !== undefined) product.tags = tags;

    // Update images
    if (images !== undefined) product.images = images;
    if (product_thumbnail_id !== undefined) product.product_thumbnail_id = product_thumbnail_id;
    if (product_galleries_id !== undefined) product.product_galleries_id = product_galleries_id;
    if (size_chart_image_id !== undefined) product.size_chart_image_id = size_chart_image_id;

    // Update SEO
    if (meta_title !== undefined) product.meta_title = meta_title;
    if (meta_description !== undefined) product.meta_description = meta_description;
    if (product_meta_image_id !== undefined) product.product_meta_image_id = product_meta_image_id;

    // Update shipping and tax
    if (is_free_shipping !== undefined) product.is_free_shipping = is_free_shipping;
    if (tax_id !== undefined) product.tax_id = tax_id;
    if (estimated_delivery_text !== undefined) product.estimated_delivery_text = estimated_delivery_text;
    if (return_policy_text !== undefined) product.return_policy_text = return_policy_text;

    // Update flags
    if (is_featured !== undefined) product.is_featured = is_featured;
    if (is_popular !== undefined) product.is_popular = is_popular;
    if (is_trending !== undefined) product.is_trending = is_trending;
    if (is_return !== undefined) product.is_return = is_return;
    if (status !== undefined) product.status = status;

    // Update new fields
    if (variations !== undefined) product.variations = variations;
    if (related_products !== undefined) product.related_products = related_products;
    if (cross_sell_products !== undefined) product.cross_sell_products = cross_sell_products;
    if (is_random_related_products !== undefined) product.is_random_related_products = is_random_related_products;
    if (safe_checkout !== undefined) product.safe_checkout = safe_checkout;
    if (secure_checkout !== undefined) product.secure_checkout = secure_checkout;
    if (social_share !== undefined) product.social_share = social_share;
    if (encourage_order !== undefined) product.encourage_order = encourage_order;
    if (encourage_view !== undefined) product.encourage_view = encourage_view;
    if (is_corporate_only !== undefined) product.is_corporate_only = is_corporate_only;

    // Set updatedBy field
    product.updatedBy = req.user?.id || req.adminUser?.id;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating product',
      error: error.message
    });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  await product.deleteOne();
  res.status(200).json({ 
    success: true,
    message: 'Product deleted successfully' 
  });
});

// @desc    Get product meta (categories)
// @route   GET /api/products/meta
// @access  Public
const getProductMeta = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('categories');
  res.status(200).json({
    success: true,
    message: 'Meta data fetched successfully',
    data: { categories },
    categories
  });
});

// @desc    Get products with corporate pricing
// @route   GET /api/products/corporate
// @access  Private (Corporate users only)
const getCorporateProducts = asyncHandler(async (req, res) => {
  const { userType } = req.user || {};
  
  if (userType !== 'Corporate') {
    return res.status(403).json({ message: 'Access denied. Corporate account required.' });
  }

  const products = await Product.find({
    'corporatePricing.enabled': true,
    status: true
  }).populate({
    path: 'categories',
    populate: {
      path: 'parent',
      model: 'Category'
    }
  });

  // Add pricing information for each product
  const productsWithCorporatePricing = products.map(product => {
    const productObj = product.toObject();
    
    // Add calculated fields for easier frontend consumption
    if (productObj.corporatePricing && productObj.corporatePricing.enabled) {
      const tiers = productObj.corporatePricing.priceTiers || [];
      productObj.lowestCorporatePrice = tiers.length > 0 ? 
        Math.min(...tiers.map(tier => tier.pricePerUnit)) : null;
      productObj.minCorporateQuantity = tiers.length > 0 ? 
        Math.min(...tiers.map(tier => tier.minQuantity)) : 1;
    }
    
    return productObj;
  });

  res.status(200).json({ 
    success: true,
    data: productsWithCorporatePricing,
    products: productsWithCorporatePricing,
    count: productsWithCorporatePricing.length
  });
});

// @desc    Get product pricing for specific quantity (corporate)
// @route   GET /api/products/:id/pricing
// @access  Private (Corporate users only)
const getProductPricing = asyncHandler(async (req, res) => {
  const { quantity = 1 } = req.query;
  const { userType } = req.user || {};
  
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const pricingInfo = getProductPrice(product.toObject(), userType.toLowerCase(), parseInt(quantity));
  
  res.status(200).json({
    success: true,
    data: {
      productId: product._id,
      quantity: parseInt(quantity),
      pricing: pricingInfo,
      requiresQuote: product.corporatePricing?.customQuoteThreshold && 
                     parseInt(quantity) >= product.corporatePricing.customQuoteThreshold
    },
    productId: product._id,
    quantity: parseInt(quantity),
    pricing: pricingInfo,
    requiresQuote: product.corporatePricing?.customQuoteThreshold && 
                   parseInt(quantity) >= product.corporatePricing.customQuoteThreshold
  });
});

// @desc    Get product analytics
// @route   GET /api/products/:id/analytics
// @access  Private (Admin only)
const getProductAnalytics = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('analytics name sku');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const analytics = product.analytics || {};
    
    // Calculate additional metrics
    const totalViews = analytics.views?.total || 0;
    const weeklyViews = analytics.weeklyViews || 0;
    const monthlyViews = analytics.monthlyViews || 0;
    
    // Calculate view breakdown percentages
    const viewBreakdown = {
      corporate: ((analytics.views?.corporate || 0) / totalViews * 100) || 0,
      individual: ((analytics.views?.individual || 0) / totalViews * 100) || 0,
      anonymous: ((analytics.views?.anonymous || 0) / totalViews * 100) || 0
    };

    // Get daily views for last 30 days
    const dailyViews = analytics.dailyViews || [];
    const last30Days = dailyViews.slice(-30);

    res.status(200).json({
      productId: product._id,
      productName: product.name,
      sku: product.sku,
      analytics: {
        totalViews,
        weeklyViews,
        monthlyViews,
        lastViewed: analytics.lastViewed,
        popularityScore: analytics.popularityScore || 0,
        viewBreakdown,
        dailyViews: last30Days,
        trends: {
          dailyAverage: last30Days.length > 0 ? 
            last30Days.reduce((sum, day) => sum + (day.count || 0), 0) / last30Days.length : 0,
          peakDay: last30Days.reduce((max, day) => 
            (day.count || 0) > (max.count || 0) ? day : max, { count: 0, date: null })
        }
      }
    });
  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({
      message: 'Internal server error while fetching analytics',
      error: error.message
    });
  }
});

// @desc    Bulk update product status
// @route   PUT /api/products/bulk/status
// @access  Private (Admin only)
const bulkUpdateProductStatus = asyncHandler(async (req, res) => {
  try {
    const { productIds, status, action } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Product IDs array is required' });
    }

    let updateData = {};
    
    switch (action) {
      case 'activate':
        updateData.status = true;
        break;
      case 'deactivate':
        updateData.status = false;
        break;
      case 'feature':
        updateData.is_featured = true;
        break;
      case 'unfeature':
        updateData.is_featured = false;
        break;
      case 'mark_popular':
        updateData.is_popular = true;
        break;
      case 'unmark_popular':
        updateData.is_popular = false;
        break;
      case 'mark_trending':
        updateData.is_trending = true;
        break;
      case 'unmark_trending':
        updateData.is_trending = false;
        break;
      case 'custom_status':
        if (status !== undefined) updateData.status = status;
        break;
      default:
        return res.status(400).json({ message: 'Invalid action specified' });
    }

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { 
        $set: {
          ...updateData,
          updatedBy: req.user?.id || req.adminUser?.id,
          updatedAt: new Date()
        }
      }
    );

    res.status(200).json({
      message: `Successfully updated ${result.modifiedCount} products`,
      modifiedCount: result.modifiedCount,
      action,
      productIds
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({
      message: 'Internal server error during bulk update',
      error: error.message
    });
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductMeta,
  getCorporateProducts,
  getProductPricing,
  getProductAnalytics,
  bulkUpdateProductStatus,
  getCategories
};
