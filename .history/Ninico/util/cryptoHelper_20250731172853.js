import CryptoJS from 'crypto-js';

const getEncryptionKey = () => {
    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
    
    if (!key) {
        console.error('❌ Encryption key not found in environment variables');
        throw new Error('Encryption key not found in environment variables');
    }

    console.log('🔑 Key validation:', {
        exists: !!key,
        length: key.length,
        preview: key.substring(0, 4) + '...'
    });

    return key;
};

export const encryptData = (data) => {
    try {
        console.log('🔒 Starting encryption process');
        
        const key = getEncryptionKey();
        const jsonString = JSON.stringify(data);
        
        const encrypted = CryptoJS.AES.encrypt(jsonString, key).toString();
        
        console.log('✅ Encryption successful:', {
            inputType: typeof data,
            jsonLength: jsonString.length,
            outputLength: encrypted.length
        });
        
        return encrypted;
    } catch (error) {
        console.error('❌ Encryption failed:', error.message);
        throw new Error(`Encryption failed: ${error.message}`);
    }
};

export const decryptData = (cipherText) => {
    try {
        console.log('🔓 Starting decryption process');

        if (!cipherText || typeof cipherText !== 'string') {
            throw new Error('Invalid cipher text format');
        }

        const key = getEncryptionKey();
        
        const bytes = CryptoJS.AES.decrypt(cipherText, key);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        
        if (!decrypted) {
            throw new Error('Decryption produced empty result');
        }

        const parsed = JSON.parse(decrypted);
        
        console.log('✅ Decryption successful:', {
            inputLength: cipherText.length,
            outputType: typeof parsed,
            hasData: !!parsed
        });

        return parsed;
    } catch (error) {
        console.error('❌ Decryption failed:', {
            error: error.message,
            cipherPreview: cipherText?.substring(0, 32) + '...'
        });
        throw new Error(`Decryption failed: ${error.message}`);
    }
};