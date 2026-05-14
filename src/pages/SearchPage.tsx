import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { Search } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-emerald-600" />
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white">
                Resultats pour &quot;{query}&quot;
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{results.length} produit(s) trouve(s)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-5">🔍</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
              Aucun resultat pour &quot;{query}&quot;
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Essayez un autre terme de recherche ou parcourez nos categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
