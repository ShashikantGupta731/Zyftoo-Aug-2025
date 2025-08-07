import { useCallback, useEffect, useRef } from 'react';
import { analyticsService } from '../util/analyticsService';
import { useAuth } from '../components/context/AuthContext';

/**
 * Custom hook for product analytics tracking
 * @param {object} options - Hook configuration options
 */
export const useProductAnalytics = (options = {}) => {
  const { user } = useAuth();
  const trackingRef = useRef(new Set());
  
  const {
    autoTrackPageViews = true,
    debounceMs = 1000,
    trackHover = false
  } = options;

  /**
   * Get current user type
   */
  const getUserType = useCallback(() => {
    return analyticsService.getUserType(user);
  }, [user]);

  /**
   * Track a product view
   */
  const trackProductView = useCallback((productId, context = {}) => {
    const userType = getUserType();
    
    analyticsService.trackProductView(productId, {
      userType,
      debounceMs,
      ...context
    });
  }, [getUserType, debounceMs]);

  /**
   * Track product card click with enhanced context
   */
  const trackProductCardClick = useCallback((product, context = {}) => {
    const userType = getUserType();
    
    analyticsService.trackProductCardClick(product, {
      userType,
      trackHover,
      ...context
    });
  }, [getUserType, trackHover]);

  /**
   * Track product page view (for product detail pages)
   */
  const trackProductPageView = useCallback((productId, context = {}) => {
    // Prevent duplicate tracking for the same product in the same session
    const trackingKey = `page-${productId}`;
    if (trackingRef.current.has(trackingKey)) {
      return;
    }
    
    trackingRef.current.add(trackingKey);
    
    const userType = getUserType();
    
    analyticsService.trackProductPageView(productId, {
      userType,
      ...context
    });
  }, [getUserType]);

  /**
   * Create tracking props for product components
   */
  const createTrackingProps = useCallback((product, context = {}) => {
    const userType = getUserType();
    
    return analyticsService.createTrackingProps(product, {
      userType,
      trackHover,
      ...context
    });
  }, [getUserType, trackHover]);

  /**
   * Get popular products with user context
   */
  const getPopularProducts = useCallback(async (filters = {}) => {
    const userType = getUserType();
    
    return await analyticsService.getPopularProducts({
      userType: userType === 'guest' ? 'all' : userType,
      ...filters
    });
  }, [getUserType]);

  /**
   * Auto-track page views based on URL changes
   */
  useEffect(() => {
    if (!autoTrackPageViews) return;

    // This would typically integrate with Next.js router
    // For now, we'll track based on URL patterns
    const currentPath = window.location.pathname;
    
    // Check for product detail pages
    const productDetailMatch = currentPath.match(/\/shop-details\/([^\/]+)/) ||
                              currentPath.match(/\/products\/([^\/]+)/) ||
                              currentPath.match(/\/corporate\/products\/([^\/]+)/);
    
    if (productDetailMatch) {
      const productId = productDetailMatch[1];
      trackProductPageView(productId, {
        referrer: document.referrer ? 'external' : 'internal',
        source: currentPath.includes('corporate') ? 'corporate-page' : 'product-page'
      });
    }
  }, [autoTrackPageViews, trackProductPageView]);

  return {
    // Core tracking functions
    trackProductView,
    trackProductCardClick,
    trackProductPageView,
    
    // Helper functions
    createTrackingProps,
    getUserType,
    
    // Data fetching
    getPopularProducts,
    
    // Admin functions (only available for admin users)
    getProductAnalytics: user?.role === 'admin' ? 
      analyticsService.getProductAnalytics.bind(analyticsService) : null,
    getAnalyticsDashboard: user?.role === 'admin' ? 
      analyticsService.getAnalyticsDashboard.bind(analyticsService) : null
  };
};
