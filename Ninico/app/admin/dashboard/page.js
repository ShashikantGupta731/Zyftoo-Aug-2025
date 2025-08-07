'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main admin page to maintain existing functionality
    router.push('/admin')
  }, [router])

  return null
}