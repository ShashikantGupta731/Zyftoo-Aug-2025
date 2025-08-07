'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminCategories() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main admin page and set active menu to categories
    router.push('/admin?tab=categories')
  }, [router])

  return null
}
