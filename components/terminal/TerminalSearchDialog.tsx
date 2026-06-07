"use client";

import { useEffect, useRef, useState } from "react";
import { TerminalSearchBar } from "./TerminalSearchBar";

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      className="h-4 w-4"
      aria-hidden
    >
      <circle cx="10" cy="10" r="6" />
      <path d="M14.5 14.5L20 20" />
    </svg>
  );
}

export function TerminalSearchDialog() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="crt-glow flex h-9 w-9 items-center justify-center border border-muted text-primary transition-colors hover:text-primary"
        aria-label="Buka pencarian (Ctrl+K)"
        title="Cari (Ctrl+K)"
      >
        <SearchIcon />
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
        className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-black/70 open:flex open:items-start open:justify-center open:pt-[15vh]"
      >
        <div
          className="w-full max-w-xl border border-primary bg-surface p-1 shadow-neon"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-2 flex items-center justify-between border-b border-muted px-3 py-2">
            <span className="text-xs font-bold uppercase text-primary">&gt; SYS_SEARCH</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs uppercase text-muted hover:text-primary"
              aria-label="Tutup pencarian"
            >
              [ESC]
            </button>
          </div>
          <TerminalSearchBar autoFocus onSearch={() => setOpen(false)} />
          <p className="px-3 py-2 text-[10px] uppercase text-muted">
            tekan [EXEC] atau enter untuk mencari · ctrl+k untuk buka
          </p>
        </div>
      </dialog>
    </>
  );
}
