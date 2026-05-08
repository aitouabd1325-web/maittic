import { useState, useMemo } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Filters, { SortOption } from "./components/Filters";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import { products, Product, Store, getBestPrice, getSavings } from "./data/products";
import AdminPanel from "./components/AdminPanel";
const PRICE_LIMIT = 25000;

export default function App() {if (window.location.pathname === "/admin") {
  return <AdminPanel />;
}
  const [category, setCategory] = useState<"all" | "smartphones" | "laptops">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [selectedStore, setSelectedStore] = useState<Store | "all">("all");
  const [maxPrice, setMaxPrice] = useState(PRICE_LIMIT);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let list = [...products];

    // Category filter
    if (category !== "all") list = list.filter((p) => p.category === category);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          Object.values(p.specs).some((v) => v.toLowerCase().includes(q))
      );
    }

    // Store filter
    if (selectedStore !== "all") {
      list = list.filter((p) =>
        p.prices.some((pr) => pr.store === selectedStore && pr.inStock)
      );
    }

    // Max price filter
    list = list.filter((p) => {
      const best = getBestPrice(p);
      return best ? best.price <= maxPrice : false;
    });

    // Sort
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => (getBestPrice(a)?.price ?? 0) - (getBestPrice(b)?.price ?? 0));
        break;
      case "price-desc":
        list.sort((a, b) => (getBestPrice(b)?.price ?? 0) - (getBestPrice(a)?.price ?? 0));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "savings":
        list.sort((a, b) => getSavings(b) - getSavings(a));
        break;
    }

    return list;
  }, [category, searchQuery, sortBy, selectedStore, maxPrice]);

  return (
    <div className="min-h-screen bg-[#050c1a] font-[Inter,sans-serif]">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} />

      <Hero
        onCategorySelect={setCategory}
        activeCategory={category}
        totalProducts={products.length}
      />

      <Filters
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedStore={selectedStore}
        onStoreChange={setSelectedStore}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        priceLimit={PRICE_LIMIT}
        resultCount={filtered.length}
      />

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-[#0d1a2d] border border-[#1f2937] flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-[#374151]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-white text-lg font-bold mb-2">Aucun produit trouvé</h3>
            <p className="text-[#6b7a8d] text-sm">Essayez d'ajuster vos filtres ou votre recherche.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setCategory("all");
                setSelectedStore("all");
                setMaxPrice(PRICE_LIMIT);
              }}
              className="mt-5 bg-[#00c96f] hover:bg-[#00b560] text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            {/* Deal of the day banner */}
            {sortBy === "savings" && filtered[0] && (
              <div className="mb-6 bg-gradient-to-r from-[#00c96f]/15 via-[#00c96f]/5 to-transparent border border-[#00c96f]/25 rounded-2xl px-6 py-4 flex items-center gap-4">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-[#00c96f] text-xs font-bold uppercase tracking-widest">Meilleure économie du jour</p>
                  <p className="text-white font-bold">
                    {filtered[0].name} — Économisez jusqu'à{" "}
                    <span className="text-[#00c96f]">{getSavings(filtered[0]).toLocaleString("fr-MA")} DH</span>{" "}
                    selon la boutique
                  </p>
                </div>
              </div>
            )}

            {/* Category section headers */}
            {category === "all" && (
              <div className="space-y-10">
                {(["smartphones", "laptops"] as const).map((cat) => {
                  const catProducts = filtered.filter((p) => p.category === cat);
                  if (!catProducts.length) return null;
                  return (
                    <div key={cat}>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-xl bg-[#00c96f]/15 border border-[#00c96f]/30 flex items-center justify-center">
                          {cat === "smartphones" ? (
                            <svg className="w-4 h-4 text-[#00c96f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-[#00c96f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <h2 className="text-white text-xl font-black capitalize">
                          {cat === "smartphones" ? "Smartphones" : "Laptops"}
                        </h2>
                        <span className="text-[#6b7a8d] text-sm ml-1">({catProducts.length} produits)</span>
                        <div className="flex-1 h-px bg-[#1f2937]" />
                        <button
                          onClick={() => setCategory(cat)}
                          className="text-[#00c96f] hover:text-white text-xs font-semibold transition-colors"
                        >
                          Voir tout →
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {catProducts.map((p) => (
                          <ProductCard key={p.id} product={p} onClick={setSelectedProduct} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {category !== "all" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} onClick={setSelectedProduct} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Price Tracker CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #071a0f 0%, #0d2a1a 50%, #071a0f 100%)",
            border: "1px solid #1e3a2f",
          }}
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-[#00c96f]/10 rounded-full blur-[80px]" />
          <div className="relative px-8 sm:px-12 py-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="text-[#00c96f] text-sm font-bold uppercase tracking-widest mb-2">🚨 Alertes Prix</p>
              <h3 className="text-white text-2xl sm:text-3xl font-black mb-3">
                Ne ratez plus jamais<br />une bonne affaire !
              </h3>
              <p className="text-[#6b7a8d] text-sm leading-relaxed max-w-md">
                Entrez votre email et recevez une notification instantanée dès qu'un prix baisse sur votre produit favori. Powered by notre scraper Python.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 md:w-64 bg-[#0d1a2d] border border-[#1f2937] rounded-xl px-4 py-3 text-white text-sm placeholder-[#374151] focus:outline-none focus:border-[#00c96f]/50"
              />
              <button className="bg-[#00c96f] hover:bg-[#00b560] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#00c96f]/30 whitespace-nowrap">
                S'abonner gratuitement
              </button>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Stores Section */}
      <section className="bg-[#050c1a] border-t border-[#1f2937] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[#4b5563] text-xs uppercase tracking-widest mb-8 font-semibold">Boutiques suivies en temps réel</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { name: "Jumia", color: "#f97316", desc: "Leader e-commerce" },
              { name: "Marjane", color: "#16a34a", desc: "Grande distribution" },
              { name: "MediaMarkt", color: "#dc2626", desc: "Spécialiste Tech" },
              { name: "Electro Plus", color: "#2563eb", desc: "Électronique" },
              { name: "Zayou", color: "#7c3aed", desc: "Marketplace" },
            ].map((store) => (
              <div
                key={store.name}
                className="flex items-center gap-3 bg-[#0d1a2d] border border-[#1f2937] rounded-2xl px-5 py-3 hover:border-[#00c96f]/30 transition-all group cursor-default"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                  style={{ backgroundColor: store.color }}
                >
                  {store.name[0]}
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{store.name}</p>
                  <p className="text-[#4b5563] text-[10px]">{store.desc}</p>
                </div>
                <div className="ml-2 w-1.5 h-1.5 rounded-full bg-[#00c96f] animate-pulse" title="En ligne" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Product Detail Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
