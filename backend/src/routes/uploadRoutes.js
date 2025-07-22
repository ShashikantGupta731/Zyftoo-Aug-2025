const express = require('express');
const router = express.Router();
const { uploadProductImage } = require('../utils/fileUpload');
const path = require('path');

// Helper function to generate proper URL
const generateImageUrl = (req, filePath, subfolder = '') => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  // Extract filename from path
  const filename = path.basename(filePath);
  const imagePath = subfolder ? 
    `/assets/images/ProductImage/${subfolder}/${filename}` : 
    `/assets/images/ProductImage/${filename}`;
  return `${baseUrl}${imagePath}`;
};

// Product Images Upload (for main product images)
router.post('/product-images', uploadProductImage.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    console.log('Product image uploaded:', req.file);
    const url = generateImageUrl(req, req.file.path);
    
    res.json({ 
      message: 'Product image uploaded successfully',
      url,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Product image upload error:', error);
    res.status(500).json({ error: 'Failed to upload product image' });
  }
});

// Product Thumbnail Upload
router.post('/product-thumbnail', uploadProductImage.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    console.log('Thumbnail uploaded:', req.file);
    const url = generateImageUrl(req, req.file.path, 'thumbnail');
    
    res.json({ 
      message: 'Thumbnail uploaded successfully',
      url,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    res.status(500).json({ error: 'Failed to upload thumbnail' });
  }
});

// Size Chart Upload
router.post('/size-chart', uploadProductImage.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    console.log('Size chart uploaded:', req.file);
    const url = generateImageUrl(req, req.file.path, 'SizeChart');
    
    res.json({ 
      message: 'Size chart uploaded successfully',
      url,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Size chart upload error:', error);
    res.status(500).json({ error: 'Failed to upload size chart' });
  }
});

// Meta Image Upload  
router.post('/meta-image', uploadProductImage.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    console.log('Meta image uploaded:', req.file);
    const url = generateImageUrl(req, req.file.path, 'MetaImage');
    
    res.json({ 
      message: 'Meta image uploaded successfully',
      url,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Meta image upload error:', error);
    res.status(500).json({ error: 'Failed to upload meta image' });
  }
});

module.exports = router; 