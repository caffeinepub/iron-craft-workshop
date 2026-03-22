import { ProductCategory } from "../backend.d";
import type { Product } from "../backend.d";

export const SEED_PRODUCTS: Product[] = [
  {
    id: 1n,
    name: "Classic Iron Door",
    category: ProductCategory.door,
    price: 850,
    unit: "per piece",
    description:
      "Handcrafted solid iron door with intricate scroll patterns, perfect for main entrances.",
    imageUrl: "/assets/generated/product-door.dim_600x600.jpg",
    isAvailable: true,
    lastUpdated: BigInt(Date.now()) * 1_000_000n,
    priceHistory: [],
  },
  {
    id: 2n,
    name: "Decorative Window Grille",
    category: ProductCategory.window_,
    price: 320,
    unit: "per piece",
    description:
      "Elegant iron window grille with custom scrollwork for security and aesthetics.",
    imageUrl: "/assets/generated/product-window.dim_600x600.jpg",
    isAvailable: true,
    lastUpdated: BigInt(Date.now()) * 1_000_000n,
    priceHistory: [],
  },
  {
    id: 3n,
    name: "Ornamental Driveway Gate",
    category: ProductCategory.gate,
    price: 1250,
    unit: "per piece",
    description:
      "Grand driveway gate with spear-top pickets and traditional scrollwork details.",
    imageUrl: "/assets/generated/product-gate.dim_600x600.jpg",
    isAvailable: true,
    lastUpdated: BigInt(Date.now()) * 1_000_000n,
    priceHistory: [],
  },
  {
    id: 4n,
    name: "Security Window Bars",
    category: ProductCategory.window_,
    price: 180,
    unit: "per piece",
    description:
      "Heavy-duty iron window bars providing maximum security with clean minimalist design.",
    imageUrl: "/assets/generated/product-window.dim_600x600.jpg",
    isAvailable: true,
    lastUpdated: BigInt(Date.now()) * 1_000_000n,
    priceHistory: [],
  },
];
