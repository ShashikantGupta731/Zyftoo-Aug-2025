'use client';
import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import AuthContext from '@/components/context/AuthContext';
import { decryptAndRetrieve } from '@/util/cryptoHelper';

// Import step components
import LoginStep from '../authModal/LoginStep';
import LoginPasswordStep from '../authModal/LoginPasswordStep';
import OtpStep from '../authModal/OtpStep';
import PasswordResetStep from '../authModal/PasswordResetStep';
import RegisterStep from '../authModal/RegisterStep';
import SuccessStep from '../authModal/SuccessStep';
import RegisterSuccessStep from '../authModal/RegisterSuccessStep';

export default function LoginModal({ show, onClose }) {
  const { login } = useContext(AuthContext);
  const [step, setStep] = useState('login'); // 'login' or 'otp' or 'signupOtp' or 'register' or 'register-success'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
                {step === 'login' && (
                  <LoginStep 
                    phone={phone}
                    setPhone={setPhone}
                    setStep={setStep}
                    setToast={setToast}
                  />
                )}
                
                {step === 'login-password' && (
                  <LoginPasswordStep 
                    phone={phone}
                    password={password}
                    setPassword={setPassword}
                    setStep={setStep}
                    setToast={setToast}
                  />
                )}
                
                {step === 'signupOtp' && (
                  <OtpStep 
                    phone={phone}
                    otp={otp}
                    setOtp={setOtp}
                    setStep={setStep}
                    setToast={setToast}
                    purpose="signup"
                  />
                )}
                
                {step === 'forgotOtp' && (
                  <OtpStep 
                    phone={phone}
                    otp={otp}
                    setOtp={setOtp}
                    setStep={setStep}
                    setToast={setToast}
                    purpose="reset"
                  />
                )}
                
                {step === 'password-reset' && (
                  <PasswordResetStep 
                    phone={phone}
                    regPassword={regPassword}
                    setRegPassword={setRegPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    setStep={setStep}
                    setToast={setToast}
                  />
                )}
                
                {step === 'success' && (
                  <SuccessStep onClose={onClose} />
                )}
                
                {step === 'register' && (
                  <RegisterStep 
                    phone={phone}
                    name={name}
                    setName={setName}
                    email={email}
                    setEmail={setEmail}
                    regPassword={regPassword}
                    setRegPassword={setRegPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    gender={gender}
                    setGender={setGender}
                    dob={dob}
                    setDob={setDob}
                    pincode={pincode}
                    setPincode={setPincode}
                    isCorporate={isCorporate}
                    setIsCorporate={setIsCorporate}
                    userType={userType}
                    setUserType={setUserType}
                    companyName={companyName}
                    setCompanyName={setCompanyName}
                    gstNumber={gstNumber}
                    setGstNumber={setGstNumber}
                    companyAddress={companyAddress}
                    setCompanyAddress={setCompanyAddress}
                    setStep={setStep}
                    setToast={setToast}
                  />
                )}
                
                {step === 'register-success' && (
                  <RegisterSuccessStep 
                    setStep={setStep}
                    onClose={onClose}
                  />
                )}
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

      <style jsx>{\`
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
      \`}</style>
    </>
  );
}
