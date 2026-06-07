import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductWithRelations } from "@/types/product";

export function DeveloperPortfolioGrid({ products }: { products: ProductWithRelations[] }) {
  if (products.length === 0) {
    return (
      <div className="border border-muted bg-surface p-8 text-center text-sm text-muted">
        Belum ada proyek di katalog.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
