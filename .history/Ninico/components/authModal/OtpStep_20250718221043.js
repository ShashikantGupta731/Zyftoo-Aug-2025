'use client';
import { post } from '@/util/apiService';
import { OTP } from '@/util/apiEndpoints';
import { encryptData } from '@/util/cryptoHelper';

export default function OtpStep({ 
  phone, 
  otp, 
  setOtp, 
  setStep, 
  setToast,
  purpose = 'signup' // 'signup', 'reset', etc.
}) {

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

  const handleOtpVerification = async () => {
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
      // Encrypt OTP verification data
      const encryptedData = encryptData({
        phone,
        otp: enteredOtp,
        purpose,
      });
      
      const response = await post(OTP.VERIFY, { encryptedData }, false);

      if (!response.success) {
        setToast(response.message || 'Wrong OTP');
        return;
      }

      // Navigate to appropriate next step based on purpose
      if (purpose === 'signup') {
        setStep('register');
      } else if (purpose === 'reset') {
        setStep('password-reset');
      }
    } catch (err) {
      setToast('Something went wrong');
    }
  };

  const getTitle = () => {
    switch (purpose) {
      case 'signup':
        return 'Enter OTP To Proceed:';
      case 'reset':
        return 'Enter OTP To Reset Password:';
      default:
        return 'Enter OTP To Proceed:';
    }
  };

  return (
    <>
      <h3>{getTitle()}</h3>
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
      <button className="login-next" onClick={handleOtpVerification}>
        Next
      </button>
    </>
  );
}
