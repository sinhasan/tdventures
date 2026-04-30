import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Gauge, Loader2, Sparkles, AlertCircle, CheckCircle2, AlertTriangle, ArrowUpRight, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { allSectors, allStages } from "@/lib/platform-data";
const scoreReadiness = async (input: any) => {
  return {
    score: 0,
    insights: [],
  };
};

export const Route = createFileRoute("/app/readiness")({
  head: () => ({ meta: [{ title: "Fundraising Readiness — Atlas Intelligence" }] }),
  component: ReadinessPage,
});

const productStages = ["idea", "prototype", "mvp", "beta", "launched", "scaling"] as const;

const productWeights: Record<string, number> = {
  idea: 10, prototype: 30, mvp: 55, beta: 75, launched: 90, scaling: 100,
};

function ReadinessPage() {
  const [sector, setSector] = useState<string>("AI Infra");
  const [stage, setStage] = useState<string>("Seed");
  const [traction, setTraction] = useState(40);
  const [team, setTeam] = useState(60);
  const [market, setMarket] = useState(70);
  const [product, setProduct] = useState<string>("mvp");
  const [deck, setDeck] = useState(50);

  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ReadinessResponse | null>(null);

  // Live local score preview (matches server formula) for instant feedback
  const liveScore = useMemo(() => {
    const productScore = productWeights[product] ?? 50;
    return Math.round(
      traction * 0.30 + team * 0.20 + market * 0.15 + productScore * 0.20 + deck * 0.15
    );
  }, [traction, team, market, product, deck]);

  const displayScore = response?.score ?? liveScore;

  const run = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await scoreReadiness({
        data: { traction, team, market, product, deck, sector, stage },
      });
      setResponse(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to score readiness");
    } finally {
      setRunning(false);
    }
  };

  return (
    <AppShell
      title="Fundraising Readiness"
      subtitle="Score your raise, identify gaps, and get AI-powered suggestions to improve."
      actions={
        <button
          onClick={run}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-md bg-lime px-4 py-2 text-sm font-medium text-lime-foreground hover:bg-lime/90 disabled:opacity-60"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {running ? "Analyzing…" : response ? "Re-run analysis" : "Run AI analysis"}
        </button>
      }
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
        {/* Inputs */}
        <div className="space-y-6">
          <Card title="Startup signals" subtitle="Adjust the inputs to model your raise.">
            <div className="grid sm:grid-cols-2 gap-5">
              <Select label="Sector" value={sector} onChange={setSector} options={allSectors} />
              <Select label="Stage" value={stage} onChange={setStage} options={allStages} />
              <Select
                label="Product stage"
                value={product}
                onChange={setProduct}
                options={productStages as unknown as string[]}
              />
            </div>

            <div className="mt-6 space-y-5">
              <Slider label="Traction (revenue / users)" hint="0 = pre-revenue, 100 = strong recurring revenue & growth" value={traction} onChange={setTraction} />
              <Slider label="Team experience" hint="0 = first-time founders, 100 = repeat operators with domain expertise" value={team} onChange={setTeam} />
              <Slider label="Market size" hint="0 = niche, 100 = multi-billion TAM with tailwinds" value={market} onChange={setMarket} />
              <Slider label="Pitch deck quality" hint="0 = rough draft, 100 = investor-ready, data-rich narrative" value={deck} onChange={setDeck} />
            </div>
          </Card>

          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm flex gap-2">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-destructive">Analysis failed</div>
                <div className="text-muted-foreground mt-0.5">{error}</div>
              </div>
            </div>
          )}

          {/* AI output */}
          {response && (
            <div className="space-y-6">
              <Card title="AI verdict">
                <p className="text-sm leading-relaxed">{response.verdict}</p>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card title="Strengths" icon={<CheckCircle2 className="h-4 w-4 text-lime" />}>
                  <ul className="space-y-2 text-sm">
                    {response.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-lime mt-1">▸</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card title="Weaknesses" icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}>
                  <ul className="space-y-2 text-sm">
                    {response.weaknesses.map((w, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-amber-400 mt-1">▸</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <Card title="Suggestions to improve" icon={<Sparkles className="h-4 w-4 text-lime" />}>
                <ul className="space-y-3">
                  {response.suggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3 rounded-md border border-border bg-surface/40 p-3">
                      <PriorityBadge priority={s.priority} />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{s.area}</div>
                        <div className="text-sm mt-0.5">{s.suggestion}</div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </div>

        {/* Sticky gauge */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card title="Readiness score" icon={<Gauge className="h-4 w-4 text-lime" />}>
            <Speedometer value={displayScore} />
            <div className="mt-4 text-center">
              <div className="font-display text-5xl">{displayScore}</div>
              <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1">
                {response ? "AI-validated" : "Live preview"} · /100
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{verdictTier(displayScore)}</div>
            </div>
          </Card>

          <Card title="Score breakdown">
            <div className="space-y-2.5">
              <Bar label="Traction" value={traction} weight={30} />
              <Bar label="Team" value={team} weight={20} />
              <Bar label="Market" value={market} weight={15} />
              <Bar label="Product" value={productWeights[product] ?? 50} weight={20} />
              <Bar label="Deck" value={deck} weight={15} />
            </div>
          </Card>

          {response && (
            <button
              onClick={run}
              disabled={running}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs hover:bg-surface/70"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Re-analyze
            </button>
          )}
        </aside>
      </div>
    </AppShell>
  );
}

/* ---------- Pieces ---------- */

function Card({ title, subtitle, icon, children }: { title: string; subtitle?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface/30 p-5">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <h2 className="font-display text-lg">{title}</h2>
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>}
      <div className={subtitle ? "" : "mt-3"}>{children}</div>
    </section>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] | string[] }) {
  return (
    <label className="block">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:border-lime/60 capitalize"
      >
        {options.map((o) => <option key={o} value={o} className="capitalize">{o}</option>)}
      </select>
    </label>
  );
}

function Slider({ label, hint, value, onChange }: { label: string; hint?: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <div className="text-sm font-medium">{label}</div>
        <div className="font-display text-lg tabular-nums">{value}</div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-lime"
      />
      {hint && <div className="text-[11px] text-muted-foreground mt-1">{hint}</div>}
    </div>
  );
}

function Bar({ label, value, weight }: { label: string; value: number; weight: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label} <span className="opacity-60">· {weight}%</span></span>
        <span className="tabular-nums">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div className="h-full bg-lime transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-destructive/15 text-destructive border-destructive/30",
    medium: "bg-amber-400/15 text-amber-400 border-amber-400/30",
    low: "bg-lime/15 text-lime border-lime/30",
  }[priority];
  return (
    <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${styles}`}>
      {priority}
    </span>
  );
}

function verdictTier(score: number): string {
  if (score >= 85) return "Investor-ready · go raise";
  if (score >= 70) return "Strong — tighten weak spots";
  if (score >= 55) return "Promising · close key gaps";
  if (score >= 40) return "Early · build before you raise";
  return "Pre-raise · focus on fundamentals";
}

/* ---------- Speedometer (semicircular SVG gauge) ---------- */

function Speedometer({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const angle = (v / 100) * 180; // 0..180 deg
  const r = 80;
  const cx = 100;
  const cy = 100;
  // Needle endpoint
  const rad = (Math.PI * (180 - angle)) / 180;
  const nx = cx + Math.cos(rad) * (r - 8);
  const ny = cy - Math.sin(rad) * (r - 8);

  // Arc helper
  const arcPath = (startDeg: number, endDeg: number) => {
    const s = (Math.PI * (180 - startDeg)) / 180;
    const e = (Math.PI * (180 - endDeg)) / 180;
    const x1 = cx + Math.cos(s) * r;
    const y1 = cy - Math.sin(s) * r;
    const x2 = cx + Math.cos(e) * r;
    const y2 = cy - Math.sin(e) * r;
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <svg viewBox="0 0 200 120" className="w-full">
      {/* Track segments */}
      <path d={arcPath(0, 40)} stroke="oklch(0.55 0.18 25)" strokeWidth="12" fill="none" strokeLinecap="butt" opacity="0.35" />
      <path d={arcPath(40, 70)} stroke="oklch(0.75 0.15 75)" strokeWidth="12" fill="none" strokeLinecap="butt" opacity="0.35" />
      <path d={arcPath(70, 180)} stroke="var(--lime)" strokeWidth="12" fill="none" strokeLinecap="butt" opacity="0.35" />
      {/* Active arc */}
      <path
        d={arcPath(0, angle)}
        stroke="var(--lime)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        style={{ transition: "all 0.5s ease" }}
      />
      {/* Tick labels */}
      <text x="20" y="115" className="fill-muted-foreground" fontSize="8" fontFamily="monospace">0</text>
      <text x="95" y="20" className="fill-muted-foreground" fontSize="8" fontFamily="monospace" textAnchor="middle">50</text>
      <text x="178" y="115" className="fill-muted-foreground" fontSize="8" fontFamily="monospace">100</text>
      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ transition: "all 0.5s ease" }}
      />
      <circle cx={cx} cy={cy} r="5" fill="currentColor" />
      <circle cx={cx} cy={cy} r="2" className="fill-background" />
    </svg>
  );
}
