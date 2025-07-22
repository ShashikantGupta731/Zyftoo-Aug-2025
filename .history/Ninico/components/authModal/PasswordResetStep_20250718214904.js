'use client';
import { post } from '../../util/apiService';
import { AUTH } from '../../util/apiEndpoints';
import { encryptData } from '../../util/cryptoHelper';

export default function PasswordResetStep({ 
  phone, 
  regPassword, 
  setRegPassword,
  confirmPassword, 
  setConfirmPassword,
  setStep, 
  setToast 
}) {

  const handlePasswordReset = async () => {
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

      setStep('register-success');
    } catch (error) {
      setToast('Server error. Try again.');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <h3 style={{ fontSize: '22px' }}>Reset Your Password</h3>
      </div>
      <div className="form-vertical">
        <input 
          className="login-input" 
          type="password" 
          placeholder="New Password" 
          value={regPassword} 
          onChange={(e) => setRegPassword(e.target.value)} 
        />
        <input 
          className="login-input" 
          type="password" 
          placeholder="Confirm New Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />
        
        <button className="login-next" onClick={handlePasswordReset}>
          Update Password 
        </button>
      </div>
    </>
  );
}
