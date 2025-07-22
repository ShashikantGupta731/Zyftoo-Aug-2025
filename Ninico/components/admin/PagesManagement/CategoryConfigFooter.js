'use client'
import React from 'react'

export default function CategoryConfigFooter({ onClose, onSave, loading }) {
  return (
    <div className="modal-footer">
      <button 
        type="button" 
        className="btn btn-secondary" 
        onClick={onClose}
      >
        Cancel
      </button>
      <button 
        type="button" 
        className="btn btn-primary" 
        onClick={onSave}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Saving...
          </>
        ) : (
          'Save Configuration'
        )}
      </button>
    </div>
  )
}
