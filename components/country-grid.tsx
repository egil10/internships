"use client";

import type { CountItem } from "@/lib/types";

const FLAGS: Record<string, string> = {
  Norway: "🇳🇴",
  UK: "🇬🇧",
  Sweden: "🇸🇪",
  Denmark: "🇩🇰",
  China: "🇨🇳",
  "Hong Kong": "🇭🇰",
  Taiwan: "🇹🇼",
  Singapore: "🇸🇬",
  Switzerland: "🇨🇭",
  Zambia: "🇿🇲",
  Mozambique: "🇲🇿",
  Japan: "🇯🇵",
  USA: "🇺🇸",
  Germany: "🇩🇪",
  France: "🇫🇷",
  Global: "🌍",
  Remote: "💻",
  Multiple: "🌐",
  Unknown: "❓",
};

export function CountryGrid({
  data,
  active,
  onSelect,
}: {
  data: CountItem[];
  active: string | null;
  onSelect: (c: string) => void;
}) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {data.map((c) => {
        const pct = (c.count / max) * 100;
        const on = active === c.label;
        return (
          <button
            key={c.label}
            onClick={() => onSelect(c.label)}
            className={`group relative overflow-hidden rounded-lg border p-3 text-left transition-colors ${
              on
                ? "border-accent/50 bg-accent/10"
                : "border-border bg-bg hover:border-muted/40"
            }`}
          >
            <div
              className="absolute inset-y-0 left-0 bg-accent/10 transition-all"
              style={{ width: `${pct}%` }}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg leading-none">
                  {FLAGS[c.label] ?? "📍"}
                </span>
                <span className="truncate text-sm">{c.label}</span>
              </div>
              <span className="tabular-nums text-xs text-muted shrink-0">
                {c.count}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
