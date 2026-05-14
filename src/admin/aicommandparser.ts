import {
  addProduct,
  updateProductPrice,
  updateProduct,
  deleteProduct,
  addStore,
  deleteStore,
  addCategory,
  getStats,
  getProducts,
  getStores,
  getCategories,
  resetToDefaults,
} from "../store/dataStore";
import { ChatMessage } from "../types";

type CommandResult = Omit<ChatMessage, "id" | "timestamp" | "role">;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = "llama3-70b-8192";

const CATEGORY_ICONS: Record<string, string> = {
  laptops: "💻",
  smartphones: "📱",
  headphones: "🎧",
  tablets: "📲",
  cameras: "📷",
  gaming: "🎮",
  tvs: "📺",
  accessories: "🔌",
  wearables: "⌚",
  audio: "🔊",
};

const STORE_LOGOS: Record<string, string> = {
  techzone: "🖥️",
  megamart: "🛒",
  gadgethub: "📱",
  electroshop: "⚡",
  bestprice: "💰",
};

function pickEmoji(name: string, map: Record<string, string>, fallback: string): string {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return map[key] ?? fallback;
}

function fmt(n: number) {
  return `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;
}

// Parse AI response and execute the command
function executeAction(action: {
  type: string;
  name?: string;
  price?: number;
  store?: string;
  category?: string;
  field?: string;
  value?: string;
  query?: string;
  filter?: string;
  filterValue?: string;
  subType?: string;
}): CommandResult {
  switch (action.type) {
    case "add_product": {
      if (!action.name || !action.price || !action.store || !action.category) {
        return { type: "error", content: "❌ Informations insuffisantes pour ajouter le produit." };
      }
      const image = pickEmoji(action.category, CATEGORY_ICONS, "🏷️");
      const stores = getStores();
      const storeExists = stores.some((s) => s.name.toLowerCase() === action.store!.toLowerCase());
      const added = addProduct({
        name: action.name,
        price: action.price,
        store: action.store,
        category: action.category,
        image,
        featured: false,
      });
      let note = "";
      if (!storeExists) {
        addStore({ name: action.store, logo: pickEmoji(action.store, STORE_LOGOS, "🪦"), url: "", rating: 4.0 });
        note = `\n\n⚠️ Magasin **"${action.store}"** ajouté automatiquement.`;
      }
      return {
        type: "success",
        content: `✅ Produit ajouté!\n\n**${added.name}**\nPrix: ${fmt(added.price)}\nMagasin: ${added.store}\nCatégorie: ${added.category}${note}`,
      };
    }

    case "update_price": {
      if (!action.name || !action.price) {
        return { type: "error", content: "❌ Nom du produit ou prix manquant." };
      }
      const updated = updateProductPrice(action.name, action.price);
      if (!updated) return { type: "error", content: `❌ Produit **"${action.name}"** introuvable.` };
      return {
        type: "success",
        content: `✅ Prix mis à jour!\n\n**${updated.name}**\nAncien: ${fmt(updated.originalPrice ?? updated.price)}\nNouveau: ${fmt(updated.price)}`,
      };
    }

    case "update_product": {
      if (!action.name || !action.field || action.value === undefined) {
        return { type: "error", content: "❌ Informations manquantes pour la mise à jour." };
      }
      const changes: Record<string, string | boolean> = {};
      if (action.field === "featured") {
        changes.featured = action.value === "true";
      } else {
        changes[action.field] = action.value;
      }
      const updated = updateProduct(action.name, changes);
      if (!updated) return { type: "error", content: `❌ Produit **"${action.name}"** introuvable.` };
      return { type: "success", content: `✅ **${updated.name}** mis à jour! (${action.field}: ${action.value})` };
    }

    case "delete_product": {
      if (!action.name) return { type: "error", content: "❌ Nom du produit manquant." };
      const removed = deleteProduct(action.name);
      if (!removed) return { type: "error", content: `❌ Produit **"${action.name}"** introuvable.` };
      return { type: "success", content: `🗑️ Produit **${removed.name}** supprimé.` };
    }

    case "add_store": {
      if (!action.name) return { type: "error", content: "❌ Nom du magasin manquant." };
      const logo = pickEmoji(action.name, STORE_LOGOS, "🪦");
      const added = addStore({ name: action.name, logo, url: "", rating: 4.0 });
      return { type: "success", content: `✅ Magasin **${added.name}** ${added.logo} ajouté!` };
    }

    case "delete_store": {
      if (!action.name) return { type: "error", content: "❌ Nom du magasin manquant." };
      const removed = deleteStore(action.name);
      if (!removed) return { type: "error", content: `❌ Magasin **"${action.name}"** introuvable.` };
      return { type: "success", content: `🗑️ Magasin **${removed.name}** supprimé.` };
    }

    case "add_category": {
      if (!action.name) return { type: "error", content: "❌ Nom de catégorie manquant." };
      const icon = action.value || pickEmoji(action.name, CATEGORY_ICONS, "🏷️");
      const added = addCategory(action.name, icon);
      return { type: "success", content: `✅ Catégorie **${added.icon} ${added.name}** ajoutée!` };
    }

    case "list_products": {
      let products = getProducts();
      if (action.filter === "category" && action.filterValue) {
        products = products.filter((p) => p.category.toLowerCase().includes(action.filterValue!.toLowerCase()));
      }
      if (action.filter === "store" && action.filterValue) {
        products = products.filter((p) => p.store.toLowerCase().includes(action.filterValue!.toLowerCase()));
      }
      if (products.length === 0) return { type: "info", content: "Aucun produit trouvé." };
      const rows = products
        .map((p) => `• **${p.name}** — ${fmt(p.price)} | ${p.store} | ${p.category}`)
        .join("\n");
      return { type: "info", content: `**📦 Produits (${products.length})**\n\n${rows}` };
    }

    case "search_products": {
      if (!action.query) return { type: "error", content: "❌ Requête de recherche manquante." };
      const q = action.query.toLowerCase();
      const results = getProducts().filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.store.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
      if (results.length === 0) return { type: "info", content: `Aucun résultat pour **"${action.query}"**.` };
      const rows = results.map((p) => `• **${p.name}** — ${fmt(p.price)} | ${p.store}`).join("\n");
      return { type: "info", content: `**🔍 Résultats pour "${action.query}" (${results.length})**\n\n${rows}` };
    }

    case "list_stores": {
      const stores = getStores();
      const rows = stores.map((s) => `${s.logo} **${s.name}** — ${s.productCount} produits | ⭐ ${s.rating}`).join("\n");
      return { type: "info", content: `**🪦 Magasins (${stores.length})**\n\n${rows}` };
    }

    case "list_categories": {
      const cats = getCategories();
      const rows = cats.map((c) => `${c.icon} **${c.name}** — ${c.count} produits`).join("\n");
      return { type: "info", content: `**🗂️ Catégories (${cats.length})**\n\n${rows}` };
    }

    case "stats": {
      const stats = getStats();
      if (action.subType === "most_viewed") {
        const rows = stats.mostViewed
          .map((p, i) => `${i + 1}. **${p.name}** — ${p.views.toLocaleString()} vues`)
          .join("\n");
        return { type: "info", content: `**👁️ Produits les plus vus**\n\n${rows}` };
      }
      if (action.subType === "price_drops") {
        const rows = stats.recentPriceDrops
          .map((p) => {
            const drop = p.originalPrice
              ? (((p.originalPrice - p.price) / p.originalPrice) * 100).toFixed(0)
              : 0;
            return `• **${p.name}** — ${fmt(p.price)} (-${drop}%)`;
          })
          .join("\n");
        return { type: "info", content: `**📉 Baisses de prix**\n\n${rows}` };
      }
      return {
        type: "info",
        content: `**📊 Statistiques MaitTic**\n\n📦 Produits: **${stats.totalProducts}**\n🪦 Magasins: **${stats.totalStores}**\n🗂️ Catégories: **${stats.totalCategories}**\n\n🔥 Plus vu: ${stats.mostViewed[0]?.name ?? "N/A"}\n📉 Meilleure baisse: ${stats.recentPriceDrops[0]?.name ?? "N/A"}`,
      };
    }

    case "reset": {
      resetToDefaults();
      return { type: "success", content: "♻️ Données réinitialisées aux valeurs par défaut." };
    }

    case "help": {
      return {
        type: "info",
        content: `**🤖 Assistant Admin MaitTic**\n\nTu peux me parler naturellement en français, darija ou anglais!\n\n**Exemples:**\n• "Ajoute un iPhone 15 à 12000 MAD dans Jumia catégorie Smartphones"\n• "زيد منتج Samsung S24 بـ 9000 درهم فـ Marjane"\n• "Supprime le produit MacBook Pro"\n• "Montre les statistiques"\n• "Cherche Sony"\n• "Liste tous les produits"`,
      };
    }

    default:
      return {
        type: "error",
        content: `❓ Je n'ai pas compris. Essaie de reformuler ou tape **help** pour voir les exemples.`,
      };
  }
}

