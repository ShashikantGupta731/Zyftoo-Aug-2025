'use client'
import { createContext, useState, useEffect } from 'react'
import { encryptAndStore, decryptAndRetrieve, clearAuthData } from '@/util/cryptoHelper'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Try to get encrypted user data first
      const encryptedUser = decryptAndRetrieve('user')
      if (encryptedUser) {
        setUser(encryptedUser)
      } else {
        // Fallback to unencrypted user data for backward compatibility
        const user = localStorage.getItem('user')
        if (user) {
          setUser(JSON.parse(user))
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      // Clear corrupted data
      clearAuthData()
    }
    setLoading(false) // done loading
  }, [])

  const login = (userData) => {
    setUser(userData)
    // Store user data encrypted
    encryptAndStore('user', userData)
    // Also keep unencrypted for backward compatibility (can be removed later)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    // Clear all auth data using utility function
    clearAuthData()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
