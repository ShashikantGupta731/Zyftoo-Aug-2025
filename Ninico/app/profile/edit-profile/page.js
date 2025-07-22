'use client';
import React, { useContext, useState } from 'react';
import AuthContext from '@/components/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header1 from '@/components/layout/header/Header1';

export default function EditProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [formData, setFormData] = useState({
    mobile: '7317314242',
    fullName: 'Shashikant Gupta',
    email: 'shashikantgupta001@gmail.com',
    gender: 'male',
    birthday: '',
    alternateMobile: '',
    hintName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender: gender
    }));
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile data:', formData);
  };

  return (
    <>
      <Header1 />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            {/* Back Button */}
            <div className="mb-4">
              <Link href="/profile/ProfilePage" className="btn btn-outline-secondary btn-sm">
                <i className="fas fa-arrow-left me-2"></i>Back to Profile
              </Link>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-3 shadow-sm border">
              {/* Header */}
              <div className="px-4 py-3 border-bottom">
                <h5 className="mb-0 fw-bold" style={{ fontSize: '18px', color: '#282c3f' }}>
                  Edit Details
                </h5>
              </div>

              {/* Form Content */}
              <div className="px-4 py-4">
                {/* Mobile Number */}
                <div className="mb-4">
                  <label className="form-label text-muted mb-1" style={{ fontSize: '12px' }}>
                    Mobile Number*
                  </label>
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center">
                        <input
                          type="text"
                          className="form-control border-0 bg-transparent p-0"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleInputChange}
                          style={{ 
                            fontSize: '14px', 
                            color: '#282c3f',
                            fontWeight: '500'
                          }}
                          readOnly
                        />
                        <i className="fas fa-check-circle text-success ms-2" style={{ fontSize: '16px' }}></i>
                      </div>
                    </div>
                    <div className="col-md-6 text-end">
                      <button 
                        className="btn btn-outline-secondary btn-sm px-4"
                        style={{ 
                          fontSize: '12px',
                          fontWeight: '600',
                          letterSpacing: '0.5px',
                          borderColor: '#d4d5d9',
                          color: '#696b79'
                        }}
                      >
                        CHANGE
                      </button>
                    </div>
                  </div>
                  <hr className="mt-3 mb-0" style={{ borderColor: '#f5f5f6' }} />
                </div>

                {/* Full Name */}
                <div className="mb-4">
                  <label className="form-label text-muted mb-2" style={{ fontSize: '12px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent p-0"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    style={{ 
                      fontSize: '14px', 
                      color: '#282c3f',
                      fontWeight: '400'
                    }}
                  />
                  <hr className="mt-3 mb-0" style={{ borderColor: '#f5f5f6' }} />
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="form-label text-muted mb-2" style={{ fontSize: '12px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control border-0 bg-transparent p-0"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ 
                      fontSize: '14px', 
                      color: '#282c3f',
                      fontWeight: '400'
                    }}
                  />
                  <hr className="mt-3 mb-0" style={{ borderColor: '#f5f5f6' }} />
                </div>

                {/* Gender Selection */}
                <div className="mb-4">
                  <div className="row g-0">
                    <div className="col-md-6">
                      <button
                        className={`btn w-100 text-start p-3 border-end ${formData.gender === 'male' ? 'bg-light border-success' : 'bg-white'}`}
                        style={{ 
                          borderColor: formData.gender === 'male' ? '#28a745' : '#f5f5f6',
                          borderRadius: '0',
                          position: 'relative'
                        }}
                        onClick={() => handleGenderChange('male')}
                      >
                        {formData.gender === 'male' && (
                          <i className="fas fa-check text-success position-absolute" 
                             style={{ top: '12px', right: '15px', fontSize: '14px' }}></i>
                        )}
                        <span style={{ fontSize: '14px', color: '#282c3f', fontWeight: '400' }}>
                          Male
                        </span>
                      </button>
                    </div>
                    <div className="col-md-6">
                      <button
                        className={`btn w-100 text-start p-3 ${formData.gender === 'female' ? 'bg-light border-success' : 'bg-white'}`}
                        style={{ 
                          borderColor: formData.gender === 'female' ? '#28a745' : '#f5f5f6',
                          borderRadius: '0'
                        }}
                        onClick={() => handleGenderChange('female')}
                      >
                        {formData.gender === 'female' && (
                          <i className="fas fa-check text-success position-absolute" 
                             style={{ top: '12px', right: '15px', fontSize: '14px' }}></i>
                        )}
                        <span style={{ fontSize: '14px', color: '#282c3f', fontWeight: '400' }}>
                          Female
                        </span>
                      </button>
                    </div>
                  </div>
                  <hr className="mt-3 mb-0" style={{ borderColor: '#f5f5f6' }} />
                </div>

                {/* Birthday */}
                <div className="mb-4">
                  <label className="form-label text-muted mb-2" style={{ fontSize: '12px' }}>
                    Birthday (dd/mm/yyyy)
                  </label>
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent p-0"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    placeholder=""
                    style={{ 
                      fontSize: '14px', 
                      color: '#282c3f',
                      fontWeight: '400'
                    }}
                  />
                  <hr className="mt-3 mb-0" style={{ borderColor: '#f5f5f6' }} />
                </div>

                {/* Alternate Mobile Details */}
                <div className="mb-4">
                  <h6 className="mb-3 fw-semibold" style={{ fontSize: '14px', color: '#282c3f' }}>
                    Alternate mobile details
                  </h6>
                  
                  <div className="mb-3">
                    <div className="input-group border-0">
                      <span 
                        className="input-group-text bg-transparent border-0 px-0"
                        style={{ fontSize: '14px', color: '#696b79' }}
                      >
                        +91
                      </span>
                      <span 
                        className="input-group-text bg-transparent border-0 px-2"
                        style={{ fontSize: '14px', color: '#d4d5d9' }}
                      >
                        |
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 bg-transparent"
                        name="alternateMobile"
                        value={formData.alternateMobile}
                        onChange={handleInputChange}
                        placeholder="Mobile Number"
                        style={{ 
                          fontSize: '14px', 
                          color: '#282c3f',
                          fontWeight: '400'
                        }}
                      />
                    </div>
                    <hr className="mt-2 mb-0" style={{ borderColor: '#f5f5f6' }} />
                  </div>

                  <div className="mb-0">
                    <input
                      type="text"
                      className="form-control border-0 bg-transparent p-0"
                      name="hintName"
                      value={formData.hintName}
                      onChange={handleInputChange}
                      placeholder="Hint name"
                      style={{ 
                        fontSize: '14px', 
                        color: '#282c3f',
                        fontWeight: '400'
                      }}
                    />
                    <hr className="mt-3 mb-0" style={{ borderColor: '#f5f5f6' }} />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-3">
                  <button 
                    className="btn w-100 text-white fw-semibold text-uppercase"
                    style={{ 
                      backgroundColor: '#ff3f6c',
                      borderColor: '#ff3f6c',
                      fontSize: '14px',
                      padding: '15px',
                      borderRadius: '4px',
                      letterSpacing: '1px'
                    }}
                    onClick={handleSave}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#e8295c'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#ff3f6c'}
                  >
                    SAVE DETAILS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .form-control:focus {
          box-shadow: none;
          border-color: transparent;
        }
        
        .btn:focus {
          box-shadow: none;
        }
        
        .input-group-text {
          border: none;
        }
        
        @media (max-width: 767.98px) {
          .container {
            padding-left: 15px;
            padding-right: 15px;
          }
          
          .px-4 {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          
          .row.g-0 .col-md-6:first-child button {
            border-bottom: 1px solid #f5f5f6;
          }
          
          .row.g-0 .col-md-6 button {
            border-right: none !important;
          }
        }
        
        @media (min-width: 768px) {
          .row.g-0 .col-md-6:first-child button {
            border-right: 1px solid #f5f5f6;
          }
        }
      `}</style>
    </>
  );
}
