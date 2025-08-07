'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '../../util/apiService'
import { encryptData, decryptData } from '../../util/cryptoHelper'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState('phone') // 'phone' or 'password'
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Enable auto-login
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      router.push('/admin')
    }
  }, [router])

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone)
  }

  const handleLogin = async () => {
    setError('')
    setLoading(true)

    if (!validatePhone(phone) || !password) {
      setToast('Please enter valid credentials')
      setLoading(false)
      return
    }

    try {
      // Prepare login data
      const loginData = {
        phone,
        password,
        userType: 'Admin'
      }
      
      console.log('📝 Admin login payload:', loginData)
      
      // Encrypt the data
      const encryptedData = encryptData(loginData)
      console.log('🔒 Admin login data encrypted')

      // Send login request to admin-specific endpoint
      const res = await post('/auth/adminlogin', { encryptedData }, false)
      console.log('📨 Raw server response:', res)

      // Get the axios response data
      const response = res.data
      console.log('🔄 Response data:', response)

      if (!response) {
        throw new Error('No response received from server')
      }

      // Check if login was successful
      if (!response.success) {
        console.error('❌ Login failed:', response.error)
        setError(response.error || 'Login failed')
        setLoading(false)
        return
      }

      // Decrypt response if it's encrypted
      let decryptedResponse
      if (response.encryptedData) {
        console.log('🔐 Encrypted response detected, decrypting...')
        decryptedResponse = decryptData(response.encryptedData)
        console.log('🔓 Decrypted response:', decryptedResponse)
      } else {
        console.log('📄 Using unencrypted response')
        decryptedResponse = response
      }

      // Get the final data structure (handle potential nesting)
      const userData = decryptedResponse.data || decryptedResponse
      console.log('👤 User data:', userData)

      // Validate response structure
      if (!userData?.token || !userData?.user) {
        console.error('❌ Invalid response structure:', userData)
        throw new Error('Invalid response format from server')
      }

      // Verify admin role
      if (userData.user.role !== 'admin') {
        console.warn('⚠️ Non-admin access attempt:', userData.user.role)
        setError('Access denied. Admin privileges required.')
        setLoading(false)
        return
      }

      // Store admin token and info
      localStorage.setItem('adminToken', userData.token)
      
      // ALSO store as authToken so API service can use it for category operations
      localStorage.setItem('authToken', userData.token)
      
      const adminInfo = {
        id: userData.user.id,
        name: userData.user.name,
        phone: userData.user.phone,
        role: userData.user.role,
        email: userData.user.email,
        userType: userData.user.userType || 'Admin'
      }
      
      localStorage.setItem('adminInfo', JSON.stringify(adminInfo))
      console.log('💾 Admin info stored:', adminInfo)

      console.log('✅ Admin login successful')
      setToast('Login successful! Redirecting...')
      
      // Redirect to admin dashboard after a short delay
      setTimeout(() => {
        router.push('/admin')
      }, 1000)

    } catch (err) {
      console.error('❌ Login error:', err)
      const errorMessage = err.response?.data?.error || 
                          err.message || 
                          'Login failed. Please try again.'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content login-modal">
        <div className="login-modal-left">
          <div className="login-logo-wrapper mobile-only">
            <div className="logo-circle">
              <img src="/assets/img/logo/logo.png" alt="Company Logo" className="login-logo" />
            </div>
          </div>
          <h2>ADMIN PANEL</h2>
          <p>Secure Login Portal</p>
          <div className="offer-image desktop-only">
            <img src="/assets/login-illustration.png" alt="Admin" />
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
              {step === 'phone' ? (
                <>
                  <h3>Admin Login</h3>
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="login-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && validatePhone(phone)) {
                        setStep('password')
                      }
                    }}
                  />
                  <button 
                    className="login-next"
                    onClick={() => {
                      if (validatePhone(phone)) {
                        setStep('password')
                      } else {
                        setToast('Please enter a valid 10-digit phone number')
                      }
                    }}
                  >
                    Next
                  </button>
                </>
              ) : step === 'password' ? (
                <>
                  <div className='password-text1'><h3>Password:</h3></div>
                  <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                    <strong>Phone:</strong> {phone || 'Not set'}
                  </div>
                  <input
                    type="password"
                    placeholder="Enter Your Password"
                    className="password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && password) {
                        handleLogin()
                      }
                    }}
                  />
                  <button
                    className="login-btn"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Login'}
                  </button>
                  <button
                    className="back-btn"
                    onClick={() => {
                      setStep('phone')
                      setPassword('')
                      setError('')
                    }}
                    disabled={loading}
                  >
                    Back
                  </button>
                </>
              ) : null}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`toast-message ${toast.includes('successful') ? 'success' : ''}`}>
          {toast}
        </div>
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
        }

        .modal-content.login-modal {
          display: flex;
          flex-direction: row;
          width: 800px;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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
        }

        .login-modal-right {
          width: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .login-form-wrapper {
          width: 100%;
          max-width: 300px;
        }

        .login-input,
        .password-input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }

        .password-input {
          text-align: center;
        }

        .login-next,
        .login-btn,
        .back-btn {
          width: 100%;
          padding: 10px;
          margin-top: 20px;
          background: rgb(76, 105, 149);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease;
        }

        .login-next:hover,
        .login-btn:hover,
        .back-btn:hover {
          background: #007bff;
        }

        .login-btn:disabled,
        .back-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .back-btn {
          background: #6c757d;
          margin-top: 10px;
        }

        .error-message {
          color: #ff4d4f;
          margin-top: 10px;
          text-align: center;
          font-size: 14px;
        }

        .toast-message {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background: #ff4d4f;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          animation: slideUp 0.3s ease;
        }

        .toast-message.success {
          background: #52c41a;
        }

        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }

        .login-logo-wrapper {
          margin-bottom: 20px;
          text-align: center;
        }

        .logo-circle {
          background-color: black;
          padding: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .login-logo {
          height: 60px;
          width: auto;
        }

        .password-text1 {
          text-align: center;
        }

        @media (max-width: 768px) {
          .modal-content.login-modal {
            flex-direction: column;
            width: 90%;
            max-width: 400px;
          }

          .login-modal-left,
          .login-modal-right {
            width: 100%;
          }

          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: block;
          }
        }

        @media (min-width: 769px) {
          .mobile-only {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}