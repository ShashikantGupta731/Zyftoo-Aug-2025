import Link from "next/link"
import CartShow from "../elements/CartShow"
import LoginPopup from "@/components/Modal/LoginModal"
import Profilebar from "@/components/layout/Profilebar"
import { useState } from "react"

export default function HeaderMobSticky({ scroll, isMobileMenu, handleMobileMenu, isCartSidebar, handleCartSidebar }) {
    const [showLogin, setShowLogin] = useState(false)
    const [showProfilebar, setShowProfilebar] = useState(false)
    let profilebarTimer = null
    return (
        <>
            <div id="header-mob-sticky" className={`tp-md-lg-header d-md-none ${scroll ? "header-sticky" : ""}`} style={{ backgroundColor: '#000000' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-3 d-flex align-items-center">
                            <div className="header-canvas flex-auto">
                                <button className="tp-menu-toggle" onClick={handleMobileMenu}><i className="far fa-bars" /></button>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="logo text-center">
                                <Link href="/"><img src="/assets/img/logo/logo.png" alt="logo" /></Link>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="header-meta-info d-flex align-items-center justify-content-end ml-25">
                                <div className="header-meta m-0 d-flex align-items-center">
                                    <div className="header-meta__social d-flex align-items-center">
                                        <button className="header-cart p-relative tp-cart-toggle" onClick={handleCartSidebar}>
                                            <i className="fal fa-shopping-cart" />
                                            <CartShow />
                                        </button>
                                        <div
                                            className="header-user-icon-wrapper"
                                            style={{ position: 'relative', display: 'inline-block' }}
                                            onMouseEnter={() => {
                                                clearTimeout(profilebarTimer)
                                                setShowProfilebar(true)
                                            }}
                                            onMouseLeave={() => {
                                                profilebarTimer = setTimeout(() => {
                                                    setShowProfilebar(false)
                                                }, 300)
                                            }}
                                        >
                                            <button className="zy-header-login-icon" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }} onClick={() => setShowLogin(true)}>
                                                <i className="fal fa-user" />
                                            </button>
                                            {showProfilebar && (
                                                <Profilebar
                                                    show={showProfilebar}
                                                    onClose={() => setShowProfilebar(false)}
                                                    onLoginClick={() => {
                                                        setShowProfilebar(false)
                                                        setShowLogin(true)
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showLogin && (
                <LoginPopup
                    show={showLogin}
                    onClose={() => setShowLogin(false)}
                />
            )}
        </>
    )
}
