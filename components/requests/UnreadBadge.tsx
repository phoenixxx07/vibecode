export function UnreadBadge({ count, className = "" }: { count: number; className?: string }) {
  if (count <= 0) return null;

  return (
    <span
      className={`inline-flex min-h-5 min-w-5 shrink-0 items-center justify-center border border-amber-500 bg-amber-500/15 px-1.5 text-[10px] font-bold leading-none text-amber-400 ${className}`}
      aria-label={`${count} pesan belum dibaca`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function UnreadDot({ show, className = "" }: { show: boolean; className?: string }) {
  if (!show) return null;

  return (
    <span
      className={`absolute -right-0.5 -top-0.5 h-3 w-3 border border-page bg-amber-500 ${className}`}
      aria-hidden
    />
  );
}
