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
            
            <style jsx>{`
                #header-mob-sticky {
                    background-color: #000000 !important;
                }
                .tp-menu-toggle i {
                    color: #fff !important;
                }
                .header-meta__social i,
                .zy-header-login-icon i,
                .header-cart i {
                    color: #fff !important;
                }
            `}</style>
        </>
    )
}
