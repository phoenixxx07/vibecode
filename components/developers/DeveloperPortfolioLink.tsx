import Link from "next/link";

export function DeveloperPortfolioLink({
  developerId,
  className = "",
}: {
  developerId: string;
  className?: string;
}) {
  return (
    <Link
      href={`/developers/${developerId}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-xs font-bold uppercase text-primary hover:underline ${className}`}
    >
      [PORTFOLIO]
    </Link>
  );
}
