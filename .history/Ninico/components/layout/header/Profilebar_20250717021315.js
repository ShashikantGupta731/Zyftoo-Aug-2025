'use client';
import Link from 'next/link';
import React, { useContext } from 'react';
import AuthContext from '@/components/context/AuthContext'; // <-- make sure this is correct path

export default function Profilebar({ onLoginClick }) {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) return null; // or loading skeleton

  return (
    <div
      className="profilebar-dropdown"
      onMouseEnter={(e) => e.stopPropagation()}
      onMouseLeave={(e) => e.stopPropagation()}
    >
      {user ? (
        <div className="profilebar-welcome">
          <p><strong>Hello {user.name}</strong></p>
          <p>{user.phone}</p>
        </div>
      ) : (
        <div className="profilebar-welcome">
          <p><strong>Welcome</strong></p>
          <p>To access account and manage orders</p>
          <button className="profilebar-login-btn" onClick={onLoginClick}>
            LOGIN / SIGNUP
          </button>
        </div>
      )}

      <hr />
      <ul className="profilebar-list">
        <li><Link href="/orders">Orders</Link></li>
        <li><Link href="/wishlist">Wishlist</Link></li>
        <li><Link href="#">Contact Us</Link></li>
        <li><Link href="#">Saved Addresses</Link></li>
        {user && (
          <>
            <li><Link href="#">Edit Profile</Link></li>
            <li><button onClick={logout} className="profilebar-login-btn">Logout</button></li>
          </>
        )}
      </ul>

      <style jsx>{`
        .profilebar-dropdown {
          position: absolute;
          top: 45px;
          right: 0;
          width: 260px;
          background: white;
          border: 1px solid #ddd;
          padding: 15px;
          z-index: 9999;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          font-size: 14px;
        }

        .profilebar-welcome p {
          margin: 4px 0;
        }

        .profilebar-login-btn {
          margin-top: 10px;
          padding: 5px 15px;
          font-weight: bold;
          background-color: white;
          border: 1px solid #fa5a5a;
          color: #fa5a5a;
          cursor: pointer;
          width: 100%;
        }

        .profilebar-list {
          list-style: none;
          padding: 0;
          margin-top: 10px;
        }

        .profilebar-list li {
          margin: 8px 0;
        }

        .profilebar-list a {
          color: #333;
          text-decoration: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .new-badge {
          font-size: 10px;
          background-color: #fa5a5a;
          color: white;
          padding: 1px 5px;
          border-radius: 3px;
        }
     
      `}</style>
    </div>
  );
}
