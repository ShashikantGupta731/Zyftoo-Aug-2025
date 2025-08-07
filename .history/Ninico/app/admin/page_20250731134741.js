'use client'
import { useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function AdminPage() {
  // Use the admin auth hook
  useAdminAuth()

  return <AdminLayout />
}
