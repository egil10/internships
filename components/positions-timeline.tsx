"use client";

import { Building2, MapPin, GraduationCap, Briefcase } from "lucide-react";

type Position = {
  company: string;
  role: string;
  start: string;
  end: string | null;
  location: string;
  tier: "current" | "internship" | "academic";
  tag: string;
};

const TAG_TONE: Record<string, string> = {
  Investment: "bg-accent/15 text-accent border-accent/30",
  Diplomatic: "bg-blue-500/10 text-blue-500 border-blue-500/30 dark:text-blue-300",
  Academic: "bg-violet-500/10 text-violet-500 border-violet-500/30 dark:text-violet-300",
  Research: "bg-violet-500/10 text-violet-500 border-violet-500/30 dark:text-violet-300",
};

function fmtMonth(s: string | null): string {
  if (!s) return "now";
  const [y, m] = s.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

function duration(start: string, end: string | null): string {
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end
    ? end.split("-").map(Number)
    : (() => {
        const d = new Date();
        return [d.getFullYear(), d.getMonth() + 1];
      })();
  const months = (ey - sy) * 12 + (em - sm) + 1;
  if (months >= 12) {
    const y = Math.floor(months / 12);
    const r = months % 12;
    return r ? `${y} yr ${r} mo` : `${y} yr`;
  }
  return `${months} mo`;
}

export function PositionsTimeline({
  positions,
  earlierWork,
}: {
  positions: Position[];
  earlierWork: string[];
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Briefcase size={14} className="text-accent" />
            Where the &ldquo;yes&rdquo;es landed
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Every position actually held since 2021. The other 260+ rows are
            what it took to get here.
          </p>
        </div>
      </div>

      <ol className="relative mt-5 pl-4 border-l border-border/80 space-y-5">
        {positions.map((p, i) => (
          <li key={i} className="relative">
            <span
              className={`absolute -left-[20px] top-1 h-3 w-3 rounded-full border-2 border-bg ${
                p.tier === "current" ? "bg-accent animate-pulse" : "bg-accent/60"
              }`}
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h4 className="text-sm font-semibold">{p.role}</h4>
              <span className="text-xs text-muted">
                {fmtMonth(p.start)} — {fmtMonth(p.end)}
                <span className="opacity-60"> · {duration(p.start, p.end)}</span>
              </span>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <Building2 size={11} /> {p.company}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} /> {p.location}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                  TAG_TONE[p.tag] ?? "border-border text-muted"
                }`}
              >
                {p.tag}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 pt-4 border-t border-border/60">
        <div className="text-[10px] uppercase tracking-wider text-muted mb-2">
          And before all that — summer & student work
        </div>
        <div className="flex flex-wrap gap-1.5">
          {earlierWork.map((w) => (
            <span
              key={w}
              className="inline-flex items-center rounded-full border border-border bg-bg/50 px-2 py-0.5 text-[11px] text-muted"
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

type Edu = {
  institution: string;
  degree: string;
  start: string;
  end: string;
  country: string;
};

export function EducationList({ items }: { items: Edu[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-medium flex items-center gap-2 mb-4">
        <GraduationCap size={14} className="text-accent" />
        Education
      </h3>
      <ol className="space-y-3">
        {items.map((e, i) => (
          <li
            key={i}
            className="flex items-start justify-between gap-3 pb-3 last:pb-0 border-b last:border-0 border-border/60"
          >
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{e.institution}</div>
              <div className="text-xs text-muted">{e.degree}</div>
            </div>
            <div className="shrink-0 text-xs text-muted tabular-nums">
              {e.start === e.end ? e.start : `${e.start}–${e.end}`}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
