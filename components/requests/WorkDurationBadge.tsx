import { formatWorkDuration } from "@/lib/project-request-labels";

export function WorkDurationBadge({
  startedAt,
  completedAt,
}: {
  startedAt: Date | string;
  completedAt: Date | string;
}) {
  const duration = formatWorkDuration(new Date(startedAt), new Date(completedAt));
  return (
    <span className="border border-primary px-2 py-0.5 text-xs font-bold uppercase text-primary">
      Durasi: {duration}
    </span>
  );
}
