const Product = require('../models/Product');
const asyncHandler = require('express-async-handler'); // to avoid try-catch
const Order = require('../models/Order');




// @desc    Create a new product
// @route   POST /api/products
// @access  Private (Admin only)
const createProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      short_description,
      description,
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
      tags,
      categories,
      selectedCategory,
      selectedSubcategories,
      is_random_related_products,
      related_products,
      cross_sell_products,
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
      status
    } = req.body;

    // ✅ Required fields check
    if (!name || !description || !price || !selectedCategory) {
      return res.status(400).json({
        message: 'Missing required fields: name, description, price, or selected category'
      });
    }

    // ✅ Clean/normalize values
    const cleanTaxId = tax_id && tax_id !== 'tax1' && tax_id !== '' ? tax_id : null;

    const product = new Product({
      name,
      short_description,
      description,
      type: type || 'simple',
      unit,
      weight: weight ? parseFloat(weight) : undefined,
      stock_status: stock_status || 'in_stock',
      sku,
      quantity: quantity ? parseInt(quantity) : 0,
      price: parseFloat(price),
      discount,
      sale_price,
      available_from,
      available_to,

      tags,
      categories: [
        selectedCategory,
        ...(selectedSubcategories || [])
      ],
      is_random_related_products,
      related_products,
      cross_sell_products,

      images,
      product_thumbnail_id,
      product_galleries_id,
      size_chart_image_id,

      meta_title: meta_title || name,
      meta_description,
      product_meta_image_id,

      is_free_shipping: !!is_free_shipping,
      tax_id: cleanTaxId,
      estimated_delivery_text,
      return_policy_text,

      is_featured: !!is_featured,
      is_popular: !!is_popular,
      is_trending: !!is_trending,
      is_return: !!is_return,
      status: status !== false, // default true
      createdBy: req.user._id // for tracking who added it
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      message: 'Internal server error while creating product',
      error: error.message
    });
  }
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


  // List all updatable fields from the current schema
  const fieldsToUpdate = [
    'name',
    'short_description',
    'description',
    'type',
    'unit',
    'weight',
    'stock_status',
    'sku',
    'quantity',
    'price',
    'compare_price',
    'cost_price',
    'sale_price',
    'discount',
    'available_from',
    'available_to',
    'tags',
    'categories',
    'selectedCategory',
    'selectedSubcategories',
    'is_random_related_products',
    'related_products',
    'cross_sell_products',
    'images',
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
    'is_popular',
    'is_trending',
    'is_return',
    'status',
    'requires_shipping'
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


// Remove getProductMeta or update to match schema (no 'brand' or 'category' field, only 'categories')
const getProductMeta = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('categories');
  res.status(200).json({
    message: 'Meta data fetched successfully',
    categories
  });
});


// Remove addReview, updateReview, deleteReview if Product schema does not support reviews

// If you want to keep review endpoints, you must add a reviews field to the Product schema.

// For now, remove review-related endpoints from exports:

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
                   getProductMeta
                 };
