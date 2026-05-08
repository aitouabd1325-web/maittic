interface HeroProps {
  onCategorySelect: (cat: "smartphones" | "laptops" | "all") => void;
  activeCategory: string;
  totalProducts: number;
}

const stats = [
  { label: "Produits comparés", value: "500+" },
  { label: "Boutiques partenaires", value: "12" },
  { label: "Mises à jour / jour", value: "3x" },
  { label: "Économies moyennes", value: "18%" },
];

export default function Hero({ onCategorySelect, activeCategory, totalProducts }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #050c1a 0%, #0a1628 40%, #071a0f 100%)",
      }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#00c96f 1px, transparent 1px), linear-gradient(90deg, #00c96f 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00c96f]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#0057ff]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#00c96f]/10 border border-[#00c96f]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00c96f] animate-pulse" />
            <span className="text-[#00c96f] text-sm font-medium">Mis à jour aujourd'hui · {totalProducts} produits en ligne</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-4">
            Comparez les meilleurs prix<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c96f] to-[#00e5a0]">
              Smartphones & Laptops
            </span>
            <br />
            <span className="text-[#9ca3af] font-normal text-3xl sm:text-4xl">au Maroc 🇲🇦</span>
          </h1>

          <p className="text-[#6b7a8d] text-lg max-w-2xl mx-auto mb-10">
            Mait Tic collecte les prix en temps réel depuis <strong className="text-[#9ca3af]">Jumia, Marjane, MediaMarkt, Electro Plus</strong> et d'autres boutiques marocaines grâce au <strong className="text-[#00c96f]">web scraping automatisé</strong>.
          </p>

          {/* Category Tabs */}
          <div className="inline-flex items-center gap-2 bg-[#111827]/80 border border-[#1f2937] rounded-2xl p-1.5 mb-12">
            {(["all", "smartphones", "laptops"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? "bg-[#00c96f] text-white shadow-lg shadow-[#00c96f]/30"
                    : "text-[#6b7a8d] hover:text-white hover:bg-white/5"
                }`}
              >
                {cat === "all" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                )}
                {cat === "smartphones" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
                {cat === "laptops" && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {cat === "all" ? "Tout" : cat === "smartphones" ? "Smartphones" : "Laptops"}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-[#0d1a2d]/60 border border-[#1e3a2f]/50 rounded-2xl px-6 py-4 text-center backdrop-blur-sm"
            >
              <p className="text-2xl font-black text-[#00c96f]">{s.value}</p>
              <p className="text-[#6b7a8d] text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
