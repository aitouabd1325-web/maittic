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
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function parseCommand(input: string): CommandResult {
  const raw = input.trim();
  const lower = raw.toLowerCase();

  // ---- HELP ----
  if (/^(help|\?)/.test(lower)) {
    return {
      type: "info",
      content: `**📖 Admin Command Reference**

**Products**
• \`add product "<name>" $<price> store "<store>" category "<category>"\`
• \`update price "<name>" $<newPrice>\`
• \`update product "<name>" name "<new name>"\`
• \`update product "<name>" badge "<badge>"\`
• \`update product "<name>" featured <true|false>\`
• \`delete product "<name>"\`
• \`list products\`
• \`list products category "<cat>"\`
• \`list products store "<store>"\`
• \`search products "<query>"\`

**Stores**
• \`add store "<name>"\`
• \`delete store "<name>"\`
• \`list stores\`

**Categories**
• \`add category "<name>" icon "<emoji>"\`
• \`list categories\`

**Statistics**
• \`stats\`
• \`stats most viewed\`
• \`stats price drops\`
• \`stats recent\`

**System**
• \`reset data\` – restore default dataset
• \`help\` – show this menu`,
    };
  }

  // ---- STATS ----
  if (/^stats/.test(lower)) {
    const stats = getStats();

    if (/most viewed/.test(lower)) {
      const rows = stats.mostViewed
        .map((p, i) => `${i + 1}. **${p.name}** – ${p.views.toLocaleString()} views (${p.store})`)
        .join("\n");
      return { type: "info", content: `**👁️ Most Viewed Products**\n\n${rows}` };
    }

    if (/price drops/.test(lower)) {
      const rows = stats.recentPriceDrops
        .map((p) => {
          const drop = p.originalPrice
            ? (((p.originalPrice - p.price) / p.originalPrice) * 100).toFixed(0)
            : 0;
          return `• **${p.name}** – ${fmt(p.price)} *(was ${fmt(p.originalPrice ?? p.price)}, -${drop}%)* @ ${p.store}`;
        })
        .join("\n");
      return { type: "info", content: `**📉 Biggest Price Drops**\n\n${rows}` };
    }

    if (/recent/.test(lower)) {
      const rows = stats.recentlyAdded
        .map((p) => `• **${p.name}** – ${fmt(p.price)} @ ${p.store} *(${p.category})*`)
        .join("\n");
      return { type: "info", content: `**🆕 Recently Added Products**\n\n${rows}` };
    }

    // Full stats
    return {
      type: "info",
      content: `**📊 MaitTic Dashboard Stats**

📦 Total Products: **${stats.totalProducts}**
🏪 Total Stores: **${stats.totalStores}**
🗂️ Total Categories: **${stats.totalCategories}**

**🔥 Top Viewed:** ${stats.mostViewed[0]?.name ?? "N/A"} (${stats.mostViewed[0]?.views.toLocaleString() ?? 0} views)
**📉 Best Drop:** ${stats.recentPriceDrops[0]?.name ?? "N/A"} (${
        stats.recentPriceDrops[0]?.originalPrice
          ? (
              ((stats.recentPriceDrops[0].originalPrice - stats.recentPriceDrops[0].price) /
                stats.recentPriceDrops[0].originalPrice) *
              100
            ).toFixed(0) + "% off"
          : "N/A"
      })
**🆕 Newest:** ${stats.recentlyAdded[0]?.name ?? "N/A"}

Type \`stats most viewed\`, \`stats price drops\`, or \`stats recent\` for details.`,
    };
  }

  // ---- LIST PRODUCTS ----
  if (/^list products?/.test(lower)) {
    let products = getProducts();

    const catMatch = lower.match(/category\s+"([^"]+)"/);
    if (catMatch) {
      const cat = catMatch[1].toLowerCase();
      products = products.filter((p) => p.category.toLowerCase().includes(cat));
    }

    const storeMatch = lower.match(/store\s+"([^"]+)"/);
    if (storeMatch) {
      const store = storeMatch[1].toLowerCase();
      products = products.filter((p) => p.store.toLowerCase().includes(store));
    }

    if (products.length === 0) {
      return { type: "info", content: "No products found matching that filter." };
    }

    const rows = products
      .map(
        (p) =>
          `• **${p.name}** – ${fmt(p.price)}${p.originalPrice ? ` ~~${fmt(p.originalPrice)}~~` : ""} | ${p.store} | ${p.category} | 👁 ${p.views}`
      )
      .join("\n");
    return { type: "info", content: `**📦 Products (${products.length})**\n\n${rows}` };
  }

  // ---- SEARCH PRODUCTS ----
  if (/^search products?/.test(lower)) {
    const qMatch = raw.match(/search products?\s+"([^"]+)"/i);
    if (!qMatch) return { type: "error", content: 'Usage: `search products "<query>"`' };
    const q = qMatch[1].toLowerCase();
    const results = getProducts().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.store.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
    if (results.length === 0) return { type: "info", content: `No products found for **"${qMatch[1]}"**.` };
    const rows = results
      .map((p) => `• **${p.name}** – ${fmt(p.price)} | ${p.store} | ${p.category}`)
      .join("\n");
    return { type: "info", content: `**🔍 Search Results for "${qMatch[1]}" (${results.length})**\n\n${rows}` };
  }

  // ---- ADD PRODUCT ----
  if (/^add product/.test(lower)) {
    const nameMatch = raw.match(/add product\s+"([^"]+)"/i);
    const priceMatch = raw.match(/\$(\d+(?:\.\d+)?)/i);
    const storeMatch = raw.match(/store\s+"([^"]+)"/i);
    const catMatch = raw.match(/category\s+"([^"]+)"/i);

    if (!nameMatch || !priceMatch || !storeMatch || !catMatch) {
      return {
        type: "error",
        content: `❌ Missing fields. Usage:\n\`add product "<name>" $<price> store "<store>" category "<category>"\``,
      };
    }

    const name = nameMatch[1];
    const price = parseFloat(priceMatch[1]);
    const store = storeMatch[1];
    const category = catMatch[1];
    const image = pickEmoji(category, CATEGORY_ICONS, "🏷️");

    // Check if store exists
    const stores = getStores();
    const storeExists = stores.some((s) => s.name.toLowerCase() === store.toLowerCase());

    const added = addProduct({ name, price, store, category, image, featured: false });

    let note = "";
    if (!storeExists) {
      addStore({ name: store, logo: pickEmoji(store, STORE_LOGOS, "🏪"), url: "", rating: 4.0 });
      note = `\n\n⚠️ Store **"${store}"** was new — added automatically.`;
    }

    return {
      type: "success",
      content: `✅ Product added!\n\n**${added.name}**\nPrice: ${fmt(added.price)}\nStore: ${added.store}\nCategory: ${added.category}\nID: \`${added.id}\`${note}`,
    };
  }

  // ---- UPDATE PRICE ----
  if (/^update price/.test(lower)) {
    const nameMatch = raw.match(/update price\s+"([^"]+)"/i);
    const priceMatch = raw.match(/\$(\d+(?:\.\d+)?)/i);

    if (!nameMatch || !priceMatch) {
      return {
        type: "error",
        content: 'Usage: `update price "<name>" $<newPrice>`',
      };
    }

    const updated = updateProductPrice(nameMatch[1], parseFloat(priceMatch[1]));
    if (!updated) {
      return { type: "error", content: `❌ Product **"${nameMatch[1]}"** not found.` };
    }
    return {
      type: "success",
      content: `✅ Price updated!\n\n**${updated.name}**\nOld: ${fmt(updated.originalPrice ?? updated.price)}\nNew: ${fmt(updated.price)}\nStore: ${updated.store}`,
    };
  }

  // ---- UPDATE PRODUCT (generic fields) ----
  if (/^update product/.test(lower)) {
    const nameMatch = raw.match(/update product\s+"([^"]+)"/i);
    if (!nameMatch) return { type: "error", content: 'Usage: `update product "<name>" <field> "<value>"`' };
    const target = nameMatch[1];

    // name
    const newNameMatch = raw.match(/\bname\s+"([^"]+)"/i);
    if (newNameMatch) {
      const updated = updateProduct(target, { name: newNameMatch[1] });
      if (!updated) return { type: "error", content: `❌ Product **"${target}"** not found.` };
      return { type: "success", content: `✅ Renamed **"${target}"** → **"${updated.name}"**` };
    }

    // badge
    const badgeMatch = raw.match(/\bbadge\s+"([^"]+)"/i);
    if (badgeMatch) {
      const updated = updateProduct(target, { badge: badgeMatch[1] });
      if (!updated) return { type: "error", content: `❌ Product **"${target}"** not found.` };
      return { type: "success", content: `✅ Badge set to **"${badgeMatch[1]}"** on **${updated.name}**` };
    }

    // featured
    const featuredMatch = raw.match(/\bfeatured\s+(true|false)/i);
    if (featuredMatch) {
      const val = featuredMatch[1].toLowerCase() === "true";
      const updated = updateProduct(target, { featured: val });
      if (!updated) return { type: "error", content: `❌ Product **"${target}"** not found.` };
      return { type: "success", content: `✅ **${updated.name}** is now ${val ? "⭐ featured" : "not featured"}.` };
    }

    return { type: "error", content: 'Specify a field to update: `name`, `badge`, or `featured`.' };
  }

  // ---- DELETE PRODUCT ----
  if (/^delete product/.test(lower)) {
    const nameMatch = raw.match(/delete product\s+"([^"]+)"/i);
    if (!nameMatch) return { type: "error", content: 'Usage: `delete product "<name>"`' };
    const removed = deleteProduct(nameMatch[1]);
    if (!removed) return { type: "error", content: `❌ Product **"${nameMatch[1]}"** not found.` };
    return { type: "success", content: `🗑️ Deleted **${removed.name}** (${removed.store} – ${fmt(removed.price)})` };
  }

  // ---- LIST STORES ----
  if (/^list stores?/.test(lower)) {
    const stores = getStores();
    const rows = stores
      .map((s) => `${s.logo} **${s.name}** – ${s.productCount} products | ⭐ ${s.rating}`)
      .join("\n");
    return { type: "info", content: `**🏪 Stores (${stores.length})**\n\n${rows}` };
  }

  // ---- ADD STORE ----
  if (/^add store/.test(lower)) {
    const nameMatch = raw.match(/add store\s+"([^"]+)"/i);
    if (!nameMatch) return { type: "error", content: 'Usage: `add store "<name>"`' };
    const name = nameMatch[1];
    const logoMatch = raw.match(/logo\s+"([^"]+)"/i);
    const logo = logoMatch ? logoMatch[1] : pickEmoji(name, STORE_LOGOS, "🏪");
    const added = addStore({ name, logo, url: "", rating: 4.0 });
    return { type: "success", content: `✅ Store **${added.name}** ${added.logo} added! ID: \`${added.id}\`` };
  }

  // ---- DELETE STORE ----
  if (/^delete store/.test(lower)) {
    const nameMatch = raw.match(/delete store\s+"([^"]+)"/i);
    if (!nameMatch) return { type: "error", content: 'Usage: `delete store "<name>"`' };
    const removed = deleteStore(nameMatch[1]);
    if (!removed) return { type: "error", content: `❌ Store **"${nameMatch[1]}"** not found.` };
    return { type: "success", content: `🗑️ Store **${removed.name}** removed.` };
  }

  // ---- LIST CATEGORIES ----
  if (/^list categor/.test(lower)) {
    const cats = getCategories();
    const rows = cats.map((c) => `${c.icon} **${c.name}** – ${c.count} products`).join("\n");
    return { type: "info", content: `**🗂️ Categories (${cats.length})**\n\n${rows}` };
  }

  // ---- ADD CATEGORY ----
  if (/^add categor/.test(lower)) {
    const nameMatch = raw.match(/add category\s+"([^"]+)"/i);
    if (!nameMatch) return { type: "error", content: 'Usage: `add category "<name>" icon "<emoji>"`' };
    const name = nameMatch[1];
    const iconMatch = raw.match(/icon\s+"([^"]+)"/i);
    const icon = iconMatch ? iconMatch[1] : pickEmoji(name, CATEGORY_ICONS, "🏷️");
    const added = addCategory(name, icon);
    return { type: "success", content: `✅ Category **${added.icon} ${added.name}** added!` };
  }

  // ---- RESET ----
  if (/^reset data/.test(lower)) {
    resetToDefaults();
    return { type: "success", content: "♻️ Data reset to defaults. All changes have been reverted." };
  }

  // ---- UNKNOWN ----
  return {
    type: "error",
    content: `❓ Unknown command. Type \`help\` to see all available commands.`,
  };
}
