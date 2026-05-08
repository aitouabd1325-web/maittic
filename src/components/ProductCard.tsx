import { Product, getBestPrice, getSavings, storeColors, Store } from "../data/products";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-amber-400" : "text-[#374151]"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const bestPrice = getBestPrice(product);
  const savings = getSavings(product);

  return (
    <div
      onClick={() => onClick(product)}
      className="group relative bg-[#0d1a2d] border border-[#1f2937] hover:border-[#00c96f]/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-[#00c96f]/10 hover:-translate-y-1"
    >
      {/* Savings Badge */}
      {savings > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-[#00c96f] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
          Économisez {savings.toLocaleString("fr-MA")} DH
        </div>
      )}

      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-[#111827] to-[#0d1a2d] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x300/111827/374151?text=${encodeURIComponent(product.brand)}`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a2d] via-transparent to-transparent" />
      </div>

      <div className="p-4">
        {/* Brand + Category */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#00c96f] text-xs font-semibold uppercase tracking-widest">{product.brand}</span>
          <span className="text-[#374151] text-xs capitalize">{product.category === "smartphones" ? "📱" : "💻"}</span>
        </div>

        {/* Name */}
        <h3 className="text-white font-semibold text-sm leading-snug mb-2 group-hover:text-[#00c96f] transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-[#1f2937] text-[#6b7a8d] text-[10px] px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-[#6b7a8d] text-xs">{product.rating} ({product.reviews})</span>
        </div>

        {/* Price + Stores */}
        <div className="border-t border-[#1f2937] pt-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[#6b7a8d] text-xs mb-0.5">Meilleur prix</p>
              <p className="text-[#00c96f] text-xl font-black">
                {bestPrice?.price.toLocaleString("fr-MA")}
                <span className="text-sm font-normal text-[#6b7a8d] ml-1">DH</span>
              </p>
              {!bestPrice?.inStock && (
                <p className="text-red-400 text-[10px] mt-0.5">Rupture chez ce vendeur</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-[#6b7a8d] text-[10px] mb-1">{product.prices.length} boutiques</p>
              <div className="flex -space-x-1">
                {product.prices.slice(0, 4).map((p) => (
                  <div
                    key={p.store}
                    className="w-5 h-5 rounded-full border-2 border-[#0d1a2d] flex items-center justify-center text-[7px] font-bold text-white"
                    style={{ backgroundColor: storeColors[p.store as Store] }}
                    title={p.store}
                  >
                    {p.store[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button className="mt-3 w-full bg-[#111827] hover:bg-[#00c96f]/10 border border-[#1f2937] hover:border-[#00c96f]/50 text-[#9ca3af] hover:text-[#00c96f] text-xs font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Comparer les prix
          </button>
        </div>
      </div>
    </div>
  );
}
