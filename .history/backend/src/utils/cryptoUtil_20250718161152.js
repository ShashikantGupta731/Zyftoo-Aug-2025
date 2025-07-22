const crypto = require('crypto');
require('dotenv').config();

// Algorithm for encryption
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // For GCM, this is the recommended size
const TAG_LENGTH = 16; // For GCM, this is the recommended size

/**
 * Get encryption key from environment variables
 * @returns {string} Encryption key
 */
const getEncryptionKey = () => {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('ENCRYPTION_KEY is not defined in environment variables');
    }
    
    // Ensure key is 32 bytes for AES-256
    return crypto.createHash('sha256').update(key).digest();
};

/**
 * Encrypts an object and returns a cipher string
 * @param {object} data - The data object to encrypt
 * @returns {string} Encrypted string with IV and auth tag
 */
const encryptData = (data) => {
    try {
        const key = getEncryptionKey();
        const jsonString = JSON.stringify(data);
        
        // Generate random IV
        const iv = crypto.randomBytes(IV_LENGTH);
        
        // Create cipher
        const cipher = crypto.createCipher('aes-256-cbc', key);
        
        // Encrypt the data
        let encrypted = cipher.update(jsonString, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // Combine IV and encrypted data
        const result = iv.toString('hex') + ':' + encrypted;
        
        return result;
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
        
        // Split IV and encrypted data
        const parts = cipher.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid cipher format');
        }
        
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedData = parts[1];
        
        // Create decipher
        const decipher = crypto.createDecipher('aes-256-cbc', key);
        
        // Decrypt the data
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        // Parse and return the object
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt data');
    }
};

/**
 * Enhanced encryption using AES-256-GCM for better security
 * @param {object} data - The data object to encrypt
 * @returns {string} Encrypted string with IV and auth tag
 */
const encryptDataGCM = (data) => {
    try {
        const key = getEncryptionKey();
        const jsonString = JSON.stringify(data);
        
        // Generate random IV
        const iv = crypto.randomBytes(IV_LENGTH);
        
        // Create cipher
        const cipher = crypto.createCipherGCM(ALGORITHM, key, iv);
        
        // Encrypt the data
        let encrypted = cipher.update(jsonString, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // Get the authentication tag
        const tag = cipher.getAuthTag();
        
        // Combine IV, tag, and encrypted data
        const result = iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
        
        return result;
    } catch (error) {
        console.error('GCM Encryption error:', error);
        throw new Error('Failed to encrypt data with GCM');
    }
};

/**
 * Enhanced decryption using AES-256-GCM for better security
 * @param {string} cipher - The encrypted string to decrypt
 * @returns {object} Decrypted and parsed object
 */
const decryptDataGCM = (cipher) => {
    try {
        const key = getEncryptionKey();
        
        // Split IV, tag, and encrypted data
        const parts = cipher.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid GCM cipher format');
        }
        
        const iv = Buffer.from(parts[0], 'hex');
        const tag = Buffer.from(parts[1], 'hex');
        const encryptedData = parts[2];
        
        // Create decipher
        const decipher = crypto.createDecipherGCM(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);
        
        // Decrypt the data
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        // Parse and return the object
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('GCM Decryption error:', error);
        throw new Error('Failed to decrypt data with GCM');
    }
};

/**
 * Utility function to encrypt sensitive data before storing in database
 * @param {object} data - Data to encrypt
 * @returns {string} Encrypted string
 */
const encryptForStorage = (data) => {
    return encryptDataGCM(data);
};

/**
 * Utility function to decrypt data retrieved from database
 * @param {string} encryptedData - Encrypted string from database
 * @returns {object} Decrypted object
 */
const decryptFromStorage = (encryptedData) => {
    return decryptDataGCM(encryptedData);
};

module.exports = {
    encryptData,
    decryptData,
    encryptDataGCM,
    decryptDataGCM,
    encryptForStorage,
    decryptFromStorage
};
