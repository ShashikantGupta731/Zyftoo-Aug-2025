'use client'
import React from 'react'

export default function CategoryConfigHeader({ onClose }) {
  return (
    <div className="modal-header">
      <h5 className="modal-title">
        <i className="bi bi-grid-3x3-gap me-2"></i>
        Category Section Configuration
      </h5>
      <button 
        type="button" 
        className="btn-close" 
        onClick={onClose}
      ></button>
    </div>
  )
}
