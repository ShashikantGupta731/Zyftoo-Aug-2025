"use client";
import Link from "next/link";
import HomePageMenu from "../sections/SidebarMenu/HomePageMenu";
import GiftPageMenu from "../sections/SidebarMenu/GiftPageMenu";
import VoucherPageMenu from "../sections/SidebarMenu/VoucherPageMenu";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LoginPopup from "@/components/Modal/LoginModal";

export default function Sidebar({ isMobileMenu, handleMobileMenu }) {
  const [showLogin, setShowLogin] = useState(false);  
   useEffect(() => {
    if (isMobileMenu) {
      document.body.style.overflow = "hidden"; // ✅ Lock scroll
    } else {
      document.body.style.overflow = ""; // ✅ Restore scroll
    }

    return () => {
      document.body.style.overflow = ""; // Cleanup on unmount
    };
  }, [isMobileMenu]);

  const pathname = usePathname();

  let MenuComponent = null;

  if (pathname === "/") {
    MenuComponent = HomePageMenu;
  } else if (pathname.startsWith("/shopgifts")) {
    MenuComponent = GiftPageMenu;
  } else if (pathname.startsWith("/VoucherPage")) {
    MenuComponent = VoucherPageMenu;
  }
  return (
    <>
      <div className={`sidebar-menu ${isMobileMenu ? "tp-sidebar-opened" : ""}`}>
       <div className="sidebar-content-wrapper">
          {/* Header Top Panel */}
          <div className="sidebar-header">
           
            <div className="sidebar-header-left">
              <div className="icon-circle">
                <i className="fal fa-user" />
              </div>
              <span className="user-label">Zyftoo</span>
            </div>
            <div className="sidebar-header-right" >
              <button className="side-login-btn" onClick={() => setShowLogin(true)}>
                <i className="fal fa-sign-in" style={{ marginRight: "6px" }} />
                Login
              </button>
              
            </div>
          </div>
<button className="close-btn" onClick={handleMobileMenu}>
              <i className="fal fa-times" />
            </button>

            {showLogin 
            && (<LoginPopup show={showLogin} onClose={() => setShowLogin(false)} />
          )}
            
            
          </div>

          {/* Gift Menu */}
          {/* Conditionally Render Menu Based on Route */}
{MenuComponent && <MenuComponent handleClose={handleMobileMenu} />}


          {/* Static Links */}
          <div className="sidebar-links">
            <Link href="/account">Account</Link>
            <Link href="/orders">Orders</Link>
            <Link href="/zyftoo-studio">
              Zyftoo Studio <span className="new-tag">NEW</span>
            </Link>
            <Link href="/zyftoo-mall">
              Zyftoo Mall <span className="new-tag">NEW</span>
            </Link>
            <Link href="/zyftoo-insider">Zyftoo Insider</Link>
          </div>
        </div>
      

      <div
        className={`body-overlay ${isMobileMenu ? "opened" : ""}`}
        onClick={handleMobileMenu}
      />

      <style jsx>{`
        .sidebar-menu {
          position: fixed;
          top: 0;
          left: -100%;
          width: 80%;
          max-width: 350px;
          height: 100vh;
          background-color: #ffffff;
          z-index: 1000;
          overflow-y: auto;
          transition: all 0.3s ease;
          box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
        }

        .tp-sidebar-opened {
          left: 0;
        }
        .sidebar-content-wrapper {
          width: 100%;
          margin: 0;
          padding: 0;
        }

        .sidebar-header {
          background-color: #3d3745;
          padding: 16px;
          display: flex;
          height: auto;
          width: 100%;
          position: relative;
          
        }

        .sidebar-header-left {
          display: flex;
          align-items: center;
          height: 50px;
          
          
        }

        .sidebar-header-right {
          display: flex;
          flex-shrink: 0;
          height: 50px;
          margin-top: 60px;
          margin-left: -85px
        }

        .icon-circle {
          background-color: #ffffff;
          color: #3d3745;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 16px;
        }

        .user-label {
          color: #ffffff;
          font-weight: 600;
          font-size: 15px;
          margin-left: 10px;
        }

        .side-login-btn {
          background-color: #fff;
          border: 1px solid #ddd;
          color: #333;
          padding: 8px 14px;
          width: 120px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .side-login-btn i {
          font-size: 16px;
          color: #555;
        }

        .side-login-btn:hover {
          background-color: #f5f5f5;
          border-color: #ccc;
          color: #000;
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 22px;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        }
        .sidebar-links {
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 14px;
        }

        .sidebar-links a {
          color: #1d1d1d;
          text-decoration: none;
        }

        .new-tag {
          background-color: #ff3c6f;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 12px;
          margin-left: 6px;
        }

        .body-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
          display: none;
        }

        .body-overlay.opened {
          display: block;
        }
      `}</style>
    </>
  );
}
