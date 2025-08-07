'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminSettings() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main admin page and set active menu to settings
    router.push('/admin?tab=settings')
  }, [router])

  return null
}
