import { useState } from "react";

// ── Types (same as products.ts) ──────────────────────────────
type Store = "Jumia" | "Marjane" | "MediaMarkt" | "Electro Plus" | "Zayou";
type Category = "smartphones" | "laptops";

interface PriceEntry {
  store: Store;
  price: number;
  inStock: boolean;
  url: string;
  lastUpdated: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  image: string;
  specs: Record<string, string>;
  prices: PriceEntry[];
  rating: number;
  reviews: number;
  tags: string[];
}

// ── Initial data (copy from products.ts) ────────────────────
const initialProducts: Product[] = [
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro 256GB",
    brand: "Apple",
    category: "smartphones",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
    specs: { Écran: "6.1\" Super Retina XDR", Processeur: "Apple A17 Pro", RAM: "8 GB", Stockage: "256 GB" },
    prices: [
      { store: "Jumia", price: 13999, inStock: true, url: "#", lastUpdated: "2025-01-10" },
      { store: "Marjane", price: 14299, inStock: true, url: "#", lastUpdated: "2025-01-09" },
      { store: "Zayou", price: 13650, inStock: true, url: "#", lastUpdated: "2025-01-11" },
    ],
    rating: 4.8, reviews: 312, tags: ["5G", "Titanium"],
  },
  {
    id: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra 256GB",
    brand: "Samsung",
    category: "smartphones",
    image: "https://images.unsplash.com/photo-1707818871527-f0dfe3cc6190?w=400&q=80",
    specs: { Écran: "6.8\" Dynamic AMOLED", Processeur: "Snapdragon 8 Gen 3", RAM: "12 GB", Stockage: "256 GB" },
    prices: [
      { store: "Jumia", price: 15499, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "Zayou", price: 14999, inStock: true, url: "#", lastUpdated: "2025-01-11" },
    ],
    rating: 4.7, reviews: 489, tags: ["S Pen", "5G", "AI"],
  },
  {
    id: "macbook-air-m3",
    name: "MacBook Air M3 13\"",
    brand: "Apple",
    category: "laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
    specs: { Écran: "13.6\" Liquid Retina", Processeur: "Apple M3", RAM: "8 GB", Stockage: "256 GB SSD" },
    prices: [
      { store: "Jumia", price: 13999, inStock: true, url: "#", lastUpdated: "2025-01-11" },
      { store: "MediaMarkt", price: 13799, inStock: true, url: "#", lastUpdated: "2025-01-11" },
    ],
    rating: 4.9, reviews: 278, tags: ["M3", "Ultraléger"],
  },
];

const STORES: Store[] = ["Jumia", "Marjane", "MediaMarkt", "Electro Plus", "Zayou"];
const storeColors: Record<Store, string> = {
  Jumia: "#f97316", Marjane: "#16a34a", MediaMarkt: "#dc2626",
  "Electro Plus": "#2563eb", Zayou: "#7c3aed",
};

const today = new Date().toISOString().split("T")[0];

const emptyProduct = (): Omit<Product, "id"> => ({
  name: "", brand: "", category: "smartphones", image: "",
  specs: { Écran: "", Processeur: "", RAM: "", Stockage: "" },
  prices: [], rating: 4.0, reviews: 0, tags: [],
});

// ── Helpers ─────────────────────────────────────────────────
function slug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 40);
}

function exportTS(products: Product[]) {
  const lines = [
    `export type Store = "Jumia" | "Marjane" | "MediaMarkt" | "Electro Plus" | "Zayou";`,
    `export type Category = "smartphones" | "laptops";`,
    `export interface PriceEntry { store: Store; price: number; inStock: boolean; url: string; lastUpdated: string; }`,
    `export interface Product { id: string; name: string; brand: string; category: Category; image: string; specs: Record<string, string>; prices: PriceEntry[]; rating: number; reviews: number; tags: string[]; }`,
    ``,
    `export const products: Product[] = ${JSON.stringify(products, null, 2)};`,
    ``,
    `export function getBestPrice(p: Product) { const a = p.prices.filter(x => x.inStock); return (a.length ? a : p.prices).sort((a,b) => a.price-b.price)[0] || null; }`,
    `export function getPriceRange(p: Product) { const pr = p.prices.map(x => x.price); return { min: Math.min(...pr), max: Math.max(...pr) }; }`,
    `export function getSavings(p: Product) { const { min, max } = getPriceRange(p); return max - min; }`,
    `export const storeColors: Record<Store,string> = { Jumia:"#f97316", Marjane:"#16a34a", MediaMarkt:"#dc2626", "Electro Plus":"#2563eb", Zayou:"#7c3aed" };`,
  ];
  return lines.join("\n");
}

