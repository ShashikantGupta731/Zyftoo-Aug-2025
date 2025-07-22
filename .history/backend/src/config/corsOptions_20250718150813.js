/**
 * CORS configuration for secure API access
 */

// Get allowed origins from environment variables
const getAllowedOrigins = () => {
  const clientOrigin = process.env.CLIENT_ORIGIN;
  
  if (clientOrigin) {
    return clientOrigin.split(',').map(origin => origin.trim());
  }
  
  // Default origins for development
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ];
};

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Enable credentials (cookies, authorization headers)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'X-Client-Version'
  ],
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-Current-Page'
  ],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

/**
 * Development CORS options (more permissive)
 */
const devCorsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
    'X-Client-Version'
  ]
};

/**
 * Production CORS options (strict)
 */
const prodCorsOptions = {
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  optionsSuccessStatus: 200
};

/**
 * Get CORS options based on environment
 */
const getCorsOptions = () => {
  if (process.env.NODE_ENV === 'production') {
    return prodCorsOptions;
  } else if (process.env.NODE_ENV === 'development') {
    return devCorsOptions;
  }
  return corsOptions;
};

module.exports = {
  corsOptions,
  devCorsOptions,
  prodCorsOptions,
  getCorsOptions,
  getAllowedOrigins
};
