'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const router = useRouter()

  useEffect(() => {
    // Check for admin token
    const token = localStorage.getItem('adminToken')
    if (!token) {
      console.log('🚫 No admin token found, redirecting to login')
      router.push('/adminLogin')
      return
    }

    // Verify token is valid (you can add more validation here)
    try {
      // Optional: Verify token format or expiration
      const tokenData = JSON.parse(atob(token.split('.')[1]))
      const isExpired = tokenData.exp * 1000 < Date.now()
      
      if (isExpired) {
        console.log('🚫 Admin token expired, redirecting to login')
        localStorage.removeItem('adminToken')
        router.push('/adminLogin')
      }
    } catch (error) {
      console.error('❌ Invalid token format:', error)
      localStorage.removeItem('adminToken')
      router.push('/adminLogin')
    }
  }, [router])

  return null
}
