import { apiService } from './apiService';

/**
 * Analytics service for tracking product interactions
 */
class AnalyticsService {
  constructor() {
    this.baseUrl = '/analytics';
    this.trackingQueue = [];
    this.isProcessing = false;
  }

  /**
   * Track a product view with optional debouncing
   * @param {string} productId - The product ID to track
   * @param {object} options - Tracking options
   */
  async trackProductView(productId, options = {}) {
    try {
      const {
        userType = 'individual',
        source = 'web',
        immediate = false,
        debounceMs = 1000
      } = options;

      const trackingData = {
        productId,
        userType,
        source,
        timestamp: Date.now()
      };

      if (immediate) {
        return await this._sendTrackingRequest(trackingData);
      }

      // Add to queue with debouncing
      this._addToQueue(trackingData, debounceMs);
      
    } catch (error) {
      console.error('Error tracking product view:', error);
      // Don't throw error to avoid breaking user experience
    }
  }

  /**
   * Add tracking data to queue with debouncing
   * @private
   */
  _addToQueue(trackingData, debounceMs) {
    // Remove existing entry for the same product (debounce)
    this.trackingQueue = this.trackingQueue.filter(
      item => item.productId !== trackingData.productId
    );
    
    // Add new entry
    this.trackingQueue.push(trackingData);
    
    // Process queue after debounce delay
    setTimeout(() => {
      this._processQueue();
    }, debounceMs);
  }

  /**
   * Process the tracking queue
   * @private
   */
  async _processQueue() {
    if (this.isProcessing || this.trackingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const itemsToProcess = [...this.trackingQueue];
    this.trackingQueue = [];

    try {
      // Process items in parallel (with reasonable batch size)
      const batchSize = 5;
      for (let i = 0; i < itemsToProcess.length; i += batchSize) {
        const batch = itemsToProcess.slice(i, i + batchSize);
        await Promise.allSettled(
          batch.map(item => this._sendTrackingRequest(item))
        );
      }
    } catch (error) {
      console.error('Error processing tracking queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Send tracking request to backend
   * @private
   */
  async _sendTrackingRequest(trackingData) {
    const { productId, ...requestData } = trackingData;
    
    return await apiService.post(
      `${this.baseUrl}/products/${productId}/view`,
      requestData
    );
  }

  /**
   * Get popular products
   * @param {object} filters - Filter options
   */
  async getPopularProducts(filters = {}) {
    try {
      const {
        limit = 10,
        userType = 'all',
        category,
        timeFrame = 'all'
      } = filters;

      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('userType', userType);
      params.append('timeFrame', timeFrame);
      
      if (category) {
        params.append('category', category);
      }

      const response = await apiService.get(
        `${this.baseUrl}/products/popular?${params.toString()}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching popular products:', error);
      throw error;
    }
  }

  /**
   * Get analytics for a specific product (admin only)
   * @param {string} productId - The product ID
   */
  async getProductAnalytics(productId) {
    try {
      const response = await apiService.get(
        `${this.baseUrl}/products/${productId}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      throw error;
    }
  }

  /**
   * Get analytics dashboard data (admin only)
   */
  async getAnalyticsDashboard() {
    try {
      const response = await apiService.get(
        `${this.baseUrl}/dashboard`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics dashboard:', error);
      throw error;
    }
  }

  /**
   * Track product view from product card click
   * @param {object} product - Product object
   * @param {object} context - Context information
   */
  trackProductCardClick(product, context = {}) {
    const {
      userType = 'individual',
      listType = 'general', // general, search, category, popular, recommended
      position,
      source = 'product-card'
    } = context;

    const trackingSource = `${source}-${listType}${position ? `-pos${position}` : ''}`;
    
    this.trackProductView(product._id, {
      userType,
      source: trackingSource,
      debounceMs: 500 // Shorter debounce for clicks
    });
  }

  /**
   * Track product view from product details page
   * @param {string} productId - Product ID
   * @param {object} context - Context information
   */
  trackProductPageView(productId, context = {}) {
    const {
      userType = 'individual',
      referrer = 'direct',
      source = 'product-page'
    } = context;

    const trackingSource = `${source}-${referrer}`;
    
    this.trackProductView(productId, {
      userType,
      source: trackingSource,
      immediate: true // Product page views are tracked immediately
    });
  }

  /**
   * Utility to determine user type from auth context
   * @param {object} user - User object from auth context
   */
  getUserType(user) {
    if (!user) return 'guest';
    
    // Check if user has corporate features
    if (user.userType === 'corporate' || 
        user.corporateDetails || 
        user.role === 'corporate') {
      return 'corporate';
    }
    
    return 'individual';
  }

  /**
   * Create tracking-enabled product card props
   * @param {object} product - Product object
   * @param {object} context - Context information
   */
  createTrackingProps(product, context = {}) {
    return {
      onClick: () => this.trackProductCardClick(product, context),
      onMouseEnter: () => {
        // Optional: Track hover/preview events
        if (context.trackHover) {
          this.trackProductView(product._id, {
            ...context,
            source: 'product-hover',
            debounceMs: 2000
          });
        }
      }
    };
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export { analyticsService };
export default analyticsService;
