export type Category = "smartphones" | "laptops";
export type Store = "Jumia" | "Marjane" | "MediaMarkt" | "Electro Plus" | "Zayou";

export interface PriceEntry {
  store: Store;
  price: number;
  inStock: boolean;
  url: string;
  lastUpdated: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  image: string;
  specs: Record<string, string>;
  prices: PriceEntry[];
  rating: number;
  reviews: number;
  tags: string[];
}

const storeColors: Record<Store, string> = {
  Jumia: "#f97316",
  Marjane: "#16a34a",
  MediaMarkt: "#dc2626",
  "Electro Plus": "#2563eb",
  Zayou: "#7c3aed",
};

export { storeColors };

export const products: Product[] = [
  // ── SMARTPHONES ──────────────────────────────────────────────
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro 256GB",
    brand: "Apple",
    category: "smartphones",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
    specs: {
      Écran: "6.1\" Super Retina XDR",
      Processeur: "Apple A17 Pro",
      RAM: "8 GB",
      Stockage: "256 GB",
      Batterie: "3 274 mAh",
      Caméra: "48 MP + 12 MP + 12 MP",
      OS: "iOS 17",
    },
    prices: [
      { store: "Jumia", price: 13999, inStock: true, url: "#", lastUpdated: "2025-01-10" },
      { store: "Marjane", price: 14299, inStock: true, url: "#", lastUpdated: "2025-01-09" },
      { store: "MediaMarkt", price: 13799, inStock: false, url: "#", lastUpdated: "2025-01-10" },
      { store: "Zayou", price: 13650, inStock: true, url: "#", lastUpdated: "2025-01-11" },
    ],
    rating: 4.8,
    reviews: 312,
    tags: ["5G", "ProMotion", "Titanium"],
  },
  {
    id: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra 256GB",
    brand: "Samsung",
    category: "smartphones",
    image: "https://images.unsplash.com/photo-1707818871527-f0dfe3cc6190?w=400&q=80",
    specs: {
      Écran: "6.8\" Dynamic AMOLED 2X",
      Processeur: "Snapdragon 8 Gen 3",
      RAM: "12 GB",
      Stockage: "256 GB",
      Batterie: "5 000 mAh",
      Caméra: "200 MP + 12 MP + 10 MP + 50 MP",
      OS: "Android 14",
    },
    prices: [
      { store: "Jumia", price: 15499, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Marjane", price: 15999, inStock: true, url: "#", lastUpdated: "2025-01-10" },
      { store: "MediaMarkt", price: 15299, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Electro Plus", price: 15100, inStock: false, url: "#", lastUpdated: "2025-01-08" },
      { store: "Zayou", price: 14999, inStock: true, url: "#", lastUpdated: "2025-01-11" },
    ],
    rating: 4.7,
    reviews: 489,
    tags: ["S Pen", "5G", "AI"],
  },
  {
    id: "xiaomi-14",
    name: "Xiaomi 14 256GB",
    brand: "Xiaomi",
    category: "smartphones",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80",
    specs: {
      Écran: "6.36\" AMOLED 120Hz",
      Processeur: "Snapdragon 8 Gen 3",
      RAM: "12 GB",
      Stockage: "256 GB",
      Batterie: "4 610 mAh",
      Caméra: "50 MP Leica + 50 MP + 50 MP",
      OS: "Android 14 / HyperOS",
    },
    prices: [
      { store: "Jumia", price: 8999, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Zayou", price: 8750, inStock: true, url: "#", lastUpdated: "2025-01-10" },
      { store: "MediaMarkt", price: 9100, inStock: true, url: "#", lastUpdated: "2025-01-09" },
    ],
    rating: 4.6,
    reviews: 207,
    tags: ["Leica", "5G", "Rapide charge"],
  },
  {
    id: "google-pixel-8",
    name: "Google Pixel 8 Pro 128GB",
    brand: "Google",
    category: "smartphones",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80",
    specs: {
      Écran: "6.7\" LTPO OLED 120Hz",
      Processeur: "Google Tensor G3",
      RAM: "12 GB",
      Stockage: "128 GB",
      Batterie: "5 050 mAh",
      Caméra: "50 MP + 48 MP + 48 MP",
      OS: "Android 14",
    },
    prices: [
      { store: "Jumia", price: 10999, inStock: false, url: "#", lastUpdated: "2025-01-07" },
      { store: "Marjane", price: 11200, inStock: true, url: "#", lastUpdated: "2025-01-10" },
      { store: "Zayou", price: 10800, inStock: true, url: "#", lastUpdated: "2025-01-11" },
    ],
    rating: 4.5,
    reviews: 165,
    tags: ["IA Google", "7 ans MAJ", "5G"],
  },
  {
    id: "oppo-reno11",
    name: "OPPO Reno 11 Pro 256GB",
    brand: "OPPO",
    category: "smartphones",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&q=80",
    specs: {
      Écran: "6.74\" AMOLED 120Hz",
      Processeur: "MediaTek Dimensity 8200",
      RAM: "12 GB",
      Stockage: "256 GB",
      Batterie: "4 600 mAh",
      Caméra: "50 MP + 32 MP + 13 MP",
      OS: "Android 14 / ColorOS 14",
    },
    prices: [
      { store: "Jumia", price: 5999, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Electro Plus", price: 6199, inStock: true, url: "#", lastUpdated: "2025-01-09" },
      { store: "Zayou", price: 5850, inStock: true, url: "#", lastUpdated: "2025-01-10" },
    ],
    rating: 4.3,
    reviews: 98,
    tags: ["Portrait", "Charge rapide 80W"],
  },
  {
    id: "samsung-a54",
    name: "Samsung Galaxy A54 5G 128GB",
    brand: "Samsung",
    category: "smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
    specs: {
      Écran: "6.4\" Super AMOLED 120Hz",
      Processeur: "Exynos 1380",
      RAM: "8 GB",
      Stockage: "128 GB",
      Batterie: "5 000 mAh",
      Caméra: "50 MP + 12 MP + 5 MP",
      OS: "Android 13",
    },
    prices: [
      { store: "Jumia", price: 3799, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Marjane", price: 3999, inStock: true, url: "#", lastUpdated: "2025-01-10" },
      { store: "MediaMarkt", price: 3699, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Electro Plus", price: 3749, inStock: true, url: "#", lastUpdated: "2025-01-08" },
    ],
    rating: 4.4,
    reviews: 521,
    tags: ["5G", "IP67", "Populaire"],
  },

  // ── LAPTOPS ──────────────────────────────────────────────────
  {
    id: "macbook-air-m3",
    name: "MacBook Air M3 13\" 256GB",
    brand: "Apple",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
    specs: {
      Écran: "13.6\" Liquid Retina",
      Processeur: "Apple M3 8-core",
      RAM: "8 GB",
      Stockage: "256 GB SSD",
      Batterie: "Jusqu'à 18h",
      Poids: "1.24 kg",
      OS: "macOS Sonoma",
    },
    prices: [
      { store: "Jumia", price: 13999, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Marjane", price: 14499, inStock: false, url: "#", lastUpdated: "2025-01-09" },
      { store: "MediaMarkt", price: 13799, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Zayou", price: 13600, inStock: true, url: "#", lastUpdated: "2025-01-10" },
    ],
    rating: 4.9,
    reviews: 278,
    tags: ["Ultraléger", "Silencieux", "M3"],
  },
  {
    id: "dell-xps-15",
    name: "Dell XPS 15 9530 Core i7",
    brand: "Dell",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&q=80",
    specs: {
      Écran: "15.6\" OLED 3.5K 120Hz",
      Processeur: "Intel Core i7-13700H",
      RAM: "16 GB DDR5",
      Stockage: "512 GB NVMe SSD",
      "Carte graphique": "NVIDIA RTX 4060",
      Batterie: "Jusqu'à 13h",
      OS: "Windows 11",
    },
    prices: [
      { store: "Jumia", price: 19999, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "MediaMarkt", price: 20499, inStock: true, url: "#", lastUpdated: "2025-01-10" },
      { store: "Electro Plus", price: 19750, inStock: false, url: "#", lastUpdated: "2025-01-08" },
    ],
    rating: 4.7,
    reviews: 143,
    tags: ["OLED", "RTX 4060", "Premium"],
  },
  {
    id: "hp-victus-16",
    name: "HP Victus 16 Ryzen 5",
    brand: "HP",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",
    specs: {
      Écran: "16.1\" FHD IPS 144Hz",
      Processeur: "AMD Ryzen 5 7535HS",
      RAM: "16 GB DDR5",
      Stockage: "512 GB NVMe SSD",
      "Carte graphique": "NVIDIA RTX 4060 8GB",
      Batterie: "Jusqu'à 8h",
      OS: "Windows 11",
    },
    prices: [
      { store: "Jumia", price: 9999, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Marjane", price: 10299, inStock: true, url: "#", lastUpdated: "2025-01-10" },
      { store: "MediaMarkt", price: 9899, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Electro Plus", price: 9750, inStock: true, url: "#", lastUpdated: "2025-01-09" },
      { store: "Zayou", price: 9699, inStock: false, url: "#", lastUpdated: "2025-01-07" },
    ],
    rating: 4.5,
    reviews: 389,
    tags: ["Gaming", "144Hz", "RTX 4060"],
  },
  {
    id: "lenovo-thinkpad-x1",
    name: "Lenovo ThinkPad X1 Carbon Gen 12",
    brand: "Lenovo",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    specs: {
      Écran: "14\" IPS 2.8K OLED",
      Processeur: "Intel Core Ultra 7 165U",
      RAM: "32 GB LPDDR5",
      Stockage: "1 TB NVMe SSD",
      Poids: "1.12 kg",
      Batterie: "Jusqu'à 15h",
      OS: "Windows 11 Pro",
    },
    prices: [
      { store: "Jumia", price: 22999, inStock: false, url: "#", lastUpdated: "2025-01-06" },
      { store: "MediaMarkt", price: 23499, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Zayou", price: 22500, inStock: true, url: "#", lastUpdated: "2025-01-10" },
    ],
    rating: 4.8,
    reviews: 97,
    tags: ["Professionnel", "Ultra léger", "MIL-SPEC"],
  },
  {
    id: "asus-rog-zephyrus",
    name: "ASUS ROG Zephyrus G14 2024",
    brand: "ASUS",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&q=80",
    specs: {
      Écran: "14\" QHD+ 165Hz OLED",
      Processeur: "AMD Ryzen 9 8945HS",
      RAM: "16 GB DDR5",
      Stockage: "1 TB NVMe SSD",
      "Carte graphique": "NVIDIA RTX 4070 8GB",
      Batterie: "Jusqu'à 10h",
      OS: "Windows 11",
    },
    prices: [
      { store: "Jumia", price: 18999, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "MediaMarkt", price: 19499, inStock: true, url: "#", lastUpdated: "2025-01-10" },
      { store: "Electro Plus", price: 18750, inStock: true, url: "#", lastUpdated: "2025-01-09" },
    ],
    rating: 4.7,
    reviews: 201,
    tags: ["Gaming", "OLED", "RTX 4070"],
  },
  {
    id: "acer-aspire-5",
    name: "Acer Aspire 5 Core i5 512GB",
    brand: "Acer",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&q=80",
    specs: {
      Écran: "15.6\" FHD IPS",
      Processeur: "Intel Core i5-1335U",
      RAM: "8 GB DDR4",
      Stockage: "512 GB NVMe SSD",
      "Carte graphique": "Intel Iris Xe",
      Batterie: "Jusqu'à 10h",
      OS: "Windows 11",
    },
    prices: [
      { store: "Jumia", price: 5499, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Marjane", price: 5699, inStock: true, url: "#", lastUpdated: "2025-01-10" },
      { store: "MediaMarkt", price: 5399, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Electro Plus", price: 5349, inStock: true, url: "#", lastUpdated: "2025-01-09" },
      { store: "Zayou", price: 5299, inStock: true, url: "#", lastUpdated: "2025-01-10" },
    ],
    rating: 4.2,
    reviews: 612,
    tags: ["Bureautique", "Rapport qualité/prix", "Étudiant"],
  },
];

export function getBestPrice(product: Product): PriceEntry | null {
  const available = product.prices.filter((p) => p.inStock);
  if (!available.length) return product.prices.sort((a, b) => a.price - b.price)[0] || null;
  return available.sort((a, b) => a.price - b.price)[0];
}

export function getPriceRange(product: Product) {
  const prices = product.prices.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getSavings(product: Product) {
  const { min, max } = getPriceRange(product);
  return max - min;
}