// ── Sub-components ───────────────────────────────────────────
function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span style={{ background: color + "22", color, border: `1px solid ${color}44` }}
      className="px-2 py-0.5 rounded-full text-[11px] font-bold">
      {children}
    </span>
  );
}

function PriceEditor({
  prices, onChange,
}: { prices: PriceEntry[]; onChange: (p: PriceEntry[]) => void }) {
  const addStore = (store: Store) => {
    if (prices.find((p) => p.store === store)) return;
    onChange([...prices, { store, price: 0, inStock: true, url: "#", lastUpdated: today }]);
  };
  const remove = (store: Store) => onChange(prices.filter((p) => p.store !== store));
  const update = (store: Store, field: keyof PriceEntry, value: any) =>
    onChange(prices.map((p) => (p.store === store ? { ...p, [field]: value } : p)));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-3">
        {STORES.filter((s) => !prices.find((p) => p.store === s)).map((s) => (
          <button key={s} onClick={() => addStore(s)}
            style={{ borderColor: storeColors[s] + "66", color: storeColors[s] }}
            className="px-3 py-1 rounded-lg border text-xs font-semibold hover:opacity-80 transition-opacity bg-[#0d1a2d]">
            + {s}
          </button>
        ))}
      </div>
      {prices.map((p) => (
        <div key={p.store} className="flex items-center gap-2 bg-[#0a1628] rounded-xl px-3 py-2 border border-[#1f2937]">
          <div className="w-2 h-2 rounded-full" style={{ background: storeColors[p.store] }} />
          <span className="text-white text-xs font-bold w-24 shrink-0">{p.store}</span>
          <input type="number" value={p.price}
            onChange={(e) => update(p.store, "price", Number(e.target.value))}
            className="bg-[#050c1a] border border-[#1f2937] rounded-lg px-2 py-1 text-white text-xs w-24 focus:outline-none focus:border-[#00c96f]/50" />
          <span className="text-[#6b7a8d] text-xs">DH</span>
          <label className="flex items-center gap-1 ml-auto cursor-pointer">
            <input type="checkbox" checked={p.inStock}
              onChange={(e) => update(p.store, "inStock", e.target.checked)}
              className="accent-[#00c96f]" />
            <span className="text-[#6b7a8d] text-xs">Stock</span>
          </label>
          <button onClick={() => remove(p.store)} className="text-red-400 hover:text-red-300 text-xs ml-1">✕</button>
        </div>
      ))}
    </div>
  );
}

