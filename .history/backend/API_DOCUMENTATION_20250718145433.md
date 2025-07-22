# Ninico E-commerce API - Encrypted Communication Guide

## 🚀 Overview

This API implements end-to-end encryption for secure communication between frontend and backend. All sensitive endpoints support AES-256 encryption with additional security features including JWT authentication, rate limiting, input validation, and CORS protection.

## 🔒 Security Features

- **AES-256 Encryption**: All request/response data encrypted
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Protection against DDoS and brute force
- **Input Validation**: Joi-based schema validation
- **CORS Protection**: Whitelist-based origin control
- **Helmet Security**: Additional HTTP security headers

## 🔑 Encryption Details

### Encryption Secret
```
ENCRYPTION_SECRET=aes256-encryption-secret-key-32-chars-long!
```

### Request Format (Encrypted Endpoints)
```json
{
  "body": "U2FsdGVkX19encrypted_data_here..."
}
```

### Response Format (Encrypted Endpoints)
```json
{
  "success": true,
  "body": "U2FsdGVkX19encrypted_response_here...",
  "timestamp": "2025-01-18T10:30:00.000Z"
}
```

## 📋 API Endpoints

### Authentication Endpoints

#### POST `/api/v1/auth/register` (Encrypted)
Register a new user with encrypted payload.

**Request Body (Encrypted):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "confirmPassword": "password123",
  "otp": "123456",
  "userType": "individual",
  "gender": "male",
  "dob": "1990-01-01",
  "pincode": "123456"
}
```

**Response (Encrypted):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "userType": "individual",
    "role": "user",
    "isEmailVerified": false
  }
}
```

#### POST `/api/v1/auth/login` (Encrypted)
Login user with encrypted credentials.

**Request Body (Encrypted):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Encrypted):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "userType": "individual",
    "role": "user",
    "isEmailVerified": true,
    "profileComplete": true
  }
}
```

#### POST `/api/v1/auth/forgot-password` (Encrypted)
Request password reset with encrypted email.

**Request Body (Encrypted):**
```json
{
  "email": "john@example.com"
}
```

#### POST `/api/v1/auth/reset-password/:token` (Encrypted)
Reset password with token and encrypted new password.

**Request Body (Encrypted):**
```json
{
  "password": "newPassword123"
}
```

#### GET `/api/v1/auth/profile` (Protected, Encrypted Response)
Get user profile with JWT token.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (Encrypted):**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "userType": "individual",
    "role": "user",
    "gender": "male",
    "dob": "1990-01-01",
    "pincode": "123456",
    "isEmailVerified": true,
    "createdAt": "2025-01-18T10:00:00.000Z",
    "lastLogin": "2025-01-18T10:30:00.000Z"
  }
}
```

### Utility Endpoints

#### GET `/health`
Health check endpoint (no encryption).

#### GET `/api/v1/auth/verify-token` (Protected)
Verify JWT token validity.

#### POST `/api/v1/auth/refresh-token` (Protected)
Refresh JWT token.

#### POST `/api/v1/auth/logout` (Protected)
Logout user (client-side token removal).

## 🚦 Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General API | 100 requests | 15 minutes |
| Authentication | 5 requests | 15 minutes |
| Password Reset | 3 requests | 1 hour |
| OTP Requests | 3 requests | 5 minutes |
| File Upload | 20 requests | 15 minutes |
| Operations | 50 requests | 10 minutes |

## 🔍 Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Authentication Error
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

### Rate Limit Error
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later.",
  "retryAfter": "15 minutes"
}
```

### Encryption Error
```json
{
  "success": false,
  "message": "Failed to decrypt request data"
}
```

## 🛠️ Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/ninico

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRE=7d

# Encryption
ENCRYPTION_SECRET=aes256-encryption-secret-key-32-chars-long!

# CORS
CLIENT_ORIGIN=http://localhost:3000,http://localhost:3001

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📝 Frontend Integration

### Install Dependencies
```bash
npm install crypto-js
```

### Encryption Utility
```javascript
import CryptoJS from 'crypto-js';

const ENCRYPTION_SECRET = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;

export const encrypt = (data) => {
  const stringData = typeof data === 'string' ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringData, ENCRYPTION_SECRET).toString();
};

export const decrypt = (encryptedData) => {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_SECRET);
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
  
  try {
    return JSON.parse(decryptedData);
  } catch {
    return decryptedData;
  }
};
```

### API Call Example
```javascript
const loginUser = async (credentials) => {
  const encryptedBody = encrypt(credentials);
  
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body: encryptedBody })
  });
  
  const data = await response.json();
  
  if (data.body) {
    return decrypt(data.body);
  }
  
  return data;
};
```

## 🧪 Testing

### Postman Setup
1. Set environment variable: `ENCRYPTION_SECRET`
2. Use pre-request script to encrypt body
3. Use test script to decrypt response

### cURL Example
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"body":"encrypted_data_here"}'
```

## 🔄 Backward Compatibility

Legacy endpoints remain available without encryption:
- `/api/auth/login`
- `/api/auth/signup`
- `/api/auth/reset-password`

## 🚨 Security Considerations

1. **Secret Management**: Store encryption secrets securely
2. **HTTPS**: Always use HTTPS in production
3. **Token Storage**: Store JWT tokens securely (httpOnly cookies recommended)
4. **Rate Limiting**: Monitor and adjust rate limits as needed
5. **Logging**: Don't log sensitive encrypted data
6. **Key Rotation**: Implement encryption key rotation strategy

## 📞 Support

For implementation questions or issues, refer to the frontend integration guide or contact the development team.
