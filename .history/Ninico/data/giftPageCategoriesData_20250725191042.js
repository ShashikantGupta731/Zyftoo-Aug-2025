/**
 * Gift Page Categories Data
 * 
 * This file serves as both static fallback data and as a reference
 * for the expected API response structure.
 */

const giftPageCategories = [
  {
    id: 1,
    name: "Electronics & Gadgets",
    slug: "electronics-gadgets",
    image: "/assets/img/features/feature-icon-01.png",
    description: "Latest tech gadgets and electronic devices",
    isActive: true,
    sortOrder: 1,
    subcategories: [
      { id: 11, name: "Smartphones", link: "/shop/smartphones", isActive: true },
      { id: 12, name: "Laptops", link: "/shop/laptops", isActive: true },
      { id: 13, name: "Smart Watches", link: "/shop/smart-watches", isActive: true },
      { id: 14, name: "Headphones", link: "/shop/headphones", isActive: true },
      { id: 15, name: "Gaming Accessories", link: "/shop/gaming", isActive: true }
    ]
  },
  {
    id: 2,
    name: "Fashion & Accessories",
    slug: "fashion-accessories",
    image: "/assets/img/features/feature-icon-02.png",
    description: "Trendy fashion items and stylish accessories",
    isActive: true,
    sortOrder: 2,
    subcategories: [
      { id: 21, name: "Men's Clothing", link: "/shop/mens-clothing", isActive: true },
      { id: 22, name: "Women's Clothing", link: "/shop/womens-clothing", isActive: true },
      { id: 23, name: "Jewelry", link: "/shop/jewelry", isActive: true },
      { id: 24, name: "Watches", link: "/shop/watches", isActive: true },
      { id: 25, name: "Bags & Wallets", link: "/shop/bags", isActive: true }
    ]
  },
  {
    id: 3,
    name: "Home & Garden",
    slug: "home-garden",
    image: "/assets/img/features/feature-icon-03.png",
    description: "Beautiful items for your home and garden",
    isActive: true,
    sortOrder: 3,
    subcategories: [
      { id: 31, name: "Home Decor", link: "/shop/home-decor", isActive: true },
      { id: 32, name: "Kitchen Appliances", link: "/shop/kitchen", isActive: true },
      { id: 33, name: "Furniture", link: "/shop/furniture", isActive: true },
      { id: 34, name: "Garden Tools", link: "/shop/garden", isActive: true },
      { id: 35, name: "Lighting", link: "/shop/lighting", isActive: true }
    ]
  },
  {
    id: 4,
    name: "Health & Beauty",
    slug: "health-beauty",
    image: "/assets/img/features/feature-icon-04.png",
    description: "Products for health, wellness and beauty",
    isActive: true,
    sortOrder: 4,
    subcategories: [
      { id: 41, name: "Skincare", link: "/shop/skincare", isActive: true },
      { id: 42, name: "Makeup", link: "/shop/makeup", isActive: true },
      { id: 43, name: "Health Supplements", link: "/shop/supplements", isActive: true },
      { id: 44, name: "Fitness Equipment", link: "/shop/fitness", isActive: true },
      { id: 45, name: "Personal Care", link: "/shop/personal-care", isActive: true }
    ]
  },
  {
    id: 5,
    name: "Books & Education",
    slug: "books-education",
    image: "/assets/img/features/feature-icon-05.png",
    description: "Educational materials and reading materials",
    isActive: true,
    sortOrder: 5,
    subcategories: [
      { id: 51, name: "Fiction Books", link: "/shop/fiction", isActive: true },
      { id: 52, name: "Educational Books", link: "/shop/educational", isActive: true },
      { id: 53, name: "Children's Books", link: "/shop/childrens", isActive: true },
      { id: 54, name: "E-Books", link: "/shop/ebooks", isActive: true },
      { id: 55, name: "Stationery", link: "/shop/stationery", isActive: true }
    ]
  },
  {
    id: 6,
    name: "Sports & Outdoors",
    slug: "sports-outdoors",
    image: "/assets/img/features/feature-icon-06.png",
    description: "Sports equipment and outdoor adventure gear",
    isActive: true,
    sortOrder: 6,
    subcategories: [
      { id: 61, name: "Sports Equipment", link: "/shop/sports-equipment", isActive: true },
      { id: 62, name: "Outdoor Gear", link: "/shop/outdoor-gear", isActive: true },
      { id: 63, name: "Athletic Wear", link: "/shop/athletic-wear", isActive: true },
      { id: 64, name: "Camping & Hiking", link: "/shop/camping", isActive: true },
      { id: 65, name: "Water Sports", link: "/shop/water-sports", isActive: true }
    ]
  },
  {
    id: 7,
    name: "Toys & Games",
    slug: "toys-games",
    image: "/assets/img/features/feature-icon-07.png",
    description: "Fun toys and entertaining games for all ages",
    isActive: true,
    sortOrder: 7,
    subcategories: [
      { id: 71, name: "Action Figures", link: "/shop/action-figures", isActive: true },
      { id: 72, name: "Board Games", link: "/shop/board-games", isActive: true },
      { id: 73, name: "Educational Toys", link: "/shop/educational-toys", isActive: true },
      { id: 74, name: "Puzzles", link: "/shop/puzzles", isActive: true },
      { id: 75, name: "Remote Control", link: "/shop/remote-control", isActive: true }
    ]
  }
];

// Metadata for the gift categories section
const giftCategoriesMetadata = {
  title: "Perfect Gifts for Every Occasion",
  subtitle: "Discover amazing products across all categories",
  description: "Browse through our carefully curated selection of gifts for everyone and every occasion.",
  totalCategories: giftPageCategories.length,
  totalSubcategories: giftPageCategories.reduce((total, category) => total + category.subcategories.length, 0),
  lastUpdated: "2025-07-25T00:00:00.000Z",
  source: "static_data",
  version: "1.0"
};

/**
 * Expected API Response Structure:
 * 
 * {
 *   "success": true,
 *   "categories": [...giftPageCategories],
 *   "metadata": {
 *     ...giftCategoriesMetadata,
 *     "source": "api",
 *     "lastUpdated": "ISO timestamp",
 *     "version": "string"
 *   }
 * }
 */

// Named exports (what the components expect)
export { giftPageCategories, giftCategoriesMetadata };

// Default export (backward compatibility)
export default giftPageCategories;