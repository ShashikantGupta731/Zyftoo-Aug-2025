
import Layout from "@/components/layout/Layout"
import Banner2 from "@/components/sections/Banner2"
import Blog2 from "@/components/sections/Blog2"
import Brand2 from "@/components/sections/Brand2"
import DealProduct2 from "@/components/sections/DealProduct2"
import Product3 from "@/components/sections/Product3"
import Product2 from "@/components/sections/Product2"
import Services from "@/components/sections/Services"
import Slider3 from "@/components/sections/Slider3"
import WhiteProduct from "@/components/sections/WhiteProduct"
import ModernGiftCategories from "@/components/sections/ModernGiftCategories"
import PlatinamProduct from "@/components/sections/PlatinamProduct"
import Link from "next/link"

console.log('📄 === MODERN PAGE.JS LOADED ===')
console.log('📦 ModernGiftCategories imported:', typeof ModernGiftCategories)

export default function Home3() {

    return (
        <>
            <Layout headerStyle={1} footerStyle={2}>
                <ModernGiftCategories />
                <Slider3 />
                <Services />
                <Product2 />
                <PlatinamProduct/>
                <Banner2 />
                <DealProduct2 />             
                
            </Layout>
        </>
    )
}