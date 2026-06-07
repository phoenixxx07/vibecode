import Link from "next/link";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { TerminalButton } from "@/components/terminal/TerminalButton";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProjectTypeLabel } from "@/lib/products";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  approved: "ONLINE",
  pending: "PENDING",
  rejected: "REJECTED",
};

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const products = await prisma.product.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      categories: { include: { category: true } },
    },
  });

  return (
    <div className="min-h-screen">
      <TerminalHeader showSearch={false} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold uppercase text-primary">&gt; MY_PROJECTS</h1>
          <TerminalButton href="/submit" variant="primary">
            [APPEND_DB]
          </TerminalButton>
        </div>

        <div className="overflow-x-auto border border-muted">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-muted bg-surface text-xs uppercase text-muted">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4">Tipe</th>
                <th className="p-4">Status</th>
                <th className="p-4">Views</th>
                <th className="p-4">Clicks</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-muted/50">
                  <td className="p-4 font-bold">{product.name}</td>
                  <td className="p-4 text-muted">{getProjectTypeLabel(product.projectType)}</td>
                  <td className="p-4">
                    <span
                      className={`border px-2 py-0.5 text-xs ${
                        product.status === "approved"
                          ? "border-primary text-primary"
                          : product.status === "rejected"
                            ? "border-red-500 text-red-400"
                            : "border-accent text-accent"
                      }`}
                    >
                      {STATUS_LABEL[product.status]}
                    </span>
                  </td>
                  <td className="p-4 text-muted">{product.viewCount}</td>
                  <td className="p-4 text-muted">{product.clickCount}</td>
                  <td className="p-4">
                    <Link
                      href={`/dashboard/projects/${product.id}/edit`}
                      className="text-xs uppercase text-primary hover:underline"
                    >
                      [EDIT]
                    </Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted">
                    Belum ada proyek. <Link href="/submit" className="text-primary">Submit sekarang</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
