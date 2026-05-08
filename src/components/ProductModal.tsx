import { useEffect } from "react";
import { Product, getBestPrice, storeColors, Store } from "../data/products";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

function PriceBar({ price, max }: { price: number; max: number }) {
  const pct = Math.round((price / max) * 100);
  return (
    <div className="flex-1 h-1.5 bg-[#1f2937] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          background: pct < 75 ? "#00c96f" : pct < 90 ? "#f59e0b" : "#ef4444",
        }}
      />
    </div>
  );
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!product) return null;

  const bestPrice = getBestPrice(product);
  const maxPrice = Math.max(...product.prices.map((p) => p.price));
  const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0d1a2d] border border-[#1f2937] rounded-3xl shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-3xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/800x300/111827/374151?text=${encodeURIComponent(product.name)}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a2d] via-[#0d1a2d]/50 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-black/50 hover:bg-black/80 border border-white/10 rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <p className="text-[#00c96f] text-xs font-bold uppercase tracking-widest mb-1">{product.brand}</p>
            <h2 className="text-white text-xl sm:text-2xl font-black leading-tight">{product.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating) ? "text-amber-400" : "text-[#374151]"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-[#9ca3af] text-xs ml-1">{product.rating}/5 · {product.reviews} avis</span>
              </div>
              <div className="flex gap-1">
                {product.tags.map((t) => (
                  <span key={t} className="bg-white/10 text-white/70 text-[10px] px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Best Price Banner */}
          {bestPrice && (
            <div className="bg-gradient-to-r from-[#00c96f]/15 to-[#00e5a0]/5 border border-[#00c96f]/30 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-[#00c96f] text-xs font-bold uppercase tracking-widest mb-1">🏆 Meilleur prix disponible</p>
                <p className="text-white text-3xl font-black">{bestPrice.price.toLocaleString("fr-MA")} <span className="text-[#6b7a8d] text-base font-normal">DH</span></p>
                <p className="text-[#6b7a8d] text-xs mt-1">chez <span className="text-white font-semibold">{bestPrice.store}</span> · Mis à jour le {bestPrice.lastUpdated}</p>
              </div>
              <a
                href={bestPrice.url}
                className="shrink-0 bg-[#00c96f] hover:bg-[#00b560] text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#00c96f]/30 flex items-center gap-2"
              >
                Acheter
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Price Comparison Table */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00c96f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Comparaison des prix par boutique
            </h3>
            <div className="space-y-3">
              {sortedPrices.map((p, i) => (
                <div
                  key={p.store}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    i === 0 && p.inStock
                      ? "bg-[#00c96f]/10 border-[#00c96f]/30"
                      : "bg-[#111827] border-[#1f2937]"
                  }`}
                >
                  {/* Rank */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      i === 0 && p.inStock ? "bg-[#00c96f] text-white" : "bg-[#1f2937] text-[#6b7a8d]"
                    }`}
                  >
                    {i + 1}
                  </div>

                  {/* Store */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: storeColors[p.store as Store] }}
                  >
                    {p.store[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-sm font-semibold truncate">{p.store}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.inStock ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"}`}>
                        {p.inStock ? "En stock" : "Rupture"}
                      </span>
                      {i === 0 && p.inStock && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00c96f] text-white font-bold">Meilleur</span>
                      )}
                    </div>
                    <PriceBar price={p.price} max={maxPrice} />
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-base font-black ${i === 0 && p.inStock ? "text-[#00c96f]" : "text-white"}`}>
                      {p.price.toLocaleString("fr-MA")}
                    </p>
                    <p className="text-[#6b7a8d] text-xs">DH</p>
                  </div>
                  <a
                    href={p.url}
                    className={`shrink-0 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                      p.inStock
                        ? "bg-[#1f2937] hover:bg-[#2d3748] text-[#9ca3af] hover:text-white"
                        : "bg-[#111827] text-[#374151] cursor-not-allowed"
                    }`}
                    onClick={(e) => !p.inStock && e.preventDefault()}
                  >
                    {p.inStock ? "Voir" : "Indispo"}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#00c96f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
              Fiche technique
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="flex items-start gap-3 bg-[#111827] rounded-xl p-3">
                  <p className="text-[#6b7a8d] text-xs font-medium w-24 shrink-0 mt-0.5">{key}</p>
                  <p className="text-white text-xs font-semibold">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Alert CTA */}
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-bold mb-1 flex items-center gap-2">
                <span>🔔</span> Alerte baisse de prix
              </p>
              <p className="text-[#6b7a8d] text-sm">Recevez une notification quand le prix baisse.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 sm:w-48 bg-[#0d1a2d] border border-[#1f2937] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#374151] focus:outline-none focus:border-[#00c96f]/50"
              />
              <button className="bg-[#00c96f] hover:bg-[#00b560] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap">
                M'alerter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
