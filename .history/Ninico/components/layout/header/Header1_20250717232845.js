'use client'
import CartShow from "@/components/elements/CartShow"
import WishListShow from "@/components/elements/WishListShow"
import Link from "next/link"
import { useState, useRef, useEffect, useContext } from "react"
import HeaderMobSticky from "../HeaderMobSticky"
import HeaderSticky from "../HeaderSticky"
import HeaderTabSticky from "../HeaderTabSticky"
import LoginPopup from "@/components/Modal/LoginModal"
import Profilebar from "@/components/layout/Profilebar"
import AuthContext from '@/components/context/AuthContext'


export default function Header1({ scroll, isMobileMenu, handleMobileMenu, isCartSidebar, handleCartSidebar }) {
    const [isToggled, setToggled] = useState(true)
    const [showProfilebar, setShowProfilebar] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const wrapperRef = useRef(null)
    const profilebarTimer = useRef(null)
    const { user, logout } = useContext(AuthContext)
    
    const handleToggle = () => setToggled(!isToggled)
    return (
        <>
            <header style={{ backgroundColor: '#000000' }}>
                <div className="logo-area d-none d-xl-block">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-2 col-lg-3">
                                <div className="logo">
                                    <Link href="/"><img src="/assets/img/logo/logo.png" alt="logo" /></Link>
                                </div>
                            </div>
                            <div className="col-xl-10 col-lg-9">
                                <div className="header-meta-info d-flex align-items-center justify-content-between">
                                    <div className="header-search-bar">
                                        <form action="#">
                                            <div className="search-info p-relative">
                                                <button className="header-search-icon"><i className="fal fa-search" /></button>
                                                <input type="text" placeholder="Search products..." />
                                            </div>
                                        </form>
                                    </div>
                                    <div className="header-meta header-brand d-flex align-items-center">
                                        

                                        <div className="header-meta__social d-flex align-items-center ml-25">
                                            <button className="header-cart p-relative tp-cart-toggle" onClick={handleCartSidebar}>
                                                <i className="fal fa-shopping-cart" />
                                                <CartShow />
                                            </button>
                                            <div className="d-inline-block mx-2" />
                                            <div 
                                                className="header-user-icon-wrapper"
                                                style={{ position: 'relative', display: 'inline-block' }}
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
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                                >
                                                    <i className="fal fa-user" />
                                                </button>
                                            </div>
                                            <div className="d-inline-block mx-2" />
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
                                                />
                                            </div>
                                            <Link href="/wishlist" className="header-cart p-relative tp-cart-toggle">
                                                <i className="fal fa-heart" />
                                                <WishListShow />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </header>
            <HeaderSticky scroll={scroll} isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
            <HeaderTabSticky scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
            <HeaderMobSticky scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
            
            {showLogin && (
                <LoginPopup
                    show={showLogin}
                    onClose={() => setShowLogin(false)}
                />
            )}
            
            <style jsx>{`
                header {
                    background-color: #000000 !important;
                    padding: 10px 0 !important;
                    min-height: 60px !important;
                }
                
                .logo-area {
                    background-color: #000000 !important;
                    padding: 1px 0 !important;
                    min-height: 60px !important;
                    margin-top: 1px !important;
                }
                
                .header-meta-info {
                    min-height: 50px !important;
                    padding: 5px 0 !important;
                }
                
                .header-search-bar input {
                    background-color: #fff !important;
                    color: #000 !important;
                    height: 20px !important;
                    padding: 8px 12px !important;
                }
                
                .header-search-bar .search-info {
                    height: 30px !important;
                }
                
                .header-search-bar {
                    height: 36px !important;
                }
                
                .logo img {
                    max-height: 80px !important;
                }
                
                .main-menu-area {
                    background-color: #000000 !important;
                }
                
                .header-search-bar input::placeholder {
                    color: #666 !important;
                }
                
                .header-meta__social i,
                .zy-header-login-icon i,
                .header-cart i {
                    color: #fff !important;
                }
                
                .tp-cat-toggle {
                    color: #fff !important;
                }
                
                .main-menu ul li a {
                    color: #fff !important;
                }
                
                .main-menu ul li a:hover {
                    color: #0989ff !important;
                }
                
                .cat-menu__list li a {
                    color: #333 !important;
                }
                
                .daily-offer ul li a {
                    color: #333 !important;
                }
            `}</style>
        </>
    )
}
