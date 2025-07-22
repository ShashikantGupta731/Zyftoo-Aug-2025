/**
 * Migration Example Component
 * Shows how to gradually migrate from fetch to encrypted API service
 * This component can be used as a reference for updating your existing components
 */

'use client';
import React, { useState } from 'react';
import { post, get } from '@/util/apiService';
import { AUTH, OTP } from '@/util/apiEndpoints';

export default function MigratedLoginExample() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [useEncryption, setUseEncryption] = useState(false);
  const [toast, setToast] = useState('');

  // ============================================================================
  // OLD METHOD (using fetch - still works)
  // ============================================================================
  const loginWithFetch = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setToast(data.error || 'Login failed');
        return;
      }

      setToast('Login successful (fetch method)');
      return data;
    } catch (error) {
      setToast('Network error');
      console.error('Login error:', error);
    }
  };

  // ============================================================================
  // NEW METHOD (using encrypted API service)
  // ============================================================================
  const loginWithEncryptedApi = async () => {
    try {
      const response = await post(AUTH.LOGIN, { phone, password }, useEncryption);
      
      if (response.success) {
        setToast('Login successful (encrypted API)');
        
        // Store auth token if provided
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        return response.data;
      } else {
        setToast(response.message || 'Login failed');
      }
    } catch (error: any) {
      setToast(error.message || 'Login failed');
      console.error('Login error:', error);
    }
  };

  // ============================================================================
  // HYBRID METHOD (checking both old and new)
  // ============================================================================
  const checkUserExists = async () => {
    try {
      // Method 1: Using fetch (old way)
      const fetchResponse = await fetch(`http://localhost:5000/api/auth/check-user/${phone}`);
      const fetchData = await fetchResponse.json();
      console.log('Fetch result:', fetchData);

      // Method 2: Using new API service
      const apiResponse = await get(`${AUTH.CHECK_USER}/${phone}`);
      console.log('API service result:', apiResponse.data);

      setToast(`User exists: ${fetchData.exists ? 'Yes' : 'No'}`);
    } catch (error) {
      setToast('Error checking user');
      console.error('Check user error:', error);
    }
  };

  // ============================================================================
  // SEND OTP (showing encrypted vs unencrypted)
  // ============================================================================
  const sendOTP = async () => {
    try {
      // Send OTP with encryption based on toggle
      const response = await post(OTP.SEND, 
        { phone, purpose: 'login' }, 
        useEncryption  // This will encrypt the phone number if true
      );
      
      if (response.success) {
        setToast(`OTP sent ${useEncryption ? '(encrypted)' : '(unencrypted)'}`);
      } else {
        setToast(response.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      setToast(error.message || 'Failed to send OTP');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>API Migration Example</h2>
      
      {/* Toast notification */}
      {toast && (
        <div style={{
          padding: '10px',
          margin: '10px 0',
          backgroundColor: '#f0f8ff',
          border: '1px solid #0066cc',
          borderRadius: '4px',
          color: '#0066cc'
        }}>
          {toast}
        </div>
      )}

      {/* Input fields */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            margin: '5px 0',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            margin: '5px 0',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>

      {/* Encryption toggle */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={useEncryption}
            onChange={(e) => setUseEncryption(e.target.checked)}
          />
          Use Encryption for API calls
        </label>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={loginWithFetch}
          style={{
            padding: '10px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login with Fetch (Old Method)
        </button>
        
        <button
          onClick={loginWithEncryptedApi}
          style={{
            padding: '10px',
            backgroundColor: useEncryption ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login with API Service {useEncryption ? '(Encrypted)' : '(Unencrypted)'}
        </button>
        
        <button
          onClick={checkUserExists}
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Check User (Both Methods)
        </button>
        
        <button
          onClick={sendOTP}
          style={{
            padding: '10px',
            backgroundColor: '#fd7e14',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send OTP {useEncryption ? '(Encrypted)' : '(Unencrypted)'}
        </button>
      </div>

      {/* Documentation */}
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Migration Guide:</h4>
        <ol>
          <li><strong>Immediate use:</strong> All your existing fetch calls continue to work unchanged</li>
          <li><strong>Gradual migration:</strong> Replace fetch calls with new API service one by one</li>
          <li><strong>Encryption:</strong> Use encryption for sensitive data like login credentials</li>
          <li><strong>No encryption:</strong> Use unencrypted for public data like product listings</li>
          <li><strong>Error handling:</strong> New API service provides better error handling and response structure</li>
        </ol>
      </div>
    </div>
  );
}
