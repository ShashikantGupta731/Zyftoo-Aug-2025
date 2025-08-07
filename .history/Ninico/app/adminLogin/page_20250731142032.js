'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '../../util/apiService'
import { AUTH } from '../../util/apiEndpoints'
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

  // Check if already logged in
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

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate phone
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit phone number')
      setLoading(false)
      return
    }

    try {
      // Send login request
      const response = await post(AUTH.LOGIN, {
        phone,
        password,
        role: 'admin' // Add role to indicate admin login
      })

      // Debug the response structure
      console.log('🔄 Full response:', {
        status: response?.status,
        hasEncryptedData: !!response?.encryptedData,
        encryptedDataLength: response?.encryptedData?.length,
        responseKeys: Object.keys(response)
      })

      if (!response?.encryptedData) {
        console.error('❌ No encrypted data in response:', response)
        throw new Error('Invalid response format from server')
      }

      try {
        // Log encrypted data prefix for debugging
        console.log('🔒 Encrypted data prefix:', response.encryptedData.substring(0, 50))

        // Decrypt the response
        const decryptedData = decryptData(response.encryptedData)
        console.log('🔓 Decrypted response structure:', {
          success: decryptedData?.success,
          hasData: !!decryptedData?.data,
          hasToken: !!decryptedData?.data?.token,
          hasUser: !!decryptedData?.data?.user,
          userRole: decryptedData?.data?.user?.role
        })

        if (!decryptedData?.success || !decryptedData?.data?.token || !decryptedData?.data?.user) {
          console.error('❌ Invalid decrypted data structure:', decryptedData)
          throw new Error('Invalid response data structure')
        }

        const { token, user } = decryptedData.data

        // Verify admin role
        if (user.role !== 'admin') {
          console.warn('⚠️ Non-admin user attempted login:', user.role)
          setError('Access denied. Admin privileges required.')
          return
        }

        console.log('✅ Admin validation successful:', {
          userId: user.id,
          role: user.role
        })

        // Store admin token
        localStorage.setItem('adminToken', token)
        
        // Store admin info
        const adminInfo = {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
          email: user.email
        }
        
        localStorage.setItem('adminInfo', JSON.stringify(adminInfo))
        console.log('💾 Stored admin info:', adminInfo)

        console.log('✅ Admin login successful')
        router.push('/admin')

      } catch (decryptError) {
        console.error('🔐 Decryption error:', {
          message: decryptError.message,
          stack: decryptError.stack,
          response: response
        })
        setError(`Error processing response: ${decryptError.message}`)
      }
    } catch (err) {
      console.error('❌ Login error:', {
        message: err.message,
        type: err.name,
        stack: err.stack
      })
      setError(err.message || 'Invalid credentials or server error')
    } finally {
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
                  />
                  <button
                    className="login-btn"
                    onClick={handleLogin}
                  >
                    {loading ? 'Signing in...' : 'Login'}
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
        <div className="toast-message">
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
        .login-btn {
          width: 100%;
          padding: 10px;
          margin-top: 20px;
          background: rgb(76, 105, 149);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        }

        .login-next:hover,
        .login-btn:hover {
          background: #007bff;
        }

        .error-message {
          color: #ff4d4f;
          margin-top: 10px;
          text-align: center;
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
  )
}
