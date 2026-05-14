import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getProductById } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useApp();
  const wishlistProducts = wishlist
    .map(item => ({ item, product: getProductById(item.productId) }))
    .filter(x => x.product !== undefined);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Ma Wishlist</h1>
              <span className="text-sm text-gray-400">({wishlistProducts.length} produits)</span>
            </div>
            {wishlistProducts.length > 0 && (
              <button
                onClick={() => wishlistProducts.forEach(x => removeFromWishlist(x.item.productId))}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium"
              >
                <Trash2 className="w-4 h-4" /> Vider la liste
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistProducts.map(({ item, product }) => (
              product && <ProductCard key={item.productId} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-5">💔</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Votre wishlist est vide</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Sauvegardez vos produits favoris en cliquant sur le coeur sur les fiches produits.
            </p>
            <Link to="/" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-block">
              Decouvrir les produits
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
