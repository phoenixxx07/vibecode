"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import { TerminalButton } from "../terminal/TerminalButton";
import { TerminalInput } from "../terminal/TerminalInput";

type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
  _count: { products: number; upvotes: number };
};

export function AdminUsersPanel({
  users,
  currentAdminId,
}: {
  users: AdminUser[];
  currentAdminId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function promoteAdmin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading("promote");
    setError("");
    setSuccess("");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email") }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menambah admin");

      setSuccess(`${data.email} sekarang admin.`);
      e.currentTarget.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah admin");
    } finally {
      setLoading(null);
    }
  }

  async function setRole(userId: string, role: "admin" | "user") {
    setLoading(userId);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal update role");

      setSuccess(`Role ${data.email} diubah ke ${data.role}.`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal update role");
    } finally {
      setLoading(null);
    }
  }

  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-6">
      <form onSubmit={promoteAdmin} className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <TerminalInput
          name="email"
          label="Tambah admin via email"
          type="email"
          required
          placeholder="developer@example.com"
          hint="User harus sudah pernah login via Google"
        />
        <div className="flex items-end">
          <TerminalButton type="submit" variant="primary" disabled={loading === "promote"}>
            {loading === "promote" ? "[ADDING...]" : "[TAMBAH_ADMIN]"}
          </TerminalButton>
        </div>
      </form>

      <p className="text-xs text-muted">{adminCount} admin terdaftar</p>

      {error && (
        <div className="border border-red-500 p-3 text-sm text-red-400">{error}</div>
      )}
      {success && (
        <div className="border border-primary p-3 text-sm text-primary">{success}</div>
      )}

      {users.length === 0 ? (
        <div className="border border-muted bg-surface p-8 text-center text-muted">
          Belum ada user terdaftar.
        </div>
      ) : (
        <div className="overflow-x-auto border border-muted">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-muted bg-page/50 text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Proyek</th>
                <th className="px-4 py-3">Upvotes</th>
                <th className="px-4 py-3">Terdaftar</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {users.map((user) => (
                <tr key={user.id} className="bg-surface">
                  <td className="px-4 py-3 font-bold uppercase">
                    {user.name ?? "—"}
                    {user.id === currentAdminId && (
                      <span className="ml-2 text-xs text-muted">(anda)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`border px-2 py-0.5 text-xs uppercase ${
                        user.role === "admin"
                          ? "border-accent text-accent"
                          : "border-muted text-muted"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user._count.products}</td>
                  <td className="px-4 py-3">{user._count.upvotes}</td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {user.role === "admin" ? (
                      user.id !== currentAdminId && (
                        <TerminalButton
                          variant="ghost"
                          disabled={loading === user.id}
                          onClick={() => setRole(user.id, "user")}
                        >
                          [DEMOTE]
                        </TerminalButton>
                      )
                    ) : (
                      <TerminalButton
                        variant="accent"
                        disabled={loading === user.id}
                        onClick={() => setRole(user.id, "admin")}
                      >
                        [PROMOTE]
                      </TerminalButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
