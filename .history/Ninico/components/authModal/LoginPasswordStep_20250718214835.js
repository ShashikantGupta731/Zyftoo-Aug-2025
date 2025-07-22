'use client';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { post } from '../../util/apiService';
import { AUTH } from '../../util/apiEndpoints';
import { encryptData, decryptData, encryptAndStore } from '../../util/cryptoHelper';

export default function LoginPasswordStep({ 
  phone, 
  password, 
  setPassword, 
  setStep, 
  setToast 
}) {
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (password.trim() === '') {
      setToast('Enter the Password to Proceed');
      return;
    }

    try {
      if (!phone || phone.trim() === '') {
        setToast('Phone number is required');
        return;
      }
      
      // Encrypt login credentials
      const loginData = { phone, password };
      const encryptedData = encryptData(loginData);
      
      const response = await post(AUTH.LOGIN, { encryptedData }, false);

      if (!response.success) {
        const msg = response.message || 'Login failed';
        setToast(msg);
        return;
      }

      // Decrypt the response data
      let decryptedResponse;
      if (response.encryptedData) {
        decryptedResponse = decryptData(response.encryptedData);
      } else {
        decryptedResponse = response;
      }

      // Handle nested data structure
      const responseData = decryptedResponse.data || decryptedResponse;

      if (!responseData?.token) {
        setToast('Login succeeded but token missing.');
        return;
      }
      
      // Store user data encrypted in localStorage
      encryptAndStore('user', responseData.user);
      login(responseData.user);
      setStep('success');
    } catch (error) {
      setToast('Server Error: ' + (error.message || 'Unknown error'));
    }
  };

  return (
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
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-btn" onClick={handleLogin}>
        Login
      </button>
    </>
  );
}
