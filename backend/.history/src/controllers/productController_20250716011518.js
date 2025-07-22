const Product = require('../models/Product');
const asyncHandler = require('express-async-handler'); // to avoid try-catch
const Order = require('../models/Order');




// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin only)
const createProduct = asyncHandler(async (req, res) => {
  try {
    console.log('Creating product with data:', req.body);
    console.log('User:', req.user);
    
    const {
      name,
      short_description,
      description,
      store_id,
      type,
      unit,
      weight,
      stock_status,
      sku,
      quantity,
      price,
      discount,
      sale_price,
      available_from,
      available_to,
      variations,
      tags,
      categories,
      is_random_related_products,
      related_products,
      cross_sell_products,
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
      safe_checkout,
      secure_checkout,
      social_share,
      encourage_order,
      encourage_view,
      is_trending,
      is_return,
      status
    } = req.body;

    // Basic validation
    if (!name || !description || !type) {
      return res.status(400).json({ message: 'Please fill all required fields (name, description, type)' });
    }

    // Clean up tax_id - set to null if it's a placeholder or invalid value
    const cleanTaxId = tax_id && tax_id !== 'tax1' && tax_id !== '' ? tax_id : null;

    const product = new Product({
      name,
      short_description,
      description,
      store_id,
      type,
      unit,
      weight,
      stock_status,
      sku,
      quantity,
      price,
      discount,
      sale_price,
      available_from,
      available_to,
      variations,
      tags,
      categories,
      is_random_related_products,
      related_products,
      cross_sell_products,
      product_thumbnail_id,
      product_galleries_id,
      size_chart_image_id,
      meta_title,
      meta_description,
      product_meta_image_id,
      is_free_shipping,
      tax_id: cleanTaxId,
      estimated_delivery_text,
      return_policy_text,
      is_featured,
      is_popular,
      safe_checkout,
      secure_checkout,
      social_share,
      encourage_order,
      encourage_view,
      is_trending,
      is_return,
      status,
      createdBy: req.user._id // from authMiddleware
    });

    const savedProduct = await product.save();
    console.log('Product saved successfully:', savedProduct);

    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({
      message: 'Error creating product',
      error: error.message
    });
  }
});


const getAllProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { category, brand, search, minPrice, maxPrice } = req.query;
  const filter = {};


  if (category) {
    filter.category = category;
  }

  if (brand) {
    filter.brand = brand;
  }

  if (search) {
    filter.name = { $regex: search, $options: 'i' }; // case-insensitive
  }

   if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  const total = await Product.countDocuments(filter);
  let sortOptions = {};

  if (req.query.sortBy) {
    const field = req.query.sortBy;
    const order = req.query.order === 'desc' ? -1 : 1;
    sortOptions[field] = order;
  }

  const products = await Product.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    message: 'Products fetched with filters & pagination',
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    products
  });
});


const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const sortOrder = req.query.sort === 'oldest' ? 1 : -1; // default to newest
  const limit = parseInt(req.query.limit) || 0;
  const ratingFilter = parseInt(req.query.rating) || 0;



  const product = await Product.findById(productId).populate('reviews.user', 'name');
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Clone product data
  const productData = product.toObject();

  // Fetch orders by current user (if logged in) OR for all users who reviewed
  const orders = await Order.find({
    'items.product': productId,
    orderStatus: { $ne: 'Cancelled' }
  }).select('user');

  const verifiedUserIds = orders.map((order) => order.user.toString());
  let filteredReviews = product.reviews.filter(
    (r) => r.rating >= ratingFilter
  );

  // ✅ Sort reviews by date
  filteredReviews.sort((a, b) => {
    if (sortOrder === 1) return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // ✅ Apply limit
  if (limit > 0) {
    filteredReviews = filteredReviews.slice(0, limit);
  }

  // Tag each review as verified or not
  productData.reviews = product.reviews.map((review) => ({
    _id: review._id,
    name: review.name,
    comment: review.comment,
    rating: review.rating,
    createdAt: review.createdAt,
    isVerifiedBuyer: verifiedUserIds.includes(review.user._id?.toString())
  }));

  res.status(200).json({
    message: 'Product found',
    product: productData
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // List all updatable fields from schema
  const fieldsToUpdate = [
    'name',
    'short_description',
    'description',
    'store_id',
    'type',
    'unit',
    'weight',
    'stock_status',
    'sku',
    'quantity',
    'price',
    'discount',
    'sale_price',
    'available_from',
    'available_to',
    'variations',
    'tags',
    'categories',
    'is_random_related_products',
    'related_products',
    'cross_sell_products',
    'product_thumbnail_id',
    'product_galleries_id',
    'size_chart_image_id',
    'meta_title',
    'meta_description',
    'product_meta_image_id',
    'is_free_shipping',
    'tax_id',
    'estimated_delivery_text',
    'return_policy_text',
    'is_featured',
    'safe_checkout',
    'secure_checkout',
    'social_share',
    'encourage_order',
    'encourage_view',
    'is_trending',
    'is_return',
    'status'
  ];

  fieldsToUpdate.forEach(field => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updatedProduct = await product.save();

  res.status(200).json({
    message: 'Product updated successfully',
    product: updatedProduct
  });
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
    message: 'Product deleted successfully'
  });
});

const getProductMeta = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  const brands = await Product.distinct('brand');

  res.status(200).json({
    message: 'Meta data fetched successfully',
    categories,
    brands
  });
});

const addReview = asyncHandler(async (req, res) => {
  let rating = req.body.rating;
  const comment = req.body.comment;

  const productId = req.params.id;

  const product = await Product.findById(productId).populate('reviews.user', 'name');


  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // ✅ Convert rating to number or default to 0
  rating = Number(rating);
  if (isNaN(rating) || rating < 0 || rating > 5) {
    rating = 0; // auto-correct if invalid
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({ message: 'You have already reviewed this product' });
  }
  
  const hasOrdered = await Order.findOne({
  user: req.user._id,
  'items.product': productId,
  orderStatus: { $ne: 'Cancelled' }
});

if (!hasOrdered) {
  return res.status(403).json({ message: 'Only users who purchased this product can review' });
}

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;

  // Recalculate average rating
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();

  res.status(201).json({ message: 'Review added successfully' });
});

const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const review = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  // ✅ Update review fields
  review.rating = Number(rating) || review.rating;
  review.comment = comment || review.comment;

  // Recalculate rating
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();

  res.status(200).json({ message: 'Review updated successfully' });
});

const deleteReview = asyncHandler(async (req, res) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const reviewIndex = product.reviews.findIndex(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (reviewIndex === -1) {
    return res.status(404).json({ message: 'Review not found' });
  }

  // ✅ Remove review
  product.reviews.splice(reviewIndex, 1);

  product.numReviews = product.reviews.length;

  product.rating =
    product.numReviews > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews
      : 0;

  await product.save();

  res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports = { createProduct, 
                   getAllProducts, 
                   getProductById, 
                   updateProduct, 
                   deleteProduct, 
                   getProductMeta, 
                   addReview, 
                   updateReview, 
                   deleteReview 
                  };
