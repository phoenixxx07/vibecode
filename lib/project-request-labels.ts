import { ProjectRequestApplicationStatus, ProjectRequestStatus } from "@prisma/client";

export const APPLICATION_STATUS_LABELS: Record<ProjectRequestApplicationStatus, string> = {
  active: "Mendaftar",
  selected: "Terpilih",
  withdrawn: "Mundur",
};

export const PROJECT_REQUEST_STATUS_LABELS: Record<ProjectRequestStatus, string> = {
  submission: "Pengajuan",
  published: "Disetujui (terbit)",
  rejected: "Ditolak",
  in_progress: "Diproses",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export function formatWorkDuration(startedAt: Date, completedAt: Date): string {
  const ms = completedAt.getTime() - startedAt.getTime();
  if (ms <= 0) return "0 menit";

  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} hari`);
  if (hours % 24 > 0) parts.push(`${hours % 24} jam`);
  if (days === 0 && hours === 0 && minutes > 0) parts.push(`${minutes} menit`);
  if (parts.length === 0) parts.push("kurang dari 1 menit");

  return parts.join(" ");
}

export function getEffectiveBudget(request: {
  budgetAmount: number;
  agreedBudgetAmount?: number | null;
}): number {
  return request.agreedBudgetAmount ?? request.budgetAmount;
}

export function formatBudget(amount: number | string, currency: string): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currency || "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}

/** Format angka untuk input estimasi biaya (pemisah ribuan id-ID, tanpa desimal). */
export function formatBudgetInput(value: string | number): string {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("id-ID");
}

/** Parse nilai input estimasi biaya ke number. */
export function parseBudgetInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

export function parseFeatures(features: string): string[] {
  return features
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);
}
