"use client";

import type { CountItem } from "@/lib/types";

export function CategoryBar({ data }: { data: CountItem[] }) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="space-y-1.5">
      {data.map((d) => {
        const w = (d.count / max) * 100;
        return (
          <div key={d.label} className="text-xs">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-muted truncate pr-2">{d.label}</span>
              <span className="tabular-nums">{d.count}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-bg overflow-hidden">
              <div
                className="h-full rounded-full bg-accent/70"
                style={{ width: `${w}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
