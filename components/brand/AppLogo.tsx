import Image from "next/image";
import Link from "next/link";

type AppLogoProps = {
  href?: string | null;
  size?: number;
  showText?: boolean;
  tagline?: boolean;
  className?: string;
  priority?: boolean;
};

export function AppLogo({
  href = "/",
  size = 40,
  showText = true,
  tagline = true,
  className = "",
  priority = false,
}: AppLogoProps) {
  const content = (
    <>
      <Image
        src="/images/vibecodelogo.svg"
        alt="VibeCatalog"
        width={size}
        height={size}
        className="shrink-0 rounded-sm"
        priority={priority}
      />
      {showText && (
        <div className="min-w-0">
          <p className="truncate text-xl font-bold uppercase tracking-wider text-primary">
            VibeCatalog.id
          </p>
          {tagline && (
            <p className="truncate text-xs uppercase text-muted">
              katalog vibe coder indonesia
            </p>
          )}
        </div>
      )}
    </>
  );

  const classes = ["flex items-center gap-3", className].filter(Boolean).join(" ");

  if (href) {
    return (
      <Link href={href} className={`${classes} group`} aria-label="VibeCatalog.id — Beranda">
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
