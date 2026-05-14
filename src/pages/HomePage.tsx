import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingDown, Star, ChevronRight, Flame, Clock, ShieldCheck, Zap, Award } from 'lucide-react';
import { products, categories, getFeaturedDeal, getBestPriceForProduct } from '../data/products';
import ProductCard from '../components/ProductCard';

// AdSense placeholder component
function AdBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm font-medium ${className}`}>
      <div className="text-center py-6">
        <div className="text-2xl mb-1">📢</div>
        <p className="text-xs">Espace publicitaire</p>
        <p className="text-xs opacity-60">Google AdSense</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('smartphones');
  const dealProduct = getFeaturedDeal();
  const dealBestPrice = getBestPriceForProduct(dealProduct);
  const dealMaxPrice = Math.max(...dealProduct.prices.map(p => p.price));
  const dealSavings = dealMaxPrice - dealBestPrice;

  const filteredProducts = products.filter(p => p.category === activeCategory).slice(0, 8);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const newArrivals = products.filter(p => p.badge === 'new').slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium mb-5">
              <Zap className="w-4 h-4 text-yellow-300" />
              Comparateur de prix #1 au Maroc
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4">
              Trouvez le <span className="text-yellow-300">meilleur prix</span> au Maroc
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8">
              Comparez instantanement les prix de Jumia, Marjane, Electroplanet, Avito, Hmall et Fnac Maroc.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/category/smartphones" className="bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-yellow-50 transition-colors shadow-lg">
                Voir les offres
              </Link>
              <Link to="/deals" className="bg-white/15 backdrop-blur border border-white/30 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/25 transition-colors">
                Deals du Jour
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-10 text-sm text-white/80">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-yellow-300" /><span>Prix mis à jour en temps réel</span></div>
              <div className="flex items-center gap-2"><Award className="w-4 h-4 text-yellow-300" /><span>+500 produits comparés</span></div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-300" /><span>6 boutiques fiables</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Deal of the Day */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
            <div className="flex-shrink-0">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-white text-sm font-bold mb-3">
                <Flame className="w-4 h-4" /> DEAL DU JOUR
              </div>
              <img
                src={dealProduct.image}
                alt={dealProduct.name}
                loading="lazy"
                className="w-36 h-36 sm:w-48 sm:h-48 object-cover rounded-2xl shadow-2xl"
              />
            </div>
            <div className="flex-1 text-white text-center sm:text-left">
              <p className="text-sm font-semibold opacity-80 uppercase tracking-wide mb-1">{dealProduct.brand}</p>
              <h2 className="text-2xl sm:text-3xl font-black mb-3">{dealProduct.name}</h2>
              <div className="flex items-center gap-3 justify-center sm:justify-start mb-4">
                <span className="text-4xl font-black">{dealBestPrice.toLocaleString()} MAD</span>
                <div>
                  <p className="text-sm line-through opacity-60">{dealMaxPrice.toLocaleString()} MAD</p>
                  <p className="text-sm font-bold bg-white/20 rounded-full px-2 py-0.5">Economisez {dealSavings.toLocaleString()} MAD</p>
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start text-sm mb-5 opacity-80">
                <Clock className="w-4 h-4" />
                <span>Offre limitee — mis à jour aujourd&apos;hui</span>
              </div>
              <Link
                to={`/product/${dealProduct.id}`}
                className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors shadow-lg"
              >
                Voir le deal <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top AdSense Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <AdBanner className="h-24" />
      </div>

      {/* Store logos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-5">Boutiques comparees</p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
          {['Jumia', 'Marjane', 'Electroplanet', 'Avito', 'Hmall', 'Fnac Maroc'].map(store => (
            <div key={store} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{store}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category Filter + Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Comparer par categorie
          </h2>
          <Link to={`/category/${activeCategory}`} className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:gap-2 transition-all">
            Voir tout <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-300'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-medium">Aucun produit dans cette categorie</p>
          </div>
        )}
      </section>

      {/* AdSense mid-page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdBanner className="h-28" />
      </div>

      {/* Top Rated */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> Mieux notes
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {topRated.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              ✨ Nouveautes
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Why use us */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-center text-gray-900 dark:text-white mb-10">Pourquoi Maittic?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'Prix en temps reel', desc: 'Nos prix sont mis à jour plusieurs fois par jour pour vous garantir la meilleure information.' },
              { icon: '🛡️', title: 'Fiable et transparent', desc: 'Nous comparons uniquement des boutiques de confiance verifiees au Maroc.' },
              { icon: '📊', title: 'Historique des prix', desc: 'Visualisez 30 jours de variation de prix pour acheter au meilleur moment.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdBanner className="h-24" />
      </div>

      {/* Price trend summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-emerald-500" /> Meilleures affaires du moment
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.filter(p => p.badge === 'deal').map(product => {
            const best = getBestPriceForProduct(product);
            const max = Math.max(...product.prices.map(p => p.price));
            const pct = Math.round(((max - best) / max) * 100);
            return (
              <Link key={product.id} to={`/product/${product.id}`} className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md transition-all">
                <img src={product.image} alt={product.name} loading="lazy" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-black">{best.toLocaleString()} MAD</p>
                  <p className="text-xs text-gray-400 line-through">{max.toLocaleString()} MAD</p>
                </div>
                {pct > 0 && (
                  <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-black text-sm px-2 py-1 rounded-lg">
                    -{pct}%
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
