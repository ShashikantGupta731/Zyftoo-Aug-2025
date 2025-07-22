import CryptoJS from 'crypto-js';

// Get encryption key from environment variables
const getEncryptionKey = (): string => {
    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    
    if (!key) {
        throw new Error('NEXT_PUBLIC_ENCRYPTION_KEY is not defined in environment variables');
    }
    return key;
};

/**
 * Encrypts any data (object, string, number, etc.) and returns a cipher string
 * @param data - The data to encrypt
 * @returns Encrypted string
 */
export const encryptData = (data: any): string => {
    console.log('🔒 Frontend DEBUG: Starting encryption...');
    console.log('📝 Input data:', data);
    console.log('📝 Data type:', typeof data);
    
    try {
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
 * Decrypts a cipher string and returns the parsed object
 * @param cipherText - The encrypted string to decrypt
 * @returns Decrypted and parsed data
 */
export const decryptData = (cipherText: string): any => {
    try {
        const key = getEncryptionKey();
        const decryptedBytes = CryptoJS.AES.decrypt(cipherText, key);
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
 * Utility function to encrypt sensitive form data before storing in localStorage
 * @param key - Storage key
 * @param data - Data to encrypt and store
 */
export const encryptAndStore = (key: string, data: any): void => {
    try {
        const encrypted = encryptData(data);
        localStorage.setItem(key, encrypted);
    } catch (error) {
        console.error('Failed to encrypt and store data:', error);
    }
};

/**
 * Utility function to decrypt and retrieve data from localStorage
 * @param key - Storage key
 * @returns Decrypted data or null if not found/invalid
 */
export const decryptAndRetrieve = (key: string): any => {
    try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        
        return decryptData(encrypted);
    } catch (error) {
        console.error('Failed to decrypt and retrieve data:', error);
        return null;
    }
};
