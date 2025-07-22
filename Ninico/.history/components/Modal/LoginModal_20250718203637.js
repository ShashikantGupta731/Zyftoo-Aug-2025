'use client';
import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '@/components/context/AuthContext';
import { post, get } from '@/util/apiService';
import { AUTH, OTP } from '@/util/apiEndpoints';
import { encryptData, decryptData, encryptAndStore, decryptAndRetrieve } from '@/util/cryptoHelper';





export default function LoginModal({ show, onClose }) {
  const { login } = useContext(AuthContext);
  const [step, setStep] = useState('login'); // 'login' or 'otp' or 'signupOtp' or 'register' or 'register-success'
  const [phone, setPhone] = useState('');
  const [password, setpassword] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [toast, setToast] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [pincode, setPincode] = useState('');
  const [userType, setUserType] = useState('individual'); // or 'corporate'
  const [companyDetails, setCompanyDetails] = useState('');
  const [role, setRole] = useState('user'); // default
  const [isCorporate, setIsCorporate] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const backgroundImage = '/assets/feature-icon-05.png';
  const hasImage = !!backgroundImage;




  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load user data from encrypted localStorage on component mount
  useEffect(() => {
    try {
      const encryptedUser = decryptAndRetrieve('user');
      if (encryptedUser && login) {
        login(encryptedUser);
      }
    } catch (error) {
      console.error('Error loading encrypted user data:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
    }
  }, [login]);

  if (!show) return null;

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className={`modal-content login-modal ${step === 'register' ? 'step-register' : ''}`}>
          <button className="modal-close" onClick={onClose}>×</button>

          <div className={`login-modal-left ${step === 'register' ? 'narrow-left' : ''}`}
            style={{
              backgroundImage: hasImage ? `url(${backgroundImage})` : 'none',
              backgroundColor: hasImage ? 'transparent' : '#d3f14a',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}>
            <div className="login-logo-wrapper mobile-only">
              <div className="logo-circle">
                <img src="/assets/img/logo/logo.png" alt="Company Logo" className="login-logo" />
              </div>
            </div>
            <h2>START YOUR JOURNEY TO SAVE BIG!</h2>
            <p>Up to 40% discount on 250+ brand vouchers</p>
            <div className="offer-image desktop-only">
              <img src="/assets/login-illustration.png" alt="Offer" />
            </div>
          </div>

          <div className="login-modal-right">
            <div className="login-content-wrapper">
              <div className="login-logo-wrapper desktop-only">
                <div className="logo-circle">
                  <img src="/assets/img/logo/logo.png" alt="Company Logo" className="login-logo" />
                </div>
              </div>

              <div className="login-form-wrapper">
                {step === 'login' ? (
                  <>
                    <h3>Log In/Sign Up</h3>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="login-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <label className="login-agree">
                      <input type="checkbox" checked readOnly />
                      By continuing, you agree to Zyftoo<br />
                      <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>
                    </label>
                    <button className="login-next"
                      onClick={() => {
                        if (phone.length === 10) {
                          setStep('login-password');
                        } else {
                          setToast('Kindly enter the number');
                        }
                      }}
                    >Next</button>

                    <button
                      className="signup-btn"
                      onClick={async () => {
                        if (phone.length !== 10) {
                          setToast('Kindly enter the number');
                          return;
                        }

                        try {
                          // Step 1: Check if user exists
                          const response = await get(`${AUTH.CHECK_USER}/${phone}`);

                          if (response.data.exists) {
                            setToast('User already exists');
                            return;
                          }

                          // Step 2: Send OTP with encrypted data
                          const encryptedData = encryptData({ phone, purpose: 'signup' });
                          const otpResponse = await post(OTP.SEND, { encryptedData }, false);

                          if (!otpResponse.success) {
                            setToast(otpResponse.message || 'Failed to send OTP');
                            return;
                          }

                          // Step 3: Proceed to next screen
                          setStep('signupOtp');
                        } catch (err) {
                          console.error('Signup OTP flow failed:', err.message || err);
                          setToast('Something went wrong');
                        }
                      }}
                    >
                      Signup
                    </button>
                    <div
                      className="forgot-password-section"
                      onClick={async () => {
                        if (phone.length !== 10) {
                          setToast('Kindly enter the number');
                          return;
                        }

                        try {
                          // Step 1: Check if user exists
                          console.log('Checking user existence for phone:', phone);
                          const response = await get(`${AUTH.CHECK_USER}/${phone}`);
                          console.log('User existence check response:', response.data);

                          if (!response.data.exists) {
                            setToast('No User registered with this phone number');
                            return;
                          }

                          // Step 2: Send OTP with encrypted data
                          const encryptedData = encryptData({ phone, purpose: 'reset' });
                          const otpResponse = await post(OTP.SEND, { encryptedData }, false);
                          console.log('OTP send response:', otpResponse.data);

                          if (!otpResponse.success) {
                            setToast(otpResponse.message || 'Failed to send OTP');
                            return;
                          }

                          // Step 3: Proceed to next screen
                          setStep('forgotOtp');
                        } catch (err) {
                          console.error('Forgot password OTP flow failed:', err.message || err);
                          setToast('Something went wrong');
                        }
                      }}
                    >
                      Forgot Password?
                    </div>

                  </>
                ) : step === 'login-password' ? (
                  <>
                    <div className='password-text1'><h3>Password:</h3></div>
                    <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                      <strong>Phone:</strong> {phone || 'Not set'}
                    </div>
                    <input
                      type="password"
                      placeholder="Enter Your password"
                      className="password-input"
                      value={password}
                      onChange={(e) => setpassword(e.target.value)}
                    />
                    <button
                      className="login-btn"
                      onClick={async () => {
                      if (password.trim() === '') {
                        setToast('Enter the Password to Proceed');
                        return;
                      }

                      try {
                        if (!phone || phone.trim() === '') {
                          setToast('Phone number is required');
                          return;
                        }
                        
                        console.log('🔍 DEBUG: Starting login process...');
                        console.log('📱 Phone:', phone);
                        console.log('🔑 Password length:', password.length);
                        
                        // Encrypt login credentials
                        const loginData = { phone, password };
                        console.log('📝 Original login data:', loginData);
                        
                        const encryptedData = encryptData(loginData);
                        console.log('🔒 Encrypted data:', encryptedData);
                        console.log('📦 Payload being sent:', { encryptedData });
                        
                        const response = await post(AUTH.LOGIN, { encryptedData }, false);
                        console.log('📨 Raw response received:', response);

                        if (!response.success) {
                          const msg = response.message || 'Login failed';
                          console.log('❌ Login failed:', msg);
                          setToast(msg);
                          return;
                        }

                        // Decrypt the response data
                        let decryptedResponse;
                        if (response.encryptedData) {
                          console.log('🔓 Decrypting response data...');
                          decryptedResponse = decryptData(response.encryptedData);
                          console.log('✅ Decrypted response:', decryptedResponse);
                        } else {
                          console.log('⚠️ No encrypted data in response, using as-is');
                          decryptedResponse = response;
                        }

                        // Handle nested data structure
                        const responseData = decryptedResponse.data || decryptedResponse;
                        console.log('🔍 Response data structure:', responseData);

                        if (!responseData.data?.token) {
                          console.log('❌ Token missing in response data:', responseData);
                          setToast('Login succeeded but token missing.');
                          return;
                        }
                        
                        console.log('✅ Login successful, storing user data...');
                        console.log('🎫 Token found:', responseData.token);
                        // Store user data encrypted in localStorage
                        encryptAndStore('user', responseData.user);
                        login(responseData.user);
                        setStep('success');
                      } catch (error) {
                        console.error('❌ Login Error:', error);
                        console.error('📋 Login Error details:', {
                          message: error.message,
                          status: error.status,
                          data: error.data
                        });
                        setToast('Server Error: ' + (error.message || 'Unknown error'));
                      }
                    }}
                    >
                      Login
                    </button>
                  </>
                ) : step === 'signupOtp' ? (
                  <>
                    <h3>Enter OTP To Proceed:</h3>
                    <div style={{ marginBottom: '10px' }}></div>
                     <strong>Phone:</strong> {phone || 'Not set'}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                      {otp.map((value, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={value}
                          onChange={(e) => handleOtpChange(e.target.value, index)}
                          className="otp-input-box"
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                      Resend OTP in: <span style={{ color: '#007bff' }}>01:24</span>
                    </div>
                    <button
                      className="login-next"
                      onClick={async () => {
                        console.log('OTP step. Phone is:', phone);
                        const enteredOtp = otp.join('').trim();

                        if (!phone) {
                          setToast('Phone number is missing. Please start over.');
                          return;
                        }

                        if (enteredOtp.length !== 6) {
                          setToast('Please enter all 6 digits of OTP');
                          return;
                        }

                        try {
                          console.log('Verifying OTP:', enteredOtp);
                          
                          // Encrypt OTP verification data
                          const encryptedData = encryptData({
                            phone,
                            otp: enteredOtp,
                            purpose: 'signup',
                          });
                          
                          const response = await post(OTP.VERIFY, { encryptedData }, false);
                          console.log('OTP verification response:', response);

                          if (!response.success) {
                            setToast(response.message || 'Wrong OTP');
                            return;
                          }

                          setStep('register'); // ✅ Go to registration step
                        } catch (err) {
                          console.error('OTP verification failed:', err.message || err);
                          setToast('Something went wrong');
                        }
                      }}
                      >
                        Next
                    </button>
                  </>
                  ): step === 'forgotOtp' ? (
                  <>
                    <h3>Enter OTP To Proceed:</h3>
                    <div style={{ marginBottom: '5px' }}></div>
                     <strong>Phone:</strong> {phone || 'Not set'}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                      {otp.map((value, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength="1"
                          value={value}
                          onChange={(e) => handleOtpChange(e.target.value, index)}
                          className="otp-input-box"
                        />
                      ))}
                    </div>
                    <div style={{ fontSize: '12px', marginBottom: '10px' }}>
                      Resend OTP in: <span style={{ color: '#007bff' }}>01:24</span>
                    </div>
                    <button
                      className="login-next"
                      onClick={async () => {
                        console.log('OTP step. Phone is:', phone);
                        const enteredOtp = otp.join('').trim();

                        if (!phone) {
                          setToast('Phone number is missing. Please start over.');
                          return;
                        }

                        if (enteredOtp.length !== 6) {
                          setToast('Please enter all 6 digits of OTP');
                          return;
                        }

                        try {
                          console.log('Verifying OTP:', enteredOtp);
                          
                          // Encrypt OTP verification data
                          const encryptedData = encryptData({
                            phone,
                            otp: enteredOtp,
                            purpose: 'reset',
                          });
                          
                          const response = await post(OTP.VERIFY, { encryptedData }, false);
                          console.log('OTP verification response:', response);

                          if (!response.success) {
                            setToast(response.message || 'Wrong OTP');
                            return;
                          }

                          setStep('password-reset'); // ✅ Go to reset password step
                        } catch (err) {
                          console.error('OTP verification failed:', err.message || err);
                          setToast('Something went wrong');
                        }
                      }}
                      >
                        Next
                    </button>
                  </>
                  ): step === 'password-reset' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                      <h3 style={{ fontSize: '22px' }}>Create Your Account</h3>
                    </div>
                    <div className="form-vertical">
                      <input className="login-input" type="password" placeholder="Password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                      <input className="login-input" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      
                      <button className="login-next" onClick={async () => {
                        if (!regPassword || !confirmPassword) {
                          setToast('Please fill all required fields');
                          return;
                        }

                        if (regPassword !== confirmPassword) {
                          setToast('Passwords do not match');
                          return;
                        }

                        try {
                          // Encrypt password reset data
                          const encryptedData = encryptData({
                            phone,
                            newPassword: regPassword
                          });
                          
                          const response = await post(AUTH.RESET_PASSWORD, { encryptedData }, false);

                          if (!response.success) {
                            setToast(response.message || 'Password reset failed');
                            return;
                          }

                          console.log('✅ Password Reset Success:', response.data);
                          setStep('register-success');
                        } catch (error) {
                          console.error('❌ Password Reset Error:', error);
                          setToast('Server error. Try again.');
                        }
                      }}>
                      Update Password 
                    </button>

                    </div>
                  </>
                  
                ) : step === 'success' ? (
                  <>
                    <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>Congratulations</h3>
                    <p style={{ marginBottom: "30px" }}>You have successfully Logged In.</p>
                    <button className="continue-btn" onClick={onClose}>CONTINUE SHOPPING</button>
                  </>
                ) : step === 'register' ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                      <h3 style={{ fontSize: '22px' }}>Create Your Account</h3>
                    </div>
                    <div className="form-vertical">
                      <input className="login-input" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                      <input className="login-input" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                      <input className="login-input" type="password" placeholder="Password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                      <input className="login-input" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      <select className="login-input" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <input className="login-input" type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
                      <input className="login-input" type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                      {/* Corporate User Toggle */}
                      <div className="corporate-toggle-wrapper">
                        <label className="corporate-checkbox">
                          <input
                            type="checkbox"
                            checked={isCorporate}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setIsCorporate(checked);
                              setUserType(checked ? 'corporate' : 'individual');

                              // Optional: Clear corporate fields when unchecked
                              if (!checked) {
                                setCompanyName('');
                                setGstNumber('');
                                setCompanyAddress('');
                              }
                            }}
                          />
                          Are you a Corporate User?
                        </label>
                      </div>

                      {/* Show corporate fields if selected */}
                      {isCorporate && (
                        <div className="corporate-fields">
                          <input
                            className="login-input"
                            type="text"
                            placeholder="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                          />
                          <input
                            className="login-input"
                            type="text"
                            placeholder="GST Number"
                            value={gstNumber}
                            onChange={(e) => setGstNumber(e.target.value)}
                          />
                          <input
                            className="login-input"
                            type="text"
                            placeholder="Company Address"
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                          />
                        </div>
                      )}
                      <button className="login-next" onClick={async () => {
                      if (!name || !email || !regPassword || !confirmPassword || !gender || !dob || !pincode) {
                        setToast('Please fill all required fields');
                        return;
                      }

                      if (regPassword !== confirmPassword) {
                        setToast('Passwords do not match');
                        return;
                      }

                      try {
                        // Encrypt registration data
                        const registrationData = {
                          name,
                          email,
                          phone, // ✅ Already stored from earlier step
                          password: regPassword,
                          confirmPassword,
                          otp: otp.join('').trim(), // ✅ We still have OTP
                          userType,
                          companyDetails,
                          role,
                          gender,
                          dob,
                          pincode,
                          companyDetails: isCorporate ? {
                            companyName,
                            gstNumber,
                            address: companyAddress
                          } : {},
                        };

                        const encryptedData = encryptData(registrationData);
                        const response = await post(AUTH.SIGNUP, { encryptedData }, false);
                      
                        if (!response.success) {
                          setToast(response.message || 'Signup failed');
                          return;
                        }

                        console.log('✅ Signup Success:', response.data);
                        setStep('register-success');
                      } catch (error) {
                        console.error('❌ Signup Error:', error);
                        setToast('Server error. Try again.');
                      }
                    }}>
                      REGISTER
                    </button>

                    </div>
                  </>
                ) : step === 'register-success' ? (
                  <>
                    <div className="login-success-message">
                      <h3>Congratulations</h3>
                      <p>Your account has been created successfully.</p>
                    </div>
                    <div className="button-row">
                      <button
                        className="login-next" id="continue-shopping-btn" 
                        onClick={() => {
                          setStep('login');
                          onClose();
                        }}
                      >
                        CONTINUE SHOPPING
                      </button>
                      <button
                        className="secondary-button" id="continue-shopping-btn" 
                        onClick={() => setStep('login')}
                      >
                        BACK TO LOGIN
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ff4d4f',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '6px',
          zIndex: 99999,
          fontSize: '13px',
          fontWeight: '500',
        }}>{toast}</div>
      )}

      <style jsx>{`
       .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99996;
          }

          .modal-content.login-modal {
            display: flex;
            flex-direction: row;
            width: 800px; 
            max-height: 90vh;
            overflow: hidden;         
            background: white;
            border-radius: 10px;
            overflow: hidden; /* 🔴 REMOVE this */
            position: relative;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            font-family: "Segoe UI", sans-serif;
            max-height: 90vh; /* ✅ NEW */
          }

          .login-modal-left {
            width: 50%;
            background: #d3f14a;
            padding: 30px 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            transition: width 0.3s ease-in-out;
          }

          .narrow-left {
            width:35% !important;
          }

          .login-modal-left h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 12px;
            line-height: 1.3;
          }

          .login-modal-left p {
            font-size: 13px;
            font-weight: 500;
          }

          .login-modal-left img {
            width: 90px;
            margin: 15px auto 0;
          }

          .login-modal-right {
            width: 50%;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            background: white;
            box-sizing: border-box;
            position: relative;
            padding: 0;
            transition: width 0.3s ease-in-out;
            overflow-y: auto; 
            height:400px;       /* ✅ Enable scroll */
            max-height: 500px;       /* ✅ Lock scrollable height */
          }

          .login-content-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: 100%; /* let it fill the container */
            padding: 5px 20px;  /* spacing from both sides */
            box-sizing: border-box;
            margin-top:25%;
          }
          .login-logo-wrapper {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
          }
          .password-text1{
            margin-left:36%;
          }

          .logo-circle {
            background-color: black;
            padding: 10px;
            height: 60px;
            width: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .login-logo {
            height: 80px; /* or adjust as needed */
            width: auto;
          }

          .login-modal.step-register .login-modal-right {
            width: 60%;
          }
          .login-form-wrapper {
            width: 100%;
            max-width: 300px;
            max-height: 100%;
            padding: 0;
            overflow: unset;
            margin-top:35%;
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px 14px;
          }

          .full-width {
            grid-column: 1 / -1;
          }

          .login-modal-right h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
          }

          .login-input,
          select.login-input{
            padding: 6px 10px;
            margin: 0;
            font-size: 13px;
            height: 32px;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
          }
          .password-input {
            padding: 6px 10px;
            margin: 0;
            font-size: 13px;
            height: 32px;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            text-align: center;

          }

          select.login-input {
            background: #fff;
          }

          .otp-input-box {
            width: 36px;
            height: 40px;
            font-size: 16px;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .login-agree {
            font-size: 12px;
            color: #333;
            margin: 12px 0;
          }

          .login-agree a {
            color: #007bff;
            text-decoration: none;
          }
          .button-row {
            display: flex;
            justify-content: center;
            gap: 16px; /* Adjust as needed */
            margin-top: 20px; /* Optional: space from content above */
          }


          .login-next,
          .secondary-button,.signup-btn {
            background-color:rgb(76, 105, 149);
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            font-weight: 600;
            border-radius: 4px;
            font-size: 11px;
            height:35;
            width: 40%;
            margin: 12px 12px 0; 
          }
            .login-next:hover {
            background-color: #007bff;
            color: white;
          }
            .signup-btn:hover {
            background-color: #007bff;
            color: white;
          }

          .secondary-button {
            background: white;
            border: 1px solid black;
            gap:16px;
          }
            .secondary-button:hover {
            background-color: #007bff;
            color: white;
          }
          .login-btn{
            background-color:rgb(76, 105, 149);
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            font-weight: 600;
            border-radius: 4px;
            font-size: 11px;
            height:35;
            width: 40%;
            margin: 12px 0px 0; 
          }
            .login-btn:hover {
            background-color: #007bff;
            color: white;
          }
          .continue-btn{
            background-color:rgb(76, 105, 149);
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            font-weight: 600;
            border-radius: 4px;
            font-size: 11px;
            height:35;
            width: 60%;
            margin: 0px 0px 0; 
          }
          #continue-shopping-btn {
            
            font-size: 9px;
            width: 60%;
            margin: 0px 0px 0; 
          }

          .modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 22px;
            background: none;
            border: none;
            cursor: pointer;
            color: #333;
          }

          .zy-header-login-icon {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            margin-left: 15px;
            color: white;
          }
          .form-vertical {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .form-row-2col {
            display: flex;
            gap: 12px;
          }

          .login-input,
          select.login-input {
            padding: 8px 10px;
            font-size: 13px;
            height: 34px;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
          }
          .login-success-message {
          text-align: center;
          margin-bottom: 30px;
        }
          .modal-close {
            position: absolute;
            top: 12px;
            right: 12px;
            font-size: 24px;
            background: none;
            border: none;
            cursor: pointer;
            color: #111;
            font-weight: bold;
            z-index: 20; /* make sure it stays above everything */
            transition: transform 0.2s ease;
          }

          .modal-close:hover {
            transform: scale(1.2);
            color: red;
          }
            .mobile-only {
              display: none;
            }
          .forgot-password-section {
            font-size: 13px;
            cursor: pointer;
            margin-top: 10px;
            text-align: left;
            font-weight: bold;
            color: #333;
          }
          .corporate-toggle-wrapper {
            margin-top: 10px;
            margin-bottom: 10px;
          }

          .corporate-checkbox {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            font-weight: 500;
            color: #333;
            cursor: pointer;
          }

          .corporate-checkbox input[type="checkbox"] {
            accent-color: rgb(76, 105, 149);
            width: 16px;
            height: 16px;
            cursor: pointer;
          }

          .corporate-fields {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 10px;
          }
             
          @media (max-width: 768px) {
          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: -10px;
          }

          .modal-content.login-modal {
            flex-direction: column;
            width: 90vw;
            height: auto;
          }

          .login-modal-left,
          .login-modal-right {
            width: 100%;
            height: auto;
          }

          .login-modal-left {
            padding: 20px 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            
          }

          .login-logo-wrapper.mobile-only {
            margin-bottom: 12px;
          }

          .login-modal-left h2 {
            font-size: 18px;
            font-weight: 600;
            margin-top: 60px;
          }

          .login-modal-left p {
            font-size: 14px;
            margin-bottom: 10px;
          }

          .login-modal-left img {
            width: 70px;
            margin-top: 10px;
          }

          .login-logo {
            height: 50px;
          }

          .login-form-wrapper {
            padding: 20px;
            max-width: 100%;
            box-sizing: border-box;
          }

          .modal-close {
            top: 10px;
            right: 10px;
          }
          .login-next{
            width: 80%;
            margin-top: 20px;
          }
          .signup-btn{
            width: 80%;
            margin-top: 20px;}
          }
          .forgot-password-section {
            text-align: center;
          }
         .login-btn{
          width: 80%;
          margin-left: 10%;
          margin-top:25px;      
        }
        .narrow-left {

          width: 100% !important;

          }  

        .login-modal.step-register .login-modal-right {
          width: 100% !important;
          margin-top: 0px;
        }
        .login-content-wrapper{
          margin-top: 0px;
          padding-top: 0px;
        }
         .button-row{
           width: 105%;
         }

        .button-row #continue-shopping-btn{
         font-size: 7px; !important;
        }  
      `}</style>
    </>
  );
}
