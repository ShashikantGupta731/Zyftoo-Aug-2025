'use client'
import React from 'react'

/**
 * Modal Container Component
 * Provides the basic modal structure and backdrop
 */
export default function ModalContainer({ show, children, size = "modal-xl" }) {
  if (!show) return null

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className={`modal-dialog ${size}`}>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}
