'use client'
import Link from "next/link"
import { useState } from "react"
import MobileMenu from "./MobileMenu"
import MobileCategories from "./MobileCategories"

export default function Sidebar({ isMobileMenu, handleMobileMenu }) {
    const [activeTab, setActiveTab] = useState('menu') // 'menu' or 'categories'

    return (
        <>
            <div className={`tpsideinfo ${isMobileMenu ? "tp-sidebar-opened" : ""}`}>
                <button className="tpsideinfo__close" onClick={handleMobileMenu}>Close<i className="fal fa-times ml-10" /></button>
                <div className="tpsideinfo__search text-center pt-35">
                    <span className="tpsideinfo__search-title mb-20">What Are You Looking For?</span>
                    <form action="#">
                        <input type="text" placeholder="Search Products..." />
                        <button><i className="fal fa-search" /></button>
                    </form>
                </div>
                <div className="tpsideinfo__nabtab">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button 
                                className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('menu')}
                                type="button" 
                                role="tab"
                            >
                                Menu
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button 
                                className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`} 
                                onClick={() => setActiveTab('categories')}
                                type="button" 
                                role="tab"
                            >
                                Categories
                            </button>
                        </li>
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                        <div className={`tab-pane fade ${activeTab === 'menu' ? 'show active' : ''}`} role="tabpanel">
                            <MobileMenu />
                        </div>
                        <div className={`tab-pane fade ${activeTab === 'categories' ? 'show active' : ''}`} role="tabpanel">
                            <MobileCategories />
                        </div>
                    </div>
                </div>
                <div className="tpsideinfo__account-link">
                    <Link href="/sign-in"><i className="fal fa-user" /> Login / Register</Link>
                </div>
                <div className="tpsideinfo__wishlist-link">
                    <Link href="/wishlist" target="_parent"><i className="fal fa-heart" /> Wishlist</Link>
                </div>
            </div>
            <div className={`body-overlay ${isMobileMenu ? "opened" : ""}`} onClick={handleMobileMenu} />
        </>
    )
}
