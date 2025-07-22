const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

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
      status
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

      // Pricing
      price: parseFloat(price),
      compare_price,
      cost_price,
      sale_price,
      discount,

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
      status
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

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate({
    path: 'categories',
    populate: {
      path: 'parent',
      model: 'Category'
    }
  });
  res.status(200).json({ products });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'categories',
    populate: {
      path: 'parent',
      model: 'Category'
    }
  });
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.status(200).json({ product });
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

  // Only update fields present in the Product schema
  const fieldsToUpdate = [
    'name',
    'short_description',
    'description',
    'price',
    'compare_price',
    'cost_price',
    'sale_price',
    'discount',
    'sku',
    'quantity',
    'stock_status',
    'type',
    'unit',
    'weight',
    'requires_shipping',
    'available_from',
    'available_to',
    'categories',
    'tags',
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
  res.status(200).json({ message: 'Product deleted successfully' });
});

// @desc    Get product meta (categories)
// @route   GET /api/products/meta
// @access  Public
const getProductMeta = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('categories');
  res.status(200).json({
    message: 'Meta data fetched successfully',
    categories
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductMeta
};
