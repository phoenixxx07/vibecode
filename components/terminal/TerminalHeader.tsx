import Link from "next/link";
import { AppLogo } from "@/components/brand/AppLogo";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ThemeToggle } from "./ThemeToggle";
import { TerminalSearchDialog } from "./TerminalSearchDialog";

export async function TerminalHeader({ showSearch = true }: { showSearch?: boolean }) {
  const session = await auth();

  return (
    <header className="border-b border-muted bg-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <AppLogo size={36} showText={false} priority />
          <nav className="hidden items-center gap-4 text-sm uppercase md:flex">
            <Link href="/catalog" className="text-text-main hover:text-primary">
              [KATALOG]
            </Link>
            <Link href="/catalog/requests" className="text-text-main hover:text-primary">
              [REQUEST]
            </Link>
            <Link href="/search" className="text-text-main hover:text-primary">
              [CARI]
            </Link>
            <Link href="/submit" className="text-text-main hover:text-primary">
              [SUBMIT]
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
          <ThemeToggle />
          {showSearch && <TerminalSearchDialog />}
          {session?.user ? (
            <div className="flex items-center gap-3 text-sm uppercase">
              <Link href="/dashboard" className="border border-muted px-3 py-1.5 hover:border-primary hover:text-primary">
                [DASHBOARD]
              </Link>
              {session.user.role === "admin" && (
                <Link href="/admin" className="border border-accent px-3 py-1.5 text-accent hover:bg-accent hover:text-background-dark">
                  [ADMIN]
                </Link>
              )}
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="border border-primary bg-primary px-4 py-2 text-sm font-bold uppercase text-background-dark hover:bg-background-dark hover:text-primary"
            >
              [LOGIN]
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
