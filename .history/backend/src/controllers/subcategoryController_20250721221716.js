const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const Media = require('../models/Media');
const { getImageUrl, deleteImageFile } = require('../utils/fileUpload');

// Create subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const {
      name = 'Default Subcategory',
      description = '',
      parent,
      status = true
    } = req.body || {};
    
    // Validate parent category exists
    if (!parent) {
      return res.status(400).json({ error: 'Parent category is required' });
    }
    
    const parentCategory = await Category.findById(parent);
    if (!parentCategory) {
      return res.status(400).json({ error: 'Parent category not found' });
    }
    
    const subcategoryData = { name, description, parent, status };
    
    // Handle image upload if file is present
    if (req.file) {
      const imageUrl = getImageUrl(req.file.path, req);
      subcategoryData.image = {
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
        category: 'subcategory',
        alt: `${name} image`
      });
      await media.save();
    }
    
    console.log('Creating subcategory with data:', subcategoryData);
    const subcategory = new Subcategory(subcategoryData);
    await subcategory.save();
    
    // Populate parent category for response
    await subcategory.populate('parent', 'name _id');
    
    console.log('Subcategory saved:', subcategory);
    res.status(201).json({
      success: true,
      data: subcategory,
      message: 'Subcategory created successfully'
    });
  } catch (err) {
    console.error('Subcategory create error:', err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Get all subcategories
exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .populate('parent', 'name _id')
      .sort({ createdAt: -1 });
    
    console.log('Fetched subcategories from DB:', JSON.stringify(subcategories, null, 2));
    
    res.json({
      success: true,
      data: subcategories
    });
  } catch (err) {
    console.error('Get subcategories error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Get subcategories by parent category
exports.getSubcategoriesByParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    
    const subcategories = await Subcategory.find({ parent: parentId })
      .populate('parent', 'name _id')
      .sort({ name: 1 });
    
    res.json({
      success: true,
      data: subcategories
    });
  } catch (err) {
    console.error('Get subcategories by parent error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Get single subcategory
exports.getSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate('parent', 'name _id');
    if (!subcategory) {
      return res.status(404).json({ 
        success: false,
        error: 'Subcategory not found' 
      });
    }
    
    res.json({
      success: true,
      data: subcategory
    });
  } catch (err) {
    console.error('Get subcategory error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Update subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const existingSubcategory = await Subcategory.findById(req.params.id);
    if (!existingSubcategory) {
      return res.status(404).json({ 
        success: false,
        error: 'Subcategory not found' 
      });
    }
    
    const updateData = { ...req.body };
    
    // Validate parent category if being updated
    if (updateData.parent) {
      const parentCategory = await Category.findById(updateData.parent);
      if (!parentCategory) {
        return res.status(400).json({ 
          success: false,
          error: 'Parent category not found' 
        });
      }
    }
    
    // Handle image upload if file is present
    if (req.file) {
      // Delete old image if it exists
      if (existingSubcategory.image && existingSubcategory.image.path) {
        deleteImageFile(existingSubcategory.image.path);
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
        category: 'subcategory',
        alt: `${updateData.name || existingSubcategory.name} image`
      });
      await media.save();
    }
    
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    ).populate('parent', 'name _id');
    
    res.json({
      success: true,
      data: subcategory,
      message: 'Subcategory updated successfully'
    });
  } catch (err) {
    console.error('Update subcategory error:', err);
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Delete subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ 
        success: false,
        error: 'Subcategory not found' 
      });
    }
    
    // Delete image file if it exists
    if (subcategory.image && subcategory.image.path) {
      deleteImageFile(subcategory.image.path);
    }
    
    await Subcategory.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Subcategory deleted successfully'
    });
  } catch (err) {
    console.error('Delete subcategory error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};
