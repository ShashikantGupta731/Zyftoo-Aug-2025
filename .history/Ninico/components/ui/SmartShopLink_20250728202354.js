import Link from 'next/link'
import { useCorporateShopRedirect } from '@/hooks/useCorporateShopRedirect'

const SmartShopLink = ({ href, children, className, ...props }) => {
    const { getShopUrl } = useCorporateShopRedirect()
    
    const finalHref = getShopUrl(href)
    
    return (
        <Link href={finalHref} className={className} {...props}>
            {children}
        </Link>
    )
}

export default SmartShopLink
