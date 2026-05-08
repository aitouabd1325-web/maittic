export default function Footer() {
  return (
    <footer className="bg-[#050c1a] border-t border-[#1f2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00c96f] to-[#00a855] flex items-center justify-center shadow-lg shadow-[#00c96f]/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <span className="text-white font-black text-2xl">Mait<span className="text-[#00c96f]">Tic</span></span>
                <p className="text-[#6b7a8d] text-xs uppercase tracking-widest">Comparateur de Prix Maroc 🇲🇦</p>
              </div>
            </div>
            <p className="text-[#6b7a8d] text-sm leading-relaxed max-w-sm">
              Le premier comparateur de prix dédié aux smartphones et laptops au Maroc. Trouvez le meilleur deal sur Jumia, Marjane, MediaMarkt et plus encore.
            </p>
            <div className="flex gap-3 mt-5">
              {["Twitter / X", "GitHub", "LinkedIn"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="bg-[#0d1a2d] border border-[#1f2937] hover:border-[#00c96f]/40 text-[#6b7a8d] hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-white text-sm font-bold mb-4">Catégories</p>
            <div className="space-y-2.5">
              {["Smartphones", "Laptops", "Tablettes (bientôt)", "Accessoires (bientôt)", "Meilleures offres"].map((l) => (
                <a key={l} href="#" className="block text-[#6b7a8d] hover:text-[#00c96f] text-sm transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white text-sm font-bold mb-4">Boutiques</p>
            <div className="space-y-2.5">
              {["Jumia.ma", "Marjane.ma", "MediaMarkt Maroc", "Electro Plus", "Zayou"].map((l) => (
                <a key={l} href="#" className="block text-[#6b7a8d] hover:text-[#00c96f] text-sm transition-colors">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1f2937] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#4b5563] text-xs">
            © 2025 MaitTic. Projet open source · Scraping éthique · Données à titre indicatif.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[#4b5563] text-xs">Construit avec</span>
            {["Python", "React", "SQLite", "BeautifulSoup"].map((t) => (
              <span key={t} className="text-[#6b7a8d] text-xs bg-[#0d1a2d] border border-[#1f2937] px-2 py-0.5 rounded-md">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
