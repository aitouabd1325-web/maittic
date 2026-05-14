import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PriceAlert, WishlistItem } from '../types';

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  wishlist: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  compareList: string[];
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  priceAlerts: PriceAlert[];
  addPriceAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  removePriceAlert: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch { return []; }
  });

  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('compareList') || '[]');
    } catch { return []; }
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    localStorage.setItem('priceAlerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const addToWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.find(i => i.productId === productId)) return prev;
      return [...prev, { productId, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(i => i.productId !== productId));
  };

  const isInWishlist = (productId: string) => wishlist.some(i => i.productId === productId);

  const addToCompare = (productId: string) => {
    setCompareList(prev => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= 2) return [prev[1], productId];
      return [...prev, productId];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(id => id !== productId));
  };

  const isInCompare = (productId: string) => compareList.includes(productId);

  const addPriceAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPriceAlerts(prev => [...prev, newAlert]);
  };

  const removePriceAlert = (id: string) => {
    setPriceAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AppContext.Provider value={{
      darkMode, toggleDarkMode,
      wishlist, addToWishlist, removeFromWishlist, isInWishlist,
      compareList, addToCompare, removeFromCompare, isInCompare,
      priceAlerts, addPriceAlert, removePriceAlert,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
