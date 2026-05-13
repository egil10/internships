export type Internship = {
  id: number;
  cycle: string | null;
  cycleYear: number | null;
  cycleSeason: string;
  dateApplied: string | null;
  year: number | null;
  company: string;
  role: string;
  location: string;
  country: string;
  flag: string;
  type: string;
  typeNorm: string;
  source: string;
  sourceNorm: string;
  stage: string;
  stageNorm: string;
  outcome: string;
  outcomeNorm: string;
  tookIt: string;
  notes: string;
  discovery: string;
  appliedConfirmed: boolean;
};

export type CountItem = { label: string; count: number };

export type YearStat = {
  year: number;
  applications: number;
  offers: number;
  accepted: number;
  interviews: number;
  rejected: number;
};

export type Stats = {
  totals: {
    tracked: number;
    appliedConfirmed: number;
    deadlineOnly: number;
    interviewsReached: number;
    offers: number;
    offersAccepted: number;
    rejections: number;
    inProgress: number;
    countriesApplied: number;
    yearsSpanned: [number, number];
  };
  byYear: YearStat[];
  byType: CountItem[];
  byStage: CountItem[];
  byOutcome: CountItem[];
  bySource: CountItem[];
  byCountry: CountItem[];
  bySeason: CountItem[];
  funnel: { stage: string; count: number }[];
};
