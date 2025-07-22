
'use client'
import { useEffect, useState } from "react"
import BackToTop from '../elements/BackToTop'
import DataBg from "../elements/DataBg"
import Breadcrumb from './Breadcrumb'
import HeaderCart from "./HeaderCart"
import Sidebar from "./Sidebar"
import Footer1 from './footer/Footer1'
import Footer2 from './footer/Footer2'
import Header1 from "./header/Header1"

export default function Layout({ headerStyle, footerStyle, headTitle, breadcrumbTitle, children }) {
    const [scroll, setScroll] = useState(0)
    // Mobile Menu
    const [isMobileMenu, setMobileMenu] = useState(false)
    const handleMobileMenu = () => setMobileMenu(!isMobileMenu)

    // CartSidebar
    const [isCartSidebar, setCartSidebar] = useState(false)
    const handleCartSidebar = () => setCartSidebar(!isCartSidebar)

    useEffect(() => {
        const WOW = require('wowjs')
        window.wow = new WOW.WOW({
            live: false
        })
        window.wow.init()

        document.addEventListener("scroll", () => {
            const scrollCheck = window.scrollY > 100
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck)
            }
        })
    }, [])
    return (
        <>
            {/* <PageHead headTitle={headTitle} /> */}
            <DataBg />
            <Header1 scroll={scroll} isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
            <Sidebar isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} />
            <HeaderCart isCartSidebar={isCartSidebar} handleCartSidebar={handleCartSidebar} />
            <main>
                {breadcrumbTitle && <Breadcrumb breadcrumbTitle={breadcrumbTitle} />}

                {children}
            </main>

            {!footerStyle && < Footer1 />}
            {footerStyle == 1 ? < Footer1 /> : null}
            {footerStyle == 2 ? < Footer2 /> : null}

            <BackToTop />
        </>
    )
}
