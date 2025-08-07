'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminOrders() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main admin page and set active menu to orders
    router.push('/admin?tab=orders')
  }, [router])

  return null
}
