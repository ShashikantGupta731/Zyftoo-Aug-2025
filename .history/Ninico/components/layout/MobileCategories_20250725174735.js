'use client'
import Link from 'next/link'
import { useState } from 'react'
import { giftPageCategories } from "@/data/giftPageCategoriesData"
import styles from './MobileCategories.module.css'

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
        <div className={styles.mobileMenuContainer}>
            <div className={`${styles.meanContainer} ${styles.fadeIn}`}>
                <div className={styles.meanBar}>
                    <nav className={styles.meanNav}>
                        <ul className={styles.meanNavList}>
                            {giftPageCategories.map((category, index) => (
                                <li key={category.id} className={styles.meanNavItem}>
                                    <Link href="/shop" className={styles.meanNavLink}>
                                        {category.name}
                                    </Link>
                                    <ul className={`${styles.submenu} ${isActive.key == category.id ? styles.active : ''}`}>
                                        {category.subcategories.map((sub, subIndex) => (
                                            <li key={subIndex} className={styles.submenuItem}>
                                                <Link href="/shop" className={styles.submenuLink}>
                                                    {sub.name}
                                                </Link>
                                                {sub.children && (
                                                    <ul className={styles.subSubmenu}>
                                                        {sub.children.map((child, childIndex) => (
                                                            <li key={childIndex} className={styles.subSubmenuItem}>
                                                                <Link href="/shop" className={styles.subSubmenuLink}>
                                                                    {child}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                    <button 
                                        className={`${styles.meanExpand} ${isActive.key == category.id ? styles.active : ''}`}
                                        onClick={() => handleClick(category.id)} 
                                        aria-expanded={isActive.key == category.id}
                                        aria-label={`Toggle ${category.name} submenu`}
                                    >
                                        <i className={`fal fa-plus ${styles.meanExpandIcon}`} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}
