import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger" | "accent";

const variants: Record<Variant, string> = {
  primary:
    "border-primary bg-primary text-background-dark hover:bg-background-dark hover:text-primary",
  ghost:
    "border-muted text-text-main hover:border-primary hover:text-primary",
  danger:
    "border-red-500 text-red-400 hover:bg-red-500 hover:text-background-dark",
  accent:
    "border-accent text-accent hover:bg-accent hover:text-background-dark",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  href?: string;
  children: ReactNode;
};

function isNativeLink(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

export function TerminalButton({
  variant = "ghost",
  href,
  children,
  className = "",
  ...props
}: Props) {
  const classes = `inline-flex items-center justify-center border px-4 py-2 text-sm font-bold uppercase transition-colors ${variants[variant]} ${className}`;

  if (href) {
    if (isNativeLink(href)) {
      const { type: _type, ...anchorProps } =
        props as AnchorHTMLAttributes<HTMLAnchorElement>;
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
