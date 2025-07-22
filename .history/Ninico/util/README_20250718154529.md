# 🔐 Encrypted API Service for Next.js

A safe, encrypted API service that works alongside your existing Axios/fetch calls without breaking them.

## 📁 Files Created

```
util/
├── apiEndpoints.js     # Centralized API endpoint definitions
├── apiService.js       # Encrypted API service with axios
├── apiExamples.js      # Usage examples and migration guide
└── .env.local          # Environment configuration
```

## 🚀 Quick Start

### 1. Environment Setup

Your `.env.local` file has been created with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_ENCRYPTION_KEY=your-32-character-secret-key-here
NEXT_PUBLIC_ENCRYPTION_IV=your-16-character-iv-here
```

**⚠️ Important:** Replace the encryption key and IV with secure values in production!

### 2. Basic Usage

```javascript
import { post, get } from '@/util/apiService';
import { AUTH, USER } from '@/util/apiEndpoints';

// Encrypted login
const response = await post(AUTH.LOGIN, { phone, password }, true); // encrypt=true

// Regular API call (unencrypted)
const user = await get(USER.PROFILE, null, false); // decrypt=false
```

## 🔄 Migration Strategy

### Your existing code continues to work:

```javascript
// OLD WAY (still works fine)
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone, password }),
});
```

### Gradually upgrade to new service:

```javascript
// NEW WAY (encrypted & secure)
import { post } from '@/util/apiService';
import { AUTH } from '@/util/apiEndpoints';

const response = await post(AUTH.LOGIN, { phone, password }, true);
```

## 🛡️ Security Features

### Encryption
- **AES encryption** for sensitive payloads
- **Automatic token management** (Authorization headers)
- **Request/Response interceptors** for error handling

### When to encrypt:
- ✅ Login credentials
- ✅ Personal information
- ✅ Payment details
- ✅ OTP verification
- ❌ Public product data
- ❌ Category listings

## 📚 API Endpoints

All endpoints are centralized in `apiEndpoints.ts`:

```javascript
import { AUTH, USER, PRODUCT, OTP, buildUrl, withId } from '@/util/apiEndpoints';

// Examples:
AUTH.LOGIN           // "/auth/login"
USER.PROFILE         // "/user/profile"
withId(USER.PROFILE, "123")  // "/user/profile/123"
buildUrl(PRODUCT.SEARCH, { q: "laptop" })  // "/products/search?q=laptop"
```

## 🔧 API Service Methods

### POST (with encryption)
```javascript
const response = await post(endpoint, payload, encrypt = false);
```

### GET (with decryption)
```javascript
const response = await get(endpoint, params?, decrypt = false);
```

### PUT & DELETE
```javascript
const response = await put(endpoint, payload, encrypt = false);
const response = await del(endpoint);
```

### File Upload
```javascript
const formData = new FormData();
formData.append('file', file);
const response = await uploadFile('/upload/image', formData);
```

## 📝 Response Format

All new API calls return a consistent format:

```javascript
{
  data: {...},          // The actual response data
  success: true/false,  // Whether the request succeeded
  status: 200,          // HTTP status code
  message: "Success"    // Optional message
}
```

## 🔐 Encryption Details

### Automatic Encryption
- When `encrypt=true`, payloads are encrypted before sending
- Server response decryption happens automatically if `response.data.body` exists
- Uses AES-256-CBC encryption with configurable key and IV

### Manual Encryption
```javascript
import { encryptData, decryptData } from '@/util/apiService';

const encrypted = encryptData({ sensitive: "data" });
const decrypted = decryptData(encryptedString);
```

## 🔄 Backward Compatibility

### Zero Breaking Changes
- All existing `fetch` calls continue to work
- No need to change existing components immediately
- Gradual migration path available

### Example Migration
```javascript
// Before (still works)
const res = await fetch(`http://localhost:5000/api/auth/check-user/${phone}`);
const data = await res.json();

// After (better error handling + encryption option)
const response = await get(`${AUTH.CHECK_USER}/${phone}`);
const data = response.data;
```

## 🎯 Use Cases

### Immediate Benefits
1. **Better Error Handling**: Consistent error format across all API calls
2. **Automatic Auth**: Authorization headers added automatically
3. **Response Interceptors**: Handle 401 errors globally
4. **Type Safety**: TypeScript support for better development experience

### Advanced Features
1. **Selective Encryption**: Encrypt only sensitive endpoints
2. **Request/Response Logging**: Built-in logging for debugging
3. **Token Management**: Automatic token refresh (can be extended)
4. **File Uploads**: Simplified multipart/form-data handling

## 🧪 Testing

Use the example component at `components/examples/MigratedLoginExample.js` to test:

1. Compare old fetch vs new API service
2. Toggle encryption on/off
3. See error handling improvements
4. Test backward compatibility

## 🚀 Production Checklist

- [ ] Replace default encryption keys in `.env.local`
- [ ] Set up proper key management for production
- [ ] Update `NEXT_PUBLIC_API_BASE_URL` for production server
- [ ] Test encrypted endpoints with backend
- [ ] Implement server-side decryption for encrypted payloads
- [ ] Set up proper CORS headers for encrypted requests

## 💡 Tips

1. **Start Small**: Migrate one component at a time
2. **Use Encryption Wisely**: Only for sensitive data to avoid performance overhead
3. **Keep Old Code**: No rush to migrate everything immediately
4. **Test Thoroughly**: Use the example component to validate changes
5. **Monitor Performance**: Encryption adds slight overhead

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend accepts the new headers
2. **Encryption Failures**: Verify key and IV are 32 and 16 characters respectively
3. **Token Issues**: Check if `authToken` is properly stored in localStorage
4. **TypeScript Errors**: Ensure you're importing from the correct paths

### Debug Mode
```javascript
// Enable detailed logging
console.log('Request:', endpoint, payload);
console.log('Response:', response);
```

---

🎉 **You're all set!** Your old API calls continue to work while new encrypted API service is ready for use.