function ProductForm({
  initial, onSave, onCancel,
}: { initial: Omit<Product, "id"> & { id?: string }; onSave: (p: Product) => void; onCancel: () => void }) {
  const [form, setForm] = useState(initial);
  const [tagInput, setTagInput] = useState(initial.tags.join(", "));
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const addSpec = () => {
    if (!specKey.trim()) return;
    setForm((f) => ({ ...f, specs: { ...f.specs, [specKey]: specVal } }));
    setSpecKey(""); setSpecVal("");
  };
  const removeSpec = (k: string) => {
    const s = { ...form.specs };
    delete s[k];
    setForm((f) => ({ ...f, specs: s }));
  };

  const handleSave = () => {
    if (!form.name.trim()) return alert("Nom requis !");
    const id = (initial as any).id || slug(form.name);
    onSave({ ...form, id, tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean) });
  };

  return (
    <div className="space-y-5">
      {/* Basic info */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Nom du produit", field: "name", full: true },
          { label: "Marque", field: "brand" },
          { label: "Image URL", field: "image" },
        ].map(({ label, field, full }) => (
          <div key={field} className={full ? "col-span-2" : ""}>
            <label className="text-[#6b7a8d] text-xs mb-1 block">{label}</label>
            <input value={(form as any)[field]} onChange={(e) => set(field, e.target.value)}
              className="w-full bg-[#0a1628] border border-[#1f2937] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c96f]/50" />
          </div>
        ))}
        <div>
          <label className="text-[#6b7a8d] text-xs mb-1 block">Catégorie</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)}
            className="w-full bg-[#0a1628] border border-[#1f2937] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c96f]/50">
            <option value="smartphones">📱 Smartphones</option>
            <option value="laptops">💻 Laptops</option>
          </select>
        </div>
        <div>
          <label className="text-[#6b7a8d] text-xs mb-1 block">Tags (séparés par virgule)</label>
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
            className="w-full bg-[#0a1628] border border-[#1f2937] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c96f]/50" />
        </div>
        <div>
          <label className="text-[#6b7a8d] text-xs mb-1 block">Note (0-5)</label>
          <input type="number" min={0} max={5} step={0.1} value={form.rating}
            onChange={(e) => set("rating", Number(e.target.value))}
            className="w-full bg-[#0a1628] border border-[#1f2937] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c96f]/50" />
        </div>
      </div>

      {/* Specs */}
      <div>
        <label className="text-[#6b7a8d] text-xs mb-2 block font-semibold uppercase tracking-wider">Spécifications</label>
        <div className="space-y-1.5 mb-2">
          {Object.entries(form.specs).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 bg-[#0a1628] rounded-lg px-3 py-1.5 border border-[#1f2937]">
              <span className="text-[#00c96f] text-xs font-bold w-24 shrink-0">{k}</span>
              <input value={v} onChange={(e) => setForm((f) => ({ ...f, specs: { ...f.specs, [k]: e.target.value } }))}
                className="flex-1 bg-transparent text-white text-xs focus:outline-none" />
              <button onClick={() => removeSpec(k)} className="text-red-400 text-xs">✕</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input placeholder="Clé (ex: RAM)" value={specKey} onChange={(e) => setSpecKey(e.target.value)}
            className="flex-1 bg-[#0a1628] border border-[#1f2937] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#00c96f]/50" />
          <input placeholder="Valeur (ex: 8 GB)" value={specVal} onChange={(e) => setSpecVal(e.target.value)}
            className="flex-1 bg-[#0a1628] border border-[#1f2937] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#00c96f]/50" />
          <button onClick={addSpec}
            className="bg-[#00c96f]/20 hover:bg-[#00c96f]/30 text-[#00c96f] border border-[#00c96f]/30 rounded-lg px-3 py-1.5 text-xs font-bold transition-all">
            + Ajouter
          </button>
        </div>
      </div>

      {/* Prices */}
      <div>
        <label className="text-[#6b7a8d] text-xs mb-2 block font-semibold uppercase tracking-wider">Prix par boutique</label>
        <PriceEditor prices={form.prices} onChange={(p) => set("prices", p)} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button onClick={handleSave}
          className="flex-1 bg-[#00c96f] hover:bg-[#00b560] text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-[#00c96f]/20">
          💾 Enregistrer
        </button>
        <button onClick={onCancel}
          className="px-5 bg-[#0d1a2d] hover:bg-[#1f2937] text-[#6b7a8d] font-semibold py-2.5 rounded-xl text-sm transition-all border border-[#1f2937]">
          Annuler
        </button>
      </div>
    </div>
  );
}

