"use client";
import React, { useState, useRef, useEffect } from 'react';
import CartShow from "@/components/elements/CartShow"
import Link from "next/link"
import HeaderMobSticky from "../HeaderMobSticky"
import HeaderTabSticky from "../HeaderTabSticky"
import HeaderSticky from "../HeaderSticky"
import HeaderSticky4 from "../HeaderSticky4"
import LoginPopup from "@/components/Modal/LoginModal";
import Profilebar from "@/components/layout/Profilebar";
import { useContext } from 'react';
import AuthContext from '@/components/context/AuthContext'



export default function Header4({ scroll, isMobileMenu, handleMobileMenu, isCartSidebar, handleCartSidebar, showSticky = true }) { 
  const [showProfilebar, setShowProfilebar] = useState(false); // for hover sidebar
  const [showLogin, setShowLogin] = useState(false);
  const [scrollY, setScrollY] = useState(0);             // to track position
  const [showStickyHeader, setShowStickyHeader] = useState(false);  //
  const wrapperRef = useRef(null);
  const profilebarTimer = useRef(null);
  const { user, logout } = useContext(AuthContext);
 
  // to auto-close profilebar on scroll


useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScroll = window.scrollY;
    const quarterScreen = window.innerHeight / 4;

    setShowProfilebar(false); // Auto-close profilebar

    if (currentScroll > lastScrollY) {
      // Scrolling down
      if (currentScroll > quarterScreen) {
        setShowStickyHeader(true); // ✅ Show if beyond 25% screen height
      }
    } else {
      // Scrolling up - hide instantly
      setShowStickyHeader(false);
    }

    lastScrollY = currentScroll;
  };

  window.addEventListener("scroll", handleScroll);
  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);





  
  return (
        <>
            <header className="platinam-light">
                <div className="zy-header-navbar-wrapper d-none d-xl-block">
                    <div className="zy-header-container">
                      <div className="zy-header-row">
                        
                        {/* Logo */}
                        <div className="zy-header-col-2">
                          <div className="zy-header-logo-wrapper text-center">
                            <div className="zy-header-logo">
                              <Link href="/">
                                <img src="/assets/img/logo/logo.png" alt="logo" />
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Search */}
                        <div className="zy-header-col-5">
                          <div className="zy-navbar-search-wrapper d-flex align-items-center">
                            <div className="zy-navbar-search-box">
                              <form action="#">
                                <div className="zy-navbar-search-input-wrapper position-relative">
                                  <button className="zy-navbar-search-icon"><i className="fal fa-search" /></button>
                                  <input type="text" placeholder="Search products..." className="zy-navbar-search-input" />
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>

                        {/* Icons */}
                        <div className="zy-header-col-5">
                          <div className="zy-header-action-wrapper d-flex align-items-center justify-content-end">
                            <div className="zy-header-icons d-flex align-items-center">
                              <button className="zy-header-cart-btn" onClick={handleCartSidebar}>
                    <i className="fal fa-shopping-cart" />
                    <CartShow />
                  </button>

                  <div ref={wrapperRef} style={{ position: 'relative' }}>
                    <div
                      className="profilebar-wrapper"
                      onMouseEnter={() => {
                        clearTimeout(profilebarTimer.current);
                        setShowProfilebar(true);
                      }}
                      onMouseLeave={() => {
                        profilebarTimer.current = setTimeout(() => {
                          setShowProfilebar(false);
                        }, 300);
                      }}
                    >
                      <button
                        className="zy-header-login-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowProfilebar(!showProfilebar);
                        }}
                      >
                        <i className="fal fa-user" />
                      </button>
                    </div>

                    <div
                      onMouseEnter={() => {
                        clearTimeout(profilebarTimer.current);
                        setShowProfilebar(true);
                      }}
                      onMouseLeave={() => {
                        profilebarTimer.current = setTimeout(() => {
                          setShowProfilebar(false);
                        }, 300);
                      }}
                    >
                      <Profilebar
                        show={showProfilebar}
                        onClose={() => setShowProfilebar(false)}
                        onLoginClick={() => {
                          setShowProfilebar(false);
                          setShowLogin(true);
                        }}
                        onEditProfileClick={() => {
                          setShowProfilebar(false);
                          setShowUserProfile(true);
                        }}
                      />
                    </div>

                    {showLogin && (
                      <LoginPopup
                        show={showLogin}
                        onClose={() => setShowLogin(false)}
                      />
                    )}
                    
                    {showUserProfile && (
                      <UserProfile
                        show={showUserProfile}
                        onClose={() => setShowUserProfile(false)}
                      />
                    )}
                  </div>

                  <Link href="/wishlist"><i className="fal fa-heart" /></Link>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>

                
            </header>
             {/* Conditionally render sticky headers */}
            {showSticky && (
                <>
                    <HeaderSticky4 scroll={scroll} isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
                    <HeaderTabSticky scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
                    <HeaderMobSticky scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
                </>
            )}
        </>
    )
}
