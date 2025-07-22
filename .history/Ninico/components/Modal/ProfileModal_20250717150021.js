'use client';
import Link from 'next/link';
import React from 'react';

export default function ProfileModal({ show, onClose, user, logout, onLoginClick }) {
  if (!show) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          
          {/* Header Section */}
          <div className="profile-header">
            {user ? (
              <div className="user-info">
                <div className="user-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="user-details">
                  <h4>Hello {user.name || 'User'}</h4>
                  <p className="phone-number">{user.phone}</p>
                </div>
              </div>
            ) : (
              <div className="guest-info">
                <div className="user-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="user-details">
                  <h4>Welcome</h4>
                  <p>To access account and manage orders</p>
                  <button className="btn btn-primary login-btn" onClick={onLoginClick}>
                    LOGIN / SIGNUP
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="profile-menu">
            <div className="menu-section">
              <div className="menu-item">
                <Link href="/orders" className="menu-link" onClick={onClose}>
                  <i className="fas fa-box"></i>
                  <span>Orders</span>
                </Link>
              </div>
              
              <div className="menu-item">
                <Link href="/wishlist" className="menu-link" onClick={onClose}>
                  <i className="fas fa-heart"></i>
                  <span>Wishlist</span>
                </Link>
              </div>
              
              <div className="menu-item">
                <Link href="#" className="menu-link" onClick={onClose}>
                  <i className="fas fa-gift"></i>
                  <span>Gift Cards</span>
                </Link>
              </div>
              
              <div className="menu-item">
                <Link href="/contact" className="menu-link" onClick={onClose}>
                  <i className="fas fa-headset"></i>
                  <span>Contact Us</span>
                </Link>
              </div>
              
              <div className="menu-item">
                <Link href="#" className="menu-link" onClick={onClose}>
                  <i className="fas fa-star"></i>
                  <span>Myntra Insider</span>
                  <span className="badge badge-new">New</span>
                </Link>
              </div>
            </div>

            <hr className="menu-divider" />

            <div className="menu-section">
              <div className="menu-item">
                <Link href="#" className="menu-link" onClick={onClose}>
                  <i className="fas fa-credit-card"></i>
                  <span>Myntra Credit</span>
                </Link>
              </div>
              
              <div className="menu-item">
                <Link href="#" className="menu-link" onClick={onClose}>
                  <i className="fas fa-tags"></i>
                  <span>Coupons</span>
                </Link>
              </div>
              
              <div className="menu-item">
                <Link href="#" className="menu-link" onClick={onClose}>
                  <i className="fas fa-bookmark"></i>
                  <span>Saved Cards</span>
                </Link>
              </div>
              
              <div className="menu-item">
                <Link href="#" className="menu-link" onClick={onClose}>
                  <i className="fas fa-shield-alt"></i>
                  <span>Saved VPA</span>
                </Link>
              </div>
              
              <div className="menu-item">
                <Link href="#" className="menu-link" onClick={onClose}>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Saved Addresses</span>
                </Link>
              </div>
            </div>

            {user && (
              <>
                <hr className="menu-divider" />
                <div className="menu-section">
                  <div className="menu-item">
                    <Link href="#" className="menu-link" onClick={onClose}>
                      <i className="fas fa-user-edit"></i>
                      <span>Edit Profile</span>
                    </Link>
                  </div>
                  
                  <div className="menu-item">
                    <button className="menu-link logout-btn" onClick={() => { logout(); onClose(); }}>
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Logout</span>
                    </button>
                  </div>
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
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          z-index: 9999;
          padding-top: 60px;
          padding-right: 20px;
        }

        .modal-content.profile-modal {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          width: 280px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .modal-close {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #666;
          z-index: 10;
        }

        .modal-close:hover {
          color: #000;
        }

        .profile-header {
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .user-info,
        .guest-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          font-size: 40px;
          color: #666;
        }

        .user-details h4 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .phone-number {
          margin: 0;
          font-size: 14px;
          color: #666;
        }

        .guest-info .user-details p {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #666;
        }

        .login-btn {
          background: #ff3e6c;
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-transform: uppercase;
        }

        .login-btn:hover {
          background: #e91e63;
        }

        .profile-menu {
          padding: 0;
        }

        .menu-section {
          padding: 8px 0;
        }

        .menu-item {
          margin: 0;
        }

        .menu-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          text-decoration: none;
          color: #333;
          font-size: 14px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          position: relative;
        }

        .menu-link:hover {
          background: #f8f8f8;
          color: #333;
          text-decoration: none;
        }

        .menu-link i {
          width: 20px;
          color: #666;
          font-size: 16px;
        }

        .menu-link span {
          flex: 1;
        }

        .badge-new {
          background: #ff3e6c;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .menu-divider {
          margin: 8px 0;
          border: none;
          border-top: 1px solid #f0f0f0;
        }

        .logout-btn {
          color: #666;
        }

        .logout-btn:hover {
          color: #ff3e6c;
          background: #f8f8f8;
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding-top: 80px;
            padding-right: 10px;
          }

          .modal-content.profile-modal {
            width: 260px;
          }
        }
      `}</style>
    </>
  );
}
