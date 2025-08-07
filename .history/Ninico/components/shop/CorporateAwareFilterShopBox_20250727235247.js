'use client'
import { addCart } from "@/features/shopSlice"
import { addWishlist } from "@/features/wishlistSlice"
import { Fragment, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import products from "../../data/products"
import AuthContext from '@/components/context/AuthContext'
import {
    addPerPage,
    addSort,
    addprice,
    clearBrand,
    clearCategory,
    clearColor,
} from "../../features/filterSlice"
import {
    clearBrandToggle,
    clearCategoryToggle,
    clearColorToggle,
} from "../../features/productSlice"
import ShopCard from "./ShopCard"
import EnhancedShopCard from "./EnhancedShopCard"

const CorporateAwareFilterShopBox = ({ itemStart, itemEnd, useCorporateCard = false }) => {
    const { shopList, shopSort } = useSelector((state) => state.filter)
    const { user } = useContext(AuthContext)
    
    const {
        price,
        category,
        color,
        brand,
    } = shopList || {}

    const { sort, perPage } = shopSort

    const dispatch = useDispatch()

    const addToCart = (id) => {
        const item = products?.find((item) => item.id === id)
        dispatch(addCart({ product: item }))
    }

    const addToWishlist = (id) => {
        const item = products?.find((item) => item.id === id)
        dispatch(addWishlist({ product: item }))
    }

    // Enhanced products with corporate pricing (sample data for demo)
    const enhanceProductsWithCorporatePricing = (products) => {
        return products.map(product => ({
            ...product,
            retailPrice: {
                mrp: (product.price?.max * 100) * 1.2 || 0,
                sellingPrice: product.price?.max * 100 || 0,
                discount: Math.floor(Math.random() * 20), // Random discount for demo
                currency: 'INR'
            },
            corporatePricing: Math.random() > 0.5 ? {
                enabled: true,
                minimumOrderQuantity: Math.floor(Math.random() * 50) + 10,
                priceTiers: [
                    {
                        minQuantity: 10,
                        maxQuantity: 49,
                        pricePerUnit: (product.price?.max * 100) * 0.9,
                        discount: 10,
                        description: "Small bulk discount"
                    },
                    {
                        minQuantity: 50,
                        maxQuantity: 99,
                        pricePerUnit: (product.price?.max * 100) * 0.8,
                        discount: 20,
                        description: "Medium bulk discount"
                    },
                    {
                        minQuantity: 100,
                        maxQuantity: null,
                        pricePerUnit: (product.price?.max * 100) * 0.7,
                        discount: 30,
                        description: "Large bulk discount"
                    }
                ]
            } : { enabled: false }
        }))
    }

    // Existing filter functions
    const priceFilter = (item) =>
        item?.price?.min >= price?.min && item?.price?.max <= price?.max

    const categoryFilter = (item) =>
        category?.length !== 0 && item?.category !== undefined ? 
        category?.includes(item?.category[0]?.type.toLocaleLowerCase().split(" ").join("-")) : item

    const colorFilter = (item) =>
        color?.length !== 0 && item?.color !== undefined ? 
        color?.includes(item?.color[0]?.type.toLocaleLowerCase().split(" ").join("-")) : item

    const brandFilter = (item) =>
        brand?.length !== 0 && item?.brand !== undefined ? 
        brand?.includes(item?.brand[0]?.type.toLocaleLowerCase().split(" ").join("-")) : item

    const sortFilter = (a, b) =>
        sort === "des" ? a.id > b.id && -1 : a.id < b.id && -1

    // Determine which products to show and which card component to use
    const productsToShow = useCorporateCard ? enhanceProductsWithCorporatePricing(products) : products
    const CardComponent = useCorporateCard ? EnhancedShopCard : ShopCard

    let content = productsToShow.slice(itemStart, itemEnd)
        ?.filter(priceFilter)
        ?.filter(categoryFilter)
        ?.filter(colorFilter)
        ?.filter(brandFilter)
        ?.sort(sortFilter)
        .slice(perPage.start, perPage.end !== 0 ? perPage.end : 10)
        ?.map((item, i) => (
            <Fragment key={i}>
                <CardComponent 
                    item={item} 
                    addToCart={addToCart} 
                    addToWishlist={addToWishlist} 
                />
            </Fragment>
        ))

    return content
}

export default CorporateAwareFilterShopBox
