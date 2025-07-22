// Test backend encryption/decryption integration
const { encryptData, decryptData } = require('../src/utils/cryptoUtil');

const testBackendEncryption = () => {
    console.log('🔐 Testing Backend Encryption Integration...\n');
    
    try {
        // Set test encryption key
        process.env.ENCRYPTION_KEY = 'test-encryption-key-for-demo-purposes';
        
        // Test 1: Login data encryption/decryption
        const loginData = {
            phone: '1234567890',
            password: 'testPassword123'
        };
        
        console.log('📝 Original login data:', loginData);
        
        const encryptedLogin = encryptData(loginData);
        console.log('🔒 Encrypted login data:', encryptedLogin);
        
        const decryptedLogin = decryptData(encryptedLogin);
        console.log('🔓 Decrypted login data:', decryptedLogin);
        
        const loginMatches = JSON.stringify(loginData) === JSON.stringify(decryptedLogin);
        console.log('✅ Login data integrity:', loginMatches ? 'PASSED' : 'FAILED');
        
        console.log('\n' + '='.repeat(50) + '\n');
        
        // Test 2: OTP data encryption/decryption
        const otpData = {
            phone: '1234567890',
            otp: '123456',
            purpose: 'signup'
        };
        
        console.log('📝 Original OTP data:', otpData);
        
        const encryptedOtp = encryptData(otpData);
        console.log('🔒 Encrypted OTP data:', encryptedOtp);
        
        const decryptedOtp = decryptData(encryptedOtp);
        console.log('🔓 Decrypted OTP data:', decryptedOtp);
        
        const otpMatches = JSON.stringify(otpData) === JSON.stringify(decryptedOtp);
        console.log('✅ OTP data integrity:', otpMatches ? 'PASSED' : 'FAILED');
        
        console.log('\n' + '='.repeat(50) + '\n');
        
        // Test 3: Signup data encryption/decryption
        const signupData = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            password: 'testPassword123',
            confirmPassword: 'testPassword123',
            otp: '123456',
            userType: 'individual',
            gender: 'male',
            dob: '1990-01-01',
            pincode: '123456'
        };
        
        console.log('📝 Original signup data:', signupData);
        
        const encryptedSignup = encryptData(signupData);
        console.log('🔒 Encrypted signup data:', encryptedSignup);
        
        const decryptedSignup = decryptData(encryptedSignup);
        console.log('🔓 Decrypted signup data:', decryptedSignup);
        
        const signupMatches = JSON.stringify(signupData) === JSON.stringify(decryptedSignup);
        console.log('✅ Signup data integrity:', signupMatches ? 'PASSED' : 'FAILED');
        
        console.log('\n🎉 All backend encryption tests completed!');
        
        // Test request body format that controllers expect
        console.log('\n📋 Sample encrypted request body format:');
        console.log('Login:', JSON.stringify({ encryptedData: encryptedLogin }, null, 2));
        
    } catch (error) {
        console.error('❌ Backend encryption test failed:', error.message);
    }
};

// Run tests if this file is executed directly
if (require.main === module) {
    testBackendEncryption();
}

module.exports = { testBackendEncryption };
