'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminProducts() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main admin page and set active menu to products
    router.push('/admin?tab=products')
  }, [router])

  return null
}
