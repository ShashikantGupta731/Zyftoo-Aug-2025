import CryptoJS from 'crypto-js';

// Get encryption key from environment variables
const getEncryptionKey = (): string => {
    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    console.log('🔑 Frontend DEBUG: Checking encryption key...');
    console.log('🔑 Key exists:', !!key);
    console.log('🔑 Key length:', key?.length || 0);
    console.log('🔑 Key value:', key ? key.substring(0, 8) + '...' : 'UNDEFINED');
    
    if (!key) {
        console.error('❌ NEXT_PUBLIC_ENCRYPTION_KEY is not defined in environment variables');
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

/**
 * Get the authentication token from localStorage
 * @returns JWT token string or null if not found
 */
export const getAuthToken = (): string | null => {
    try {
        // Try encrypted token first
        const encryptedToken = localStorage.getItem('token');
        if (encryptedToken) {
            return decryptData(encryptedToken);
        }
        
        // Fallback to unencrypted token for backward compatibility
        return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    } catch (error) {
        console.error('Error getting auth token:', error);
        // Clear corrupted token data
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        return null;
    }
};

/**
 * Store the authentication token encrypted in localStorage
 * @param token - JWT token string
 */
export const setAuthToken = (token: string): void => {
    try {
        encryptAndStore('token', token);
        // Also store unencrypted for backward compatibility (can be removed later)
        localStorage.setItem('authToken', token);
    } catch (error) {
        console.error('Error storing auth token:', error);
    }
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
};
