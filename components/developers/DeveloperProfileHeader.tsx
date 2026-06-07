import Image from "next/image";

type Props = {
  name: string | null;
  email: string;
  avatarUrl: string | null;
  socialLink: string | null;
  createdAt: Date | string;
  stats: { approvedCount: number; totalUpvotes: number };
};

export function DeveloperProfileHeader({ name, email, avatarUrl, socialLink, createdAt, stats }: Props) {
  const displayName = name ?? email;
  const joined = new Date(createdAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col gap-6 border border-muted bg-surface p-6 sm:flex-row sm:items-center">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-muted bg-page">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl font-bold text-primary">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1">
        <h1 className="text-xl font-bold uppercase text-primary">&gt; {displayName}</h1>
        <p className="mt-1 text-sm text-muted">Developer · Bergabung {joined}</p>
        {socialLink && (
          <a
            href={socialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm text-primary hover:underline"
          >
            {socialLink}
          </a>
        )}
        <div className="mt-4 flex gap-6 text-sm">
          <div>
            <span className="font-bold text-primary">{stats.approvedCount}</span>
            <span className="ml-1 text-muted">Proyek</span>
          </div>
          <div>
            <span className="font-bold text-primary">{stats.totalUpvotes}</span>
            <span className="ml-1 text-muted">Upvotes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
