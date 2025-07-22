const CryptoJS = require('crypto-js');
require('dotenv').config();

/**
 * Get encryption key from environment variables
 * @returns {string} Encryption key
 */
const getEncryptionKey = () => {
    const key = process.env.ENCRYPTION_KEY;
    console.log('🔑 DEBUG: Checking encryption key...');
    console.log('🔑 Key exists:', !!key);
    console.log('🔑 Key length:', key?.length || 0);
    console.log('🔑 Key value:', key ? key.substring(0, 8) + '...' : 'UNDEFINED');
    
    if (!key) {
        console.error('❌ ENCRYPTION_KEY is not defined in environment variables');
        throw new Error('ENCRYPTION_KEY is not defined in environment variables');
    }
    return key;
};

/**
 * Encrypts an object and returns a cipher string
 * @param {object} data - The data object to encrypt
 * @returns {string} Encrypted string
 */
const encryptData = (data) => {
    try {
        const key = getEncryptionKey();
        const jsonString = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
        return encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
};

/**
 * Decrypts a cipher string and returns the parsed object
 * @param {string} cipher - The encrypted string to decrypt
 * @returns {object} Decrypted and parsed object
 */
const decryptData = (cipher) => {
    try {
        const key = getEncryptionKey();
        const decryptedBytes = CryptoJS.AES.decrypt(cipher, key);
        const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
        
        if (!decryptedString) {
            throw new Error('Failed to decrypt data - invalid cipher or key');
        }
        
        return JSON.parse(decryptedString);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
};

/**
 * Utility function to encrypt sensitive data before storing in database
 * @param {object} data - Data to encrypt
 * @returns {string} Encrypted string
 */
const encryptForStorage = (data) => {
    return encryptData(data);
};

/**
 * Utility function to decrypt data retrieved from database
 * @param {string} encryptedData - Encrypted string from database
 * @returns {object} Decrypted object
 */
const decryptFromStorage = (encryptedData) => {
    return decryptData(encryptedData);
};

/**
 * Encrypt sensitive fields in user data (e.g., payment info, personal details)
 * @param {object} userData - User data object
 * @param {string[]} fieldsToEncrypt - Array of field names to encrypt
 * @returns {object} Object with specified fields encrypted
 */
const encryptUserFields = (userData, fieldsToEncrypt = []) => {
    try {
        const result = { ...userData };
        
        fieldsToEncrypt.forEach(field => {
            if (result[field] !== undefined && result[field] !== null) {
                result[field] = encryptData(result[field]);
            }
        });
        
        return result;
    } catch (error) {
        console.error('Error encrypting user fields:', error);
        throw error;
    }
};

/**
 * Decrypt sensitive fields in user data
 * @param {object} userData - User data object with encrypted fields
 * @param {string[]} fieldsToDecrypt - Array of field names to decrypt
 * @returns {object} Object with specified fields decrypted
 */
const decryptUserFields = (userData, fieldsToDecrypt = []) => {
    try {
        const result = { ...userData };
        
        fieldsToDecrypt.forEach(field => {
            if (result[field] !== undefined && result[field] !== null) {
                result[field] = decryptData(result[field]);
            }
        });
        
        return result;
    } catch (error) {
        console.error('Error decrypting user fields:', error);
        throw error;
    }
};

module.exports = {
    encryptData,
    decryptData,
    encryptForStorage,
    decryptFromStorage,
    encryptUserFields,
    decryptUserFields
};
