import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, Heart, GitCompare, Bell, ExternalLink, CheckCircle, XCircle,
  ChevronRight, ShieldCheck, BadgeCheck, TrendingDown, Clock, Share2
} from 'lucide-react';
import { getProductById, getBestPriceForProduct, products } from '../data/products';
import { useApp } from '../context/AppContext';
import PriceHistoryChart from '../components/PriceHistoryChart';
import ProductCard from '../components/ProductCard';

function StarRating({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const s = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${s} ${i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 dark:text-gray-600'}`} />
      ))}
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || '');
  const { addToWishlist, removeFromWishlist, isInWishlist, addToCompare, removeFromCompare, isInCompare, addPriceAlert } = useApp();
  const [alertEmail, setAlertEmail] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertSent, setAlertSent] = useState(false);
  const [activeTab, setActiveTab] = useState<'prices' | 'specs' | 'reviews' | 'history'>('prices');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', user: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Produit introuvable</h2>
          <Link to="/" className="text-emerald-600 hover:underline font-medium">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const bestPrice = getBestPriceForProduct(product);
  const maxPrice = Math.max(...product.prices.map(p => p.price));
  const savings = maxPrice - bestPrice;
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alertEmail && alertPrice) {
      addPriceAlert({ productId: product.id, email: alertEmail, targetPrice: Number(alertPrice) });
      setAlertSent(true);
      setTimeout(() => setAlertSent(false), 4000);
      setAlertEmail('');
      setAlertPrice('');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "brand": { "@type": "Brand", "name": product.brand },
    "description": product.description,
    "image": product.image,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount,
    },
    "offers": product.prices.map(p => ({
      "@type": "Offer",
      "price": p.price,
      "priceCurrency": "MAD",
      "availability": p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": p.store },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-emerald-600">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to={`/category/${product.category}`} className="hover:text-emerald-600 capitalize">{product.category.replace('-', ' ')}</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-white font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: Image + Quick info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
              <div className="relative">
                {product.badge && (
                  <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold ${
                    product.badge === 'deal' ? 'bg-orange-500 text-white' :
                    product.badge === 'new' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'
                  }`}>
                    {product.badge === 'deal' ? 'Deal du Jour 🔥' : product.badge === 'new' ? 'Nouveau ✨' : 'Populaire ⭐'}
                  </div>
                )}
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
              </div>
              <div className="p-5">
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">{product.brand}</p>
                <h1 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-3">{product.name}</h1>

                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={product.rating} />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{product.rating}/5</span>
                  <span className="text-sm text-gray-400">({product.reviewCount} avis)</span>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">MEILLEUR PRIX</span>
                    <BadgeCheck className="w-4 h-4 text-emerald-600 ml-auto" />
                  </div>
                  <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{bestPrice.toLocaleString()} MAD</p>
                  {savings > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="line-through">{maxPrice.toLocaleString()} MAD</span>
                      <span className="text-emerald-600 font-semibold ml-2">Economisez {savings.toLocaleString()} MAD</span>
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                      inWishlist ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-red-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                    {inWishlist ? 'Sauvegarde' : 'Wishlist'}
                  </button>
                  <button
                    onClick={() => inCompare ? removeFromCompare(product.id) : addToCompare(product.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                      inCompare ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-300'
                    }`}
                  >
                    <GitCompare className="w-4 h-4" />
                    {inCompare ? 'Comparer' : 'Comparer'}
                  </button>
                </div>

                <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700">
                  <Share2 className="w-4 h-4" />
                  {copied ? 'Lien copie!' : 'Partager'}
                </button>

                {/* Last updated */}
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Prix verifies aujourd&apos;hui</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 ml-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
                {[
                  { key: 'prices', label: 'Prix & Stocks' },
                  { key: 'specs', label: 'Caracteristiques' },
                  { key: 'history', label: 'Historique 30j' },
                  { key: 'reviews', label: `Avis (${product.reviewCount})` },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                    className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                      activeTab === tab.key
                        ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {/* Prices Tab */}
                {activeTab === 'prices' && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Comparaison des prix dans {product.prices.length} boutiques</p>
                    {sortedPrices.map((sp, i) => (
                      <div key={sp.store} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        sp.isBestPrice
                          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10'
                          : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30'
                      }`}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                          style={{ background: i === 0 ? '#10b981' : i === 1 ? '#6366f1' : '#f59e0b', color: 'white' }}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 dark:text-white">{sp.store}</p>
                            {sp.isBestPrice && (
                              <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <BadgeCheck className="w-3 h-3" /> Meilleur Prix
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {sp.inStock ? (
                              <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-3 h-3" /> En stock</span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-red-500"><XCircle className="w-3 h-3" /> Rupture</span>
                            )}
                            <span className="text-xs text-gray-400">• mis à jour {new Date(sp.lastUpdated).toLocaleDateString('fr-MA')}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl font-black text-gray-900 dark:text-white">{sp.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">MAD</p>
                        </div>
                        <a
                          href={sp.affiliateUrl || sp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex-shrink-0 ${
                            sp.inStock
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                          }`}
                          onClick={e => !sp.inStock && e.preventDefault()}
                        >
                          Voir <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {/* Specs Tab */}
                {activeTab === 'specs' && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{product.description}</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex flex-col bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{key}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {product.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Evolution du prix sur les 30 derniers jours</p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-gray-500">Min: <strong className="text-emerald-600">{Math.min(...product.priceHistory.map(h => h.price)).toLocaleString()} MAD</strong></span>
                        <span className="text-gray-500">Max: <strong className="text-red-500">{Math.max(...product.priceHistory.map(h => h.price)).toLocaleString()} MAD</strong></span>
                      </div>
                    </div>
                    <PriceHistoryChart history={product.priceHistory} />
                    <p className="text-xs text-center text-gray-400 mt-3">Le meilleur moment pour acheter est quand le prix est proche du minimum historique.</p>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Rating summary */}
                    <div className="flex items-center gap-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-5">
                      <div className="text-center">
                        <p className="text-5xl font-black text-gray-900 dark:text-white">{product.rating}</p>
                        <StarRating rating={product.rating} />
                        <p className="text-xs text-gray-400 mt-1">{product.reviewCount} avis</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map(star => {
                          const count = product.reviews.filter(r => r.rating === star).length;
                          const pct = product.reviews.length > 0 ? (count / product.reviews.length) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 w-2">{star}</span>
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs text-gray-400 w-4">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {product.reviews.map(review => (
                      <div key={review.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {review.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{review.user}</p>
                              {review.verified && (
                                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                  <BadgeCheck className="w-3.5 h-3.5" /> Achat verifie
                                </span>
                              )}
                            </div>
                            <StarRating rating={review.rating} size="sm" />
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(review.date).toLocaleDateString('fr-MA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                    >
                      + Ajouter un avis
                    </button>

                    {showReviewForm && (
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-3">
                        <input
                          type="text"
                          placeholder="Votre nom"
                          value={newReview.user}
                          onChange={e => setNewReview(prev => ({ ...prev, user: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <button key={s} onClick={() => setNewReview(prev => ({ ...prev, rating: s }))}>
                              <Star className={`w-6 h-6 ${s <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          placeholder="Votre commentaire..."
                          value={newReview.comment}
                          onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        />
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
                          Publier l&apos;avis
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Price Alert */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Alerte de prix</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Soyez notifie quand le prix baisse</p>
                </div>
              </div>

              {alertSent ? (
                <div className="flex items-center gap-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">Alerte enregistree! Nous vous notifierons par email.</p>
                </div>
              ) : (
                <form onSubmit={handleAlertSubmit} className="space-y-3">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={alertEmail}
                    onChange={e => setAlertEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        placeholder={`Prix cible (actuellement ${bestPrice.toLocaleString()})`}
                        value={alertPrice}
                        onChange={e => setAlertPrice(e.target.value)}
                        required
                        min={1}
                        max={bestPrice - 1}
                        className="w-full px-3 py-2.5 pr-12 rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">MAD</span>
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                      Creer
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Jumia Affiliate Banner */}
            {product.prices.some(p => p.affiliateUrl) && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold opacity-80 mb-1">Partenaire officiel</p>
                    <h3 className="text-lg font-black">Commandez sur Jumia</h3>
                    <p className="text-sm opacity-80 mt-1">Livraison rapide au Maroc • Paiement securise</p>
                  </div>
                  <a
                    href={product.prices.find(p => p.affiliateUrl)?.affiliateUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 bg-white text-orange-600 font-black px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors text-sm flex items-center gap-1.5"
                  >
                    Acheter <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Produits similaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
