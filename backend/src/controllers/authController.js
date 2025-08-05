const { encryptData } = require('../utils/cryptoUtil');
const AuthService = require('../services/AuthService');

// ✅ SIGNUP CONTROLLER - Now using centralized AuthService
const signupUser = async (req, res) => {
  const { userType } = req.body;
  // Only allow signup for Individual and Corporate
  if (!["Individual", "Corporate"].includes(userType)) {
    return res.status(403).json({
      success: false,
      error: 'Signup is only allowed for Individual and Corporate users.'
    });
  }
  try {
    console.log('� [Controller] Signup request received - delegating to AuthService');
    // Use centralized AuthService
    const result = await AuthService.register(req.body);
    console.log('✅ [Controller] Registration successful via AuthService');
    return res.status(201).json(result);
  } catch (error) {
    console.error('❌ [Controller] Signup error:', error.message);
    // Preserve exact error status codes
    const statusCode = error.statusCode || (error.message.includes('Invalid encrypted data') ? 400 : 500);
    const errorMessage = error.message.includes('Invalid encrypted data') 
      ? 'Invalid encrypted data' 
      : error.message;
    return res.status(statusCode).json({ 
      success: false, 
      error: errorMessage 
    });
  }
};


// ✅ LOGIN CONTROLLER - Handles all user types with clear method checks
const loginUser = async (req, res) => {
  console.log('🚀 LOGIN REQUEST RECEIVED');
  console.log('📦 Raw request body:', JSON.stringify(req.body));
  const { email, phone, password, userType } = req.body;
  console.log('🔑 userType:', userType);

  // Enforce login method by userType
  if (["Admin", "SuperAdmin", "Corporate"].includes(userType)) {
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required for this user type.' });
    }
  } else if (userType === "Individual") {
    if (!phone || !password) {
      return res.status(400).json({ success: false, error: 'Phone and password are required for Individual login.' });
    }
  } else {
    return res.status(400).json({ success: false, error: 'Invalid userType.' });
  }

  try {
    // Use centralized AuthService
    const result = await AuthService.login(req.body);
    const responseData = {
      success: true,
      message: 'Login successful',
      data: result
    };

    // IMPORTANT: The frontend must decrypt the 'encryptedData' field in the response
    // and extract user/token from the decrypted object, NOT from the raw response.
    // Example (frontend):
    //   const decrypted = decryptData(response.encryptedData);
    //   const userData = decrypted.data?.user;
    //   const token = decrypted.data?.token;

    // Encrypt the response with error handling (preserving existing encryption logic)
    let encryptedResponseData;
    try {
      encryptedResponseData = encryptData(responseData);
      if (!encryptedResponseData) {
        throw new Error('Encryption returned null/undefined');
      }
    } catch (encryptError) {
      console.error('❌ Encryption failed:', encryptError.message);
      // Fallback: send unencrypted response if encryption fails
      return res.status(200).json(responseData);
    }
    return res.status(200).json({ 
      success: true, 
      encryptedData: encryptedResponseData 
    });
  } catch (error) {
    console.error('❌ [Controller] Login error:', error.message);
    // Preserve exact error status codes and messages
    const statusCode = error.statusCode || (error.message.includes('Invalid encrypted data') ? 400 : 500);
    const errorMessage = error.message.includes('Invalid encrypted data') 
      ? `Invalid encrypted data: ${error.message}` 
      : (error.statusCode === 401 ? error.message : 'Login failed');
    return res.status(statusCode).json({ 
      success: false, 
      error: errorMessage 
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    console.log('📧 [Controller] Email verification request - delegating to AuthService');
    
    // Use centralized AuthService
    const result = await AuthService.verifyEmail(req.params.token);
    
    console.log('✅ [Controller] Email verification successful via AuthService');
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('❌ [Controller] Email verification error:', error.message);
    return res.status(400).json({ error: error.message });
  }
};

  // ✅ RESET PASSWORD CONTROLLER - Now using centralized AuthService
 const resetPassword = async (req, res) => {
  try {
    console.log('� [Controller] Password reset request - delegating to AuthService');
    
    // Use centralized AuthService
    const result = await AuthService.resetPassword(req.body);
    
    console.log('✅ [Controller] Password reset successful via AuthService');
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('❌ [Controller] Password reset error:', error.message);
    
    // Preserve exact error status codes
    const statusCode = error.statusCode || (error.message.includes('Invalid encrypted data') ? 400 : 500);
    const errorMessage = error.message.includes('Invalid encrypted data') 
      ? 'Invalid encrypted data' 
      : error.message;
    
    return res.status(statusCode).json({ 
      success: false, 
      error: errorMessage 
    });
  }
};

const checkUser = async (req, res) => {
  try {
    console.log('🔍 [Controller] Check user request - delegating to AuthService');
    
    // Use centralized AuthService
    const result = await AuthService.checkUserExists(req.params.phone);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ [Controller] Check user error:', error.message);
    return res.status(500).json({ message: 'Server Error' });
  }
};

const checkUserByEmail = async (req, res) => {
  try {
    console.log('🔍 [Controller] Check user by email request - delegating to AuthService');
    
    // Use centralized AuthService
    const result = await AuthService.checkUserByEmail(req.params.email);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('❌ [Controller] Check user by email error:', error.message);
    return res.status(500).json({ 
      success: false, 
      message: 'Server Error' 
    });
  }
};

  module.exports = {
    signupUser,
    loginUser,
    resetPassword,
    verifyEmail,
    checkUser,
    checkUserByEmail,
  };
