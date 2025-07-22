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
 * Encrypts data and returns a cipher string (matches frontend crypto-js format)
 * @param {any} data - The data to encrypt
 * @returns {string} Encrypted string
 */
const encryptData = (data) => {
    try {
        console.log('🔒 Backend DEBUG: Starting encryption...');
        console.log('📝 Input data:', data);
        console.log('📝 Data type:', typeof data);
        
        const key = getEncryptionKey();
        console.log('🔑 Using key for encryption (first 8 chars):', key.substring(0, 8) + '...');
        
        const jsonString = JSON.stringify(data);
        console.log('📝 JSON string:', jsonString);
        console.log('📝 JSON string length:', jsonString.length);
        
        // Use the exact same method as frontend
        const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
        console.log('🔒 Encrypted result:', encrypted);
        console.log('🔒 Encrypted length:', encrypted.length);
        
        return encrypted;
    } catch (error) {
        console.error('❌ Backend encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
};

/**
 * Decrypts a cipher string and returns the parsed data (matches frontend crypto-js format)
 * @param {string} cipherText - The encrypted string to decrypt
 * @returns {any} Decrypted and parsed data
 */
const decryptData = (cipherText) => {
    console.log('🔓 Backend DEBUG: Starting decryption...');
    console.log('📝 Input cipher:', cipherText);
    console.log('📝 Cipher type:', typeof cipherText);
    console.log('📝 Cipher length:', cipherText?.length || 0);
    
    try {
        const key = getEncryptionKey();
        console.log('🔑 Using key for decryption (first 8 chars):', key.substring(0, 8) + '...');
        
        // Use the exact same method as frontend
        const decryptedBytes = CryptoJS.AES.decrypt(cipherText, key);
        const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
        
        console.log('🔓 Decrypted string:', decryptedString);
        console.log('🔓 Decrypted string length:', decryptedString.length);
        
        if (!decryptedString) {
            console.error('❌ Failed to decrypt data - empty result');
            throw new Error('Failed to decrypt data - invalid cipher or key');
        }
        
        const parsed = JSON.parse(decryptedString);
        console.log('✅ Successfully parsed JSON:', parsed);
        return parsed;
    } catch (error) {
        console.error('❌ Backend decryption error details:', {
            message: error.message,
            cipher: cipherText
        });
        throw new Error('Failed to decrypt data: ' + error.message);
    }
};

module.exports = {
    encryptData,
    decryptData
};
