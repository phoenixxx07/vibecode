"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function TerminalSearchBar({
  defaultValue = "",
  autoFocus = false,
  onSearch,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
  onSearch?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      onSearch?.();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center border border-muted bg-page">
      <span className="px-3 text-sm text-primary">&gt;</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search tools, projects & requests..."
        autoFocus={autoFocus}
        className="w-full bg-transparent py-2 pr-3 text-sm uppercase text-text-main placeholder:text-muted"
      />
      <button
        type="submit"
        className="border-l border-muted px-3 py-2 text-xs font-bold uppercase text-primary hover:bg-primary hover:text-background-dark"
      >
        [EXEC]
      </button>
    </form>
  );
}
