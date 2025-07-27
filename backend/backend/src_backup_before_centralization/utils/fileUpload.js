const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Storage configuration for category images
const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { categoryName, isSubcategory, parentCategoryName } = req.body;
    
    let uploadPath;
    if (isSubcategory === 'true' && parentCategoryName) {
      // For subcategories: public/assets/categories/parentcategoryname/subcategories
      uploadPath = path.join(__dirname, '../../public/assets/categories', parentCategoryName.toLowerCase(), 'subcategories');
    } else {
      // For main categories: public/assets/categories/categoryname
      uploadPath = path.join(__dirname, '../../public/assets/categories', (categoryName || 'default').toLowerCase());
    }
    
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const { categoryName, isSubcategory } = req.body;
    const timestamp = Date.now();
    const sanitizedName = (categoryName || 'category').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const prefix = isSubcategory === 'true' ? 'sub-' : '';
    const filename = `${prefix}${sanitizedName}-${timestamp}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer configuration for category images
const uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Function to get the URL path for uploaded files
const getImageUrl = (filePath, req) => {
  // Convert absolute path to relative URL
  const relativePath = path.relative(path.join(__dirname, '../../public'), filePath);
  const urlPath = relativePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes for URLs
  return `${req.protocol}://${req.get('host')}/${urlPath}`;
};

// Function to delete old image file
const deleteImageFile = (imagePath) => {
  if (imagePath && fs.existsSync(imagePath)) {
    try {
      fs.unlinkSync(imagePath);
      console.log('Deleted old image:', imagePath);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }
};

// Storage configuration for product images with proper folder structure
const productImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    const baseDir = path.join(__dirname, '../../public/assets/images/ProductImage');
    
    // Determine folder based on endpoint
    const endpoint = req.route?.path || req.url;
    
    if (endpoint.includes('product-thumbnail')) {
      uploadPath = path.join(baseDir, 'thumbnail');
    } else if (endpoint.includes('size-chart')) {
      uploadPath = path.join(baseDir, 'SizeChart');
    } else if (endpoint.includes('meta-image')) {
      uploadPath = path.join(baseDir, 'MetaImage');
    } else {
      uploadPath = baseDir; // Main product images
    }
    
    console.log('Upload destination:', uploadPath, 'for endpoint:', endpoint);
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = `product-${timestamp}-${randomNum}${ext}`;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const uploadProductImage = multer({
  storage: productImageStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = {
  uploadCategoryImage,
  getImageUrl,
  deleteImageFile,
  ensureDirectoryExists,
  uploadProductImage
};
