# Encryption Utilities for Ninico Project

This document explains how to use the AES encryption utilities implemented for both the Next.js frontend and Node.js backend.

## 🔐 Overview

Both frontend and backend use **AES encryption** with `crypto-js` library for consistency and compatibility.

## 📁 File Structure

```
Frontend (Next.js):
├── util/cryptoHelper.ts      # Main encryption utilities
├── util/cryptoExamples.js    # Usage examples
└── .env.local               # Environment variables

Backend (Node.js):
├── src/utils/cryptoUtil.js   # Main encryption utilities
├── src/utils/cryptoExamples.js # Usage examples
├── src/utils/cryptoTest.js   # Test file
└── .env                     # Environment variables
```

## ⚙️ Environment Setup

### Frontend (.env.local)
```bash
NEXT_PUBLIC_ENCRYPTION_KEY=your-32-character-secret-key-here
```

### Backend (.env)
```bash
ENCRYPTION_KEY=your-32-character-secret-key-here
```

⚠️ **Important**: Use the same encryption key for both frontend and backend to ensure compatibility.

## 🚀 Frontend Usage (Next.js)

### Basic Encryption/Decryption
```typescript
import { encryptData, decryptData } from '../util/cryptoHelper';

// Encrypt any data
const userData = { name: 'John', email: 'john@example.com' };
const encrypted = encryptData(userData);

// Decrypt data
const decrypted = decryptData(encrypted);
```

### LocalStorage with Encryption
```typescript
import { encryptAndStore, decryptAndRetrieve } from '../util/cryptoHelper';

// Store encrypted data
encryptAndStore('userPreferences', { theme: 'dark', language: 'en' });

// Retrieve and decrypt data
const preferences = decryptAndRetrieve('userPreferences');
```

### API Requests with Encryption
```typescript
// Encrypt sensitive data before API call
const encryptedProfile = encryptData(profileData);

const response = await fetch('/api/user/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encryptedData: encryptedProfile })
});
```

## 🖥️ Backend Usage (Node.js)

### Basic Encryption/Decryption
```javascript
const { encryptData, decryptData } = require('./utils/cryptoUtil');

// Encrypt data
const userData = { name: 'John', email: 'john@example.com' };
const encrypted = encryptData(userData);

// Decrypt data
const decrypted = decryptData(encrypted);
```

### Database Storage with Encryption
```javascript
const { encryptUserFields, decryptUserFields } = require('./utils/cryptoUtil');

// Before saving to database
const sensitiveFields = ['phone', 'address', 'bankDetails'];
const encryptedUser = encryptUserFields(userData, sensitiveFields);
await user.create(encryptedUser);

// After retrieving from database
const user = await User.findById(userId);
const decryptedUser = decryptUserFields(user.toObject(), sensitiveFields);
```

### API Middleware for Encrypted Requests
```javascript
const { decryptData } = require('./utils/cryptoUtil');

const handleEncryptedRequest = (req, res, next) => {
    try {
        if (req.body.encryptedData) {
            req.body.decryptedData = decryptData(req.body.encryptedData);
        }
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid encrypted data' });
    }
};
```

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
node src/utils/cryptoTest.js
```

### Test Frontend (in browser console)
```javascript
import { encryptData, decryptData } from './util/cryptoHelper';

const testData = { message: 'Hello World' };
const encrypted = encryptData(testData);
const decrypted = decryptData(encrypted);
console.log('Test passed:', JSON.stringify(testData) === JSON.stringify(decrypted));
```

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit encryption keys to version control
   - Use different keys for development/production
   - Keys should be at least 32 characters long

2. **Key Management**
   - Rotate keys periodically
   - Use secure key storage in production
   - Consider using environment-specific keys

3. **Data Handling**
   - Only encrypt sensitive data
   - Validate data before encryption/decryption
   - Handle encryption errors gracefully

4. **Performance**
   - Don't encrypt large amounts of data unnecessarily
   - Consider caching decrypted data when appropriate
   - Use encryption selectively for sensitive fields

## 📋 Available Functions

### Frontend (cryptoHelper.ts)
- `encryptData(data: any): string` - Encrypt any data
- `decryptData(cipherText: string): any` - Decrypt cipher text
- `encryptAndStore(key: string, data: any): void` - Encrypt and store in localStorage
- `decryptAndRetrieve(key: string): any` - Decrypt and retrieve from localStorage

### Backend (cryptoUtil.js)
- `encryptData(data: object): string` - Encrypt object data
- `decryptData(cipher: string): object` - Decrypt cipher string
- `encryptForStorage(data: object): string` - Encrypt for database storage
- `decryptFromStorage(encryptedData: string): object` - Decrypt from database
- `encryptUserFields(userData: object, fields: string[]): object` - Encrypt specific fields
- `decryptUserFields(userData: object, fields: string[]): object` - Decrypt specific fields

## 🚨 Common Issues

1. **"ENCRYPTION_KEY not defined"**
   - Ensure environment variables are set correctly
   - Check .env.local (frontend) and .env (backend) files

2. **"Failed to decrypt data"**
   - Verify the same key is used for encryption/decryption
   - Check if data was properly encrypted
   - Ensure cipher text is not corrupted

3. **Installation Issues**
   - Use `npm install crypto-js --legacy-peer-deps` if you encounter dependency conflicts

## 📞 Support

For questions or issues with the encryption utilities, please refer to the example files or create a detailed issue with error messages and steps to reproduce.
