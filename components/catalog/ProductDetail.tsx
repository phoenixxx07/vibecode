"use client";

import Image from "next/image";
import {
  formatPricing,
  getDeveloperEmail,
  getPrimaryCta,
  getProjectTypeLabel,
} from "@/lib/products";
import { normalizeScreenshotUrl, shouldUnoptimizeScreenshot } from "@/lib/thumio";
import { ProductWithRelations } from "@/types/product";
import { TerminalButton } from "../terminal/TerminalButton";

export function ProductDetail({ product }: { product: ProductWithRelations }) {
  const cta = getPrimaryCta(product.projectType);
  const screenshotSrc = normalizeScreenshotUrl(product.screenshotUrl);
  const visitUrl =
    product.projectType === "repository"
      ? product.githubUrl || product.url
      : product.url;
  const developerEmail = getDeveloperEmail(
    product.developerContact,
    product.user.email
  );

  async function trackClick(type: "visit" | "contact") {
    await fetch(`/api/products/${product.id}/click`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="relative aspect-video border border-muted bg-page">
        <Image
          src={screenshotSrc}
          alt={product.name}
          fill
          className="object-cover"
          priority
          unoptimized={shouldUnoptimizeScreenshot(screenshotSrc)}
        />
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="border border-primary px-2 py-0.5 text-xs font-bold uppercase text-primary">
              {getProjectTypeLabel(product.projectType)}
            </span>
            {product.isFeatured && (
              <span className="border border-accent px-2 py-0.5 text-xs font-bold uppercase text-accent">
                FEATURED
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold uppercase">{product.name}</h1>
          <p className="mt-2 text-muted">{product.tagline}</p>
        </div>

        <div className="border border-muted bg-surface p-4">
          <h2 className="mb-3 text-xs font-bold uppercase text-muted">Highlights //</h2>
          <ul className="space-y-2 text-sm">
            <li><span className="text-primary">&gt;</span> {product.highlight1}</li>
            <li><span className="text-primary">&gt;</span> {product.highlight2}</li>
            <li><span className="text-primary">&gt;</span> {product.highlight3}</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs uppercase text-muted">Harga</span>
            <p className="mt-1 font-bold text-primary">{formatPricing(product)}</p>
          </div>
          <div>
            <span className="text-xs uppercase text-muted">Builder</span>
            <p className="mt-1">{product.user.name ?? product.user.email}</p>
          </div>
          <div>
            <span className="text-xs uppercase text-muted">Kategori</span>
            <p className="mt-1">
              {product.categories.map((c) => c.category.name).join(", ")}
            </p>
          </div>
          <div>
            <span className="text-xs uppercase text-muted">AI Tools</span>
            <p className="mt-1">
              {product.aiTools.map((t) => t.aiTool.name).join(", ")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <TerminalButton
            variant="primary"
            onClick={() => {
              trackClick("visit");
              window.open(visitUrl, "_blank");
            }}
          >
            {cta.label}
          </TerminalButton>
          <TerminalButton
            variant="accent"
            href={`mailto:${developerEmail}`}
            onClick={() => trackClick("contact")}
          >
            [CONTACT_DEV]
          </TerminalButton>
        </div>

        <p className="text-xs text-muted">
          VibeCatalog.id adalah katalog. Pemesanan dan transaksi dilakukan langsung dengan developer.
        </p>
      </div>
    </div>
  );
}
