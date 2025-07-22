'use client'
import Link from 'next/link'

export default function MobileMenu() {
    return (
        <>
            <div className="mobile-menu mean-container">
                <div className="mean-bar">
                    <nav className="mean-nav">
                        <ul>
                            <li><Link href="/profile/edit-profile">Edit Profile</Link></li>
                            <li><Link href="/orders">Orders</Link></li>
                            <li><Link href="/wishlist">Wishlist</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
                            <li><Link href="/profile/Addresses">Saved Addresses</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}
}
