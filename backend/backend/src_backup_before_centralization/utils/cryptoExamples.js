// Example usage of cryptoUtil in Node.js backend

const { 
    encryptData, 
    decryptData, 
    encryptForStorage, 
    decryptFromStorage,
    encryptUserFields,
    decryptUserFields 
} = require('./cryptoUtil');

// Example 1: Encrypting sensitive user data before storing in database
const createUser = async (userData) => {
    try {
        // Fields that should be encrypted
        const sensitiveFields = ['phone', 'address', 'bankDetails'];
        
        // Encrypt sensitive fields
        const encryptedUserData = encryptUserFields(userData, sensitiveFields);
        
        // Save to database
        const user = new User(encryptedUserData);
        await user.save();
        
        console.log('User created with encrypted data');
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Example 2: Decrypting user data when retrieving from database
const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        // Fields to decrypt
        const sensitiveFields = ['phone', 'address', 'bankDetails'];
        
        // Decrypt sensitive fields
        const decryptedUserData = decryptUserFields(user.toObject(), sensitiveFields);
        
        return decryptedUserData;
    } catch (error) {
        console.error('Error retrieving user:', error);
        throw error;
    }
};

// Example 3: Handling encrypted API requests
const handleEncryptedRequest = (req, res, next) => {
    try {
        if (req.body.encryptedData) {
            // Decrypt the request data
            const decryptedData = decryptData(req.body.encryptedData);
            req.body.decryptedData = decryptedData;
        }
        next();
    } catch (error) {
        console.error('Error decrypting request:', error);
        return res.status(400).json({ error: 'Invalid encrypted data' });
    }
};

// Example 4: Encrypting payment information
const processPayment = async (req, res) => {
    try {
        const { encryptedPayment, amount, currency } = req.body;
        
        // Decrypt payment information
        const paymentData = decryptData(encryptedPayment);
        
        // Process payment (example)
        const paymentResult = await processPaymentWithProvider({
            ...paymentData,
            amount,
            currency
        });
        
        // Encrypt response if needed
        const encryptedResponse = encryptData({
            transactionId: paymentResult.transactionId,
            status: paymentResult.status
        });
        
        res.json({ encryptedResult: encryptedResponse });
    } catch (error) {
        console.error('Payment processing error:', error);
        res.status(500).json({ error: 'Payment processing failed' });
    }
};

// Example 5: Storing encrypted session data
const storeSessionData = async (sessionId, sessionData) => {
    try {
        const encryptedSession = encryptForStorage(sessionData);
        
        // Store in Redis or database
        await redis.set(`session:${sessionId}`, encryptedSession, 'EX', 3600);
        
        console.log('Session stored securely');
    } catch (error) {
        console.error('Error storing session:', error);
        throw error;
    }
};

// Example 6: Retrieving encrypted session data
const getSessionData = async (sessionId) => {
    try {
        const encryptedSession = await redis.get(`session:${sessionId}`);
        if (!encryptedSession) {
            return null;
        }
        
        const sessionData = decryptFromStorage(encryptedSession);
        return sessionData;
    } catch (error) {
        console.error('Error retrieving session:', error);
        return null;
    }
};

// Example 7: Middleware to encrypt response data
const encryptResponse = (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
        if (req.headers['x-encrypt-response'] === 'true') {
            const encryptedData = encryptData(data);
            return originalJson.call(this, { encryptedData });
        }
        return originalJson.call(this, data);
    };
    
    next();
};

module.exports = {
    createUser,
    getUserById,
    handleEncryptedRequest,
    processPayment,
    storeSessionData,
    getSessionData,
    encryptResponse
};
