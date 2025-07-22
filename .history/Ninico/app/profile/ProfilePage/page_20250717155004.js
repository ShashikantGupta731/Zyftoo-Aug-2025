'use client';
import React, { useContext, useState } from 'react';
import AuthContext from '@/components/context/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            {/* Back Button */}
            <div className="mb-4">
              <Link href="/" className="btn btn-outline-secondary btn-sm">
                <i className="fas fa-arrow-left me-2"></i>Back to Home
              </Link>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-3 shadow-sm p-4">
              {/* Account Header */}
              <div className="mb-4">
                <h4 className="fw-bold mb-1" style={{ fontSize: '20px', color: '#282c3f' }}>Account</h4>
                <small className="text-muted">Shashikant Gupta</small>
              </div>

              {/* Profile Section */}
              <div className="bg-light rounded-3 p-4 mb-4">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <div className="bg-secondary rounded-3 d-flex align-items-center justify-content-center" 
                         style={{ width: '80px', height: '80px' }}>
                      <i className="fas fa-user text-white" style={{ fontSize: '40px' }}></i>
                    </div>
                  </div>
                  <div className="col">
                    <p className="mb-0 fw-medium" style={{ fontSize: '14px', color: '#282c3f' }}>
                      {user?.email || 'shashikantgupta04@gmail.com'}
                    </p>
                  </div>
                  <div className="col-auto">
                    <button className="btn btn-outline-dark btn-sm px-3 py-1" 
                            style={{ fontSize: '12px', fontWeight: '500' }}>
                      EDIT PROFILE
                    </button>
                  </div>
                </div>
              </div>

                    {/* Menu Grid */}
                    <div className="row g-3">
                      {/* Row 1 */}
                      <div className="col-md-4 col-sm-6">
                        <div className="text-center p-3 border-0">
                          <div className="mb-3">
                            <i className="fas fa-box text-muted" style={{ fontSize: '24px' }}></i>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ fontSize: '14px', color: '#282c3f' }}>Orders</h6>
                          <small className="text-muted" style={{ fontSize: '12px' }}>Check your order status</small>
                        </div>
                      </div>

                      <div className="col-md-4 col-sm-6">
                        <div className="text-center p-3 border-0">
                          <div className="mb-3">
                            <i className="fas fa-th-large text-muted" style={{ fontSize: '24px' }}></i>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ fontSize: '14px', color: '#282c3f' }}>Collections & Wishlist</h6>
                          <small className="text-muted" style={{ fontSize: '12px' }}>All your curated product collections</small>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="col-md-4 col-sm-6">
                        <div className="text-center p-3 border-0">
                          <div className="mb-3">
                            <i className="fas fa-bookmark text-muted" style={{ fontSize: '24px' }}></i>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ fontSize: '14px', color: '#282c3f' }}>Saved Cards</h6>
                          <small className="text-muted" style={{ fontSize: '12px' }}>Save your cards for faster checkout</small>
                        </div>
                      </div>

                      <div className="col-md-4 col-sm-6">
                        <div className="text-center p-3 border-0">
                          <div className="mb-3">
                            <i className="fas fa-shield-alt text-muted" style={{ fontSize: '24px' }}></i>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ fontSize: '14px', color: '#282c3f' }}>Saved UPI</h6>
                          <small className="text-muted" style={{ fontSize: '12px' }}>View your saved UPI</small>
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="col-md-4 col-sm-6">
                        <div className="text-center p-3 border-0">
                          <div className="mb-3">
                            <i className="fas fa-file-invoice text-muted" style={{ fontSize: '24px' }}></i>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ fontSize: '14px', color: '#282c3f' }}>Wallet/BNPL</h6>
                          <small className="text-muted" style={{ fontSize: '12px' }}>View buy now pay later & other offers</small>
                        </div>
                      </div>

                      <div className="col-md-4 col-sm-6">
                        <div className="text-center p-3 border-0">
                          <div className="mb-3">
                            <i className="fas fa-map-marker-alt text-muted" style={{ fontSize: '24px' }}></i>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ fontSize: '14px', color: '#282c3f' }}>Addresses</h6>
                          <small className="text-muted" style={{ fontSize: '12px' }}>Save addresses for a hassle-free checkout</small>
                        </div>
                      </div>

                      <div className="col-md-4 col-sm-6">
                        <div className="text-center p-3 border-0">
                          <div className="mb-3">
                            <i className="fas fa-tags text-muted" style={{ fontSize: '24px' }}></i>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ fontSize: '14px', color: '#282c3f' }}>Coupons</h6>
                          <small className="text-muted" style={{ fontSize: '12px' }}>Manage coupons for additional discounts</small>
                        </div>
                      </div>

                      {/* Row 4 - Profile Details */}
                      <div className="col-md-4 col-sm-6 offset-md-4">
                        <div className="text-center p-3 border-0">
                          <div className="mb-3">
                            <i className="fas fa-user-edit text-muted" style={{ fontSize: '24px' }}></i>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ fontSize: '14px', color: '#282c3f' }}>Profile Details</h6>
                          <small className="text-muted" style={{ fontSize: '12px' }}>Change your profile details & password</small>
                        </div>
                      </div>
                    </div>

                    {/* Logout Button */}
                    <div className="row mt-5 mb-3">
                      <div className="col-12 d-flex justify-content-center">
                        <button 
                          className="btn text-white fw-semibold text-uppercase px-4"
                          style={{ 
                            backgroundColor: '#ff3f6c',
                            borderColor: '#ff3f6c',
                            fontSize: '14px',
                            padding: '12px 40px',
                            borderRadius: '4px'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#e8295c'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#ff3f6c'}
                        >
                          LOGOUT
                        </button>
                      </div>
                    </div>
                  </div>
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
        
        @media (max-width: 767.98px) {
          .modal-dialog {
            margin: 10px;
            max-width: calc(100% - 20px);
          }
          
          .row.g-3 > div {
            margin-bottom: 15px;
          }
          
          .text-center.p-3 {
            padding: 15px !important;
          }
        }
        
        @media (min-width: 768px) and (max-width: 991.98px) {
          .modal-dialog {
            max-width: 90%;
          }
        }
        
        @media (min-width: 992px) {
          .modal-dialog {
            max-width: 80%;
          }
        }
        
        .text-center.p-3:hover {
          background-color: #f8f9fa;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
