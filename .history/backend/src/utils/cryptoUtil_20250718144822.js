const CryptoJS = require('crypto-js');

// Get encryption secret from environment variables
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'default-secret-key-change-in-production';

/**
 * Encrypt data using AES encryption
 * @param {string|object} data - Data to encrypt
 * @returns {string} - Encrypted string
 */
const encrypt = (data) => {
  try {
    // Convert object to string if necessary
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Encrypt using AES
    const encrypted = CryptoJS.AES.encrypt(stringData, ENCRYPTION_SECRET).toString();
    
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data using AES decryption
 * @param {string} encryptedData - Encrypted string to decrypt
 * @returns {object|string} - Decrypted data
 */
const decrypt = (encryptedData) => {
  try {
    // Decrypt using AES
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_SECRET);
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      throw new Error('Failed to decrypt data - invalid key or corrupted data');
    }
    
    // Try to parse as JSON, if it fails return as string
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

/**
 * Create encrypted response format
 * @param {object} data - Data to encrypt and send
 * @returns {object} - Response with encrypted body
 */
const createEncryptedResponse = (data) => {
  try {
    const encryptedBody = encrypt(data);
    return {
      success: true,
      body: encryptedBody,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating encrypted response:', error);
    throw new Error('Failed to create encrypted response');
  }
};

/**
 * Validate if string is properly encrypted
 * @param {string} data - Data to validate
 * @returns {boolean} - True if data appears to be encrypted
 */
const isValidEncryptedData = (data) => {
  if (typeof data !== 'string' || data.length === 0) {
    return false;
  }
  
  // Basic check for base64-like structure (AES encrypted data)
  const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
  return base64Pattern.test(data) && data.length > 16;
};

module.exports = {
  encrypt,
  decrypt,
  createEncryptedResponse,
  isValidEncryptedData
};
