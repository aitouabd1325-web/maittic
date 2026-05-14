import { Link } from 'react-router-dom';
import { X, Star, CheckCircle, XCircle, BadgeCheck, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getProductById, getBestPriceForProduct, products } from '../data/products';


export default function ComparePage() {
  const { compareList, removeFromCompare, addToCompare } = useApp();
  const p1 = compareList[0] ? getProductById(compareList[0]) : null;
  const p2 = compareList[1] ? getProductById(compareList[1]) : null;

  const allSpecKeys = [...new Set([
    ...Object.keys(p1?.specs || {}),
    ...Object.keys(p2?.specs || {}),
  ])];

  const allStores = [...new Set([
    ...(p1?.prices.map(p => p.store) || []),
    ...(p2?.prices.map(p => p.store) || []),
  ])];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Comparateur de produits</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ajoutez 2 produits pour les comparer cote à cote</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Comparison table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
          {/* Product headers */}
          <div className="grid grid-cols-3 border-b border-gray-100 dark:border-gray-700">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 flex items-center">
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Produit</span>
            </div>
            {[p1, p2].map((p, i) => (
              <div key={i} className="p-4 border-l border-gray-100 dark:border-gray-700">
                {p ? (
                  <div className="relative">
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <img src={p.image} alt={p.name} className="w-full h-36 object-cover rounded-xl mb-3" />
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">{p.brand}</p>
                    <Link to={`/product/${p.id}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-emerald-600 transition-colors line-clamp-2">
                      {p.name}
                    </Link>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold">{p.rating}</span>
                      <span className="text-xs text-gray-400">({p.reviewCount})</span>
                    </div>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                      {getBestPriceForProduct(p).toLocaleString()} MAD
                    </p>
                  </div>
                ) : (
                  <div className="h-48 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm font-medium">Slot {i + 1}</p>
                      <p className="text-xs text-gray-300 dark:text-gray-500 mt-1">Ajoutez un produit depuis les fiches produits</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Prices per store */}
          <div className="border-b border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Prix par boutique</span>
              </div>
              {[p1, p2].map((p, i) => (
                <div key={i} className="p-4 border-l border-gray-100 dark:border-gray-700 space-y-2">
                  {p ? allStores.map(store => {
                    const sp = p.prices.find(x => x.store === store);
                    return (
                      <div key={store} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{store}</span>
                        {sp ? (
                          <div className="flex items-center gap-1.5">
                            {sp.isBestPrice && <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />}
                            <span className={`font-bold ${sp.isBestPrice ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                              {sp.price.toLocaleString()} MAD
                            </span>
                            {sp.inStock ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                          </div>
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600 text-xs">N/A</span>
                        )}
                      </div>
                    );
                  }) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Specs comparison */}
          {allSpecKeys.map((key, idx) => (
            <div key={key} className={`grid grid-cols-3 border-b border-gray-100 dark:border-gray-700 ${idx % 2 === 0 ? '' : 'bg-gray-50/50 dark:bg-gray-700/10'}`}>
              <div className="p-3.5 bg-gray-50/70 dark:bg-gray-700/20 flex items-center">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{key}</span>
              </div>
              {[p1, p2].map((p, i) => (
                <div key={i} className="p-3.5 border-l border-gray-100 dark:border-gray-700 flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                    {p?.specs[key] || <span className="text-gray-300 dark:text-gray-600">—</span>}
                  </span>
                </div>
              ))}
            </div>
          ))}

          {/* Rating row */}
          <div className="grid grid-cols-3">
            <div className="p-3.5 bg-gray-50 dark:bg-gray-700/30 flex items-center">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Note</span>
            </div>
            {[p1, p2].map((p, i) => (
              <div key={i} className="p-3.5 border-l border-gray-100 dark:border-gray-700">
                {p && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(p.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{p.rating}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="grid grid-cols-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/20">
            <div className="p-4" />
            {[p1, p2].map((p, i) => (
              <div key={i} className="p-4 border-l border-gray-100 dark:border-gray-700">
                {p && (
                  <div className="flex flex-col gap-2">
                    <Link to={`/product/${p.id}`} className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2 rounded-xl text-center transition-colors">
                      Voir les prix
                    </Link>
                    {p.prices.find(x => x.affiliateUrl) && (
                      <a
                        href={p.prices.find(x => x.affiliateUrl)?.affiliateUrl || '#'}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2 rounded-xl transition-colors"
                      >
                        Acheter <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions to add */}
        {(!p1 || !p2) && (
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">Ajouter un produit à comparer</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {products.filter(p => !compareList.includes(p.id)).slice(0, 8).map(p => (
                <div key={p.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col gap-3">
                  <img src={p.image} alt={p.name} className="w-full h-28 object-cover rounded-xl" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{p.name}</p>
                  <button
                    onClick={() => addToCompare(p.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl transition-colors"
                  >
                    + Comparer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
