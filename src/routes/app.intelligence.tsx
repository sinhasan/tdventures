import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Flame, TrendingUp, TrendingDown, Sparkles, ArrowUpRight, Zap, Globe2, Filter } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { sectorTrends, recentDeals, hotStartups, allSectors } from "@/lib/platform-data";

export const Route = createFileRoute("/app/intelligence")({
  head: () => ({ meta: [{ title: "Deal Intelligence — Atlas" }] }),
  component: IntelligencePage,
});

function IntelligencePage() {
  const [sectorFilter, setSectorFilter] = useState<string>("All");

  const filteredDeals = useMemo(
    () => (sectorFilter === "All" ? recentDeals : recentDeals.filter((d) => d.sector === sectorFilter)),
    [sectorFilter]
  );

  const sortedSectors = useMemo(
    () => [...sectorTrends].sort((a, b) => b.hotnessScore - a.hotnessScore),
    []
  );

  const totalDeals = recentDeals.length;
  const totalRaised = recentDeals.reduce((s, d) => s + d.amountM, 0);
  const avgDeal = (totalRaised / totalDeals).toFixed(1);

  return (
    <AppShell
      title="Deal Intelligence"
      subtitle="Trending sectors, recent funding activity, and hot startups across the market."
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/app/match"
            className="inline-flex items-center gap-2 rounded-md bg-lime px-4 py-2 text-sm font-medium text-lime-foreground hover:bg-lime/90"
          >
            <Sparkles className="h-4 w-4" /> Match against trends
          </Link>
        </div>
      }
    >
      {/* Top KPI strip */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <KpiTile label="Deals this week" value={`${totalDeals}`} delta="+24%" positive />
        <KpiTile label="Capital deployed" value={`$${totalRaised.toFixed(0)}M`} delta="+18%" positive />
        <KpiTile label="Avg round size" value={`$${avgDeal}M`} delta="-4%" positive={false} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Trending sectors */}
        <section className="rounded-lg border border-border bg-surface/30 p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-lime" />
              <h2 className="font-display text-lg">Trending sectors</h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">QoQ growth</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Where capital is actually flowing this quarter.</p>

          <div className="space-y-2">
            {sortedSectors.map((s) => (
              <SectorRow key={s.sector} {...s} />
            ))}
          </div>
        </section>

        {/* Hot startups sidebar */}
        <aside className="rounded-lg border border-border bg-surface/30 p-5 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-4 w-4 text-amber-400" />
            <h2 className="font-display text-lg">Hot startups</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Highest momentum scores in the last 30 days.</p>
          <ol className="space-y-3">
            {hotStartups.map((h, i) => (
              <li key={h.id} className="group">
                <div className="flex items-start gap-3">
                  <div className="font-display text-2xl text-muted-foreground/40 w-6 shrink-0 leading-none pt-1 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-medium truncate">{h.name}</div>
                      <div className="font-display text-sm text-amber-400 shrink-0">{h.momentum}</div>
                    </div>
                    <div className="text-[11px] text-muted-foreground">{h.sector} · {h.stage} · ${h.arrM}M ARR</div>
                    <div className="text-xs mt-1 text-foreground/85 leading-snug">{h.signal}</div>
                    <div className="mt-1.5 h-0.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-amber-400/80" style={{ width: `${h.momentum}%` }} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      {/* Recent funding activity */}
      <section className="mt-8 rounded-lg border border-border bg-surface/30 p-5">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-lime" />
              <h2 className="font-display text-lg">Recent funding activity</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Live deal flow signal across the marketplace.</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs focus:outline-none focus:border-lime/60"
            >
              <option value="All">All sectors</option>
              {allSectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {filteredDeals.length === 0 ? (
          <div className="text-sm text-muted-foreground py-12 text-center">No deals in {sectorFilter} this period.</div>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="text-left font-normal py-2 px-5">Startup</th>
                  <th className="text-left font-normal py-2 px-3">Sector</th>
                  <th className="text-left font-normal py-2 px-3">Stage</th>
                  <th className="text-right font-normal py-2 px-3">Amount</th>
                  <th className="text-left font-normal py-2 px-3 hidden md:table-cell">Lead</th>
                  <th className="text-left font-normal py-2 px-3 hidden lg:table-cell">Geo</th>
                  <th className="text-right font-normal py-2 px-5">When</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map((d) => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-surface/60 transition">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        {d.hot && <Flame className="h-3.5 w-3.5 text-amber-400" />}
                        <span className="font-medium">{d.startup}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{d.sector}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex rounded border border-border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {d.stage}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-display tabular-nums">${d.amountM}M</td>
                    <td className="py-3 px-3 text-muted-foreground hidden md:table-cell">{d.leadInvestor}</td>
                    <td className="py-3 px-3 text-muted-foreground hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1">
                        <Globe2 className="h-3 w-3" /> {d.geography}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right text-xs text-muted-foreground tabular-nums">
                      {d.daysAgo}d ago
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Sector growth chart */}
      <section className="mt-8 rounded-lg border border-border bg-surface/30 p-5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-4 w-4 text-lime" />
          <h2 className="font-display text-lg">Sector growth — last 8 weeks</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Weekly deal volume across the top sectors.</p>
        <SectorBars sectors={sortedSectors.slice(0, 5)} />
      </section>
    </AppShell>
  );
}

/* ---------- pieces ---------- */

function KpiTile({ label, value, delta, positive }: { label: string; value: string; delta: string; positive: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-surface/40 p-5">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="font-display text-3xl">{value}</div>
        <span className={`inline-flex items-center gap-0.5 text-xs ${positive ? "text-lime" : "text-rose-400"}`}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </span>
      </div>
    </div>
  );
}

function SectorRow({
  sector, dealCount, totalRaisedM, growthPct, hotnessScore, spark,
}: typeof sectorTrends[number]) {
  const positive = growthPct >= 0;
  const max = Math.max(...spark);
  const min = Math.min(...spark);
  const range = max - min || 1;
  const pts = spark.map((v, i) => `${(i / (spark.length - 1)) * 100},${24 - ((v - min) / range) * 22}`).join(" ");

  return (
    <div className="grid grid-cols-12 items-center gap-3 rounded-md border border-border bg-surface/40 px-4 py-3 hover:border-lime/30 transition">
      <div className="col-span-4 sm:col-span-3 min-w-0">
        <div className="font-medium truncate">{sector}</div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {dealCount} deals · ${totalRaisedM.toLocaleString()}M
        </div>
      </div>
      <div className="col-span-3 sm:col-span-3">
        <svg viewBox="0 0 100 26" className="w-full h-7" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="var(--lime)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={pts}
          />
        </svg>
      </div>
      <div className="col-span-2 sm:col-span-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-lime" style={{ width: `${hotnessScore}%` }} />
          </div>
          <span className="text-[11px] font-display tabular-nums text-muted-foreground w-7 text-right">{hotnessScore}</span>
        </div>
      </div>
      <div className="col-span-3 sm:col-span-3 text-right">
        <span className={`inline-flex items-center gap-0.5 text-sm font-display tabular-nums ${positive ? "text-lime" : "text-rose-400"}`}>
          {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {positive ? "+" : ""}{growthPct}%
        </span>
      </div>
    </div>
  );
}

function SectorBars({ sectors }: { sectors: typeof sectorTrends }) {
  const allValues = sectors.flatMap((s) => s.spark);
  const max = Math.max(...allValues);
  const colors = ["var(--lime)", "oklch(0.75 0.18 75)", "oklch(0.7 0.18 250)", "oklch(0.7 0.2 320)", "oklch(0.7 0.2 25)"];

  return (
    <div className="space-y-3">
      {sectors.map((s, i) => (
        <div key={s.sector} className="flex items-center gap-3">
          <div className="w-28 shrink-0 text-xs truncate">{s.sector}</div>
          <div className="flex-1 flex items-end gap-1 h-12">
            {s.spark.map((v, j) => (
              <div
                key={j}
                className="flex-1 rounded-sm transition-all hover:opacity-80"
                style={{
                  height: `${(v / max) * 100}%`,
                  background: colors[i % colors.length],
                  opacity: 0.4 + (j / s.spark.length) * 0.6,
                }}
                title={`Week ${j + 1}: ${v} deals`}
              />
            ))}
          </div>
          <div className="w-16 shrink-0 text-right font-display text-sm tabular-nums">
            {s.spark[s.spark.length - 1]}<span className="text-[10px] text-muted-foreground ml-0.5">/wk</span>
          </div>
        </div>
      ))}
    </div>
  );
}
