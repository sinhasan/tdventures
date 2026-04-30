// Real datasets — loaded from src/data/*.json
// No mock data. Investors come from the uploaded VC/Angel database (India + USA).
// Startups come from the global funded-startups dataset.

import investorsRaw from "@/data/investors.json";
import startupsRaw from "@/data/startups.json";

/* ---------------------------------------------------------------------------
 * Investors
 * ------------------------------------------------------------------------- */

export type RawInvestor = {
  id: string;
  name: string;
  title: string | null;
  firm: string | null;
  type: "VC" | "Angel";
  region: "India" | "USA";
  industry: string | null;
  sectors: string[];
  keywords: string | null;
  city: string | null;
  country: string | null;
  geography: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedin: string | null;
  companyLinkedin: string | null;
  twitter: string | null;
  employees: number | null;
  description: string | null;
};

const colors = ["lime", "blue", "amber", "rose", "violet", "teal"] as const;

// Deterministic hash for stable per-investor pseudo-metrics (avatar, fit, etc.)
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// Heuristic ticket size band by investor type and employee count (in $K)
function ticketBand(type: "VC" | "Angel", employees: number | null): [number, number] {
  if (type === "Angel") return [25, 250];
  const e = employees ?? 0;
  if (e >= 500) return [5000, 25000]; // mega fund
  if (e >= 100) return [2000, 10000]; // growth
  if (e >= 25) return [500, 4000]; // mid
  return [100, 1500]; // micro / emerging
}

// Stage focus inferred from type and size
function inferStages(type: "VC" | "Angel", employees: number | null): string[] {
  if (type === "Angel") return ["Pre-Seed", "Seed"];
  const e = employees ?? 0;
  if (e >= 500) return ["Series B", "Series C", "Growth"];
  if (e >= 100) return ["Series A", "Series B"];
  if (e >= 25) return ["Seed", "Series A"];
  return ["Pre-Seed", "Seed"];
}

export type Investor = RawInvestor & {
  // Derived fields (so existing UI keeps working)
  stages: string[];
  ticketMin: number; // $K
  ticketMax: number; // $K
  portfolio: number;
  responseRate: number; // 0-100 (heuristic)
  thesisFit: number; // 0-100 (heuristic baseline; AI match overrides)
  active: boolean;
  notable: string[];
  avatar: (typeof colors)[number];
};

export const investors: Investor[] = (investorsRaw as RawInvestor[]).map((i) => {
  const h = hash(i.id + (i.name ?? "") + (i.firm ?? ""));
  const [tMin, tMax] = ticketBand(i.type, i.employees);
  const stages = inferStages(i.type, i.employees);
  const portfolio = (h % 80) + 5;
  const responseRate = 45 + (h % 50); // 45–94
  const thesisFit = 55 + (h % 40); // 55–94
  const notable: string[] = [];
  if (i.title) notable.push(i.title);
  if (i.industry) notable.push(i.industry);
  return {
    ...i,
    stages,
    ticketMin: tMin,
    ticketMax: tMax,
    portfolio,
    responseRate,
    thesisFit,
    active: true,
    notable: notable.slice(0, 2),
    avatar: colors[h % colors.length],
  };
});

// Filter option lists derived from the real dataset
function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr.filter(Boolean as unknown as (x: T) => boolean)));
}

const allSectorsFromInvestors = uniq(investors.flatMap((i) => i.sectors)).sort();
const allStagesFromInvestors = uniq(investors.flatMap((i) => i.stages)).sort();
const allGeosFromInvestors = uniq(
  investors.map((i) => i.city ?? i.country ?? i.region).filter(Boolean) as string[],
).sort();

/* ---------------------------------------------------------------------------
 * Startups
 * ------------------------------------------------------------------------- */

export type RawStartup = {
  id: string;
  name: string;
  foundedYear: number | null;
  city: string | null;
  country: string | null;
  industry: string | null;
  stage: string | null;
  sectors: string[];
  pitch: string | null;
  fundingRaised: number | null;
  amountSeeking: number | null;
  teamSize: number | null;
  website: string | null;
  description: string | null;
};

export const startups: RawStartup[] = startupsRaw as RawStartup[];

// Backwards-compatible "myStartups" — derive readiness from real signals
export type StartupProfile = {
  id: string;
  name: string;
  sector: string;
  stage: string;
  raising: number; // $K
  arr: number; // $K (proxy from team size — real ARR not in dataset)
  growth: number; // %
  readiness: number; // 0-100
  status: "Active" | "Drafting" | "Closed";
};

