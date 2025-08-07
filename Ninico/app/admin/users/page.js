'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminUsers() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main admin page and set active menu to users
    router.push('/admin?tab=users')
  }, [router])

  return null
}
