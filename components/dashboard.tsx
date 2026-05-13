"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  Globe2,
  Heart,
  Search,
  Share2,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import type { Internship, Stats } from "@/lib/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatCard } from "@/components/stat-card";
import { Funnel } from "@/components/charts/funnel";
import { YearStack } from "@/components/charts/year-stack";
import { CategoryBar } from "@/components/charts/category-bar";
import { OutcomeDonut } from "@/components/charts/outcome-donut";
import { CountryGrid } from "@/components/country-grid";
import { InternshipTable } from "@/components/internship-table";
import { Filters, type FilterState } from "@/components/filters";
import { PositionsTimeline, EducationList } from "@/components/positions-timeline";

const EMPTY: FilterState = {
  q: "",
  year: null,
  country: null,
  outcome: null,
  type: null,
  source: null,
  stage: null,
};

function shareUrl(filters: FilterState) {
  if (typeof window === "undefined") return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v) params.set(k, String(v));
  }
  const qs = params.toString();
  return `${window.location.origin}${window.location.pathname}${qs ? "?" + qs : ""}`;
}

type Position = {
  company: string;
  role: string;
  start: string;
  end: string | null;
  location: string;
  tier: "current" | "internship" | "academic";
  tag: string;
};

type Edu = {
  institution: string;
  degree: string;
  start: string;
  end: string;
  country: string;
};

