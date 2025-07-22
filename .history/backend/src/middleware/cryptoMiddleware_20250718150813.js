const { decrypt, createEncryptedResponse, isValidEncryptedData } = require('../utils/cryptoUtil');

/**
 * Middleware to decrypt incoming encrypted requests and encrypt outgoing responses
 */
const cryptoMiddleware = (req, res, next) => {
  // Store original res.json method
  const originalJson = res.json;
  
  // Override res.json to encrypt response
  res.json = function(data) {
    try {
      // Only encrypt successful responses with actual data
      if (data && (data.success !== false)) {
        const encryptedResponse = createEncryptedResponse(data);
        return originalJson.call(this, encryptedResponse);
      } else {
        // For error responses, send as-is for debugging (can be encrypted too if needed)
        return originalJson.call(this, data);
      }
    } catch (error) {
      console.error('Response encryption error:', error);
      return originalJson.call(this, {
        success: false,
        message: 'Failed to encrypt response',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  };

  // Check if request has encrypted body
  if (req.body && req.body.body && typeof req.body.body === 'string') {
    try {
      // Validate if the body appears to be encrypted
      if (!isValidEncryptedData(req.body.body)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid encrypted data format'
        });
      }

      // Decrypt the request body
      const decryptedData = decrypt(req.body.body);
      
      // Store decrypted data in req.decryptedBody
      req.decryptedBody = decryptedData;
      
      // Keep original body for logging/debugging if needed
      req.originalEncryptedBody = req.body.body;
      
      console.log('Request decrypted successfully for:', req.path);
      
    } catch (error) {
      console.error('Request decryption error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to decrypt request data',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Invalid request format'
      });
    }
  } else {
    // For non-encrypted requests, use original body
    req.decryptedBody = req.body;
  }

  next();
};

/**
 * Middleware specifically for encrypted-only endpoints
 * This will reject any non-encrypted requests
 */
const requireEncryption = (req, res, next) => {
  if (!req.body || !req.body.body || typeof req.body.body !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'This endpoint requires encrypted data'
    });
  }

  if (!isValidEncryptedData(req.body.body)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid encrypted data format'
    });
  }

  next();
};

/**
 * Middleware for endpoints that can handle both encrypted and non-encrypted requests
 */
const optionalEncryption = (req, res, next) => {
  // This middleware allows both encrypted and non-encrypted requests
  // The cryptoMiddleware will handle decryption if data is encrypted
  next();
};

module.exports = {
  cryptoMiddleware,
  requireEncryption,
  optionalEncryption
};
