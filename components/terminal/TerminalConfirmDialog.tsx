"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TerminalButton } from "./TerminalButton";

export type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
};

type DialogProps = ConfirmOptions & {
  onConfirm: () => void;
  onCancel: () => void;
};

function TerminalConfirmDialogView({
  title = "KONFIRMASI",
  message,
  confirmLabel = "KONFIRMASI",
  cancelLabel = "BATAL",
  variant = "primary",
  onConfirm,
  onCancel,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      onClick={(e) => {
        if (e.target === dialogRef.current) onCancel();
      }}
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-black/70 open:flex open:items-center open:justify-center"
    >
      <div
        className="w-full max-w-md border border-primary bg-surface p-1 shadow-neon"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className="flex items-center justify-between border-b border-muted px-4 py-3">
          <span id="confirm-title" className="text-xs font-bold uppercase text-primary">
            &gt; {title}
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs uppercase text-muted hover:text-primary"
            aria-label="Batal"
          >
            [ESC]
          </button>
        </div>
        <p id="confirm-message" className="px-4 py-4 text-sm leading-relaxed text-text-main">
          {message}
        </p>
        <div className="flex justify-end gap-2 border-t border-muted px-4 py-3">
          <TerminalButton type="button" variant="ghost" onClick={onCancel}>
            [{cancelLabel}]
          </TerminalButton>
          <TerminalButton type="button" variant={variant} onClick={onConfirm} autoFocus>
            [{confirmLabel}]
          </TerminalButton>
        </div>
      </div>
    </dialog>
  );
}

export function useConfirmDialog() {
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const close = useCallback((result: boolean) => {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setOptions(null);
  }, []);

  const confirm = useCallback((opts: ConfirmOptions | string): Promise<boolean> => {
    const resolved: ConfirmOptions =
      typeof opts === "string" ? { message: opts } : opts;
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setOptions(resolved);
    });
  }, []);

  const dialogNode = options ? (
    <TerminalConfirmDialogView
      {...options}
      onConfirm={() => close(true)}
      onCancel={() => close(false)}
    />
  ) : null;

  return { confirm, dialogNode };
}
