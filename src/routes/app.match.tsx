import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2, MapPin, Mail, ArrowUpRight, RefreshCw, AlertCircle, CheckCircle2, DollarSign, Layers, Globe2, Briefcase } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { allSectors, allStages, allGeos, type Investor } from "@/lib/platform-data";
const aiMatchInvestors = async () => {
  return { matches: [] };
};

export const Route = createFileRoute("/app/match")({
  head: () => ({ meta: [{ title: "AI Match — Atlas Intelligence" }] }),
  component: MatchPage,
});

function MatchPage() {
  const [sector, setSector] = useState<string>(allSectors[0] ?? "");
  const [stage, setStage] = useState<string>(allStages.includes("Seed") ? "Seed" : (allStages[0] ?? ""));
  const [fundingAsk, setFundingAsk] = useState<number>(2000); // $K
  const [geography, setGeography] = useState<string>(allGeos[0] ?? "");

  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const run = async () => {
    setRunning(true);
    setError(null);
    try {
      const aiMatchInvestors = async (input: any) => {
  return { results: [], generatedAt: new Date().toISOString() };
};
      setResponse(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run AI match");
    } finally {
      setRunning(false);
    }
  };

  return (
    <AppShell
      title="AI Investor Match"
      subtitle="Our model scores investors against your fundraise signals — with explanations."
    >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left filter panel */}
        <aside className="rounded-xl border border-border bg-surface p-6 h-fit lg:sticky lg:top-24 space-y-6">
          <div>
            <h2 className="font-display text-lg">Match criteria</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Tune the inputs, run the engine.</p>
          </div>

          <PickerField label="Sector" icon={Briefcase} value={sector} setValue={setSector} options={allSectors} />
          <PickerField label="Stage" icon={Layers} value={stage} setValue={setStage} options={allStages} />
          <PickerField label="Geography" icon={Globe2} value={geography} setValue={setGeography} options={allGeos} />

          {/* Funding ask */}
          <div>
            <label className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><DollarSign className="h-3 w-3" /> Funding ask</span>
              <span className="text-lime">${formatK(fundingAsk)}</span>
            </label>
            <input
              type="range"
              min={100}
              max={20000}
              step={100}
              value={fundingAsk}
              onChange={(e) => setFundingAsk(Number(e.target.value))}
              className="mt-3 w-full accent-lime"
            />
            <div className="flex justify-between font-mono text-[9px] text-muted-foreground mt-1">
              <span>$100K</span>
              <span>$20M</span>
            </div>
          </div>

          <div className="rounded-lg border border-lime/30 bg-lime/5 p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-lime mb-2">How matching works</div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>· Sector & stage thesis fit</li>
              <li>· Ticket size overlap with ask</li>
              <li>· Geography & response history</li>
              <li>· AI-generated reasoning per match</li>
            </ul>
          </div>

          <button
            onClick={run}
            disabled={running}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-lime px-4 py-3 text-sm font-medium text-lime-foreground hover:opacity-90 transition disabled:opacity-60 shadow-[var(--shadow-glow)]"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {running ? "Scoring with AI..." : response ? "Re-run match" : "Run AI match"}
          </button>
        </aside>

        {/* Results */}
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {response ? `${response.results.length} ranked matches` : "Awaiting your criteria"}
              </p>
              <h2 className="mt-1 font-display text-2xl">Recommended investors</h2>
            </div>
            {response && (
              <button onClick={run} disabled={running} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-lime transition disabled:opacity-50">
                <RefreshCw className={`h-3.5 w-3.5 ${running ? "animate-spin" : ""}`} /> Refresh
              </button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 mb-4 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-destructive">Match failed</div>
                <div className="text-xs text-muted-foreground mt-0.5">{error}</div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!response && !running && !error && (
            <div className="rounded-xl border border-dashed border-border bg-surface/50 p-12 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-lime/10 grid place-items-center">
                <Sparkles className="h-5 w-5 text-lime" />
              </div>
              <h3 className="mt-5 font-display text-2xl">Ready to find your investors</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Set your sector, stage, ask, and geography on the left, then run the AI match engine.
              </p>
            </div>
          )}

          {/* Loading skeletons */}
          {running && !response && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-border bg-surface p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-2 bg-muted rounded w-full mt-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {response && (
            <div className="space-y-3">
              {response.results.length === 0 && (
                <div className="rounded-lg border border-border bg-surface p-12 text-center">
                  <p className="font-display text-xl">No strong matches found.</p>
                  <p className="mt-2 text-sm text-muted-foreground">Try widening your sector or geography.</p>
                </div>
              )}
              {response.results.map((r, idx) => (
                <MatchCard
                  key={r.investorId}
                  rank={idx + 1}
                  investor={r.investor}
                  score={r.score}
                  reasons={r.reasons}
                  connected={connected[r.investorId]}
                  onConnect={() => setConnected((c) => ({ ...c, [r.investorId]: true }))}
                />
              ))}
              {response.results.length > 0 && (
                <p className="text-center text-xs text-muted-foreground pt-3">
                  Generated {new Date(response.generatedAt).toLocaleTimeString()} · powered by Lovable AI
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function PickerField({
  label,
  icon: Icon,
  value,
  setValue,
  options,
}: {
  label: string;
  icon: typeof Briefcase;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-lime/60"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function MatchCard({
  rank,
  investor,
  score,
  reasons,
  connected,
  onConnect,
}: {
  rank: number;
  investor: Investor;
  score: number;
  reasons: string[];
  connected: boolean | undefined;
  onConnect: () => void;
}) {
  const colorMap: Record<string, string> = {
    lime: "bg-lime/20 text-lime", blue: "bg-blue-500/20 text-blue-300",
    amber: "bg-amber-500/20 text-amber-300", rose: "bg-rose-500/20 text-rose-300",
    violet: "bg-violet-500/20 text-violet-300", teal: "bg-teal-500/20 text-teal-300",
  };
  const initials = investor.name.split(" ").map((p) => p[0]).join("");
  const tone = score >= 85 ? "lime" : score >= 70 ? "amber" : "muted";
  const scoreColor = tone === "lime" ? "text-lime" : tone === "amber" ? "text-amber-300" : "text-muted-foreground";
  const barColor = tone === "lime" ? "bg-lime" : tone === "amber" ? "bg-amber-300" : "bg-muted-foreground";

  return (
    <article className={`rounded-xl border bg-surface p-6 transition hover:border-lime/40 ${rank === 1 ? "border-lime/50 shadow-[var(--shadow-glow)]" : "border-border"}`}>
      <div className="flex items-start gap-4">
        <div className="font-mono text-xs text-muted-foreground w-6 text-center pt-1">#{rank}</div>
        <div className={`h-12 w-12 rounded-full grid place-items-center font-display font-bold shrink-0 ${colorMap[investor.avatar] ?? colorMap.lime}`}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-xl">{investor.name}</h3>
                {rank === 1 && (
                  <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-lime text-lime-foreground">
                    Top pick
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">
                {investor.firm} · {investor.type} · <MapPin className="inline h-3 w-3" /> {investor.geography}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className={`font-display text-3xl ${scoreColor} leading-none`}>{score}</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-1">match score</div>
            </div>
          </div>

          {/* Score progress bar */}
          <div className="mt-4">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${barColor}`}
                style={{ width: `${score}%` }}
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Match score ${score} out of 100`}
              />
            </div>
          </div>

          {/* Reasons */}
          {reasons.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-lime shrink-0 mt-0.5" strokeWidth={2} />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span><span className="font-mono uppercase tracking-widest text-[9px]">Ticket</span> ${investor.ticketMin}–{investor.ticketMax}K</span>
            <span><span className="font-mono uppercase tracking-widest text-[9px]">Stages</span> {investor.stages.join(", ")}</span>
            <span><span className="font-mono uppercase tracking-widest text-[9px]">Response</span> {investor.responseRate}%</span>
            <span><span className="font-mono uppercase tracking-widest text-[9px]">Portfolio</span> {investor.portfolio}</span>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={onConnect}
              disabled={connected}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium transition ${
                connected
                  ? "bg-lime/15 text-lime cursor-default"
                  : "bg-lime text-lime-foreground hover:opacity-90"
              }`}
            >
              {connected ? <><CheckCircle2 className="h-3.5 w-3.5" /> Connection requested</> : <><Mail className="h-3.5 w-3.5" /> Connect</>}
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs hover:border-lime/40 transition">
              View profile <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatK(k: number): string {
  if (k >= 1000) return `${(k / 1000).toFixed(k % 1000 === 0 ? 0 : 1)}M`;
  return `${k}K`;
}