export function Dashboard({
  rows,
  stats,
  positions,
  earlierWork,
  education,
}: {
  rows: Internship[];
  stats: Stats;
  positions: Position[];
  earlierWork: string[];
  education: Edu[];
}) {
  const [filters, setFilters] = useState<FilterState>(EMPTY);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return rows.filter((r) => {
      if (q) {
        const blob = `${r.company} ${r.role} ${r.location} ${r.notes}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      if (filters.year && r.year !== Number(filters.year)) return false;
      if (filters.country && r.country !== filters.country) return false;
      if (filters.outcome && r.outcomeNorm !== filters.outcome) return false;
      if (filters.type && r.typeNorm !== filters.type) return false;
      if (filters.source && r.sourceNorm !== filters.source) return false;
      if (filters.stage && r.stageNorm !== filters.stage) return false;
      return true;
    });
  }, [rows, filters]);

  const accepted = stats.totals.offersAccepted;
  const tried = stats.totals.tracked;
  const acceptanceRate = ((accepted / tried) * 100).toFixed(1);

  const handleShare = async () => {
    const url = shareUrl(filters);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy link:", url);
    }
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <main className="min-h-screen pb-24">
      {/* hero */}
      <section className="grain border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-12">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Sparkles size={14} className="text-accent" />
              <span>Internship Tracker</span>
              <span className="text-border">·</span>
              <span>
                {stats.totals.yearsSpanned[0]}–{stats.totals.yearsSpanned[1]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:border-accent/40 hover:text-accent transition-colors"
              >
                <Share2 size={13} strokeWidth={2.2} />
                {copied ? "copied!" : "share view"}
              </button>
              <ThemeToggle />
            </div>
          </header>

          <div className="mt-10 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              {tried} applications.{" "}
              <span className="text-muted">
                {stats.totals.rejections} explicit rejections,{" "}
                {stats.totals.tracked - stats.totals.offers - stats.totals.rejections - stats.totals.inProgress}{" "}
                that just went quiet.
              </span>{" "}
              <span className="text-accent">
                {positions.length} jobs actually held.
              </span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted leading-relaxed">
              Six years of cold emails, deadlines and Webcruiter forms. Most of
              this dashboard is &ldquo;no&rdquo; or silence — but every now and
              then a yes lands. That&rsquo;s the whole job. Keep applying.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted">
              <Heart size={12} className="text-accent" />
              <span>made for my brothers — don&rsquo;t get discouraged</span>
            </div>
          </div>
        </div>
      </section>

      {/* stat strip */}
      <section className="mx-auto max-w-6xl px-6 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={Briefcase}
            label="Applications"
            value={tried}
            sub={`${stats.totals.appliedConfirmed} confirmed`}
          />
          <StatCard
            icon={TrendingUp}
            label="Interviews reached"
            value={stats.totals.interviewsReached}
            sub={`${((stats.totals.interviewsReached / tried) * 100).toFixed(1)}% of applied`}
          />
          <StatCard
            icon={Sparkles}
            label="Offers"
            value={stats.totals.offers}
            sub={`${accepted} accepted`}
            highlight
          />
          <StatCard
            icon={Globe2}
            label="Countries"
            value={stats.totals.countriesApplied}
            sub={`acceptance rate ${acceptanceRate}%`}
          />
        </div>
      </section>

      {/* positions + education */}
      <section className="mx-auto max-w-6xl px-6 mt-10 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <PositionsTimeline positions={positions} earlierWork={earlierWork} />
        </div>
        <div className="lg:col-span-2">
          <EducationList items={education} />
        </div>
      </section>

      {/* funnel + year */}
      <section className="mx-auto max-w-6xl px-6 mt-10 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium mb-1">The funnel</h3>
          <p className="text-xs text-muted mb-4">
            Most applications never get past stage 2. That&rsquo;s normal.
          </p>
          <Funnel data={stats.funnel} />
        </div>
        <div className="lg:col-span-3 rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium mb-1">Six years of applying</h3>
          <p className="text-xs text-muted mb-4">
            Volume rises with each cycle. So do the rejections. So do the offers.
          </p>
          <YearStack data={stats.byYear} />
        </div>
      </section>

      {/* category charts */}
      <section className="mx-auto max-w-6xl px-6 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium mb-1">By outcome</h3>
          <p className="text-xs text-muted mb-4">Where each application landed.</p>
          <OutcomeDonut data={stats.byOutcome} />
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium mb-1">By type</h3>
          <p className="text-xs text-muted mb-4">Internships dominate, but the mix is wide.</p>
          <CategoryBar data={stats.byType.slice(0, 8)} />
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium mb-1">By source</h3>
          <p className="text-xs text-muted mb-4">Where the leads came from.</p>
          <CategoryBar data={stats.bySource.slice(0, 8)} />
        </div>
      </section>

      {/* countries */}
      <section className="mx-auto max-w-6xl px-6 mt-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium">Where I applied</h3>
              <p className="text-xs text-muted">{stats.totals.countriesApplied} countries · click to filter</p>
            </div>
          </div>
          <CountryGrid
            data={stats.byCountry}
            active={filters.country}
            onSelect={(c) =>
              setFilters((f) => ({ ...f, country: f.country === c ? null : c }))
            }
          />
        </div>
      </section>

      {/* explorer */}
      <section className="mx-auto max-w-6xl px-6 mt-10">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">The full list</h2>
            <p className="text-xs text-muted mt-0.5">
              {filtered.length} of {tried} entries
              {activeCount > 0 && ` · ${activeCount} filter${activeCount > 1 ? "s" : ""} applied`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={filters.q}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, q: e.target.value }))
                }
                placeholder="search company, role, notes…"
                className="w-72 max-w-[60vw] rounded-full border border-border bg-surface pl-9 pr-3 py-1.5 text-sm placeholder:text-muted/70 focus:outline-none focus:border-accent/50"
              />
            </div>
            {activeCount > 0 && (
              <button
                onClick={() => setFilters(EMPTY)}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted hover:text-fg"
              >
                <X size={12} />
                clear
              </button>
            )}
          </div>
        </div>

        <Filters
          stats={stats}
          value={filters}
          onChange={setFilters}
        />

        <InternshipTable rows={filtered} />
      </section>

      <footer className="mx-auto max-w-6xl px-6 mt-16 text-center text-xs text-muted">
        <p>
          <Building2 size={11} className="inline mr-1 align-text-bottom" />
          Built with Next.js, Tailwind, Recharts and a lot of unanswered emails.
        </p>
      </footer>
    </main>
  );
}
