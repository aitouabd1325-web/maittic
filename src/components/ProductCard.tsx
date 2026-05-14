import { Link } from 'react-router-dom';
import { Heart, GitCompare, Star, TrendingDown, CheckCircle, XCircle, BadgeCheck } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { getBestPriceForProduct } from '../data/products';

interface Props {
  product: Product;
  compact?: boolean;
}

const badgeConfig = {
  deal: { label: 'Deal du Jour 🔥', cls: 'bg-orange-500 text-white' },
  new: { label: 'Nouveau ✨', cls: 'bg-blue-500 text-white' },
  popular: { label: 'Populaire ⭐', cls: 'bg-purple-500 text-white' },
};

export default function ProductCard({ product, compact = false }: Props) {
  const { addToWishlist, removeFromWishlist, isInWishlist, addToCompare, removeFromCompare, isInCompare } = useApp();
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const bestPrice = getBestPriceForProduct(product);
  const maxPrice = Math.max(...product.prices.map(p => p.price));
  const savings = maxPrice - bestPrice;
  const savingsPct = Math.round((savings / maxPrice) * 100);
  const bestPriceStore = product.prices.find(p => p.price === bestPrice);
  const inStockCount = product.prices.filter(p => p.inStock).length;

  const lastUpdated = new Date(
    Math.max(...product.prices.map(p => new Date(p.lastUpdated).getTime()))
  );
  const minutesAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
  const hoursAgo = Math.floor(minutesAgo / 60);
  const timeLabel = hoursAgo < 1 ? `${minutesAgo}min` : hoursAgo < 24 ? `${hoursAgo}h` : `${Math.floor(hoursAgo / 24)}j`;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300 flex flex-col">
      {/* Badge */}
      {product.badge && (
        <div className={`absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeConfig[product.badge].cls}`}>
          {badgeConfig[product.badge].label}
        </div>
      )}

      {/* Best Price Badge */}
      {savings > 0 && savingsPct >= 5 && (
        <div className="absolute top-3 right-12 z-10 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          -{savingsPct}%
        </div>
      )}

      {/* Wishlist button */}
      <button
        onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id)}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow-md hover:scale-110 transition-transform"
      >
        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden bg-gray-50 dark:bg-gray-700/50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${compact ? 'h-40' : 'h-52'}`}
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Brand + Rating */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{product.brand}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {bestPrice.toLocaleString()} MAD
              </span>
            </div>
            {savings > 0 && (
              <p className="text-xs text-gray-400 line-through">{maxPrice.toLocaleString()} MAD</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Meilleur prix: <span className="font-semibold">{bestPriceStore?.store}</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400">{inStockCount}/{product.prices.length} dispo</p>
            <p className="text-xs text-gray-400">mis à jour il y a {timeLabel}</p>
          </div>
        </div>

        {/* Stock status */}
        <div className="flex items-center gap-1.5">
          {inStockCount > 0 ? (
            <><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /><span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">En stock</span></>
          ) : (
            <><XCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-xs text-red-500 font-medium">Rupture de stock</span></>
          )}
          {product.prices.some(p => p.affiliateUrl) && (
            <span className="ml-auto flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
              <BadgeCheck className="w-3.5 h-3.5" /> Jumia
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-xl text-center transition-colors"
          >
            Voir prix
          </Link>
          <button
            onClick={() => inCompare ? removeFromCompare(product.id) : addToCompare(product.id)}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors ${inCompare
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-400 hover:text-blue-600'}`}
            title="Comparer"
          >
            <GitCompare className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
