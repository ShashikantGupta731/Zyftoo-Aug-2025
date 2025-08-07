import CryptoJS from 'crypto-js';

/**
 * Get encryption key from environment variables with debug logging
 */
const getEncryptionKey = () => {
    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    console.log('🔑 DEBUG: Checking encryption key...');
    console.log('🔑 Key exists:', !!key);
    console.log('🔑 Key length:', key?.length || 0);
    console.log('🔑 Key value:', key ? key.substring(0, 8) + '...' : 'UNDEFINED');
    
    if (!key) {
        console.error('❌ NEXT_PUBLIC_ENCRYPTION_KEY is not defined');
        throw new Error('NEXT_PUBLIC_ENCRYPTION_KEY is not defined');
    }
    return key;
};

/**
 * Encrypts data using the same method as backend
 */
export const encryptData = (data) => {
    try {
        console.log('🔒 Frontend DEBUG: Starting encryption...');
        console.log('📝 Input data:', data);
        console.log('📝 Data type:', typeof data);
        
        const key = getEncryptionKey();
        console.log('🔑 Using key for encryption (first 8 chars):', key.substring(0, 8) + '...');
        
        const jsonString = JSON.stringify(data);
        console.log('📝 JSON string:', jsonString);
        console.log('📝 JSON string length:', jsonString.length);
        
        const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
        console.log('🔒 Encrypted result:', encrypted);
        console.log('🔒 Encrypted length:', encrypted.length);
        
        return encrypted;
    } catch (error) {
        console.error('❌ Frontend encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
};

/**
 * Decrypts data using the same method as backend
 */
export const decryptData = (cipherText) => {
    console.log('🔓 Frontend DEBUG: Starting decryption...');
    console.log('📝 Input cipher:', cipherText);
    console.log('📝 Cipher type:', typeof cipherText);
    console.log('📝 Cipher length:', cipherText?.length || 0);
    
    try {
        const key = getEncryptionKey();
        console.log('🔑 Using key for decryption (first 8 chars):', key.substring(0, 8) + '...');
        
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
        console.error('❌ Frontend decryption error details:', {
            message: error.message,
            cipher: cipherText
        });
        throw new Error('Failed to decrypt data: ' + error.message);
    }
};

// Keep the storage utility functions
export const encryptAndStore = (key, data) => {
    try {
        const encrypted = encryptData(data);
        localStorage.setItem(key, encrypted);
        console.log('💾 Data encrypted and stored at key:', key);
    } catch (error) {
        console.error('❌ Failed to encrypt and store data:', error);
        throw error;
    }
};

export const decryptAndRetrieve = (key) => {
    try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) {
            console.log('⚠️ No data found for key:', key);
            return null;
        }
        
        const decrypted = decryptData(encrypted);
        console.log('🔓 Successfully retrieved and decrypted data for key:', key);
        return decrypted;
    } catch (error) {
        console.error('❌ Failed to decrypt and retrieve data:', error);
        return null;
    }
};