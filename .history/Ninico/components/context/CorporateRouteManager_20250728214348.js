'use client'
import { useEffect, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AuthContext from '@/components/context/AuthContext'

const CorporateRouteManager = ({ children }) => {
    const { user } = useContext(AuthContext)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (user && (user.accountType === 'corporate' || user.userType === 'Corporate')) {
            console.log('🔄 [CorporateRouteManager] Corporate user detected, checking redirects for:', pathname)
            
            // Define redirect mapping for corporate users
            const redirectMap = {
                '/shop': '/corporate-shop',
                '/shop/': '/corporate-shop/',
                '/corporate/shop': '/corporate-shop',
                '/corporate/shop/': '/corporate-shop/',
            }

            // Handle shop-details redirects (main product pages)
            if (pathname.startsWith('/shop-details/')) {
                const productId = pathname.replace('/shop-details/', '')
                console.log(`🔄 [CorporateRouteManager] Redirecting shop-details to corporate-shop: ${productId}`)
                router.replace(`/corporate-shop/${productId}`)
                return
            }

            // Handle corporate/shop-details redirects (consolidate to corporate-shop)
            if (pathname.startsWith('/corporate/shop-details/')) {
                const productId = pathname.replace('/corporate/shop-details/', '')
                console.log(`🔄 [CorporateRouteManager] Redirecting corporate/shop-details to corporate-shop: ${productId}`)
                router.replace(`/corporate-shop/${productId}`)
                return
            }

            // Handle other shop redirects
            if (redirectMap[pathname]) {
                console.log(`🔄 [CorporateRouteManager] Redirecting ${pathname} to ${redirectMap[pathname]}`)
                router.replace(redirectMap[pathname])
                return
            }
        }
    }, [user, pathname, router])

    return children
}

export default CorporateRouteManager