// ── Main Admin Panel ─────────────────────────────────────────
export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [view, setView] = useState<"list" | "add" | "edit">("list");
  const [editing, setEditing] = useState<Product | null>(null);
  const [filter, setFilter] = useState<"all" | Category>("all");
  const [copied, setCopied] = useState(false);

  const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);

  const saveProduct = (p: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id);
      return idx >= 0 ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p];
    });
    setView("list");
    setEditing(null);
  };

  const deleteProduct = (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(exportTS(products));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadCode = () => {
    const blob = new Blob([exportTS(products)], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products.ts";
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#050c1a] font-[Inter,sans-serif] text-white">
      {/* Header */}
      <div className="border-b border-[#1f2937] bg-[#050c1a]/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="w-9 h-9 bg-[#00c96f] rounded-xl flex items-center justify-center text-lg">⚙️</div>
          <div>
            <h1 className="text-white font-black text-lg leading-none">MaitTic Admin</h1>
            <p className="text-[#6b7a8d] text-xs">Gestion des produits</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[#6b7a8d] text-xs">{products.length} produits</span>
            <button onClick={copyCode}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${copied ? "bg-[#00c96f]/20 text-[#00c96f] border-[#00c96f]/40" : "bg-[#0d1a2d] text-[#6b7a8d] border-[#1f2937] hover:border-[#00c96f]/30"}`}>
              {copied ? "✅ Copié!" : "📋 Copier code"}
            </button>
            <button onClick={downloadCode}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00c96f] hover:bg-[#00b560] text-white transition-all">
              ⬇️ products.ts
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* List View */}
        {view === "list" && (
          <>
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex bg-[#0d1a2d] border border-[#1f2937] rounded-xl p-1 gap-1">
                {(["all", "smartphones", "laptops"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-[#00c96f] text-white" : "text-[#6b7a8d] hover:text-white"}`}>
                    {f === "all" ? "Tout" : f === "smartphones" ? "📱 Smartphones" : "💻 Laptops"}
                  </button>
                ))}
              </div>
              <button onClick={() => { setEditing(null); setView("add"); }}
                className="ml-auto bg-[#00c96f] hover:bg-[#00b560] text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-[#00c96f]/20">
                + Nouveau produit
              </button>
            </div>

            {/* Product list */}
            <div className="space-y-3">
              {filtered.map((p) => {
                const bestPrice = p.prices.filter(x => x.inStock).sort((a, b) => a.price - b.price)[0] || p.prices[0];
                return (
                  <div key={p.id} className="bg-[#0d1a2d] border border-[#1f2937] rounded-2xl p-4 flex items-center gap-4 hover:border-[#00c96f]/20 transition-all">
                    <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover bg-[#050c1a]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-bold text-sm truncate">{p.name}</p>
                        <Badge color={p.category === "smartphones" ? "#00c96f" : "#2563eb"}>
                          {p.category === "smartphones" ? "📱" : "💻"}
                        </Badge>
                      </div>
                      <p className="text-[#6b7a8d] text-xs mb-1.5">{p.brand} · ⭐ {p.rating}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.prices.map((pr) => (
                          <span key={pr.store} style={{ color: storeColors[pr.store] }}
                            className="text-[10px] font-bold">
                            {pr.store}: {pr.price.toLocaleString("fr-MA")} DH{!pr.inStock ? " ⚠️" : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {bestPrice && (
                        <p className="text-[#00c96f] font-black text-base">{bestPrice.price.toLocaleString("fr-MA")} DH</p>
                      )}
                      <p className="text-[#4b5563] text-[10px]">{p.prices.length} boutiques</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button onClick={() => { setEditing(p); setView("edit"); }}
                        className="bg-[#1f2937] hover:bg-[#00c96f]/20 text-[#6b7a8d] hover:text-[#00c96f] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                        ✏️ Modifier
                      </button>
                      <button onClick={() => deleteProduct(p.id)}
                        className="bg-[#1f2937] hover:bg-red-500/20 text-[#6b7a8d] hover:text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-16 text-[#4b5563]">
                  <p className="text-4xl mb-3">📦</p>
                  <p className="font-semibold">Aucun produit</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Add / Edit View */}
        {(view === "add" || view === "edit") && (
          <div>
            <button onClick={() => { setView("list"); setEditing(null); }}
              className="flex items-center gap-2 text-[#6b7a8d] hover:text-white text-sm mb-5 transition-colors">
              ← Retour à la liste
            </button>
            <div className="bg-[#0d1a2d] border border-[#1f2937] rounded-2xl p-6">
              <h2 className="text-white font-black text-lg mb-5">
                {view === "add" ? "➕ Nouveau produit" : `✏️ Modifier: ${editing?.name}`}
              </h2>
              <ProductForm
                initial={editing || emptyProduct()}
                onSave={saveProduct}
                onCancel={() => { setView("list"); setEditing(null); }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer tip */}
      {view === "list" && (
        <div className="max-w-5xl mx-auto px-4 pb-8">
          <div className="bg-[#071a0f] border border-[#1e3a2f] rounded-2xl px-5 py-4 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-[#00c96f] text-xs font-bold mb-1">Comment utiliser ?</p>
              <p className="text-[#6b7a8d] text-xs leading-relaxed">
                Ajoute ou modifie tes produits ici, puis clique sur <strong className="text-white">⬇️ products.ts</strong> pour télécharger le fichier.
                Remplace ensuite <code className="bg-[#0d1a2d] px-1 rounded text-[#00c96f]">src/data/products.ts</code> dans ton projet et fais un <code className="bg-[#0d1a2d] px-1 rounded text-[#00c96f]">git push</code> — Vercel va mettre à jour automatiquement!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
