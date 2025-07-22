'use client'
import React, { useState } from 'react'
import CategorySectionManager from './CategorySectionManager'

const SECTION_MANAGERS = {
  giftCategories: CategorySectionManager,
  // Add more section managers as needed
  // products: ProductSectionManager,
  // slider: SliderSectionManager,
}

export default function SectionManager({ pageKey, sectionKey, sectionData, onClose, onUpdate }) {
  const SectionComponent = SECTION_MANAGERS[sectionKey]
  
  if (!SectionComponent) {
    return (
      <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-gear me-2"></i>
                Manage {sectionData.label}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body text-center py-5">
              <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3">Section Manager Not Available</h4>
              <p className="text-muted">
                Section manager for <strong>{sectionKey}</strong> is not implemented yet.
              </p>
              <p className="text-muted">
                Available managers: {Object.keys(SECTION_MANAGERS).join(', ') || 'None'}
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-gear me-2"></i>
              Manage {sectionData.label}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-0">
            <SectionComponent 
              pageKey={pageKey}
              sectionKey={sectionKey}
              sectionData={sectionData}
              onUpdate={onUpdate}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
