import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { getProductsByCategory, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const cat = categories.find(c => c.id === id);
  const allProducts = getProductsByCategory(id || '');

  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'reviews'>('price-asc');
  const [showFilters, setShowFilters] = useState(false);

  const brands = [...new Set(allProducts.map(p => p.brand))];

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (priceMin) result = result.filter(p => Math.min(...p.prices.map(x => x.price)) >= Number(priceMin));
    if (priceMax) result = result.filter(p => Math.min(...p.prices.map(x => x.price)) <= Number(priceMax));
    if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand));
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);

    result.sort((a, b) => {
      const aPrice = Math.min(...a.prices.map(p => p.price));
      const bPrice = Math.min(...b.prices.map(p => p.price));
      switch (sortBy) {
        case 'price-asc': return aPrice - bPrice;
        case 'price-desc': return bPrice - aPrice;
        case 'rating': return b.rating - a.rating;
        case 'reviews': return b.reviewCount - a.reviewCount;
        default: return 0;
      }
    });
    return result;
  }, [allProducts, priceMin, priceMax, selectedBrands, minRating, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const clearFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setSelectedBrands([]);
    setMinRating(0);
  };

  const hasFilters = priceMin || priceMax || selectedBrands.length > 0 || minRating > 0;

  if (!cat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-4xl mb-3">😕</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Categorie introuvable</h2>
          <Link to="/" className="text-emerald-600 hover:underline">Retour à l accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Link to="/" className="hover:text-emerald-600">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-white font-medium">{cat.label}</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <span className="text-3xl">{cat.emoji}</span> {cat.label}
              <span className="text-sm font-normal text-gray-400">({filtered.length} produits)</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
              showFilters || hasFilters ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres {hasFilters && `(actifs)`}
          </button>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium">
              <X className="w-4 h-4" /> Effacer
            </button>
          )}
          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix decroissant</option>
              <option value="rating">Mieux notes</option>
              <option value="reviews">Plus commentes</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 h-fit sticky top-24 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Prix (MAD)</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={e => setPriceMin(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={e => setPriceMax(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Marques</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-200">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Note minimum</h3>
                <div className="flex gap-1.5 flex-wrap">
                  {[0, 3, 3.5, 4, 4.5].map(r => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        minRating === r ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {r === 0 ? 'Tout' : `${r}+ ⭐`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Aucun resultat</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Essayez de modifier vos filtres</p>
                <button onClick={clearFilters} className="text-emerald-600 font-semibold hover:underline text-sm">
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
