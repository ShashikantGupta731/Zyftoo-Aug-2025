// Test route to debug encryption issues
const express = require('express');
const router = express.Router();
const { encryptData, decryptData } = require('../utils/cryptoUtil');

// Test encryption endpoint
router.post('/test-encryption', (req, res) => {
    console.log('🧪 TEST ENCRYPTION ENDPOINT HIT');
    console.log('📦 Request body:', JSON.stringify(req.body));
    
    try {
        // Test 1: Check environment variable
        const envKey = process.env.ENCRYPTION_KEY;
        console.log('🔑 Environment key exists:', !!envKey);
        console.log('🔑 Environment key length:', envKey?.length || 0);
        
        // Test 2: Try to encrypt some test data
        const testData = { test: 'hello', number: 123 };
        console.log('📝 Test data:', testData);
        
        const encrypted = encryptData(testData);
        console.log('🔒 Encrypted:', encrypted);
        
        const decrypted = decryptData(encrypted);
        console.log('🔓 Decrypted:', decrypted);
        
        // Test 3: If request has encrypted data, try to decrypt it
        let clientDecryptionTest = null;
        if (req.body.encryptedData) {
            console.log('🔓 Attempting to decrypt client data...');
            clientDecryptionTest = decryptData(req.body.encryptedData);
            console.log('✅ Client data decrypted:', clientDecryptionTest);
        }
        
        res.json({
            success: true,
            envKeyExists: !!envKey,
            envKeyLength: envKey?.length || 0,
            testEncryption: {
                original: testData,
                encrypted,
                decrypted
            },
            clientDecryption: clientDecryptionTest,
            message: 'Encryption test completed'
        });
        
    } catch (error) {
        console.error('❌ Test encryption error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;
