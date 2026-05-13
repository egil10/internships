import internships from "@/data/internships.json";
import stats from "@/data/stats.json";
import positions from "@/data/positions.json";
import education from "@/data/education.json";
import { Dashboard } from "@/components/dashboard";
import type { Internship, Stats } from "@/lib/types";

export default function Page() {
  return (
    <Dashboard
      rows={internships as unknown as Internship[]}
      stats={stats as unknown as Stats}
      positions={positions.positions as never}
      earlierWork={positions.earlierWork as string[]}
      education={education.education as never}
    />
  );
}