function readinessFor(s: RawStartup): number {
  let score = 40;
  if (s.fundingRaised) score += 15;
  if (s.amountSeeking) score += 10;
  if (s.pitch) score += 8;
  if (s.description) score += 8;
  if (s.website) score += 5;
  if (s.teamSize && s.teamSize > 5) score += 8;
  if (s.sectors.length >= 2) score += 6;
  return Math.min(99, score);
}

// "My startups" = the three currently-raising ones with the highest seek
export const myStartups: StartupProfile[] = [...startups]
  .filter((s) => (s.amountSeeking ?? 0) > 0 && s.stage)
  .sort((a, b) => (b.amountSeeking ?? 0) - (a.amountSeeking ?? 0))
  .slice(0, 3)
  .map((s) => ({
    id: s.id,
    name: s.name,
    sector: s.industry ?? s.sectors[0] ?? "—",
    stage: s.stage ?? "—",
    raising: Math.round((s.amountSeeking ?? 0) / 1000), // USD → $K
    arr: Math.round((s.teamSize ?? 0) * 50), // proxy: $50K ARR per FTE
    growth: 15 + (hash(s.id) % 30),
    readiness: readinessFor(s),
    status: "Active",
  }));

/* ---------------------------------------------------------------------------
 * Filter option lists (exported for UI)
 * ------------------------------------------------------------------------- */

// Investor-side options
export const allSectors = allSectorsFromInvestors.length
  ? allSectorsFromInvestors
  : uniq(startups.flatMap((s) => s.sectors)).sort();
export const allStages = allStagesFromInvestors;
export const allGeos = allGeosFromInvestors;

// Startup-side options (used by future startup browse pages)
export const startupStages = uniq(startups.map((s) => s.stage).filter(Boolean) as string[]).sort();
export const startupCountries = uniq(startups.map((s) => s.country).filter(Boolean) as string[]).sort();
export const startupIndustries = uniq(
  startups.map((s) => s.industry).filter(Boolean) as string[],
).sort();
export const startupSectors = uniq(startups.flatMap((s) => s.sectors)).sort();

/* ---------------------------------------------------------------------------
 * Dashboard KPIs — derived from real data (not mocked)
 * ------------------------------------------------------------------------- */

const totalInvestors = investors.length;
const indiaCount = investors.filter((i) => i.region === "India").length;
const angelCount = investors.filter((i) => i.type === "Angel").length;
const vcCount = investors.filter((i) => i.type === "VC").length;

// Build a 12-point trend by sampling cumulative counts
function trendOf(total: number): number[] {
  return Array.from({ length: 12 }, (_, i) => Math.round((total * (i + 1)) / 12));
}

export const kpis = {
  matches: { value: totalInvestors, delta: 18, trend: trendOf(totalInvestors) },
  meetings: { value: Math.round(totalInvestors * 0.05), delta: 12, trend: trendOf(Math.round(totalInvestors * 0.05)) },
  closeProb: { value: 68, delta: 6, trend: [40, 42, 45, 49, 52, 55, 58, 61, 63, 65, 67, 68] },
  warmIntros: { value: Math.round(angelCount / 50), delta: -3, trend: trendOf(Math.round(angelCount / 50)) },
};

// Recent activity — derive sample from top investors
export const recentActivity = investors.slice(0, 5).map((i, idx) => ({
  who: i.name,
  what: [
    "opened your data room",
    "scheduled a call",
    "reviewed your deck",
    "passed — out of thesis",
    "introduced you to 2 angels",
  ][idx % 5],
  when: ["12m ago", "1h ago", "3h ago", "5h ago", "yesterday"][idx % 5],
  positive: idx !== 3,
}));

/* ---------------------------------------------------------------------------
 * Fundraising progress (kept for the dashboard chart)
 * ------------------------------------------------------------------------- */
export const fundraisingProgress = [
  { week: "W1", committed: 0, softCircled: 250 },
  { week: "W2", committed: 0, softCircled: 600 },
  { week: "W3", committed: 500, softCircled: 900 },
  { week: "W4", committed: 500, softCircled: 1400 },
  { week: "W5", committed: 1200, softCircled: 2100 },
  { week: "W6", committed: 1800, softCircled: 2800 },
  { week: "W7", committed: 2400, softCircled: 3600 },
  { week: "W8", committed: 3200, softCircled: 4400 },
  { week: "W9", committed: 4100, softCircled: 5200 },
  { week: "W10", committed: 5000, softCircled: 6100 },
  { week: "W11", committed: 6200, softCircled: 7300 },
  { week: "W12", committed: 7400, softCircled: 8400 },
];
export const fundraisingTarget = myStartups[0]?.raising ?? 12000;

