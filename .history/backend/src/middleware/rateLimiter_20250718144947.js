const rateLimit = require('express-rate-limit');

/**
 * General rate limiter for API endpoints
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

/**
 * Strict rate limiter for authentication endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

/**
 * Rate limiter for password reset endpoints
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.',
    retryAfter: '1 hour'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts, please try again later.',
      retryAfter: '1 hour'
    });
  }
});

/**
 * Rate limiter for OTP requests
 */
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 OTP requests per 5 minutes
  message: {
    success: false,
    message: 'Too many OTP requests, please try again later.',
    retryAfter: '5 minutes'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many OTP requests, please try again later.',
      retryAfter: '5 minutes'
    });
  }
});

/**
 * Rate limiter for file upload endpoints
 */
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 upload requests per windowMs
  message: {
    success: false,
    message: 'Too many upload requests, please try again later.',
    retryAfter: '15 minutes'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many upload requests, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

/**
 * Moderate rate limiter for product/order operations
 */
const operationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 50, // Limit each IP to 50 operations per windowMs
  message: {
    success: false,
    message: 'Too many operations, please try again later.',
    retryAfter: '10 minutes'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many operations, please try again later.',
      retryAfter: '10 minutes'
    });
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  otpLimiter,
  uploadLimiter,
  operationLimiter
};
