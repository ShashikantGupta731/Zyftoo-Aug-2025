'use client'
import React from 'react'

export default function PageSelector({ pages, selectedPage, onPageChange, loading }) {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-light">
            <h5 className="card-title mb-0">
              <i className="bi bi-file-earmark-text me-2"></i>
              Select Page to Manage
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              {pages.map((page) => (
                <div key={page.key} className="col-md-6 mb-3">
                  <div 
                    className={`card border ${selectedPage === page.key ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'} h-100`}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                    onClick={() => !loading && onPageChange(page.key)}
                  >
                    <div className="card-body d-flex align-items-center">
                      <div className="me-3">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center ${selectedPage === page.key ? 'bg-primary text-white' : 'bg-secondary text-white'}`} style={{ width: '50px', height: '50px' }}>
                          <i className={`bi ${page.key === 'home' ? 'bi-house-door' : 'bi-building'} fs-5`}></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h6 className={`mb-1 ${selectedPage === page.key ? 'text-primary' : 'text-dark'}`}>
                          {page.label}
                          {selectedPage === page.key && (
                            <i className="bi bi-check-circle-fill ms-2 text-success"></i>
                          )}
                        </h6>
                        <p className="text-muted mb-0 small">{page.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {loading && (
              <div className="text-center mt-3">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                <span className="text-muted">Loading page configuration...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
