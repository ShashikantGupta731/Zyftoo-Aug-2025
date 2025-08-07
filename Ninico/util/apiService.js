/**
 * Encrypted API Service
 * Provides secure API communication with optional encryption/decryption
 */

import axios from 'axios';
import CryptoJS from 'crypto-js';
import { API_BASE_URL } from './apiEndpoints.js';

// Encryption configuration
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-32-character-secret-key';
const ENCRYPTION_IV = process.env.NEXT_PUBLIC_ENCRYPTION_IV || 'default-16-chars';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Skip auth for auth endpoints (login, signup, etc.)
    const isAuthEndpoint = config.url.includes('/auth/') || 
                          config.url.includes('/adminlogin') ||
                          config.url.includes('/login') ||
                          config.url.includes('/signup');
    
    if (isAuthEndpoint) {
      console.log('🔓 Skipping auth for endpoint:', config.url);
      return config;
    }

    // Add auth token if available for non-auth endpoints
    if (typeof window !== 'undefined') {
      // For all non-auth requests, try to add token
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('authToken')
      
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`
        console.log('� Token added to request:', config.url)
        
        // Add admin request header if this might be an admin operation
        if (config.url.includes('/admin') || config.params?.adminView === 'true') {
          config.headers['x-admin-request'] = 'true'
          console.log('👨‍💼 Admin request header added')
        }
      } else {
        console.warn('⚠️ No auth token found for request:', config.url)
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and decryption
apiClient.interceptors.response.use(
  (response) => {
    // Check if response is encrypted
    if (response.data && typeof response.data === 'string' && response.data.startsWith('U2FsdGVk')) {
      try {
        console.log('🔐 Encrypted response detected, attempting decryption');
        // Decrypt the response
        const decryptedText = CryptoJS.AES.decrypt(
          response.data,
          ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8);
        
        const decryptedData = JSON.parse(decryptedText);
        console.log('🔓 Successfully decrypted response:', decryptedData);
        
        // Return decrypted data with encryption flag
        return {
          ...response,
          data: decryptedData,
          encryptedData: true
        };
      } catch (decryptError) {
        console.error('❌ Failed to decrypt response:', decryptError);
        return response;
      }
    }
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Clear invalid tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('adminToken');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Encrypt data using AES encryption (matches backend implementation)
 */
export const encryptData = (data) => {
  try {
    console.log('🔒 [Frontend] Starting encryption...');
    console.log('📝 [Frontend] Input data:', data);
    console.log('📝 [Frontend] Data type:', typeof data);
    
    const key = ENCRYPTION_KEY;
    console.log('🔑 [Frontend] Using key (first 8 chars):', key.substring(0, 8) + '...');
    
    const jsonString = JSON.stringify(data);
    console.log('📝 [Frontend] JSON string:', jsonString);
    console.log('📝 [Frontend] JSON string length:', jsonString.length);
    
    // Use the exact same method as backend (without IV)
    const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
    console.log('🔒 [Frontend] Encrypted result:', encrypted);
    console.log('🔒 [Frontend] Encrypted length:', encrypted.length);
    
    return encrypted;
  } catch (error) {
    console.error('❌ [Frontend] Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data using AES decryption (matches backend implementation)
 */
export const decryptData = (encryptedData) => {
  try {
    console.log('🔓 [Frontend] Starting decryption...');
    console.log('📝 [Frontend] Input cipher:', encryptedData);
    console.log('📝 [Frontend] Cipher length:', encryptedData?.length || 0);
    
    // Use the same key as backend
    const key = ENCRYPTION_KEY;
    console.log('🔑 [Frontend] Using key (first 8 chars):', key.substring(0, 8) + '...');
    
    // Use the exact same method as backend (without IV)
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    console.log('🔓 [Frontend] Decrypted string:', decryptedString);
    console.log('🔓 [Frontend] Decrypted string length:', decryptedString.length);
    
    if (!decryptedString) {
      console.error('❌ [Frontend] Failed to decrypt data - empty result');
      throw new Error('Failed to decrypt data - invalid cipher or key');
    }
    
    const parsed = JSON.parse(decryptedString);
    console.log('✅ [Frontend] Successfully parsed JSON:', parsed);
    return parsed;
  } catch (error) {
    console.error('❌ [Frontend] Decryption error:', error);
    throw new Error('Failed to decrypt data: ' + error.message);
  }
};

/**
 * POST request with optional encryption
 */
export const post = async (endpoint, payload = {}, encrypt = false, config = {}) => {
  try {
    let requestData = payload;
    
    // Encrypt payload if requested
    if (encrypt && payload) {
      requestData = {
        encryptedData: encryptData(payload)
      };
    }

    console.log('🚀 Sending request to:', endpoint);
    console.log('📦 Request payload:', requestData);

    const response = await apiClient.post(endpoint, requestData, config);
    
    console.log('✅ Response received:', response.data);

    // For admin login, return the raw axios response to maintain compatibility
    if (endpoint.includes('/adminlogin') || endpoint.includes('/auth/')) {
      return response;
    }

    // Handle both encrypted and unencrypted responses for other endpoints
    const responseData = response.data;
    
    // If it was encrypted, response.encryptedData will be true
    // and response.data will already be decrypted by the interceptor
    return {
      ...responseData,
      success: response.status >= 200 && response.status < 300,
      status: response.status
    };
  } catch (error) {
    console.error('POST request error:', error);
    throw {
      data: error.response?.data || null,
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Request failed'
    };
  }
};

/**
 * GET request with optional decryption
 */
export const get = async (endpoint, params, decrypt = false, config = {}) => {
  try {
    const response = await apiClient.get(endpoint, {
      ...config,
      params
    });
    
    let responseData = response.data;
    
    // Decrypt response body if requested and it exists
    if (decrypt && responseData.body && typeof responseData.body === 'string') {
      try {
        responseData.body = decryptData(responseData.body);
      } catch (error) {
        // If decryption fails, keep original data
        console.warn('Failed to decrypt response body, using raw data');
      }
    }

    return {
      data: responseData,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      message: responseData.message
    };
  } catch (error) {
    console.error('GET request error:', error);
    throw {
      data: null,
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Request failed'
    };
  }
};

/**
 * PUT request with optional encryption
 */
export const put = async (endpoint, payload = {}, encrypt = false, config = {}) => {
  try {
    let requestData = payload;
    
    // Encrypt payload if requested
    if (encrypt && payload) {
      requestData = {
        encryptedData: encryptData(payload)
      };
    }

    const response = await apiClient.put(endpoint, requestData, config);
    
    let responseData = response.data;
    
    // Decrypt response body if it exists and contains encrypted data
    if (responseData.body && typeof responseData.body === 'string') {
      try {
        responseData.body = decryptData(responseData.body);
      } catch (error) {
        console.warn('Failed to decrypt response body, using raw data');
      }
    }

    return {
      data: responseData,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      message: responseData.message
    };
  } catch (error) {
    console.error('PUT request error:', error);
    throw {
      data: null,
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Request failed'
    };
  }
};

/**
 * DELETE request
 */
export const del = async (endpoint, config = {}) => {
  try {
    const response = await apiClient.delete(endpoint, config);
    
    let responseData = response.data;
    
    // Decrypt response body if it exists and contains encrypted data
    if (responseData.body && typeof responseData.body === 'string') {
      try {
        responseData.body = decryptData(responseData.body);
      } catch (error) {
        console.warn('Failed to decrypt response body, using raw data');
      }
    }

    return {
      data: responseData,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      message: responseData.message
    };
  } catch (error) {
    console.error('DELETE request error:', error);
    throw {
      data: null,
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Request failed'
    };
  }
};

/**
 * File upload with multipart/form-data
 */
export const uploadFile = async (endpoint, formData, method = 'POST', config = {}) => {
  try {
    let response;
    const requestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      }
    };

    // Use the appropriate HTTP method
    switch (method.toUpperCase()) {
      case 'PUT':
        response = await apiClient.put(endpoint, formData, requestConfig);
        break;
      case 'PATCH':
        response = await apiClient.patch(endpoint, formData, requestConfig);
        break;
      case 'POST':
      default:
        response = await apiClient.post(endpoint, formData, requestConfig);
        break;
    }

    return {
      data: response.data,
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      message: response.data.message
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw {
      data: null,
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message || 'Upload failed'
    };
  }
};

// Export the axios instance for direct use (backward compatibility)
export default apiClient;

// Export all methods as named exports
export const apiService = {
  get,
  post,
  put,
  delete: del,
  uploadFile,
  encryptData,
  decryptData
};
