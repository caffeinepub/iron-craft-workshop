import { motion } from "motion/react";
import { useState } from "react";
import { ProductCategory } from "../backend.d";
import type { Product } from "../backend.d";
import ProductCard from "../components/ProductCard";
import { SEED_PRODUCTS } from "../data/seedProducts";
import { useGetAllProducts } from "../hooks/useQueries";

const FILTERS: { label: string; value: ProductCategory | "all" }[] = [
  { label: "ALL", value: "all" },
  { label: "DOORS", value: ProductCategory.door },
  { label: "WINDOWS", value: ProductCategory.window_ },
  { label: "GATES", value: ProductCategory.gate },
  { label: "OTHER", value: ProductCategory.other },
];

export default function Products() {
  const { data: backendProducts, isLoading } = useGetAllProducts();
  const [activeFilter, setActiveFilter] = useState<ProductCategory | "all">(
    "all",
  );

  const allProducts: Product[] =
    backendProducts && backendProducts.length > 0
      ? backendProducts
      : SEED_PRODUCTS;
  const filtered =
    activeFilter === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === activeFilter);

  return (
    <main className="pt-[72px] min-h-screen">
      <section className="bg-section-band py-16 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-heading font-black text-5xl tracking-widest uppercase text-foreground">
            OUR PRODUCTS
          </h1>
          <div className="w-16 h-0.5 bg-primary mt-4" />
          <p className="text-muted-foreground mt-4 text-lg max-w-xl">
            Handcrafted iron doors, windows, and gates. Prices updated daily to
            reflect current market rates.
          </p>
        </div>
      </section>

      <section className="py-12 max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-10" data-ocid="products.tab">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setActiveFilter(f.value)}
              className={`font-heading font-bold text-xs tracking-widest px-5 py-2 border transition-colors ${activeFilter === f.value ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`}
              data-ocid={`products.${f.value}.tab`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="products.loading_state"
          >
            <div className="font-heading font-bold tracking-widest text-sm animate-pulse">
              LOADING PRODUCTS...
            </div>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="products.empty_state"
          >
            <div className="font-heading font-bold tracking-widest text-sm">
              NO PRODUCTS IN THIS CATEGORY
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id.toString()}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <ProductCard product={p} index={i + 1} />
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-8 text-center">
          ⚡ Prices may vary daily based on iron market rates. Last updated
          prices shown on each card.
        </p>
      </section>
    </main>
  );
}
