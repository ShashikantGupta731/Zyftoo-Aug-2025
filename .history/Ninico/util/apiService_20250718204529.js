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
    // Add auth token if available
    if (typeof window !== 'undefined') {
      try {
        const { getAuthToken } = require('./cryptoHelper');
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Clear invalid tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Encrypt data using AES encryption
 */
export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY, {
      iv: CryptoJS.enc.Utf8.parse(ENCRYPTION_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data using AES decryption
 */
export const decryptData = (encryptedData) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY, {
      iv: CryptoJS.enc.Utf8.parse(ENCRYPTION_IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
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

    const response = await apiClient.post(endpoint, requestData, config);
    
    let responseData = response.data;
    
    // Decrypt response body if it exists and contains encrypted data
    if (responseData.body && typeof responseData.body === 'string') {
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
    console.error('POST request error:', error);
    throw {
      data: null,
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
export const uploadFile = async (endpoint, formData, config = {}) => {
  try {
    const response = await apiClient.post(endpoint, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      }
    });

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