export async function parseCommandAI(input: string): Promise<CommandResult> {
  const products = getProducts().slice(0, 5).map((p) => p.name).join(", ");
  const stores = getStores().map((s) => s.name).join(", ");
  const categories = getCategories().map((c) => c.name).join(", ");

  const systemPrompt = `Tu es un assistant admin pour MaitTic, un site de comparaison de prix au Maroc.
Tu analyses les commandes en français, darija (arabe marocain) ou anglais et retournes UNIQUEMENT un JSON.

Données actuelles:
- Produits (exemples): ${products}
- Magasins: ${stores}  
- Catégories: ${categories}

Retourne UNIQUEMENT ce JSON sans aucun texte avant ou après:
{
  "type": "add_product" | "update_price" | "update_product" | "delete_product" | "add_store" | "delete_store" | "add_category" | "list_products" | "search_products" | "list_stores" | "list_categories" | "stats" | "reset" | "help" | "unknown",
  "name": "nom du produit/magasin/catégorie",
  "price": 1234.56,
  "store": "nom du magasin",
  "category": "nom de catégorie",
  "field": "badge" | "name" | "featured",
  "value": "valeur",
  "query": "terme de recherche",
  "filter": "category" | "store",
  "filterValue": "valeur du filtre",
  "subType": "most_viewed" | "price_drops" | "recent"
}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 500,
        temperature: 0.1,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content?.trim() ?? "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const action = JSON.parse(jsonMatch[0]);
    return executeAction(action);
  } catch (error) {
    console.error("AI parsing error:", error);
    // Fallback: return helpful error
    return {
      type: "error",
      content: `⚠️ Erreur de connexion à l'IA. Réessaie ou utilise les commandes classiques:\n\n• \`add product "Nom" $prix store "Magasin" category "Catégorie"\`\n• \`delete product "Nom"\`\n• \`stats\``,
    };
  }
}