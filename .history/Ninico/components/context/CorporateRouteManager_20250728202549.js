'use client'
import { useEffect, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AuthContext from '@/components/context/AuthContext'

const CorporateRouteManager = ({ children }) => {
    const { user } = useContext(AuthContext)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (user && user.accountType === 'corporate') {
            // Define redirect mapping for corporate users
            const redirectMap = {
                '/shop': '/corporate-shop',
                '/shop/': '/corporate-shop/',
            }

            // Handle shop-details redirects
            if (pathname.startsWith('/shop-details/')) {
                const productId = pathname.replace('/shop-details/', '')
                router.push(`/corporate-shop/${productId}`)
                return
            }

            // Handle other shop redirects
            if (redirectMap[pathname]) {
                router.push(redirectMap[pathname])
                return
            }
        }
    }, [user, pathname, router])

    return children
}

export default CorporateRouteManager
