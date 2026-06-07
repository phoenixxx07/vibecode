"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";
import { useConfirmDialog } from "../terminal/TerminalConfirmDialog";
import { ProductWithRelations } from "@/types/product";
import { getProjectTypeLabel } from "@/lib/products";
import { normalizeScreenshotUrl } from "@/lib/thumio";

export function AdminReviewPanel({ products }: { products: ProductWithRelations[] }) {
  const router = useRouter();
  const { confirm, dialogNode } = useConfirmDialog();
  const [loading, setLoading] = useState<string | null>(null);

  async function review(
    productId: string,
    status: "approved" | "rejected",
    isFeatured?: boolean
  ) {
    setLoading(productId);
    try {
      await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          status,
          rejectionReason: status === "rejected" ? "Tidak memenuhi guidelines" : undefined,
          isFeatured,
        }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  async function deleteProduct(productId: string, name: string) {
    if (
      !(await confirm({
        title: "HAPUS_PROYEK",
        message: `Hapus permanen "${name}"?`,
        confirmLabel: "HAPUS",
        variant: "danger",
      }))
    ) {
      return;
    }
    setLoading(productId);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed");
      }
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="border border-muted bg-surface p-8 text-center text-muted">
        Tidak ada submission pending.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map((product) => (
        <div key={product.id} className="border border-muted bg-surface p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="relative aspect-video border border-muted bg-page lg:col-span-1">
              <Image
                src={normalizeScreenshotUrl(product.screenshotUrl)}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2">
                <span className="border border-primary px-2 py-0.5 text-xs text-primary">
                  {getProjectTypeLabel(product.projectType)}
                </span>
                <span className="border border-accent px-2 py-0.5 text-xs text-accent">
                  PENDING
                </span>
              </div>
              <h3 className="mt-2 text-lg font-bold uppercase">{product.name}</h3>
              <p className="text-sm text-muted">{product.tagline}</p>
              <p className="mt-2 text-xs text-muted">
                Builder: {product.user.name ?? product.user.email} · Kontak: {product.developerContact}
              </p>
              <p className="mt-1 text-xs">
                <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {product.url}
                </a>
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <TerminalButton
                  variant="primary"
                  disabled={loading === product.id}
                  onClick={() => review(product.id, "approved")}
                >
                  [APPROVE]
                </TerminalButton>
                <TerminalButton
                  variant="accent"
                  disabled={loading === product.id}
                  onClick={() => review(product.id, "approved", true)}
                >
                  [APPROVE+FEATURED]
                </TerminalButton>
                <TerminalButton
                  variant="danger"
                  disabled={loading === product.id}
                  onClick={() => review(product.id, "rejected")}
                >
                  [REJECT]
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
        </div>
      ))}
      {dialogNode}
    </div>
  );
}
