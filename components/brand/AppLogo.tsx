import Image from "next/image";
import Link from "next/link";

/** Wordmark di UI (header, hero, login) */
export const APP_LOGO_SRC = "/images/logoutama.webp";

/** Favicon tab browser */
export const BROWSER_ICON_SRC = "/images/vibecodelogo.svg";

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
        src={APP_LOGO_SRC}
        alt="VibeCatalog"
        width={Math.round(size * 3.2)}
        height={size}
        className="w-auto shrink-0 object-contain object-left"
        style={{ height: size, width: "auto", maxWidth: showText ? "min(42vw, 200px)" : "min(88vw, 360px)" }}
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
