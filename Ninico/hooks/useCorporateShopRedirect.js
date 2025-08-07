import { useContext } from 'react'
import AuthContext from '@/components/context/AuthContext'

export const useCorporateShopRedirect = () => {
    const { user } = useContext(AuthContext)
    
    const getShopUrl = (originalPath = '/shop') => {
        if (user && user.accountType === 'corporate') {
            // Map regular shop URLs to corporate equivalents
            if (originalPath === '/shop') {
                return '/corporate-shop'
            }
            if (originalPath.startsWith('/shop-details/')) {
                const id = originalPath.replace('/shop-details/', '')
                return `/corporate-shop/${id}`
            }
            // Add more mappings as needed
            return originalPath.replace('/shop', '/corporate-shop')
        }
        return originalPath
    }
    
    const isCorporateUser = () => {
        return user && user.accountType === 'corporate'
    }
    
    return {
        getShopUrl,
        isCorporateUser,
        user
    }
}
