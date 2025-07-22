const Category = require('../models/Category');
const Media = require('../models/Media');
const { getImageUrl, deleteImageFile } = require('../utils/fileUpload');
const path = require('path');

// Create category
exports.createCategory = async (req, res) => {
  try {
    // Fill missing fields with defaults
    const {
      name = 'Default Category',
      description = '',
      parent = null,
      status = true
    } = req.body || {};
    
    const categoryData = { name, description, parent, status };
    
    // Handle image upload if file is present
    if (req.file) {
      const imageUrl = getImageUrl(req.file.path, req);
      categoryData.image = {
        url: imageUrl,
        path: req.file.path,
        filename: req.file.filename
      };
      
      // Create media record
      const media = new Media({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: imageUrl,
        category: parent ? 'subcategory' : 'category',
        alt: `${name} image`
      });
      await media.save();
    }
    
    console.log('REQ BODY (with defaults):', categoryData);
    const category = new Category(categoryData);
    await category.save();
    console.log('CATEGORY SAVED:', category);
    res.status(201).json(category);
  } catch (err) {
    console.error('CATEGORY CREATE ERROR:', err);
    res.status(400).json({ error: err.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('parent', 'name _id');
    console.log('Fetched categories from DB:', JSON.stringify(categories, null, 2));
    
    // Transform categories to include both id and _id fields for frontend compatibility
    const transformedCategories = categories.map(cat => ({
      ...cat.toObject(),
      id: cat._id.toString(), // Add id field for frontend compatibility
    }));
    
    res.json(transformedCategories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get single category
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent');
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const existingCategory = await Category.findById(req.params.id);
    if (!existingCategory) return res.status(404).json({ error: 'Category not found' });
    
    const updateData = { ...req.body };
    
    // Handle image upload if file is present
    if (req.file) {
      // Delete old image if it exists
      if (existingCategory.image && existingCategory.image.path) {
        deleteImageFile(existingCategory.image.path);
      }
      
      // Set new image data
      const imageUrl = getImageUrl(req.file.path, req);
      updateData.image = {
        url: imageUrl,
        path: req.file.path,
        filename: req.file.filename
      };
      
      // Create media record
      const media = new Media({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        url: imageUrl,
        category: existingCategory.parent ? 'subcategory' : 'category',
        alt: `${updateData.name || existingCategory.name} image`
      });
      await media.save();
    }
    
    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    // Delete image file if it exists
    if (category.image && category.image.path) {
      deleteImageFile(category.image.path);
    }
    
    // Check if this category has subcategories
    const subcategories = await Category.find({ parent: req.params.id });
    if (subcategories.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with subcategories. Delete subcategories first.' 
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
