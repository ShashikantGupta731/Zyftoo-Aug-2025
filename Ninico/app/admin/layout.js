'use client'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export default function AdminLayout({ children }) {
  // Protect all admin routes
  useAdminAuth()
  
  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}
