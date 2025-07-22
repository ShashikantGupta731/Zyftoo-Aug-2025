'use client'
import Link from 'next/link'
import { useState } from 'react'
import { giftPageCategories } from "@/data/giftPageCategories"

export default function MobileCategories() {
    const [isActive, setIsActive] = useState({
        status: false,
        key: "",
    })

    const handleClick = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            })
        } else {
            setIsActive({
                status: true,
                key,
            })
        }
    }

    return (
        <>
            <div className="mobile-menu mean-container">
                <div className="mean-bar">
                    <Link href="#" className="meanmenu-reveal">
                        <span><span><span /></span></span>
                    </Link>
                    <nav className="mean-nav">
                        <ul>
                            {giftPageCategories.map((category, index) => (
                                <li key={category.id} className="has-dropdown">
                                    <Link href="/shop">{category.name}</Link>
                                    <ul className="submenu" style={{ display: `${isActive.key == category.id ? "block" : "none"}` }}>
                                        {category.subcategories.map((sub, subIndex) => (
                                            <li key={subIndex}>
                                                <Link href="/shop">{sub.name}</Link>
                                                {sub.children && (
                                                    <ul className="submenu">
                                                        {sub.children.map((child, childIndex) => (
                                                            <li key={childIndex}>
                                                                <Link href="/shop">{child}</Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link 
                                        className="mean-expand" 
                                        onClick={() => handleClick(category.id)} 
                                        href="#" 
                                        style={{ fontSize: 18 }}
                                    >
                                        <i className="fal fa-plus" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}
