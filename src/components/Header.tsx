import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Heart, GitCompare, Bell, Menu, X, ShoppingBag, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { products, categories } from '../data/products';

export default function Header() {
  const { darkMode, toggleDarkMode, wishlist, compareList } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const suggestions = searchQuery.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (id: string) => {
    navigate(`/product/${id}`);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center py-1.5 text-xs font-medium px-4">
        🇲🇦 Comparateur de prix #1 au Maroc — Économisez jusqu&apos;à 40% sur vos achats!
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black text-gray-900 dark:text-white">Maittic</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 block leading-none font-medium -mt-0.5">Maroc Prix</span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Chercher un produit, marque..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all"
                />
              </div>
            </form>

            {/* Live suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                {suggestions.map(product => {
                  const bestPrice = Math.min(...product.prices.map(p => p.price));
                  return (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.brand}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        {bestPrice.toLocaleString()} MAD
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Mode sombre">
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            <Link to="/wishlist" className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Wishlist">
              <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{wishlist.length}</span>
              )}
            </Link>

            <Link to="/compare" className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Comparer">
              <GitCompare className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {compareList.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{compareList.length}</span>
              )}
            </Link>

            <Link to="/alerts" className="hidden sm:flex p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Alertes prix">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className="hidden sm:flex items-center gap-1 pb-2 overflow-x-auto scrollbar-hide">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors whitespace-nowrap"
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
          <Link to="/deals" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors whitespace-nowrap">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Deals du Jour</span>
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 px-4 py-3 space-y-1">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800"
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
          <Link to="/deals" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-orange-600">
            <ShoppingBag className="w-4 h-4" />
            <span>Deals du Jour</span>
          </Link>
          <Link to="/alerts" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200">
            <Bell className="w-4 h-4" />
            <span>Alertes Prix</span>
          </Link>
        </div>
      )}
    </header>
  );
}
