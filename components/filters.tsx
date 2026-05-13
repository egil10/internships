"use client";

import type { Stats } from "@/lib/types";

export type FilterState = {
  q: string;
  year: string | null;
  country: string | null;
  outcome: string | null;
  type: string | null;
  source: string | null;
  stage: string | null;
};

export function Filters({
  stats,
  value,
  onChange,
}: {
  stats: Stats;
  value: FilterState;
  onChange: (v: FilterState | ((prev: FilterState) => FilterState)) => void;
}) {
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) =>
    onChange((prev: FilterState) => ({ ...prev, [k]: prev[k] === v ? null : v }));

  return (
    <div className="space-y-2 mb-4">
      <FilterRow
        label="year"
        options={stats.byYear.map((y) => ({
          label: String(y.year),
          count: y.applications,
        }))}
        active={value.year}
        onSelect={(v) => set("year", v)}
      />
      <FilterRow
        label="outcome"
        options={stats.byOutcome}
        active={value.outcome}
        onSelect={(v) => set("outcome", v)}
      />
      <FilterRow
        label="stage"
        options={stats.byStage}
        active={value.stage}
        onSelect={(v) => set("stage", v)}
      />
      <FilterRow
        label="type"
        options={stats.byType}
        active={value.type}
        onSelect={(v) => set("type", v)}
      />
      <FilterRow
        label="source"
        options={stats.bySource}
        active={value.source}
        onSelect={(v) => set("source", v)}
      />
    </div>
  );
}

function FilterRow({
  label,
  options,
  active,
  onSelect,
}: {
  label: string;
  options: { label: string; count: number }[];
  active: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-16 shrink-0 pt-1 text-[10px] uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const on = active === o.label;
          return (
            <button
              key={o.label}
              onClick={() => onSelect(o.label)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                on
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:text-fg hover:border-muted/40"
              }`}
            >
              <span>{o.label}</span>
              <span className="tabular-nums opacity-60">{o.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
