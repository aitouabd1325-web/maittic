export type Category =
  | 'smartphones'
  | 'laptops'
  | 'tablets'
  | 'tvs'
  | 'home-appliances'
  | 'video-games';

export type Store =
  | 'Jumia'
  | 'Marjane'
  | 'Electroplanet'
  | 'Avito'
  | 'Hmall'
  | 'Fnac Maroc';

export interface StorePrice {
  store: Store;
  price: number;
  url: string;
  inStock: boolean;
  lastUpdated: string;
  affiliateUrl?: string;
  isBestPrice?: boolean;
}

export interface PriceHistory {
  date: string;
  price: number;
  store: Store;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  image: string;
  description: string;
  specs: Record<string, string>;
  prices: StorePrice[];
  priceHistory: PriceHistory[];
  reviews: Review[];
  rating: number;
  reviewCount: number;
  badge?: 'deal' | 'new' | 'popular';
  tags: string[];
}

export interface PriceAlert {
  id: string;
  productId: string;
  email: string;
  targetPrice: number;
  createdAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}
