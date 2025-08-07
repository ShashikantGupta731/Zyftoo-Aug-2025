'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const router = useRouter()

  useEffect(() => {
    const validateToken = async () => {
      // Check for admin token
      const token = localStorage.getItem('adminToken')
      if (!token) {
        console.log('🚫 No admin token found, redirecting to login')
        router.push('/adminLogin')
        return
      }

      // Verify token format without decoding
      if (!token.includes('.')) {
        console.error('❌ Invalid token format')
        localStorage.removeItem('adminToken')
        router.push('/adminLogin')
        return
      }

      try {
        // Verify token with backend
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          console.log('🚫 Invalid or expired token')
          localStorage.removeItem('adminToken')
          router.push('/adminLogin')
          return
        }

        const data = await response.json()
        if (!data.success || data.role !== 'admin') {
          console.log('🚫 Not an admin token')
          localStorage.removeItem('adminToken')
          router.push('/adminLogin')
        }
      } catch (error) {
        console.error('❌ Token verification failed:', error)
        localStorage.removeItem('adminToken')
        router.push('/adminLogin')
      }
    }

    validateToken()
  }, [router])

  return null
}
