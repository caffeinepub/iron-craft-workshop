import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Product } from "../backend.d";
import { ProductCategory } from "../backend.d";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function timeAgo(nanoTs: bigint) {
  const ms = Number(nanoTs / 1_000_000n);
  const diffDays = Math.floor((Date.now() - ms) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

function categoryLabel(cat: ProductCategory) {
  const map: Record<ProductCategory, string> = {
    [ProductCategory.door]: "Door",
    [ProductCategory.window_]: "Window",
    [ProductCategory.gate]: "Gate",
    [ProductCategory.other]: "Other",
  };
  return map[cat] ?? cat;
}

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 1 }: Props) {
  return (
    <div
      className="bg-card border-2 border-primary/30 hover:border-primary transition-all duration-300 flex flex-col group"
      data-ocid={`products.item.${index}`}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={
            product.imageUrl ?? "/assets/generated/product-door.dim_600x600.jpg"
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary/90 text-primary-foreground font-heading font-bold text-xs tracking-wider">
            {categoryLabel(product.category)}
          </Badge>
        </div>
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
            <span className="font-heading font-black text-sm tracking-widest text-muted-foreground">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading font-black text-lg tracking-wide text-foreground uppercase mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
          {product.description}
        </p>
        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="text-2xl font-heading font-black text-primary">
              {formatPrice(product.price)}
            </div>
            <div className="text-xs text-muted-foreground">{product.unit}</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{timeAgo(product.lastUpdated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
