/**
 * Frontend Encryption Utility
 * This utility can be used in the React frontend to encrypt/decrypt API communications
 * 
 * Installation required in frontend:
 * npm install crypto-js
 */

// Example implementation for React frontend
const frontendCryptoExample = `
// utils/cryptoUtils.js (Frontend)
import CryptoJS from 'crypto-js';

const ENCRYPTION_SECRET = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET || 'aes256-encryption-secret-key-32-chars-long!';

export const encrypt = (data) => {
  try {
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(stringData, ENCRYPTION_SECRET).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decrypt = (encryptedData) => {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_SECRET);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      throw new Error('Failed to decrypt data');
    }
    
    try {
      return JSON.parse(decryptedData);
    } catch (parseError) {
      return decryptedData;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

// API utility with encryption
export const encryptedApiCall = async (url, options = {}) => {
  try {
    // Encrypt request body if present
    if (options.body) {
      const encryptedBody = encrypt(options.body);
      options.body = JSON.stringify({ body: encryptedBody });
    }

    // Make API call
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();

    // Decrypt response if encrypted
    if (data.body && typeof data.body === 'string') {
      const decryptedResponse = decrypt(data.body);
      return {
        ...data,
        ...decryptedResponse
      };
    }

    return data;
  } catch (error) {
    console.error('Encrypted API call error:', error);
    throw error;
  }
};

// Usage examples:

// 1. Login with encryption
const loginUser = async (credentials) => {
  return await encryptedApiCall('/api/v1/auth/login', {
    method: 'POST',
    body: credentials,
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
};

// 2. Register with encryption
const registerUser = async (userData) => {
  return await encryptedApiCall('/api/v1/auth/register', {
    method: 'POST',
    body: userData
  });
};

// 3. Get profile with encrypted response
const getUserProfile = async (token) => {
  return await encryptedApiCall('/api/v1/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
};
`;

/**
 * Postman/Testing Examples
 */
const postmanExamples = `
// Postman Pre-request Script for encryption
const CryptoJS = require('crypto-js');
const ENCRYPTION_SECRET = 'aes256-encryption-secret-key-32-chars-long!';

// Get the request body
const requestBody = JSON.parse(pm.request.body.raw);

// Encrypt the body
const encryptedBody = CryptoJS.AES.encrypt(JSON.stringify(requestBody), ENCRYPTION_SECRET).toString();

// Set the encrypted body
pm.request.body.update({
  mode: 'raw',
  raw: JSON.stringify({ body: encryptedBody })
});

// Postman Test Script for decryption
const CryptoJS = require('crypto-js');
const ENCRYPTION_SECRET = 'aes256-encryption-secret-key-32-chars-long!';

// Get the response
const responseJson = pm.response.json();

if (responseJson.body) {
  // Decrypt the response
  const decryptedBytes = CryptoJS.AES.decrypt(responseJson.body, ENCRYPTION_SECRET);
  const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
  
  console.log('Decrypted Response:', decryptedData);
  
  // Set as environment variable for next requests
  pm.environment.set('decryptedResponse', JSON.stringify(decryptedData));
}
`;

/**
 * cURL Examples for testing
 */
const curlExamples = `
# Test health endpoint (no encryption)
curl -X GET http://localhost:5000/health

# Test login with encryption (you'll need to encrypt the body first)
curl -X POST http://localhost:5000/api/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"body":"U2FsdGVkX19..."}'  # This should be the encrypted JSON

# Test with legacy endpoint (no encryption required)
curl -X POST http://localhost:5000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"password123"}'
`;

/**
 * Environment Variables for Frontend
 */
const frontendEnvExample = `
# .env.local (Next.js frontend)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ENCRYPTION_SECRET=aes256-encryption-secret-key-32-chars-long!
NEXT_PUBLIC_API_VERSION=v1
`;

/**
 * React Hook Example for Encrypted Auth
 */
const reactHookExample = `
// hooks/useEncryptedAuth.js
import { useState, useContext } from 'react';
import { encryptedApiCall } from '../utils/cryptoUtils';

export const useEncryptedAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await encryptedApiCall('/api/v1/auth/login', {
        method: 'POST',
        body: credentials
      });

      if (response.success) {
        // Store token securely
        localStorage.setItem('token', response.token);
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await encryptedApiCall('/api/v1/auth/register', {
        method: 'POST',
        body: userData
      });

      if (response.success) {
        localStorage.setItem('token', response.token);
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};
`;

module.exports = {
  frontendCryptoExample,
  postmanExamples,
  curlExamples,
  frontendEnvExample,
  reactHookExample
};
