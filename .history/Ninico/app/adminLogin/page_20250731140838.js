'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '../../util/apiService'
import { AUTH } from '../../util/apiEndpoints'
import { decryptData } from '../../util/cryptoHelper'

export default function AdminLoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

      console.log('🔄 Login response:', response)

      try {
        // Decrypt the response data using cryptoHelper
        const decryptedData = response.encryptedData ? decryptData(response.encryptedData) : response
        console.log('🔓 Decrypted response:', decryptedData)

        if (decryptedData.success) {
          const { token, user } = decryptedData.data

          // Verify admin role
          if (user?.role !== 'admin') {
            setError('Access denied. Admin privileges required.')
            return
          }

          // Store admin token
          localStorage.setItem('adminToken', token)
          
          // Store admin info
          localStorage.setItem('adminInfo', JSON.stringify({
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            email: user.email
          }))

          console.log('✅ Admin login successful')
          router.push('/admin')
        } else {
          setError(decryptedData.message || 'Login failed')
        }
      } catch (error) {
        console.error('🔐 Decryption/parsing error:', error)
        setError('Error processing login response')
      }
      } else if (response.success && response.token) {
        // Handle unencrypted response (fallback)
        if (response.user?.role !== 'admin') {
          setError('Access denied. Admin privileges required.')
          return
        }

        // Store admin token
        localStorage.setItem('adminToken', response.token)
        
        // Store admin info
        localStorage.setItem('adminInfo', JSON.stringify({
          id: response.user.id,
          name: response.user.name,
          phone: response.user.phone,
          role: response.user.role,
          email: response.user.email
        }))

        console.log('✅ Admin login successful')
        router.push('/admin')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err) {
      console.error('❌ Admin login error:', err)
      setError('Invalid credentials or server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
