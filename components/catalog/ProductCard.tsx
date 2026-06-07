import Image from "next/image";
import Link from "next/link";
import { formatPricing, getProjectTypeLabel } from "@/lib/products";
import { normalizeScreenshotUrl, shouldUnoptimizeScreenshot } from "@/lib/thumio";
import { ProductWithRelations } from "@/types/product";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const category = product.categories[0]?.category;
  const screenshotSrc = normalizeScreenshotUrl(product.screenshotUrl);

  return (
    <article className="crt-glow flex flex-col border border-muted bg-surface transition-colors">
      <div className="relative aspect-video w-full border-b border-muted bg-page">
        <Image
          src={screenshotSrc}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={shouldUnoptimizeScreenshot(screenshotSrc)}
        />
        <div className="absolute left-2 top-2 border border-primary bg-page/90 px-2 py-0.5 text-xs font-bold uppercase text-primary">
          {getProjectTypeLabel(product.projectType)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-bold uppercase text-text-main">{product.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted">{product.tagline}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs uppercase">
          {category && (
            <span className="border border-muted px-2 py-0.5 text-muted">{category.name}</span>
          )}
          <span className="border border-muted px-2 py-0.5 text-muted">
            {formatPricing(product)}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-xs text-muted">
            ▲ {product.upvoteCount} · {product.viewCount} views · {product.clickCount} clicks
          </span>
          <Link
            href={`/catalog/${category?.slug ?? "all"}/${product.id}`}
            className="border border-primary px-3 py-1 text-xs font-bold uppercase text-primary hover:bg-primary hover:text-background-dark"
          >
            [INSPECT]
          </Link>
        </div>
      </div>
    </article>
  );
}
