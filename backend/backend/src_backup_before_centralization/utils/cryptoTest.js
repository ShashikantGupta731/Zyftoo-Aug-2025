// Test file for crypto utilities - Backend
const { encryptData, decryptData, encryptUserFields, decryptUserFields } = require('./cryptoUtil');

// Test function to verify encryption/decryption works
const testCrypto = () => {
    console.log('🔐 Testing Backend Crypto Utilities...\n');
    
    try {
        // Test 1: Basic encryption/decryption
        const testData = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            sensitive: 'secret information'
        };
        
        console.log('📝 Original data:', testData);
        
        const encrypted = encryptData(testData);
        console.log('🔒 Encrypted:', encrypted);
        
        const decrypted = decryptData(encrypted);
        console.log('🔓 Decrypted:', decrypted);
        
        // Verify data integrity
        const dataMatches = JSON.stringify(testData) === JSON.stringify(decrypted);
        console.log('✅ Data integrity check:', dataMatches ? 'PASSED' : 'FAILED');
        
        console.log('\n' + '='.repeat(50) + '\n');
        
        // Test 2: User field encryption
        const userData = {
            id: 1,
            username: 'johndoe',
            email: 'john@example.com',
            phone: '+1234567890',
            address: '123 Main St, City, Country',
            bankDetails: {
                accountNumber: '1234567890',
                routingNumber: '987654321'
            },
            publicInfo: 'This should not be encrypted'
        };
        
        const fieldsToEncrypt = ['phone', 'address', 'bankDetails'];
        
        console.log('📝 User data before encryption:', userData);
        
        const encryptedUser = encryptUserFields(userData, fieldsToEncrypt);
        console.log('🔒 User data with encrypted fields:', encryptedUser);
        
        const decryptedUser = decryptUserFields(encryptedUser, fieldsToEncrypt);
        console.log('🔓 User data after decryption:', decryptedUser);
        
        // Verify specific fields
        const phoneMatches = userData.phone === decryptedUser.phone;
        const addressMatches = userData.address === decryptedUser.address;
        const bankMatches = JSON.stringify(userData.bankDetails) === JSON.stringify(decryptedUser.bankDetails);
        const publicMatches = userData.publicInfo === decryptedUser.publicInfo;
        
        console.log('✅ Phone field check:', phoneMatches ? 'PASSED' : 'FAILED');
        console.log('✅ Address field check:', addressMatches ? 'PASSED' : 'FAILED');
        console.log('✅ Bank details check:', bankMatches ? 'PASSED' : 'FAILED');
        console.log('✅ Public info unchanged:', publicMatches ? 'PASSED' : 'FAILED');
        
        console.log('\n🎉 All tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
};

// Run tests if this file is executed directly
if (require.main === module) {
    // Set environment variable for testing
    process.env.ENCRYPTION_KEY = 'test-encryption-key-for-demo-purposes';
    testCrypto();
}

module.exports = { testCrypto };
