const Product = require('../models/Product');

/**
 * Track product view
 */
const trackProductView = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userType = 'individual', source = 'web' } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Initialize analytics if not exists
    if (!product.analytics) {
      product.analytics = {
        views: { total: 0, individual: 0, corporate: 0 },
        dailyViews: 0,
        weeklyViews: 0,
        monthlyViews: 0,
        popularityScore: 0,
        lastViewedAt: new Date(),
        topSources: []
      };
    }

    // Update view counts
    product.analytics.views.total += 1;
    if (userType === 'corporate') {
      product.analytics.views.corporate += 1;
    } else {
      product.analytics.views.individual += 1;
    }

    // Update time-based views (simplified - would need proper time window logic in production)
    product.analytics.dailyViews += 1;
    product.analytics.weeklyViews += 1;
    product.analytics.monthlyViews += 1;
    product.analytics.lastViewedAt = new Date();

    // Update popularity score (using the virtual method)
    const totalViews = product.analytics.views.total;
    const recentViews = product.analytics.weeklyViews;
    const corporateViews = product.analytics.views.corporate;
    product.analytics.popularityScore = (totalViews * 0.3) + (recentViews * 0.5) + (corporateViews * 0.2);

    // Track top sources
    if (source) {
      const existingSource = product.analytics.topSources?.find(s => s.source === source);
      if (existingSource) {
        existingSource.views += 1;
      } else {
        if (!product.analytics.topSources) product.analytics.topSources = [];
        product.analytics.topSources.push({ source, views: 1 });
      }
      
      // Keep only top 5 sources
      product.analytics.topSources = product.analytics.topSources
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
    }

    // Save the updated product
    await product.save();

    res.json({
      success: true,
      message: 'Product view tracked successfully',
      data: {
        productId: product._id,
        totalViews: product.analytics.views.total,
        popularityScore: product.analytics.popularityScore
      }
    });

  } catch (error) {
    console.error('Error tracking product view:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track product view',
      error: error.message
    });
  }
};

/**
 * Get product analytics
 */
const getProductAnalytics = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .select('name analytics')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: {
        productId: product._id,
        productName: product.name,
        analytics: product.analytics || {
          views: { total: 0, individual: 0, corporate: 0 },
          dailyViews: 0,
          weeklyViews: 0,
          monthlyViews: 0,
          popularityScore: 0,
          topSources: []
        }
      }
    });

  } catch (error) {
    console.error('Error fetching product analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product analytics',
      error: error.message
    });
  }
};

/**
 * Get popular products
 */
const getPopularProducts = async (req, res) => {
  try {
    const { 
      limit = 10, 
      userType = 'all',
      category,
      timeFrame = 'all' // all, daily, weekly, monthly
    } = req.query;

    let sortField = 'analytics.popularityScore';
    
    // Adjust sorting based on time frame
    if (timeFrame === 'daily') {
      sortField = 'analytics.dailyViews';
    } else if (timeFrame === 'weekly') {
      sortField = 'analytics.weeklyViews';
    } else if (timeFrame === 'monthly') {
      sortField = 'analytics.monthlyViews';
    }

    // Build query
    let query = {};
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .select('name price retailPrice corporatePricing analytics images category')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit))
      .lean();

    // Filter and enhance results
    const enhancedProducts = products.map(product => ({
      ...product,
      displayPrice: product.retailPrice?.sellingPrice || product.price || 0,
      hasActiveCorporatePricing: product.corporatePricing?.enabled && 
                                 product.corporatePricing?.priceTiers?.length > 0,
      popularityRank: product.analytics?.popularityScore || 0,
      totalViews: product.analytics?.views?.total || 0,
      recentViews: product.analytics?.[timeFrame === 'daily' ? 'dailyViews' : 
                                     timeFrame === 'weekly' ? 'weeklyViews' : 
                                     timeFrame === 'monthly' ? 'monthlyViews' : 'views.total'] || 0
    }));

    res.json({
      success: true,
      data: {
        products: enhancedProducts,
        metadata: {
          total: enhancedProducts.length,
          timeFrame,
          userType,
          category: category || 'all'
        }
      }
    });

  } catch (error) {
    console.error('Error fetching popular products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular products',
      error: error.message
    });
  }
};

/**
 * Reset analytics (admin only)
 */
const resetProductAnalytics = async (req, res) => {
  try {
    const { productId } = req.params;
    const { resetType = 'all' } = req.body; // all, daily, weekly, monthly

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.analytics) {
      return res.json({
        success: true,
        message: 'Product analytics already empty'
      });
    }

    // Reset based on type
    if (resetType === 'all') {
      product.analytics = {
        views: { total: 0, individual: 0, corporate: 0 },
        dailyViews: 0,
        weeklyViews: 0,
        monthlyViews: 0,
        popularityScore: 0,
        lastViewedAt: new Date(),
        topSources: []
      };
    } else if (resetType === 'daily') {
      product.analytics.dailyViews = 0;
    } else if (resetType === 'weekly') {
      product.analytics.weeklyViews = 0;
    } else if (resetType === 'monthly') {
      product.analytics.monthlyViews = 0;
    }

    await product.save();

    res.json({
      success: true,
      message: `Product analytics ${resetType} data reset successfully`,
      data: {
        productId: product._id,
        analytics: product.analytics
      }
    });

  } catch (error) {
    console.error('Error resetting product analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset product analytics',
      error: error.message
    });
  }
};

module.exports = {
  trackProductView,
  getProductAnalytics,
  getPopularProducts,
  resetProductAnalytics
};
