/**
 * API Service Usage Examples
 * This file demonstrates how to use the new encrypted API service
 * alongside existing fetch calls for backward compatibility
 */

import { post, get, put, del } from './apiService.js';
import { AUTH, USER, PRODUCT, OTP, buildUrl, withId } from './apiEndpoints.js';

// ============================================================================
// EXAMPLE 1: Migration from fetch to encrypted API service
// ============================================================================

// OLD WAY (still works, not encrypted)
export const loginWithFetch = async (phone, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone, password }),
  });
  return response.json();
};

// NEW WAY (encrypted, secure)
export const loginWithEncryption = async (phone, password) => {
  const response = await post(AUTH.LOGIN, { phone, password }, true); // encrypt=true
  return response.data;
};

// NEW WAY (unencrypted but with better error handling)
export const loginWithApiService = async (phone, password) => {
  const response = await post(AUTH.LOGIN, { phone, password }, false); // encrypt=false
  return response.data;
};

// ============================================================================
// EXAMPLE 2: User Management Examples
// ============================================================================

// Get user profile (with decryption if server sends encrypted data)
export const getUserProfile = async (userId) => {
  const response = await get(withId(USER.PROFILE, userId), undefined, true); // decrypt=true
  return response.data;
};

// Update user profile (with encryption)
export const updateUserProfile = async (userId, profileData) => {
  const response = await put(withId(USER.UPDATE_PROFILE, userId), profileData, true); // encrypt=true
  return response.data;
};

// ============================================================================
// EXAMPLE 3: Product Management Examples
// ============================================================================

// Get all products (no encryption needed for public data)
export const getAllProducts = async (filters) => {
  const response = await get(PRODUCT.GET_ALL, filters, false); // decrypt=false
  return response.data;
};

// Create product (admin only, with encryption)
export const createProduct = async (productData) => {
  const response = await post(PRODUCT.CREATE, productData, true); // encrypt=true
  return response.data;
};

// ============================================================================
// EXAMPLE 4: Authentication Examples
// ============================================================================

// Sign up with encrypted sensitive data
export const signUp = async (userData) => {
  const response = await post(AUTH.SIGNUP, userData, true); // encrypt=true
  return response.data;
};

// Check if user exists (no encryption needed)
export const checkUserExists = async (phone) => {
  const response = await get(`${AUTH.CHECK_USER}/${phone}`, undefined, false);
  return response.data;
};

// ============================================================================
// EXAMPLE 5: OTP Examples
// ============================================================================

// Send OTP (encrypt phone number for privacy)
export const sendOTP = async (phone, purpose) => {
  const response = await post(OTP.SEND, { phone, purpose }, true); // encrypt=true
  return response.data;
};

// Verify OTP (encrypt sensitive data)
export const verifyOTP = async (phone, otp, purpose) => {
  const response = await post(OTP.VERIFY, { phone, otp, purpose }, true); // encrypt=true
  return response.data;
};

// ============================================================================
// EXAMPLE 6: Mixed Usage - Gradual Migration
// ============================================================================

// You can mix old fetch calls with new API service calls
export const mixedExample = async () => {
  // Old fetch call (still works)
  const oldResponse = await fetch('http://localhost:5000/api/products');
  const products = await oldResponse.json();

  // New API service call (with better error handling)
  const userResponse = await get(USER.PROFILE, undefined, false);
  const user = userResponse.data;

  return { products, user };
};

// ============================================================================
// EXAMPLE 7: Error Handling
// ============================================================================

export const exampleWithErrorHandling = async () => {
  try {
    const response = await post(AUTH.LOGIN, { phone: '1234567890', password: 'test' }, true);
    
    if (response.success) {
      console.log('Login successful:', response.data);
      return response.data;
    } else {
      console.error('Login failed:', response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.error('API call failed:', error.message);
    // Handle error appropriately
    throw error;
  }
};

// ============================================================================
// EXAMPLE 8: Using buildUrl helper
// ============================================================================

export const searchProducts = async (query, category) => {
  const searchUrl = buildUrl(PRODUCT.SEARCH, { 
    q: query, 
    category: category || '' 
  });
  
  // You can use with fetch (old way)
  const fetchResponse = await fetch(searchUrl);
  
  // Or with new API service
  const apiResponse = await get(PRODUCT.SEARCH, { q: query, category });
  
  return apiResponse.data;
};
