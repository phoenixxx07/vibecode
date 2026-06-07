"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { TerminalButton } from "../terminal/TerminalButton";
import { useConfirmDialog } from "../terminal/TerminalConfirmDialog";
import { isManualScreenshot } from "@/lib/screenshot";
import { normalizeScreenshotUrl, shouldUnoptimizeScreenshot } from "@/lib/thumio";

export function ScreenshotUploader({
  productId,
  productName,
  screenshotUrl,
  isApproved,
}: {
  productId: string;
  productName: string;
  screenshotUrl: string | null;
  isApproved: boolean;
}) {
  const router = useRouter();
  const { confirm, dialogNode } = useConfirmDialog();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const displayUrl = preview ?? normalizeScreenshotUrl(screenshotUrl);
  const isManual = isManualScreenshot(screenshotUrl);

  if (!isApproved) {
    return (
      <fieldset className="border border-muted p-4">
        <legend className="px-2 text-xs uppercase text-muted">Preview / Screenshot</legend>
        <p className="text-sm text-muted">
          Upload gambar preview tersedia setelah proyek disetujui admin.
        </p>
      </fieldset>
    );
  }

  async function handleUpload(file: File) {
    setLoading(true);
    setError("");
    const form = new FormData();
    form.append("screenshot", file);

    try {
      const res = await fetch(`/api/products/${productId}/screenshot`, {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Upload gagal");

      setPreview(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleReset() {
    if (
      !(await confirm({
        title: "RESET_SCREENSHOT",
        message: "Kembalikan ke screenshot otomatis?",
        confirmLabel: "RESET",
      }))
    ) {
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${productId}/screenshot`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Reset gagal");

      setPreview(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset gagal");
    } finally {
      setLoading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    void handleUpload(file);
  }

  return (
    <fieldset className="border border-muted p-4">
      <legend className="px-2 text-xs uppercase text-muted">Preview / Screenshot</legend>

      <div className="relative mt-2 aspect-video border border-muted bg-page">
        <Image
          src={displayUrl}
          alt={`Preview ${productName}`}
          fill
          className="object-cover"
          unoptimized={!!preview || isManual || shouldUnoptimizeScreenshot(displayUrl)}
        />
      </div>

      <p className="mt-3 text-xs text-muted">
        {isManual
          ? "Menggunakan gambar upload manual."
          : "Menggunakan screenshot otomatis. Jika hasilnya tidak sesuai, upload gambar sendiri."}
      </p>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      <div className="mt-4 flex flex-wrap gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/webp"
          className="hidden"
          onChange={onFileChange}
          disabled={loading}
        />
        <TerminalButton
          type="button"
          variant="primary"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          {loading ? "[UPLOADING...]" : "[UPLOAD_GAMBAR]"}
        </TerminalButton>
        {isManual && (
          <TerminalButton
            type="button"
            variant="accent"
            disabled={loading}
            onClick={handleReset}
          >
            [RESET_OTOMATIS]
          </TerminalButton>
        )}
      </div>

      <p className="mt-2 text-xs text-muted">WebP wajib · maks. 5 MB · rasio 16:9 disarankan</p>
      {dialogNode}
    </fieldset>
  );
}
