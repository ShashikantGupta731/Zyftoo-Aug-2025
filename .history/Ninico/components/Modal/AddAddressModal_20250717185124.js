'use client';
import React, { useState } from 'react';

export default function AddAddressModal({ show, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pincode: '',
    state: '',
    address: '',
    locality: '',
    city: '',
    addressType: 'home',
    openSaturday: false,
    openSunday: false,
    makeDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      addressType: type
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      mobile: '',
      pincode: '',
      state: '',
      address: '',
      locality: '',
      city: '',
      addressType: 'home',
      openSaturday: false,
      openSunday: false,
      makeDefault: false
    });
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      >
        <div 
          className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header border-bottom" style={{ borderColor: '#f5f5f6' }}>
              <h5 className="modal-title fw-bold" style={{ fontSize: '16px', color: '#282c3f' }}>
                ADD NEW ADDRESS
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body px-4 py-4">
              <form>
                {/* Name */}
                <div className="mb-4">
                  <label className="form-label text-muted mb-2" style={{ fontSize: '12px' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 border-bottom rounded-0 px-0"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    style={{ 
                      fontSize: '14px', 
                      color: '#282c3f',
                      borderColor: '#f5f5f6 !important',
                      boxShadow: 'none'
                    }}
                  />
                </div>

                {/* Mobile */}
                <div className="mb-4">
                  <label className="form-label text-muted mb-2" style={{ fontSize: '12px' }}>
                    Mobile *
                  </label>
                  <input
                    type="tel"
                    className="form-control border-0 border-bottom rounded-0 px-0"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    style={{ 
                      fontSize: '14px', 
                      color: '#282c3f',
                      borderColor: '#f5f5f6 !important',
                      boxShadow: 'none'
                    }}
                  />
                </div>

                {/* Pincode and State */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted mb-2" style={{ fontSize: '12px' }}>
                      Pincode *
                    </label>
                    <input
                      type="text"
                      className="form-control border-0 border-bottom rounded-0 px-0"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      style={{ 
                        fontSize: '14px', 
                        color: '#282c3f',
                        borderColor: '#f5f5f6 !important',
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-muted mb-2" style={{ fontSize: '12px' }}>
                      State *
                    </label>
                    <input
                      type="text"
                      className="form-control border-0 border-bottom rounded-0 px-0"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      style={{ 
                        fontSize: '14px', 
                        color: '#282c3f',
                        borderColor: '#f5f5f6 !important',
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label className="form-label text-muted mb-2" style={{ fontSize: '12px' }}>
                    Address (House No, Building, Street, Area) *
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 border-bottom rounded-0 px-0"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    style={{ 
                      fontSize: '14px', 
                      color: '#282c3f',
                      borderColor: '#f5f5f6 !important',
                      boxShadow: 'none'
                    }}
                  />
                </div>

                {/* Locality */}
                <div className="mb-4">
                  <label className="form-label text-muted mb-2" style={{ fontSize: '12px' }}>
                    Locality/ Town *
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 border-bottom rounded-0 px-0"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    style={{ 
                      fontSize: '14px', 
                      color: '#282c3f',
                      borderColor: '#f5f5f6 !important',
                      boxShadow: 'none'
                    }}
                  />
                </div>

                {/* City */}
                <div className="mb-4">
                  <label className="form-label text-muted mb-2" style={{ fontSize: '12px' }}>
                    City/ District *
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 border-bottom rounded-0 px-0"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    style={{ 
                      fontSize: '14px', 
                      color: '#282c3f',
                      borderColor: '#f5f5f6 !important',
                      boxShadow: 'none'
                    }}
                  />
                </div>

                {/* Type of Address */}
                <div className="mb-4">
                  <label className="form-label text-muted mb-3" style={{ fontSize: '12px' }}>
                    Type of Address *
                  </label>
                  <div className="d-flex gap-0">
                    <div className="flex-fill">
                      <input
                        type="radio"
                        className="btn-check"
                        name="addressType"
                        id="home"
                        value="home"
                        checked={formData.addressType === 'home'}
                        onChange={() => handleAddressTypeChange('home')}
                      />
                      <label 
                        className="btn btn-outline-secondary w-100 rounded-0" 
                        htmlFor="home"
                        style={{ 
                          fontSize: '14px',
                          borderColor: '#d4d5d9',
                          color: formData.addressType === 'home' ? '#282c3f' : '#696b79',
                          backgroundColor: formData.addressType === 'home' ? '#f8f9fa' : 'white'
                        }}
                      >
                        Home
                      </label>
                    </div>
                    <div className="flex-fill">
                      <input
                        type="radio"
                        className="btn-check"
                        name="addressType"
                        id="office"
                        value="office"
                        checked={formData.addressType === 'office'}
                        onChange={() => handleAddressTypeChange('office')}
                      />
                      <label 
                        className="btn btn-outline-secondary w-100 rounded-0 border-start-0" 
                        htmlFor="office"
                        style={{ 
                          fontSize: '14px',
                          borderColor: '#d4d5d9',
                          color: formData.addressType === 'office' ? '#282c3f' : '#696b79',
                          backgroundColor: formData.addressType === 'office' ? '#f8f9fa' : 'white'
                        }}
                      >
                        Office
                      </label>
                    </div>
                  </div>
                </div>

                {/* Office hours */}
                {formData.addressType === 'office' && (
                  <div className="mb-4">
                    <p className="text-muted mb-3" style={{ fontSize: '12px' }}>
                      Is your office open on weekends?
                    </p>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="openSaturday"
                        id="openSaturday"
                        checked={formData.openSaturday}
                        onChange={handleInputChange}
                      />
                      <label 
                        className="form-check-label" 
                        htmlFor="openSaturday"
                        style={{ fontSize: '14px', color: '#282c3f' }}
                      >
                        Open on Saturday
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="openSunday"
                        id="openSunday"
                        checked={formData.openSunday}
                        onChange={handleInputChange}
                      />
                      <label 
                        className="form-check-label" 
                        htmlFor="openSunday"
                        style={{ fontSize: '14px', color: '#282c3f' }}
                      >
                        Open on Sunday
                      </label>
                    </div>
                  </div>
                )}

                {/* Make Default */}
                <div className="mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="makeDefault"
                      id="makeDefault"
                      checked={formData.makeDefault}
                      onChange={handleInputChange}
                    />
                    <label 
                      className="form-check-label" 
                      htmlFor="makeDefault"
                      style={{ fontSize: '14px', color: '#282c3f' }}
                    >
                      Make this as my default address
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer border-top-0 px-4 pb-4">
              <div className="row w-100 g-3">
                <div className="col-6">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary w-100"
                    onClick={handleCancel}
                    style={{ 
                      fontSize: '14px',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      padding: '12px',
                      borderColor: '#d4d5d9',
                      color: '#696b79'
                    }}
                  >
                    CANCEL
                  </button>
                </div>
                <div className="col-6">
                  <button 
                    type="button" 
                    className="btn w-100 text-white"
                    onClick={handleSave}
                    style={{ 
                      backgroundColor: '#9e9e9e',
                      borderColor: '#9e9e9e',
                      fontSize: '14px',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      padding: '12px'
                    }}
                  >
                    SAVE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal.show {
          display: block !important;
        }
        
        .form-control:focus {
          border-color: #f5f5f6 !important;
          box-shadow: none !important;
        }
        
        .form-control.border-bottom {
          border-bottom: 1px solid #f5f5f6 !important;
        }
        
        .form-control.border-bottom:focus {
          border-bottom: 2px solid #526cfd !important;
        }
        
        .btn-check:checked + .btn {
          background-color: #f8f9fa !important;
          border-color: #526cfd !important;
          color: #282c3f !important;
        }
        
        .form-check-input:checked {
          background-color: #526cfd;
          border-color: #526cfd;
        }
        
        @media (max-width: 767.98px) {
          .modal-dialog {
            margin: 10px;
            max-width: calc(100% - 20px);
          }
          
          .modal-body {
            padding: 20px !important;
          }
          
          .modal-footer {
            padding: 0 20px 20px 20px !important;
          }
        }
      `}</style>
    </>
  );
}
