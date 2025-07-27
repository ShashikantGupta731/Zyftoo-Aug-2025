/**
 * Authentication Service
 * Provides authentication-specific API methods using the generic API service
 */

import { get, post } from './apiService.js';
import { AUTH, OTP } from './apiEndpoints.js';

/**
 * Authentication Service Class
 */
class AuthService {
  
  /**
   * Check if user exists by phone number
   * @param {string} phone - Phone number to check
   * @returns {Promise<Object>} - User existence result
   */
  async checkUserByPhone(phone) {
    try {
      const response = await get(`${AUTH.CHECK_USER}/${phone}`);
      return response;
    } catch (error) {
      console.error('Check user by phone error:', error);
      throw error;
    }
  }

  /**
   * Check if user exists by email (for corporate flow)
   * @param {string} email - Email to check
   * @returns {Promise<Object>} - User existence result with userType
   */
  async checkUserByEmail(email) {
    try {
      const response = await get(`${AUTH.CHECK_USER_EMAIL}/${encodeURIComponent(email)}`);
      return response;
    } catch (error) {
      console.error('Check user by email error:', error);
      throw error;
    }
  }

  /**
   * User login
   * @param {Object} credentials - Login credentials
   * @param {boolean} encrypt - Whether to encrypt the request
   * @returns {Promise<Object>} - Login result
   */
  async login(credentials, encrypt = true) {
    try {
      console.log('🔐 [AuthService] Login attempt:', { 
        hasEmail: !!credentials.email, 
        hasPhone: !!credentials.phone, 
        userType: credentials.userType 
      })
      
      const response = await post(AUTH.LOGIN, credentials, encrypt);
      
      console.log('📥 [AuthService] Login response received:', { 
        success: response.success, 
        hasData: !!response.data 
      })
      
      // Store auth token if login successful
      if (response.success && response.data?.data?.token) {
        const storage = credentials.rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', response.data.data.token);
        storage.setItem('user', JSON.stringify(response.data.data.user));
        console.log('💾 [AuthService] Auth data stored successfully')
      } else if (response.success && response.data?.token) {
        // Handle alternative token structure
        const storage = credentials.rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', response.data.token);
        storage.setItem('user', JSON.stringify(response.data.user));
        console.log('💾 [AuthService] Auth data stored successfully (alt structure)')
      }
      
      return response;
    } catch (error) {
      console.error('❌ [AuthService] Login error:', error);
      
      // Enhanced error handling for corporate login
      if (error.response?.status === 401) {
        if (credentials.userType === 'Corporate') {
          throw new Error('Invalid corporate email or password');
        } else {
          throw new Error('Invalid credentials');
        }
      }
      
      throw error;
    }
  }

  /**
   * User signup/registration
   * @param {Object} userData - User registration data
   * @param {boolean} encrypt - Whether to encrypt the request
   * @returns {Promise<Object>} - Registration result
   */
  async signup(userData, encrypt = true) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await post(AUTH.SIGNUP, userData, encrypt, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (response.data?.success) {
        return {
          success: true,
          message: response.data.message,
          data: response.data
        };
      }
      
      return {
        success: false,
        message: response.data?.message || 'Registration failed'
      };
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timeout. Please check your connection and try again.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Registration failed'
      };
    }
  }

  /**
   * Password reset
   * @param {Object} resetData - Password reset data
   * @param {boolean} encrypt - Whether to encrypt the request
   * @returns {Promise<Object>} - Reset result
   */
  async resetPassword(resetData, encrypt = true) {
    try {
      const response = await post(AUTH.RESET_PASSWORD, resetData, encrypt);
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Send OTP
   * @param {Object} otpData - OTP request data
   * @param {boolean} encrypt - Whether to encrypt the request
   * @returns {Promise<Object>} - OTP send result
   */
  async sendOTP(otpData, encrypt = true) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await post(OTP.SEND, otpData, encrypt, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      return {
        success: true,
        message: response.data?.message || 'OTP sent successfully'
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timeout. Please check your connection and try again.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to send OTP'
      };
    }
  }

  /**
   * Verify OTP
   * @param {Object} verifyData - OTP verification data
   * @param {boolean} encrypt - Whether to encrypt the request
   * @returns {Promise<Object>} - OTP verification result
   */
  async verifyOTP(verifyData, encrypt = true) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await post(OTP.VERIFY, verifyData, encrypt, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      return {
        success: true,
        message: response.data?.message || 'OTP verified successfully'
      };
    } catch (error) {
      console.error('Verify OTP error:', error);
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Request timeout. Please check your connection and try again.'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Invalid OTP'
      };
    }
  }

  /**
   * Logout user
   */
  logout() {
    // Clear all auth data from storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  }

  /**
   * Get current user from storage
   * @returns {Object|null} - Current user data
   */
  getCurrentUser() {
    try {
      const userFromLocal = localStorage.getItem('user');
      const userFromSession = sessionStorage.getItem('user');
      const userData = userFromLocal || userFromSession;
      
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Get current auth token
   * @returns {string|null} - Current auth token
   */
  getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - Authentication status
   */
  isAuthenticated() {
    return !!this.getAuthToken();
  }
}

// Export singleton instance
export default new AuthService();
