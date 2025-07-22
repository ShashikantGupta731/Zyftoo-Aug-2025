'use client';
import Link from 'next/link';
import React from 'react';

export default function ProfileModal({ show, onClose, user, logout, onLoginClick }) {
  if (!show) return null;

  return (
    <>
      <div 
        className="modal-overlay" 
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseLeave={(e) => e.stopPropagation()}
      >
        <div 
          className="modal-content profile-modal" 
          onMouseEnter={(e) => e.stopPropagation()}
          onMouseLeave={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>×</button>
          
          {/* Header Section */}
          {user ? (
            <div className="user-section">
              <h4 className="user-greeting">Hello {user.name || 'Shashikant'}</h4>
              <p className="user-phone">{user.phone || '7317314242'}</p>
            </div>
          ) : (
            <div className="guest-section">
              <div className="welcome-content">
                <div className="user-icon">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="welcome-text">
                  <h4>Welcome</h4>
                  <p>To access account and manage orders</p>
                </div>
              </div>
              <button className="login-signup-btn" onClick={onLoginClick}>
                LOGIN / SIGNUP
              </button>
            </div>
          )}

          {/* Menu Items */}
          <div className="menu-list">
            <div className="menu-item">
              <Link href="/orders" onClick={onClose}>Orders</Link>
            </div>
            
            <div className="menu-item">
              <Link href="/wishlist" onClick={onClose}>Wishlist</Link>
            </div>
            
            <div className="menu-item">
              <Link href="/contact" onClick={onClose}>Contact Us</Link>
            </div>
            
            <div className="menu-item">
              <Link href="#" onClick={onClose}>Saved Addresses</Link>
            </div>

            {user && (
              <>
                <div className="menu-item">
                  <Link href="#" onClick={onClose}>Edit Profile</Link>
                </div>
                
                <div className="menu-item">
                  <button className="logout-btn" onClick={() => { logout(); onClose(); }}>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: transparent;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          z-index: 9999;
          padding-top: 60px;
          padding-right: 20px;
          pointer-events: none;
        }

        .modal-content.profile-modal {
          background: white;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 200px;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          border: 1px solid #e0e0e0;
          pointer-events: all;
        }

        .modal-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: #999;
          z-index: 10;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          color: #333;
        }

        .user-section {
          padding: 15px;
          border-bottom: 1px solid #f0f0f0;
        }

        .user-greeting {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #282c3f;
        }

        .user-phone {
          margin: 0;
          font-size: 12px;
          color: #94969f;
        }

        .guest-section {
          padding: 15px;
          border-bottom: 1px solid #f0f0f0;
        }

        .welcome-content {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
        }

        .user-icon {
          font-size: 24px;
          color: #94969f;
          margin-top: 2px;
        }

        .welcome-text h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #282c3f;
        }

        .welcome-text p {
          margin: 0;
          font-size: 12px;
          color: #94969f;
          line-height: 1.3;
        }

        .login-signup-btn {
          background: #ff3f6c;
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 2px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          width: 100%;
        }

        .login-signup-btn:hover {
          background: #e8295c;
        }

        .menu-list {
          padding: 10px 0;
        }

        .menu-item {
          margin: 0;
          padding: 0;
        }

        .menu-item a,
        .logout-btn {
          display: block;
          padding: 10px 15px;
          text-decoration: none;
          color: #696e79;
          font-size: 14px;
          font-weight: 400;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          line-height: 1.4;
        }

        .menu-item a:hover,
        .logout-btn:hover {
          background: #f8f8f8;
          color: #282c3f;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding-top: 70px;
            padding-right: 10px;
          }

          .modal-content.profile-modal {
            width: 180px;
          }
        }
      `}</style>
    </>
  );
}
