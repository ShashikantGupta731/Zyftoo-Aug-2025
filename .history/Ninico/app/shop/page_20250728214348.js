'use client'
import Layout from "@/components/layout/Layout"
import FilterShopBox from "@/components/shop/FilterShopBox"
import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation"
import AuthContext from '@/components/context/AuthContext'

export default function Shop() {
    const [activeIndex, setActiveIndex] = useState(2)
    const { user } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        // Redirect corporate users to corporate-shop
        if (user && (user.accountType === 'corporate' || user.userType === 'Corporate')) {
            console.log('🔄 [Shop] Redirecting corporate user to corporate-shop')
            router.replace('/corporate-shop')
            return
        }
    }, [user, router])

    const handleOnClick = (index) => {
        setActiveIndex(index)
    }

    // Don't render the regular shop if user is corporate (while redirecting)
    if (user && (user.accountType === 'corporate' || user.userType === 'Corporate')) {
        return (
            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Shop">
                <div className="container py-5">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Redirecting...</span>
                        </div>
                        <p className="mt-3">Redirecting to Corporate Shop...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <>
            <Layout headerStyle={1} footerStyle={1} breadcrumbTitle="Shop">
                <div className="product-filter-area pt-65 pb-80">
                    <div className="container">
                        <FilterShopBox itemStart={10} itemEnd={18} />
                    </div>
                </div>
            </Layout>
        </>
    )
}