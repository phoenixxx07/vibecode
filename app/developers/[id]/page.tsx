import { notFound } from "next/navigation";
import { DeveloperPortfolioGrid } from "@/components/developers/DeveloperPortfolioGrid";
import { DeveloperProfileHeader } from "@/components/developers/DeveloperProfileHeader";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { getDeveloperPortfolio } from "@/lib/developers";

export const dynamic = "force-dynamic";

export default async function DeveloperProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const portfolio = await getDeveloperPortfolio(id);
  if (!portfolio) notFound();

  return (
    <div className="min-h-screen">
      <TerminalHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <DeveloperProfileHeader
          name={portfolio.name}
          email={portfolio.email}
          avatarUrl={portfolio.avatarUrl}
          socialLink={portfolio.socialLink}
          createdAt={portfolio.createdAt}
          stats={portfolio.stats}
        />
        <h2 className="mt-10 text-sm font-bold uppercase text-primary">&gt; PORTOFOLIO</h2>
        <div className="mt-6">
          <DeveloperPortfolioGrid products={portfolio.products} />
        </div>
      </main>
    </div>
  );
}
