// Example usage of cryptoHelper in Next.js frontend

import { encryptData, decryptData, encryptAndStore, decryptAndRetrieve } from '../util/cryptoHelper';

// Example 1: Encrypting user profile data before API call
export const saveUserProfile = async (profileData) => {
    try {
        // Encrypt sensitive data before sending to API
        const encryptedProfile = encryptData(profileData);
        
        const response = await fetch('/api/user/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ encryptedData: encryptedProfile })
        });
        
        return response.json();
    } catch (error) {
        console.error('Error saving profile:', error);
        throw error;
    }
};

// Example 2: Storing encrypted data in localStorage
export const storeUserPreferences = (preferences) => {
    try {
        encryptAndStore('userPreferences', preferences);
        console.log('User preferences stored securely');
    } catch (error) {
        console.error('Error storing preferences:', error);
    }
};

// Example 3: Retrieving and decrypting data from localStorage
export const getUserPreferences = () => {
    try {
        const preferences = decryptAndRetrieve('userPreferences');
        return preferences || {};
    } catch (error) {
        console.error('Error retrieving preferences:', error);
        return {};
    }
};

// Example 4: Encrypting form data before submission
export const submitPaymentInfo = async (paymentData) => {
    try {
        // Encrypt payment information
        const encryptedPayment = encryptData({
            cardNumber: paymentData.cardNumber,
            cvv: paymentData.cvv,
            expiryDate: paymentData.expiryDate
        });
        
        const response = await fetch('/api/payment/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                encryptedPayment,
                amount: paymentData.amount,
                currency: paymentData.currency
            })
        });
        
        return response.json();
    } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
    }
};

// Example 5: Client-side session data encryption
export const setSecureSession = (sessionData) => {
    try {
        const encrypted = encryptData(sessionData);
        sessionStorage.setItem('secureSession', encrypted);
    } catch (error) {
        console.error('Error setting secure session:', error);
    }
};

export const getSecureSession = () => {
    try {
        const encrypted = sessionStorage.getItem('secureSession');
        if (!encrypted) return null;
        
        return decryptData(encrypted);
    } catch (error) {
        console.error('Error getting secure session:', error);
        return null;
    }
};
