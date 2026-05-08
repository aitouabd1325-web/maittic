import { useState } from "react";

interface NavbarProps {
  onSearch: (q: string) => void;
  searchQuery: string;
}

export default function Navbar({ onSearch, searchQuery }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0f1e]/95 backdrop-blur-md border-b border-[#1e3a2f]/60 shadow-lg shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00c96f] to-[#00a855] flex items-center justify-center shadow-lg shadow-[#00c96f]/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-xl tracking-tight">Mait<span className="text-[#00c96f]">Tic</span></span>
              <p className="text-[#6b7a8d] text-[10px] leading-none -mt-0.5 tracking-widest uppercase">Maroc</p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher iPhone, Samsung, MacBook..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#1f2937] rounded-xl text-white placeholder-[#4b5563] text-sm focus:outline-none focus:border-[#00c96f]/50 focus:ring-1 focus:ring-[#00c96f]/30 transition-all"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            <a href="#how-it-works" className="text-[#9ca3af] hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-all">Comment ça marche</a>
            <a href="#scraper-info" className="text-[#9ca3af] hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-all">API & Scraping</a>
            <button className="ml-2 bg-[#00c96f] hover:bg-[#00b560] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-[#00c96f]/20 hover:shadow-[#00c96f]/40">
              Alertes Prix
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-[#9ca3af] hover:text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Search + Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-[#1f2937] space-y-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4b5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-[#1f2937] rounded-xl text-white placeholder-[#4b5563] text-sm focus:outline-none focus:border-[#00c96f]/50"
              />
            </div>
            <div className="flex flex-col gap-1">
              <a href="#how-it-works" className="text-[#9ca3af] hover:text-white text-sm px-3 py-2 rounded-lg">Comment ça marche</a>
              <a href="#scraper-info" className="text-[#9ca3af] hover:text-white text-sm px-3 py-2 rounded-lg">API & Scraping</a>
              <button className="mt-2 bg-[#00c96f] text-white text-sm font-semibold px-4 py-2 rounded-xl w-full">Alertes Prix</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
