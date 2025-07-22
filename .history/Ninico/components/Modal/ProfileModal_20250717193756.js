'use client';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileModal({ show, onClose, user, logout, onLoginClick, onEditProfileClick }) {
  const router = useRouter();
  
  if (!show) return null;

  const handleEditProfileClick = () => {
    onClose();
    router.push('/profile/ProfilePage');
  };
  if (!show) return null;

  return (
    <>
      <div 
        className="position-fixed w-100 h-100 d-flex align-items-start justify-content-end"
        style={{ 
          top: 0, 
          left: 0, 
          zIndex: 9999, 
          paddingTop: '150px', 
          paddingRight: '50px',
          pointerEvents: 'none',
          background: 'transparent'
        }}
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseLeave={(e) => e.stopPropagation()}
      >
        <div 
          className="bg-white border rounded shadow-sm position-relative"
          style={{ 
            width: '200px',
            pointerEvents: 'all',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
          }}
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            className="btn-close position-absolute"
            style={{ top: '8px', right: '8px', fontSize: '12px' }}
            onClick={onClose}
            aria-label="Close"
          ></button>
          
          {/* Header Section */}
          {user ? (
            <div className="p-3 border-bottom">
              <h6 className="mb-1 fw-semibold text-dark" style={{ fontSize: '14px' }}>
                Hello {user.name || 'Shashikant'}
              </h6>
              <small className="text-muted" style={{ fontSize: '12px' }}>
                {user.phone || '7317314242'}
              </small>
            </div>
          ) : (
            <div className="p-3 border-bottom">
              <div className="d-flex align-items-start mb-2">
                <div className="me-2" style={{ fontSize: '24px', color: '#94969f', marginTop: '2px' }}>
                  <i className="fas fa-user-circle"></i>
                </div>
                <div>
                  <h6 className="mb-1 fw-semibold text-dark" style={{ fontSize: '14px' }}>
                    Welcome
                  </h6>
                  <small className="text-muted" style={{ fontSize: '12px', lineHeight: '1.3' }}>
                    To access account and manage orders
                  </small>
                </div>
              </div>
              <button 
                className="btn btn-sm w-100 text-white fw-semibold text-uppercase"
                style={{ 
                  backgroundColor: '#ff3f6c',
                  borderColor: '#ff3f6c',
                  fontSize: '11px',
                  letterSpacing: '0.5px',
                  borderRadius: '2px'
                }}
                onClick={onLoginClick}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e8295c'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ff3f6c'}
              >
                LOGIN / SIGNUP
              </button>
            </div>
          )}

          {/* Menu Items */}
          <div className="py-2">
            <div>
              <Link 
                href="/orders" 
                className="d-block px-3 py-2 text-decoration-none"
                style={{ 
                  color: '#696e79', 
                  fontSize: '14px', 
                  fontWeight: '400',
                  lineHeight: '1.4'
                }}
                onClick={onClose}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f8f8f8';
                  e.target.style.color = '#282c3f';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#696e79';
                }}
              >
                Orders
              </Link>
            </div>
            
            <div>
              <Link 
                href="/wishlist" 
                className="d-block px-3 py-2 text-decoration-none"
                style={{ 
                  color: '#696e79', 
                  fontSize: '14px', 
                  fontWeight: '400',
                  lineHeight: '1.4'
                }}
                onClick={onClose}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f8f8f8';
                  e.target.style.color = '#282c3f';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#696e79';
                }}
              >
                Wishlist
              </Link>
            </div>
            
            <div>
              <Link 
                href="/contact" 
                className="d-block px-3 py-2 text-decoration-none"
                style={{ 
                  color: '#696e79', 
                  fontSize: '14px', 
                  fontWeight: '400',
                  lineHeight: '1.4'
                }}
                onClick={onClose}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f8f8f8';
                  e.target.style.color = '#282c3f';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#696e79';
                }}
              >
                Contact Us
              </Link>
            </div>
            
            <div>
              <Link 
                href="#" 
                className="d-block px-3 py-2 text-decoration-none"
                style={{ 
                  color: '#696e79', 
                  fontSize: '14px', 
                  fontWeight: '400',
                  lineHeight: '1.4'
                }}
                onClick={onClose}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f8f8f8';
                  e.target.style.color = '#282c3f';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#696e79';
                }}
              >
                Saved Addresses
              </Link>
            </div>

            <div>
              <button 
                className="btn d-block w-100 text-start px-3 py-2 border-0"
                style={{ 
                  color: '#696e79', 
                  fontSize: '14px', 
                  fontWeight: '400',
                  lineHeight: '1.4',
                  backgroundColor: 'transparent'
                }}
                onClick={handleEditProfileClick}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f8f8f8';
                  e.target.style.color = '#282c3f';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#696e79';
                }}
              >
                Edit Profile
              </button>
            </div>

            {user && (
              <div>
                <button 
                  className="btn d-block w-100 text-start px-3 py-2 border-0"
                  style={{ 
                    color: '#696e79', 
                    fontSize: '14px', 
                    fontWeight: '400',
                    lineHeight: '1.4',
                    backgroundColor: 'transparent'
                  }}
                  onClick={() => { logout(); onClose(); }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f8f8f8';
                    e.target.style.color = '#282c3f';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#696e79';
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
