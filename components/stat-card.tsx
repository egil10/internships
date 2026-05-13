import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-surface p-4 transition-colors ${
        highlight ? "border-accent/40" : "border-border"
      }`}
    >
      <div className="flex items-center gap-2 text-xs text-muted">
        <Icon
          size={13}
          strokeWidth={2}
          className={highlight ? "text-accent" : ""}
        />
        <span>{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <div
          className={`text-3xl font-semibold tracking-tight tabular-nums ${
            highlight ? "text-accent" : ""
          }`}
        >
          {value}
        </div>
      </div>
      {sub && <div className="mt-1 text-[11px] text-muted">{sub}</div>}
    </div>
  );
}
