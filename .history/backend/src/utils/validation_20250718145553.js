const Joi = require('joi');

/**
 * Validation schemas for different endpoints
 */

// User authentication schemas
const authSchemas = {
  register: Joi.object({
    firstName: Joi.string().min(2).max(30).required().messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name must not exceed 30 characters'
    }),
    lastName: Joi.string().min(2).max(30).required().messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name must not exceed 30 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().min(6).max(128).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password must not exceed 128 characters',
      'string.empty': 'Password is required'
    }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
      'string.pattern.base': 'Phone number must be 10 digits'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    })
  }),

  resetPassword: Joi.object({
    password: Joi.string().min(6).max(128).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password must not exceed 128 characters',
      'string.empty': 'Password is required'
    })
  })
};

// Product schemas
const productSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters',
      'string.max': 'Product name must not exceed 100 characters'
    }),
    description: Joi.string().max(2000).optional(),
    price: Joi.number().positive().required().messages({
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is required'
    }),
    category: Joi.string().required().messages({
      'string.empty': 'Category is required'
    }),
    stock: Joi.number().integer().min(0).required().messages({
      'number.min': 'Stock cannot be negative',
      'any.required': 'Stock quantity is required'
    }),
    images: Joi.array().items(Joi.string().uri()).optional()
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().max(2000).optional(),
    price: Joi.number().positive().optional(),
    category: Joi.string().optional(),
    stock: Joi.number().integer().min(0).optional(),
    images: Joi.array().items(Joi.string().uri()).optional()
  })
};

// Order schemas
const orderSchemas = {
  create: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required()
      })
    ).min(1).required().messages({
      'array.min': 'Order must contain at least one item'
    }),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'cash_on_delivery').required()
  })
};

// User profile schemas
const userSchemas = {
  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(30).optional(),
    lastName: Joi.string().min(2).max(30).optional(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      'string.empty': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).max(128).required().messages({
      'string.min': 'New password must be at least 6 characters',
      'string.max': 'New password must not exceed 128 characters',
      'string.empty': 'New password is required'
    })
  })
};

// Address schemas
const addressSchemas = {
  create: Joi.object({
    type: Joi.string().valid('home', 'work', 'other').required(),
    street: Joi.string().min(5).max(200).required(),
    city: Joi.string().min(2).max(50).required(),
    state: Joi.string().min(2).max(50).required(),
    zipCode: Joi.string().min(5).max(10).required(),
    country: Joi.string().min(2).max(50).required(),
    isDefault: Joi.boolean().optional()
  })
};

// OTP schemas
const otpSchemas = {
  send: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),
    purpose: Joi.string().valid('registration', 'password_reset', 'login', 'email_verification').required()
  }),

  verify: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).pattern(/^[0-9]+$/).required().messages({
      'string.length': 'OTP must be 6 digits',
      'string.pattern.base': 'OTP must contain only numbers'
    }),
    purpose: Joi.string().valid('registration', 'password_reset', 'login', 'email_verification').required()
  })
};

/**
 * Middleware to validate request data
 */
const validate = (schema) => {
  return (req, res, next) => {
    // Use decryptedBody if available, otherwise use body
    const dataToValidate = req.decryptedBody || req.body;
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    // Replace the body with validated and cleaned data
    if (req.decryptedBody) {
      req.decryptedBody = value;
    } else {
      req.body = value;
    }

    next();
  };
};

/**
 * Common validation patterns
 */
const patterns = {
  mongoId: /^[0-9a-fA-F]{24}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{10}$/,
  zipCode: /^[0-9]{5,6}$/
};

module.exports = {
  validate,
  authSchemas,
  productSchemas,
  orderSchemas,
  userSchemas,
  addressSchemas,
  otpSchemas,
  patterns
};
