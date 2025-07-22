"use client";
import { useState } from "react";
import Link from "next/link";
import CartShow from "@/components/elements/CartShow";
import WishListShow from "@/components/elements/WishListShow";
import LoginPopup from "@/components/Modal/LoginModal";

export default function HeaderSticky4({ scroll, isCartSidebar, handleCartSidebar }) {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <div className={`zy-header-sticky-wrapper ${scroll ? "zy-header-sticky-active" : ""}`}>
        <div className="zy-header-sticky-container">
          <div className="zy-header-sticky-row">

            {/* Logo */}
            <div className="zy-header-sticky-col-logo">
              <Link href="/">
                <img src="/assets/img/logo/logo.png" alt="logo" className="zy-header-sticky-logo" />
              </Link>
            </div>

            {/* Search Bar */}
            <div className="zy-header-sticky-col-search">
              <form action="#">
                <div className="zy-header-sticky-search-input-wrapper">
                  <button className="zy-header-sticky-search-icon">
                    <i className="fal fa-search" />
                  </button>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="zy-header-sticky-search-input"
                  />
                </div>
              </form>
            </div>

            {/* Icons */}
            <div className="zy-header-sticky-col-icons">
              <div className="zy-header-sticky-icons-wrapper">
                <button className="zy-header-cart-btn" onClick={handleCartSidebar}>
                  <div className="cart-icon-container">
                    <i className="fal fa-shopping-cart" />
                    <span className="cart-notification-badge">2</span>
                  </div>
                </button>


                <button onClick={() => setShowLogin(true)} className="zy-header-sticky-login-btn">
                  <i className="fal fa-user" />
                </button>

                <div className="zy-header-sticky-wishlist-wrapper">
                  <Link href="/wishlist">
                    <i className="fal fa-heart zy-header-sticky-wishlist-icon" />
                  </Link>
                  <WishListShow />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLogin && <LoginPopup show={showLogin} onClose={() => setShowLogin(false)} />}

      <style jsx>{`
        .zy-header-sticky-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          background-color: #000;
          height: 80px;
          transform: translateY(-100%);
          opacity: 0;
          transition: transform 0.9s ease-in-out, opacity 0.2s ease-in-out;
          display: flex;
          align-items: center;
        }

        .zy-header-sticky-active {
          transform: translateY(0);
          opacity: 1;
        }

        .zy-header-sticky-container {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .zy-header-sticky-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .zy-header-sticky-col-logo {
          width: 15%;
        }

        .zy-header-sticky-col-search {
          width: 60%;
        }

        .zy-header-sticky-col-icons {
          width: 25%;
          display: flex;
          justify-content: flex-end;
        }

        .zy-header-sticky-logo {
          max-height: 50px;
          object-fit: contain;
        }

        .zy-header-sticky-search-input-wrapper {
          position: relative;
          width: 100%;
        }

        .zy-header-sticky-search-input {
          height: 35px;
          width: 100%;
          padding: 5px 20px 5px 40px;
          background-color: #f4f4f4;
          border: none;
          border-radius: 8px;
          font-size: 14px;
        }

        .zy-header-sticky-search-icon {
          position: absolute;
          top: 50%;
          left: 12px;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 14px;
          color: #333;
        }

        .zy-header-sticky-icons-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .zy-header-cart-btn {
          background: none;
          border: none;
          position: relative;
          padding: 0;
          color: #fff;
          font-size: 20px;
        }

        .cart-icon-container {
          position: relative;
          display: inline-block;
        }

        .cart-icon-container i {
          font-size: 22px;
          color: #fff;
        }

        .cart-notification-badge {
          position: absolute;
          top: -6px;
          right: -10px;
          background-color: #d51243;
          color: #fff;
          font-size: 10px;
          font-weight: bold;
          border-radius: 50%;
          padding: 2px 6px;
          line-height: 1;
        }

        .zy-header-sticky-login-btn {
          background: none;
          border: none;
          font-size: 20px;
          color: #fff;
          position: relative;
        }

        .zy-header-sticky-wishlist-wrapper {
          position: relative;
        }

        .zy-header-sticky-wishlist-icon {
          font-size: 20px;
          color: #fff;
          transition: color 0.2s ease-in-out;
        }

        .zy-header-sticky-icons-wrapper i:hover {
          color: #d51243;
        }

        @media (max-width: 768px) {
        .zy-header-sticky-col-icons {
          width: 100%;
          justify-content: center;
          margin-bottom: 10px;
        }

        .zy-header-sticky-icons-wrapper {
          display: flex;
          flex-wrap: wrap; /* ✅ allow icons to wrap */
          justify-content: center;
          gap: 12px;        /* ✅ add spacing between icons */
          max-width: 100%;
          overflow: hidden;
        }

        .zy-header-sticky-cart-btn,
        .zy-header-sticky-login-btn,
        .zy-header-sticky-wishlist-wrapper {
          font-size: 20px;
          color: #fff;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
          margin: 0;          /* ✅ remove extra margins */
          min-width: 40px;
        }

        .zy-header-sticky-wishlist-wrapper {
          position: relative;
        }

        .zy-header-sticky-wishlist-icon {
          font-size: 20px;
          color: #fff;
        }
      }

      `}</style>
    </>
  );
}
