"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import type { Internship } from "@/lib/types";

type SortKey = "year" | "company" | "country" | "stageNorm" | "outcomeNorm";
type SortDir = "asc" | "desc";

const STAGE_TONE: Record<string, string> = {
  Offer: "bg-accent/15 text-accent border-accent/30",
  "Second Interview": "bg-blue-500/10 text-blue-500 border-blue-500/30 dark:text-blue-300",
  "First Interview": "bg-blue-500/10 text-blue-500 border-blue-500/30 dark:text-blue-300",
  "Case / Assessment": "bg-violet-500/10 text-violet-500 border-violet-500/30 dark:text-violet-300",
  "Online Test": "bg-violet-500/10 text-violet-500 border-violet-500/30 dark:text-violet-300",
  "Networking call": "bg-violet-500/10 text-violet-500 border-violet-500/30 dark:text-violet-300",
  Applied: "bg-muted/15 text-muted border-border",
  "Account / Started": "bg-muted/15 text-muted border-border",
  "Deadline tracked": "bg-muted/10 text-muted/80 border-border",
  Withdrew: "bg-orange-500/10 text-orange-500 border-orange-500/30 dark:text-orange-300",
};

const OUTCOME_TONE: Record<string, string> = {
  "Offer Accepted": "bg-accent/20 text-accent border-accent/40",
  "Offer Declined": "bg-accent/10 text-accent border-accent/30",
  "In Progress": "bg-blue-500/10 text-blue-500 border-blue-500/30 dark:text-blue-300",
  Rejected: "bg-rose-500/10 text-rose-500 border-rose-500/30 dark:text-rose-300",
  Ghosted: "bg-zinc-500/10 text-muted border-border",
  Withdrew: "bg-orange-500/10 text-orange-500 border-orange-500/30 dark:text-orange-300",
  "Did Not Pursue": "bg-zinc-500/10 text-muted border-border",
  "Later Offer": "bg-accent/10 text-accent border-accent/30",
  Unknown: "bg-zinc-500/5 text-muted/70 border-border",
};

export function InternshipTable({ rows }: { rows: Internship[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("year");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [openId, setOpenId] = useState<number | null>(null);

  const sorted = [...rows].sort((a, b) => {
    const av = (a[sortKey] ?? "") as string | number;
    const bv = (b[sortKey] ?? "") as string | number;
    if (av === bv) return 0;
    const cmp = av < bv ? -1 : 1;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setSortDir("desc");
    }
  };

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg/50 border-b border-border">
            <tr className="text-left text-xs text-muted">
              <SortableTh
                label="year"
                k="year"
                sortKey={sortKey}
                sortDir={sortDir}
                onClick={() => toggleSort("year")}
              />
              <SortableTh
                label="company"
                k="company"
                sortKey={sortKey}
                sortDir={sortDir}
                onClick={() => toggleSort("company")}
              />
              <th className="px-4 py-2.5 font-medium hidden md:table-cell">role</th>
              <SortableTh
                label="where"
                k="country"
                sortKey={sortKey}
                sortDir={sortDir}
                onClick={() => toggleSort("country")}
              />
              <SortableTh
                label="stage"
                k="stageNorm"
                sortKey={sortKey}
                sortDir={sortDir}
                onClick={() => toggleSort("stageNorm")}
              />
              <SortableTh
                label="outcome"
                k="outcomeNorm"
                sortKey={sortKey}
                sortDir={sortDir}
                onClick={() => toggleSort("outcomeNorm")}
              />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const open = openId === r.id;
              return (
                <Fragment key={r.id}>
                  <tr
                    onClick={() => setOpenId(open ? null : r.id)}
                    className="border-b border-border/60 hover:bg-bg/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-2.5 tabular-nums text-muted">
                      {r.year ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 font-medium">{r.company}</td>
                    <td className="px-4 py-2.5 hidden md:table-cell text-muted">
                      {r.role || "—"}
                    </td>
                    <td className="px-4 py-2.5 text-muted">
                      <span className="mr-1.5">{r.flag}</span>
                      {r.country}
                    </td>
                    <td className="px-4 py-2.5">
                      <Pill
                        text={r.stageNorm}
                        className={STAGE_TONE[r.stageNorm] ?? "bg-muted/10 text-muted border-border"}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <Pill
                        text={r.outcomeNorm}
                        className={OUTCOME_TONE[r.outcomeNorm] ?? "bg-muted/10 text-muted border-border"}
                      />
                    </td>
                  </tr>
                  {open && r.notes && (
                    <tr className="border-b border-border/60 bg-bg/30">
                      <td colSpan={6} className="px-4 py-3 text-xs text-muted leading-relaxed">
                        <div className="max-w-3xl">
                          <div className="mb-1 text-[10px] uppercase tracking-wider text-muted/70">
                            notes · {r.dateApplied || r.cycle || ""}
                          </div>
                          {r.notes}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted">
                  No matches. Try clearing some filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortableTh({
  label,
  k,
  sortKey,
  sortDir,
  onClick,
}: {
  label: string;
  k: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onClick: () => void;
}) {
  const active = sortKey === k;
  const Icon = !active ? ChevronsUpDown : sortDir === "asc" ? ChevronUp : ChevronDown;
  return (
    <th className="px-4 py-2.5 font-medium">
      <button
        onClick={onClick}
        className={`inline-flex items-center gap-1 transition-colors ${
          active ? "text-fg" : "text-muted hover:text-fg"
        }`}
      >
        {label}
        <Icon size={11} strokeWidth={2} />
      </button>
    </th>
  );
}

function Pill({ text, className }: { text: string; className: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${className}`}
    >
      {text}
    </span>
  );
}
