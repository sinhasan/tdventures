import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, CheckCircle2, AlertCircle, ArrowRight, FileText, BarChart3, Users2, Shield } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { myStartups } from "@/lib/platform-data";

export const Route = createFileRoute("/app/startups")({
  head: () => ({ meta: [{ title: "Startups — Atlas Intelligence" }] }),
  component: StartupsPage,
});

const dimensions = [
  { key: "team", icon: Users2, label: "Team & founders", score: 92, hint: "Founder-market fit verified" },
  { key: "metrics", icon: BarChart3, label: "Metrics & traction", score: 88, hint: "$3.4M ARR · 22% MoM" },
  { key: "deck", icon: FileText, label: "Deck & narrative", score: 76, hint: "Add competitive moat slide" },
  { key: "diligence", icon: Shield, label: "Diligence readiness", score: 64, hint: "Missing: cap table v3, code audit" },
];

function StartupsPage() {
  const [active, setActive] = useState(myStartups[0]);
  const overall = active.readiness;

  return (
    <AppShell
      title="Startup Profiles"
      subtitle="Manage your fundraising entities and track readiness."
      actions={
        <button className="inline-flex items-center gap-2 rounded-md bg-lime px-4 py-2.5 text-sm font-medium text-lime-foreground hover:opacity-90 transition">
          <Plus className="h-4 w-4" /> New startup
        </button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar list */}
        <div className="space-y-2">
          {myStartups.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s)}
              className={`w-full text-left rounded-lg border p-4 transition ${
                active.id === s.id ? "border-lime/50 bg-lime/5" : "border-border bg-surface hover:border-lime/30"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate">{s.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.sector} · {s.stage}</div>
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-widest shrink-0 ${
                  s.status === "Active" ? "text-lime" : s.status === "Drafting" ? "text-amber-300" : "text-muted-foreground"
                }`}>
                  {s.status}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-lime" style={{ width: `${s.readiness}%` }} />
                </div>
                <span className="text-xs font-mono text-muted-foreground">{s.readiness}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Score hero */}
          <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
            <div className="grid gap-8 md:grid-cols-[200px_1fr] items-center">
              <div className="relative">
                <ScoreRing score={overall} />
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-lime">Fundraising readiness</p>
                <h2 className="mt-2 font-display text-3xl">{active.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your profile is in the <span className="text-foreground font-medium">top 18%</span> of {active.stage} startups
                  on Atlas. Closing this gap unlocks ~12 additional aligned investors.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="inline-flex items-center gap-1.5 rounded-md bg-lime px-4 py-2 text-sm font-medium text-lime-foreground hover:opacity-90 transition">
                    Improve score <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm hover:border-lime/40 transition">
                    Export profile PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
            <h3 className="font-display text-xl mb-5">Score breakdown</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {dimensions.map((d) => (
                <div key={d.key} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-lime/10 grid place-items-center text-lime">
                        <d.icon className="h-4 w-4" strokeWidth={1.7} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{d.label}</div>
                        <div className="text-xs text-muted-foreground">{d.hint}</div>
                      </div>
                    </div>
                    <div className={`font-display text-2xl ${d.score >= 80 ? "text-lime" : d.score >= 65 ? "text-amber-300" : "text-rose-300"}`}>
                      {d.score}
                    </div>
                  </div>
                  <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full ${d.score >= 80 ? "bg-lime" : d.score >= 65 ? "bg-amber-300" : "bg-rose-300"}`} style={{ width: `${d.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-xl border border-border bg-surface p-6 md:p-8">
            <h3 className="font-display text-xl mb-5">AI recommendations</h3>
            <ul className="space-y-3">
              <Recommendation type="warn" text="Upload your latest cap table — investors expect v3 with SAFE conversion." />
              <Recommendation type="warn" text="Your deck is missing a slide on competitive moat. We can draft one in 30 seconds." />
              <Recommendation type="ok" text="Founder bios and team section are best-in-class for your stage." />
              <Recommendation type="ok" text="Your traction metrics chart is publicly verifiable — investors love this." />
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative h-40 w-40 mx-auto">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={r} stroke="oklch(0.23 0.014 250)" strokeWidth="12" fill="none" />
        <circle
          cx="80" cy="80" r={r}
          stroke="oklch(0.88 0.22 125)"
          strokeWidth="12" fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-5xl text-lime">{score}</div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</div>
        </div>
      </div>
    </div>
  );
}

function Recommendation({ type, text }: { type: "ok" | "warn"; text: string }) {
  const Icon = type === "ok" ? CheckCircle2 : AlertCircle;
  return (
    <li className="flex items-start gap-3 rounded-md border border-border bg-card p-3">
      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${type === "ok" ? "text-lime" : "text-amber-300"}`} strokeWidth={1.7} />
      <span className="text-sm">{text}</span>
    </li>
  );
}
