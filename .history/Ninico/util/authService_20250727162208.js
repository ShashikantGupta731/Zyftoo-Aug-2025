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
      const response = await post(AUTH.LOGIN, credentials, encrypt);
      
      // Store auth token if login successful
      if (response.success && response.data?.data?.token) {
        const storage = credentials.rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', response.data.data.token);
        storage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
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
      const response = await post(AUTH.SIGNUP, userData, encrypt);
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
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
      const response = await post(OTP.SEND, otpData, encrypt);
      return response;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
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
      const response = await post(OTP.VERIFY, verifyData, encrypt);
      return response;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
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