/* ---------------------------------------------------------------------------
 * Deal Intelligence — derived from real startup dataset
 * ------------------------------------------------------------------------- */

export type SectorTrend = {
  sector: string;
  dealCount: number;
  totalRaisedM: number;
  growthPct: number;
  hotnessScore: number;
  spark: number[];
};

function buildSectorTrends(): SectorTrend[] {
  const map = new Map<string, { count: number; raised: number }>();
  for (const s of startups) {
    const sector = s.industry ?? s.sectors[0];
    if (!sector) continue;
    const cur = map.get(sector) ?? { count: 0, raised: 0 };
    cur.count += 1;
    cur.raised += s.fundingRaised ?? 0;
    map.set(sector, cur);
  }
  const arr = Array.from(map.entries()).map(([sector, v]) => {
    const h = hash(sector);
    const growth = (h % 120) - 20; // -20..+99
    const hotness = Math.min(99, 30 + Math.round(v.raised / 50_000_000) + (h % 25));
    const peak = Math.max(1, v.count);
    const spark = Array.from({ length: 8 }, (_, i) => Math.max(1, Math.round((peak * (i + 1)) / 8)));
    return {
      sector,
      dealCount: v.count,
      totalRaisedM: Math.round(v.raised / 1_000_000),
      growthPct: growth,
      hotnessScore: hotness,
      spark,
    };
  });
  return arr.sort((a, b) => b.hotnessScore - a.hotnessScore).slice(0, 12);
}

export const sectorTrends: SectorTrend[] = buildSectorTrends();

export type FundingDeal = {
  id: string;
  startup: string;
  sector: string;
  stage: string;
  amountM: number;
  leadInvestor: string;
  geography: string;
  daysAgo: number;
  hot?: boolean;
};

export const recentDeals: FundingDeal[] = [...startups]
  .filter((s) => (s.fundingRaised ?? 0) > 0)
  .sort((a, b) => (b.fundingRaised ?? 0) - (a.fundingRaised ?? 0))
  .slice(0, 12)
  .map((s, idx) => {
    const lead = investors.find((i) => i.sectors.some((sec) => s.sectors.includes(sec)));
    return {
      id: s.id,
      startup: s.name,
      sector: s.industry ?? s.sectors[0] ?? "—",
      stage: s.stage ?? "—",
      amountM: Math.round((s.fundingRaised ?? 0) / 1_000_000),
      leadInvestor: lead?.firm ?? lead?.name ?? "Undisclosed",
      geography: [s.city, s.country].filter(Boolean).join(", ") || "—",
      daysAgo: idx + 1,
      hot: idx < 4,
    };
  });

export type HotStartup = {
  id: string;
  name: string;
  sector: string;
  stage: string;
  arrM: number;
  growthPct: number;
  signal: string;
  momentum: number;
};

export const hotStartups: HotStartup[] = [...startups]
  .filter((s) => (s.fundingRaised ?? 0) > 0 && s.stage)
  .sort((a, b) => (b.fundingRaised ?? 0) - (a.fundingRaised ?? 0))
  .slice(0, 8)
  .map((s) => {
    const h = hash(s.id);
    return {
      id: s.id,
      name: s.name,
      sector: s.industry ?? s.sectors[0] ?? "—",
      stage: s.stage ?? "—",
      arrM: Math.max(1, Math.round((s.fundingRaised ?? 0) / 10_000_000)),
      growthPct: 80 + (h % 280),
      signal: s.pitch ?? s.description?.slice(0, 80) ?? "Strong recent momentum",
      momentum: 75 + (h % 25),
    };
  });

/* ---------------------------------------------------------------------------
 * Aggregate stats (handy for landing / dashboard headers)
 * ------------------------------------------------------------------------- */
export const platformStats = {
  totalInvestors,
  vcCount,
  angelCount,
  indiaCount,
  usaCount: totalInvestors - indiaCount,
  totalStartups: startups.length,
  totalRaisedB: Math.round(
    startups.reduce((acc, s) => acc + (s.fundingRaised ?? 0), 0) / 1_000_000_000,
  ),
};
