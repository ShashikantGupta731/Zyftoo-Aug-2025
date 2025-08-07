'use client'
import Link from 'next/link'
import { useContext } from 'react'
import AuthContext from '@/components/context/AuthContext'

/**
 * Smart Product Link Component
 * Automatically redirects to the appropriate product page based on user type
 * - Corporate users: /corporate-shop/[id]
 * - Regular users: /shop-details/[id]
 */
export default function SmartProductLink({ productId, children, className, ...props }) {
    const { user } = useContext(AuthContext)
    
    // Determine the correct URL based on user type
    const href = user && (user.accountType === 'corporate' || user.userType === 'Corporate')
        ? `/corporate-shop/${productId}`
        : `/shop-details/${productId}`

    return (
        <Link href={href} className={className} {...props}>
            {children}
        </Link>
    )
}

/**
 * Smart Shop Link Component
 * Automatically redirects to the appropriate shop page based on user type
 * - Corporate users: /corporate-shop
 * - Regular users: /shop
 */
export function SmartShopLink({ children, className, ...props }) {
    const { user } = useContext(AuthContext)
    
    // Determine the correct URL based on user type
    const href = user && (user.accountType === 'corporate' || user.userType === 'Corporate')
        ? '/corporate-shop'
        : '/shop'

    return (
        <Link href={href} className={className} {...props}>
            {children}
        </Link>
    )
}
