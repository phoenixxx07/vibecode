"use client";

import { type ReactNode, useState } from "react";

export function TerminalDisclosure({
  title,
  children,
  defaultOpen = false,
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border border-muted bg-surface/50 p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center text-left text-sm font-bold uppercase text-muted hover:text-primary"
      >
        <span className="flex items-center gap-1">
          <span
            className={`inline-block transition-transform duration-200 ${open ? "rotate-90" : ""}`}
            aria-hidden
          >
            &gt;
          </span>
          {title}
        </span>
      </button>

      {open && <div className="mt-4">{children}</div>}
    </section>
  );
}
