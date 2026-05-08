import { Store, storeColors } from "../data/products";

export type SortOption = "price-asc" | "price-desc" | "rating" | "savings";

interface FiltersProps {
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
  selectedStore: Store | "all";
  onStoreChange: (s: Store | "all") => void;
  maxPrice: number;
  onMaxPriceChange: (v: number) => void;
  priceLimit: number;
  resultCount: number;
}

const stores: Array<Store | "all"> = ["all", "Jumia", "Marjane", "MediaMarkt", "Electro Plus", "Zayou"];

export default function Filters({
  sortBy,
  onSortChange,
  selectedStore,
  onStoreChange,
  maxPrice,
  onMaxPriceChange,
  priceLimit,
  resultCount,
}: FiltersProps) {
  return (
    <div className="bg-[#0a0f1e] border-b border-[#1f2937] sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Result count */}
          <div className="text-[#6b7a8d] text-sm mr-2">
            <span className="text-white font-semibold">{resultCount}</span> produit{resultCount !== 1 ? "s" : ""}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-5 bg-[#1f2937]" />

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-[#6b7a8d] text-xs font-medium whitespace-nowrap">Trier par :</label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-[#111827] border border-[#1f2937] text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#00c96f]/50 cursor-pointer"
            >
              <option value="price-asc">Prix : croissant</option>
              <option value="price-desc">Prix : décroissant</option>
              <option value="rating">Mieux notés</option>
              <option value="savings">Plus d'économies</option>
            </select>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-5 bg-[#1f2937]" />

          {/* Store Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-[#6b7a8d] text-xs font-medium whitespace-nowrap">Boutique :</label>
            <div className="flex gap-1.5 flex-wrap">
              {stores.map((store) => (
                <button
                  key={store}
                  onClick={() => onStoreChange(store)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                    selectedStore === store
                      ? "border-[#00c96f] bg-[#00c96f]/15 text-[#00c96f]"
                      : "border-[#1f2937] bg-[#111827] text-[#6b7a8d] hover:border-[#374151] hover:text-white"
                  }`}
                >
                  {store !== "all" && (
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: storeColors[store as Store] }}
                    />
                  )}
                  {store === "all" ? "Toutes" : store}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-5 bg-[#1f2937]" />

          {/* Price range */}
          <div className="flex items-center gap-3">
            <label className="text-[#6b7a8d] text-xs font-medium whitespace-nowrap">
              Max : <span className="text-white font-bold">{maxPrice.toLocaleString("fr-MA")} DH</span>
            </label>
            <input
              type="range"
              min={1000}
              max={priceLimit}
              step={500}
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(Number(e.target.value))}
              className="w-28 accent-[#00c96f] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
