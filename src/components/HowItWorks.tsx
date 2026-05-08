const steps = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: "#3b82f6",
    title: "Web Scraping Python",
    subtitle: "Collecte automatisée",
    desc: "Nos scripts Python + BeautifulSoup scrapent Jumia, Marjane, MediaMarkt et d'autres boutiques 3 fois par jour pour récupérer les prix en temps réel.",
    tech: ["Python 3.11", "BeautifulSoup4", "Requests", "Selenium"],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    color: "#f59e0b",
    title: "Base de données SQLite",
    subtitle: "Stockage structuré",
    desc: "Chaque entrée de prix est horodatée et stockée dans une base SQLite légère, permettant le suivi de l'historique des prix sur plusieurs semaines.",
    tech: ["SQLite3", "SQLAlchemy", "Flask REST API", "JSON Export"],
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: "#00c96f",
    title: "Frontend React",
    subtitle: "Interface moderne",
    desc: "Le frontend React consomme l'API REST Flask pour afficher les comparaisons de prix, filtrer par boutique, et déclencher des alertes email en cas de baisse.",
    tech: ["React 18", "Tailwind CSS", "Vite", "TypeScript"],
  },
];

const scraperCode = `# scraper/jumia_scraper.py
import requests
from bs4 import BeautifulSoup
import sqlite3, datetime

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; MaitTic/1.0)"}

def scrape_jumia_phones():
    url = "https://www.jumia.ma/smartphones/"
    res = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(res.text, "html.parser")
    
    products = []
    for item in soup.select("article.prd"):
        name  = item.select_one("h3.name").text.strip()
        price = item.select_one("div.prc").text.strip()
        link  = "https://jumia.ma" + item.select_one("a")["href"]
        products.append({"name": name, "price": price, 
                          "store": "Jumia", "url": link,
                          "scraped_at": datetime.datetime.now()})
    return products

def save_to_db(products):
    conn = sqlite3.connect("maittic.db")
    cur  = conn.cursor()
    cur.executemany(
        "INSERT INTO prices VALUES (?,?,?,?,?)",
        [(p["name"], p["price"], p["store"], 
          p["url"], p["scraped_at"]) for p in products]
    )
    conn.commit()`;

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#050c1a] py-20 border-t border-[#1f2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#00c96f] text-sm font-bold uppercase tracking-widest">Architecture</span>
          <h2 className="text-white text-3xl sm:text-4xl font-black mt-2 mb-4">Comment fonctionne Mait Tic ?</h2>
          <p className="text-[#6b7a8d] text-base max-w-2xl mx-auto">
            Une pipeline complète de collecte, stockage et affichage de données de prix pour le marché marocain du high-tech.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="relative bg-[#0d1a2d] border border-[#1f2937] rounded-2xl p-6 hover:border-[#00c96f]/30 transition-all group">
              {/* Number */}
              <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-[#0d1a2d] border-2 flex items-center justify-center text-xs font-black text-white" style={{ borderColor: step.color }}>
                {i + 1}
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${step.color}20`, color: step.color, border: `1px solid ${step.color}40` }}
              >
                {step.icon}
              </div>

              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: step.color }}>{step.subtitle}</p>
              <h3 className="text-white text-lg font-bold mb-3">{step.title}</h3>
              <p className="text-[#6b7a8d] text-sm leading-relaxed mb-4">{step.desc}</p>

              {/* Tech badges */}
              <div className="flex flex-wrap gap-1.5">
                {step.tech.map((t) => (
                  <span key={t} className="bg-[#111827] border border-[#1f2937] text-[#9ca3af] text-[10px] font-medium px-2 py-1 rounded-lg">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Code snippet */}
        <div id="scraper-info" className="bg-[#0d1a2d] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1f2937] bg-[#111827]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-[#6b7a8d] text-xs font-mono">scraper/jumia_scraper.py</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] bg-[#00c96f]/15 text-[#00c96f] border border-[#00c96f]/30 px-2 py-0.5 rounded-full font-semibold">Python</span>
              <span className="text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-semibold">BeautifulSoup4</span>
            </div>
          </div>
          <pre className="p-6 text-sm text-[#9ca3af] font-mono leading-relaxed overflow-x-auto">
            <code
              dangerouslySetInnerHTML={{
                __html: scraperCode
                  .replace(/# (.+)/g, '<span style="color:#6b7a8d"># $1</span>')
                  .replace(/\b(import|from|def|return|for|in|if)\b/g, '<span style="color:#c084fc">$1</span>')
                  .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color:#86efac">$1</span>')
                  .replace(/\b(requests|BeautifulSoup|sqlite3|datetime)\b/g, '<span style="color:#60a5fa">$1</span>'),
              }}
            />
          </pre>
        </div>

        {/* DB Schema */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { table: "products", cols: ["id", "name", "brand", "category", "image_url", "specs_json"], color: "#3b82f6" },
            { table: "prices", cols: ["id", "product_id", "store", "price_mad", "in_stock", "scraped_at", "url"], color: "#00c96f" },
            { table: "alerts", cols: ["id", "product_id", "user_email", "target_price", "notified_at"], color: "#f59e0b" },
          ].map(({ table, cols, color }) => (
            <div key={table} className="bg-[#0d1a2d] border border-[#1f2937] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <p className="text-white text-sm font-bold font-mono">{table}</p>
                <span className="text-[10px] text-[#6b7a8d] border border-[#1f2937] rounded px-1.5 py-0.5 ml-auto">SQLite</span>
              </div>
              <div className="space-y-1">
                {cols.map((col) => (
                  <div key={col} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#374151]" />
                    <span className="text-[#6b7a8d] text-xs font-mono">{col}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
