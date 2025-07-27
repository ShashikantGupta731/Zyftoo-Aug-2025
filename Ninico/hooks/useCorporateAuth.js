/**
 * Corporate User Hook
 * Custom hook to handle corporate user authentication and checks
 */

'use client'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthContext from '@/components/context/AuthContext'

export const useCorporateAuth = () => {
    const { user, loading } = useContext(AuthContext)
    const router = useRouter()
    const [isCorporateUser, setIsCorporateUser] = useState(false)

    useEffect(() => {
        if (!loading) {
            const isCorpUser = user && user.userType === 'Corporate'
            setIsCorporateUser(isCorpUser)
        }
    }, [user, loading])

    const redirectToCorporateSignIn = () => {
        router.push('/corporate/sign-in')
    }

    const redirectToCorporateDashboard = () => {
        if (isCorporateUser) {
            router.push('/CorporateHome')
        } else {
            redirectToCorporateSignIn()
        }
    }

    const requireCorporateAuth = (callback) => {
        if (loading) return

        if (!user) {
            redirectToCorporateSignIn()
            return
        }

        if (user.userType !== 'Corporate') {
            router.push('/')
            return
        }

        if (callback) callback()
    }

    return {
        isCorporateUser,
        loading,
        user,
        redirectToCorporateSignIn,
        redirectToCorporateDashboard,
        requireCorporateAuth
    }
}

export default useCorporateAuth
