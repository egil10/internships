"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CountItem } from "@/lib/types";

const PALETTE = [
  "rgb(var(--accent))",
  "rgba(45,212,191,0.55)",
  "rgb(99,102,241)",
  "rgba(99,102,241,0.45)",
  "rgb(244,114,182)",
  "rgba(244,114,182,0.45)",
  "rgb(115,115,110)",
  "rgba(115,115,110,0.45)",
  "rgba(245,158,11,0.7)",
];

export function OutcomeDonut({ data }: { data: CountItem[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div className="flex items-center gap-3">
      <div className="h-40 w-40 relative shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Tooltip
              contentStyle={{
                background: "rgb(var(--surface))",
                border: "1px solid rgb(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              innerRadius={42}
              outerRadius={68}
              stroke="rgb(var(--surface))"
              strokeWidth={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xl font-semibold tabular-nums leading-none">
              {total}
            </div>
            <div className="text-[10px] text-muted mt-0.5">total</div>
          </div>
        </div>
      </div>
      <div className="space-y-1 text-xs min-w-0 flex-1">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2 min-w-0">
            <div
              className="h-2 w-2 rounded-full shrink-0"
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            <span className="text-muted truncate flex-1">{d.label}</span>
            <span className="tabular-nums text-[11px]">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
