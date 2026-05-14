import { Flame, Clock } from 'lucide-react';
import { products, getBestPriceForProduct } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function DealsPage() {
  const deals = products.filter(p => p.badge === 'deal' || p.badge === 'popular');
  const topSavings = [...products].sort((a, b) => {
    const aSave = Math.max(...a.prices.map(p => p.price)) - getBestPriceForProduct(a);
    const bSave = Math.max(...b.prices.map(p => p.price)) - getBestPriceForProduct(b);
    return bSave - aSave;
  }).slice(0, 12);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <Flame className="w-8 h-8" />
            <h1 className="text-3xl font-black">Deals du Jour</h1>
          </div>
          <p className="text-white/80 text-lg max-w-xl">
            Les meilleures offres selectionnees quotidiennement. Ne ratez pas ces promotions exclusives!
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-white/70">
            <Clock className="w-4 h-4" />
            <span>Offres mises à jour aujourd&apos;hui — Stocks limites</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Featured deals */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" /> Offres Selectionnees
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {deals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* Top savings */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Plus Grandes Economies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {topSavings.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
