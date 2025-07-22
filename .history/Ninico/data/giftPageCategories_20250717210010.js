// /data/giftCategories.js
export const giftPageCategories = [
  {
    id: 1,
    name: "Gift Page Categories",
    icon: "assets/img/features/feature-icon-01.png",
    subcategories: [
      { name: "Chocolate Hampers" },
      { name: "Spa Kits" },
      { name: "Premium Wine Baskets" },
      { name: "Fruit Baskets" },
    ],
  },
  {
    id: 2,
    name: "Personalized Gifts",
    icon: "assets/img/features/feature-icon-02.png",
    subcategories: [
      {
        name: "Custom Mugs",
        children: ["Glass Mug", "Fiber Mug", "Ceramic Mug"],
      },
      {
        name: "Engraved Jewelry",
        children: ["Gold Necklace", "Silver Bracelet", "Diamond Ring"],
      },
      { name: "Photo Frames" },
    ],
  },
  {
    id: 3,
    name: "Beauty & Wellness Gifts",
    icon: "assets/img/features/feature-icon-03.png",
    subcategories: [
      { name: "Skin Care Kits" },
      { name: "Aromatherapy" },
      { name: "Wellness Boxes" },
    ],
  },
  {
    id: 4,
    name: "Corporate Gifts",
    icon: "assets/img/features/feature-icon-04.png",
    subcategories: [
      { name: "Office Essentials" },
      { name: "Eco-Friendly Kits" },
      { name: "Award Gifts" },
    ],
  },
  {
    id: 5,
    name: "Home Decor Gifts",
    icon: "assets/img/features/feature-icon-05.png",
    subcategories: [
      { name: "Planters" },
      { name: "Decorative Lights" },
      { name: "Wall Frames" },
    ],
  },
  {
    id: 6,
    name: "Gourmet Treats",
    icon: "assets/img/features/feature-icon-06.png",
    subcategories: [
      { name: "Artisanal Chocolates" },
      { name: "Exotic Dry Fruits" },
      { name: "Gourmet Tea Hampers" },
    ],
  },
];
