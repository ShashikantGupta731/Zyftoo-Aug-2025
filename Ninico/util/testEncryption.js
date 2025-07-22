// Simple test to verify frontend-backend encryption compatibility
// Run this in browser console after loading the page

const testEncryptionCompatibility = async () => {
    console.log('🔐 Testing Frontend-Backend Encryption Compatibility...\n');
    
    try {
        // Import crypto functions (assuming they're available)
        const { encryptData, decryptData } = window.cryptoHelper || {};
        
        if (!encryptData || !decryptData) {
            console.error('❌ Crypto functions not available. Make sure cryptoHelper is imported.');
            return;
        }
        
        // Test data similar to login
        const testData = {
            phone: '1234567890',
            password: 'testPassword123'
        };
        
        console.log('📝 Original data:', testData);
        
        // Encrypt on frontend
        const encrypted = encryptData(testData);
        console.log('🔒 Encrypted (frontend):', encrypted);
        
        // Test decryption on frontend
        const decrypted = decryptData(encrypted);
        console.log('🔓 Decrypted (frontend):', decrypted);
        
        // Check integrity
        const matches = JSON.stringify(testData) === JSON.stringify(decrypted);
        console.log('✅ Frontend encryption integrity:', matches ? 'PASSED' : 'FAILED');
        
        // Test API call format
        const apiPayload = { encryptedData: encrypted };
        console.log('📡 API payload format:', apiPayload);
        
        console.log('\n🎉 Frontend encryption test completed!');
        console.log('📋 Next: Test this payload with your backend API');
        
    } catch (error) {
        console.error('❌ Frontend encryption test failed:', error);
    }
};

// Auto-run if cryptoHelper is available
if (typeof window !== 'undefined') {
    // Browser environment
    console.log('Frontend encryption test ready. Run testEncryptionCompatibility() in console.');
    window.testEncryptionCompatibility = testEncryptionCompatibility;
}

export { testEncryptionCompatibility };
