/**
 * Client-side Product Pricing Utilities
 * Safe helpers for displaying prices in React components
 */

/**
 * Get product price for display based on user context
 * @param {Object} product - Product object
 * @param {Object} user - User object
 * @param {number} quantity - Quantity (default: 1)
 * @returns {Object} Price information
 */
export const getDisplayPrice = (product, user = null, quantity = 1) => {
  // Determine user type
  const userType = user?.userType === 'Corporate' ? 'corporate' : 'individual';
  
  // Fallback for legacy products
  if (!product.retailPrice && product.price) {
    return {
      price: product.price,
      originalPrice: product.price,
      discount: 0,
      currency: 'INR',
      showTier: false,
      isLegacy: true
    };
  }

  // Individual users or corporate pricing disabled
  if (userType === 'individual' || !product.corporatePricing?.enabled) {
    const retailPrice = product.retailPrice || {};
    return {
      price: retailPrice.sellingPrice || product.price || 0,
      originalPrice: retailPrice.mrp || product.price || 0,
      discount: retailPrice.discount || 0,
      currency: retailPrice.currency || 'INR',
      showTier: false,
      isRetail: true
    };
  }

  // Corporate pricing
  if (userType === 'corporate' && product.corporatePricing?.enabled) {
    const tiers = product.corporatePricing.priceTiers || [];
    const activeTier = tiers.find(tier => 
      quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)
    );

    if (activeTier) {
      return {
        price: activeTier.pricePerUnit,
        originalPrice: product.retailPrice?.mrp || activeTier.pricePerUnit,
        discount: activeTier.discount || 0,
        currency: 'INR',
        showTier: true,
        tierInfo: activeTier,
        isCorporate: true
      };
    }
  }

  // Fallback to retail pricing
  const retailPrice = product.retailPrice || {};
  return {
    price: retailPrice.sellingPrice || product.price || 0,
    originalPrice: retailPrice.mrp || product.price || 0,
    discount: retailPrice.discount || 0,
    currency: retailPrice.currency || 'INR',
    showTier: false,
    isRetail: true
  };
};

/**
 * Format price for display
 * @param {number} price 
 * @param {string} currency 
 * @returns {string}
 */
export const formatPrice = (price, currency = 'INR') => {
  const numPrice = parseFloat(price) || 0;
  
  if (currency === 'INR') {
    return `₹${numPrice.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  
  return `${currency} ${numPrice.toFixed(2)}`;
};

/**
 * Check if user should see corporate pricing
 * @param {Object} user 
 * @param {Object} product 
 * @returns {boolean}
 */
export const shouldShowCorporatePricing = (user, product) => {
  return user?.userType === 'Corporate' && 
         product?.corporatePricing?.enabled &&
         product?.corporatePricing?.priceTiers?.length > 0;
};

/**
 * Get minimum corporate order quantity
 * @param {Object} product 
 * @returns {number}
 */
export const getMinimumCorporateQuantity = (product) => {
  if (!product?.corporatePricing?.enabled) return 1;
  
  const minFromTiers = product.corporatePricing.priceTiers?.[0]?.minQuantity || 1;
  const minFromSettings = product.corporatePricing.minimumOrderQuantity || 1;
  
  return Math.max(minFromTiers, minFromSettings);
};

/**
 * Check if quantity requires custom quote
 * @param {Object} product 
 * @param {number} quantity 
 * @returns {boolean}
 */
export const requiresCustomQuote = (product, quantity) => {
  return product?.corporatePricing?.enabled && 
         product?.corporatePricing?.customQuoteThreshold &&
         quantity >= product.corporatePricing.customQuoteThreshold;
};
