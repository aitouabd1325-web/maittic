import { Bell, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getProductById, getBestPriceForProduct } from '../data/products';

export default function AlertsPage() {
  const { priceAlerts, removePriceAlert } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Mes Alertes Prix</h1>
            <span className="text-sm text-gray-400">({priceAlerts.length} alertes)</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {priceAlerts.length > 0 ? (
          <div className="space-y-4">
            {priceAlerts.map(alert => {
              const product = getProductById(alert.productId);
              if (!product) return null;
              const bestPrice = getBestPriceForProduct(product);
              const reached = bestPrice <= alert.targetPrice;

              return (
                <div key={alert.id} className={`bg-white dark:bg-gray-800 rounded-2xl border-2 p-5 flex items-center gap-4 ${
                  reached ? 'border-emerald-400' : 'border-gray-100 dark:border-gray-700'
                }`}>
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product.id}`} className="font-bold text-gray-900 dark:text-white hover:text-emerald-600 transition-colors text-sm line-clamp-1">
                      {product.name}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{alert.email}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">
                        Cible: {alert.targetPrice.toLocaleString()} MAD
                      </span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Actuel: {bestPrice.toLocaleString()} MAD
                      </span>
                      {reached && (
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full font-bold">
                          Objectif atteint!
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Cree le {new Date(alert.createdAt).toLocaleDateString('fr-MA')}
                    </p>
                  </div>
                  <button
                    onClick={() => removePriceAlert(alert.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-5">🔔</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Aucune alerte configuree</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Cree des alertes prix sur les fiches produits pour etre notifie quand un prix baisse.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Parcourir les produits
            </Link>
          </div>
        )}

        {/* Info box */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 p-5">
          <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Comment fonctionnent les alertes?
          </h3>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1.5 list-disc list-inside">
            <li>Accedez à la fiche d&apos;un produit</li>
            <li>Saisissez votre email et le prix cible</li>
            <li>Vous serez notifie quand le prix sera atteint</li>
            <li>Les alertes sont valides pendant 30 jours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
