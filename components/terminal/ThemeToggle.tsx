"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span
        className="inline-block h-9 w-[4.5rem] border border-muted"
        aria-hidden
      />
    );
  }

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="border border-muted px-3 py-1.5 text-xs font-bold uppercase text-muted hover:border-primary hover:text-primary"
      aria-label={isDark ? "Aktifkan light mode" : "Aktifkan dark mode"}
    >
      {isDark ? "[LIGHT]" : "[DARK]"}
    </button>
  );
}
