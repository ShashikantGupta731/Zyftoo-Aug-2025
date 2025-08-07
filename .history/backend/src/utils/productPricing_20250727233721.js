/**
 * Product Pricing Utilities
 * Safe helper functions for handling both individual and corporate pricing
 */

/**
 * Get appropriate product price based on user type and quantity
 * @param {Object} product - Product document
 * @param {string} userType - 'individual' or 'corporate'
 * @param {number} quantity - Quantity requested
 * @returns {Object} Price information
 */
const getProductPrice = (product, userType = 'individual', quantity = 1) => {
  // Fallback for old schema (backward compatibility)
  if (!product.retailPrice && product.price) {
    return {
      price: product.price,
      originalPrice: product.price,
      discount: 0,
      currency: 'INR',
      isRetail: true
    };
  }

  // Individual user or corporate pricing not enabled
  if (userType === 'individual' || !product.corporatePricing?.enabled) {
    return {
      price: product.retailPrice?.sellingPrice || product.price || 0,
      originalPrice: product.retailPrice?.mrp || product.price || 0,
      discount: product.retailPrice?.discount || 0,
      currency: product.retailPrice?.currency || 'INR',
      isRetail: true
    };
  }

  // Corporate user with bulk pricing
  if (userType === 'corporate' && product.corporatePricing?.enabled) {
    const tier = product.corporatePricing.priceTiers.find(t => 
      quantity >= t.minQuantity && (!t.maxQuantity || quantity <= t.maxQuantity)
    );
    
    if (tier) {
      return {
        price: tier.pricePerUnit,
        originalPrice: product.retailPrice?.mrp || tier.pricePerUnit,
        discount: tier.discount || 0,
        currency: 'INR',
        tierInfo: tier,
        isCorporate: true
      };
    }
  }

  // Default fallback
  return {
    price: product.retailPrice?.sellingPrice || product.price || 0,
    originalPrice: product.retailPrice?.mrp || product.price || 0,
    discount: 0,
    currency: 'INR',
    isRetail: true
  };
};

/**
 * Check if quantity qualifies for custom quote
 * @param {Object} product - Product document
 * @param {number} quantity - Quantity requested
 * @returns {boolean}
 */
const requiresCustomQuote = (product, quantity) => {
  return product.corporatePricing?.enabled && 
         product.corporatePricing?.customQuoteThreshold &&
         quantity >= product.corporatePricing.customQuoteThreshold;
};

/**
 * Get all available price tiers for a product
 * @param {Object} product - Product document
 * @returns {Array} Array of price tiers
 */
const getAvailableTiers = (product) => {
  if (!product.corporatePricing?.enabled) {
    return [];
  }
  
  return product.corporatePricing.priceTiers || [];
};

/**
 * Format price for display
 * @param {number} price - Price value
 * @param {string} currency - Currency code
 * @returns {string} Formatted price
 */
const formatPrice = (price, currency = 'INR') => {
  if (currency === 'INR') {
    return `₹${price.toFixed(2)}`;
  }
  return `${currency} ${price.toFixed(2)}`;
};

module.exports = {
  getProductPrice,
  requiresCustomQuote,
  getAvailableTiers,
  formatPrice
};
