import { Link } from 'react-router-dom';
import { Zap, Mail, ExternalLink } from 'lucide-react';
import { categories } from '../data/products';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black">Maittic</span>
                <p className="text-xs text-emerald-400 leading-none">Maroc Prix</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Le comparateur de prix #1 au Maroc. Trouvez les meilleures offres sur Jumia, Marjane, Electroplanet, Avito, Hmall et Fnac Maroc.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <span>contact@maittic.ma</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Categories</h3>
            <ul className="space-y-2.5">
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`} className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <span>{cat.emoji}</span> {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutiques */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Boutiques</h3>
            <ul className="space-y-2.5">
              {[
                { name: 'Jumia Maroc', url: 'https://www.jumia.ma' },
                { name: 'Marjane', url: 'https://www.marjane.ma' },
                { name: 'Electroplanet', url: 'https://www.electroplanet.ma' },
                { name: 'Avito', url: 'https://www.avito.ma' },
                { name: 'Hmall', url: 'https://www.hmall.ma' },
                { name: 'Fnac Maroc', url: 'https://www.fnac.ma' },
              ].map(store => (
                <li key={store.name}>
                  <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    {store.name} <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">Liens utiles</h3>
            <ul className="space-y-2.5">
              <li><Link to="/deals" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Deals du Jour</Link></li>
              <li><Link to="/compare" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Comparer des produits</Link></li>
              <li><Link to="/wishlist" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Ma Wishlist</Link></li>
              <li><Link to="/alerts" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Alertes Prix</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; 2025 Maittic — Comparateur de prix au Maroc. Tous droits reserves.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">Les prix sont mis à jour regulierement et peuvent varier.</span>
          </div>
        </div>

        {/* Affiliate disclosure */}
        <p className="text-xs text-gray-600 mt-3 text-center">
          Certains liens sont des liens affilies. Maittic peut recevoir une commission si vous effectuez un achat via ces liens, sans cout supplementaire pour vous.
        </p>
      </div>
    </footer>
  );
}
