const express = require('express');
const router = express.Router();
const {
  trackProductView,
  getProductAnalytics,
  getPopularProducts,
  resetProductAnalytics
} = require('../controllers/analyticsController');

// Middleware imports (adjust paths as needed)
const auth = require('../middleware/auth'); // For authenticated requests
const adminAuth = require('../middleware/adminAuth'); // For admin-only endpoints

/**
 * @route   POST /api/analytics/products/:productId/view
 * @desc    Track a product view (public endpoint)
 * @access  Public
 */
router.post('/products/:productId/view', trackProductView);

/**
 * @route   GET /api/analytics/products/:productId
 * @desc    Get analytics for a specific product
 * @access  Private (Admin only)
 */
router.get('/products/:productId', adminAuth, getProductAnalytics);

/**
 * @route   GET /api/analytics/products/popular
 * @desc    Get popular products based on analytics
 * @access  Public
 */
router.get('/products/popular', getPopularProducts);

/**
 * @route   POST /api/analytics/products/:productId/reset
 * @desc    Reset analytics for a product (admin only)
 * @access  Private (Admin only)
 */
router.post('/products/:productId/reset', adminAuth, resetProductAnalytics);

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get analytics dashboard data (admin only)
 * @access  Private (Admin only)
 */
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const Product = require('../models/Product');
    
    // Get overall statistics
    const totalProducts = await Product.countDocuments();
    const productsWithAnalytics = await Product.countDocuments({
      'analytics.views.total': { $gt: 0 }
    });
    
    // Get top performing products
    const topProducts = await Product.find({
      'analytics.views.total': { $gt: 0 }
    })
      .select('name analytics')
      .sort({ 'analytics.popularityScore': -1 })
      .limit(5)
      .lean();

    // Get view distribution
    const viewStats = await Product.aggregate([
      {
        $match: { 'analytics.views.total': { $gt: 0 } }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$analytics.views.total' },
          totalIndividualViews: { $sum: '$analytics.views.individual' },
          totalCorporateViews: { $sum: '$analytics.views.corporate' },
          avgViewsPerProduct: { $avg: '$analytics.views.total' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          productsWithAnalytics,
          viewedProductsPercentage: totalProducts > 0 ? 
            ((productsWithAnalytics / totalProducts) * 100).toFixed(2) : 0
        },
        topProducts,
        viewStats: viewStats[0] || {
          totalViews: 0,
          totalIndividualViews: 0,
          totalCorporateViews: 0,
          avgViewsPerProduct: 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics dashboard',
      error: error.message
    });
  }
});

module.exports = router;
