'use client';
import { useState } from 'react';
import { post, get } from '../../util/apiService';
import { OTP, AUTH } from '../../util/apiEndpoints';
import { encryptData } from '../../util/cryptoHelper';

export default function LoginStep({ 
  phone, 
  setPhone, 
  setStep, 
  setToast 
}) {

  const handleNext = () => {
    if (phone.length === 10) {
      setStep('login-password');
    } else {
      setToast('Enter a valid 10-digit phone number');
    }
  };

  const handleSignup = async () => {
    if (phone.length !== 10) {
      setToast('Enter a valid 10-digit phone number');
      return;
    }

    try {
      // Encrypt phone data for OTP request
      const encryptedData = encryptData({ phone, purpose: 'signup' });
      const response = await post(OTP.SEND, { encryptedData }, false);

      if (!response.success) {
        setToast(response.message || 'Failed to send OTP');
        return;
      }

      setStep('signupOtp');
    } catch (err) {
      setToast('Something went wrong');
    }
  };

  const handleForgotPassword = async () => {
    if (phone.length !== 10) {
      setToast('Enter a valid 10-digit phone number');
      return;
    }

    try {
      // Step 1: Check if user exists
      const response = await get(`${AUTH.CHECK_USER}/${phone}`);

      if (!response.data.exists) {
        setToast('No User registered with this phone number');
        return;
      }

      // Step 2: Send OTP with encrypted data
      const encryptedData = encryptData({ phone, purpose: 'reset' });
      const otpResponse = await post(OTP.SEND, { encryptedData }, false);

      if (!otpResponse.success) {
        setToast(otpResponse.message || 'Failed to send OTP');
        return;
      }

      // Step 3: Proceed to next screen
      setStep('forgotOtp');
    } catch (err) {
      setToast('Something went wrong');
    }
  };

  return (
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
      <button className="login-next" onClick={handleNext}>
        Next
      </button>

      <button className="signup-btn" onClick={handleSignup}>
        Signup
      </button>
      
      <div className="forgot-password-section" onClick={handleForgotPassword}>
        Forgot Password?
      </div>
    </>
  );
}
