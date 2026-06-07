"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";
import { useConfirmDialog } from "../terminal/TerminalConfirmDialog";
import { getProjectTypeLabel } from "@/lib/products";
import { normalizeScreenshotUrl, shouldUnoptimizeScreenshot } from "@/lib/thumio";
import { ProductWithRelations } from "@/types/product";

export function AdminCatalogPanel({
  products,
}: {
  products: ProductWithRelations[];
}) {
  const router = useRouter();
  const { confirm, dialogNode } = useConfirmDialog();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function updateProduct(
    productId: string,
    data: {
      isFeatured?: boolean;
      status?: "approved" | "rejected" | "pending";
      rejectionReason?: string;
    }
  ) {
    setLoading(productId);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(null);
    }
  }

  async function deleteProduct(productId: string, name: string) {
    if (
      !(await confirm({
        title: "HAPUS_PROYEK",
        message: `Hapus permanen "${name}"? Data tidak bisa dikembalikan.`,
        confirmLabel: "HAPUS",
        variant: "danger",
      }))
    ) {
      return;
    }

    setLoading(productId);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Delete failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="border border-muted bg-surface p-8 text-center text-muted">
        Belum ada proyek yang disetujui.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="border border-red-500 p-3 text-sm text-red-400">{error}</div>
      )}

      {products.map((product) => {
        const categorySlug = product.categories[0]?.category.slug ?? "all";
        const categoryName = product.categories[0]?.category.name;
        const screenshotSrc = normalizeScreenshotUrl(product.screenshotUrl);

        return (
          <div key={product.id} className="border border-muted bg-surface p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative h-20 w-32 shrink-0 border border-muted bg-page">
                <Image
                  src={screenshotSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized={shouldUnoptimizeScreenshot(screenshotSrc)}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2 text-xs uppercase">
                  <span className="border border-primary px-2 py-0.5 text-primary">
                    {getProjectTypeLabel(product.projectType)}
                  </span>
                  {product.isFeatured && (
                    <span className="border border-accent px-2 py-0.5 text-accent">
                      FEATURED
                    </span>
                  )}
                  {categoryName && (
                    <span className="border border-muted px-2 py-0.5 text-muted">
                      {categoryName}
                    </span>
                  )}
                </div>
                <h3 className="mt-1 truncate font-bold uppercase">{product.name}</h3>
                <p className="truncate text-sm text-muted">{product.tagline}</p>
                <p className="mt-1 text-xs text-muted">
                  {product.user.name ?? product.user.email} · {product.upvoteCount} upvotes ·{" "}
                  {product.viewCount} views
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <TerminalButton href={`/catalog/${categorySlug}/${product.id}`} variant="ghost">
                  [VIEW]
                </TerminalButton>
                <TerminalButton
                  href={`/dashboard/projects/${product.id}/edit`}
                  variant="ghost"
                >
                  [EDIT]
                </TerminalButton>
                <TerminalButton
                  variant="accent"
                  disabled={loading === product.id}
                  onClick={() =>
                    updateProduct(product.id, { isFeatured: !product.isFeatured })
                  }
                >
                  {product.isFeatured ? "[UNFEATURE]" : "[FEATURE]"}
                </TerminalButton>
                <TerminalButton
                  variant="ghost"
                  disabled={loading === product.id}
                  onClick={async () => {
                    if (
                      !(await confirm({
                        title: "TUNDAKAN_PROYEK",
                        message: `Tangguhkan "${product.name}"? Proyek keluar dari katalog.`,
                        confirmLabel: "TANGGUHKAN",
                      }))
                    ) {
                      return;
                    }
                    updateProduct(product.id, { status: "pending" });
                  }}
                >
                  [TANGGUHKAN]
                </TerminalButton>
                <TerminalButton
                  variant="danger"
                  disabled={loading === product.id}
                  onClick={async () => {
                    if (
                      !(await confirm({
                        title: "TOLAK_PROYEK",
                        message: `Tolak "${product.name}"?`,
                        confirmLabel: "TOLAK",
                        variant: "danger",
                      }))
                    ) {
                      return;
                    }
                    updateProduct(product.id, {
                      status: "rejected",
                      rejectionReason: "Ditolak admin",
                    });
                  }}
                >
                  [TOLAK]
                </TerminalButton>
                <TerminalButton
                  variant="danger"
                  disabled={loading === product.id}
                  onClick={() => deleteProduct(product.id, product.name)}
                >
                  [HAPUS]
                </TerminalButton>
              </div>
            </div>
          </div>
        );
      })}
      {dialogNode}
    </div>
  );
}
