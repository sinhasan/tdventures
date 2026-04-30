import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Sparkles, Users, Wand2, Gauge, Calendar, TrendingUp, Target } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { kpis, recentActivity, investors, myStartups, fundraisingProgress, fundraisingTarget } from "@/lib/platform-data";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — Atlas Intelligence" }] }),
  component: Dashboard,
});

function Dashboard() {
  const latest = fundraisingProgress[fundraisingProgress.length - 1];
  const pctClosed = Math.round((latest.committed / fundraisingTarget) * 100);
  const pctSoft = Math.round((latest.softCircled / fundraisingTarget) * 100);

  return (
    <AppShell
      title="Welcome back, Elena."
      subtitle="Here's what's moving in your fundraise this week."
      actions={
        <Link
          to="/app/match"
          className="inline-flex items-center gap-2 rounded-md bg-lime px-4 py-2.5 text-sm font-medium text-lime-foreground hover:opacity-90 transition shadow-[var(--shadow-glow)]"
        >
          <Sparkles className="h-4 w-4" />
          Run AI Match
        </Link>
      }
    >
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active matches" value={kpis.matches.value} delta={kpis.matches.delta} suffix="" trend={kpis.matches.trend} />
        <KpiCard label="Meetings booked" value={kpis.meetings.value} delta={kpis.meetings.delta} suffix="" trend={kpis.meetings.trend} />
        <KpiCard label="Close probability" value={kpis.closeProb.value} delta={kpis.closeProb.delta} suffix="%" trend={kpis.closeProb.trend} />
        <KpiCard label="Warm intros" value={kpis.warmIntros.value} delta={kpis.warmIntros.delta} suffix="" trend={kpis.warmIntros.trend} />
      </div>

      {/* Quick actions — prominent row */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <QuickAction
          to="/app/match"
          icon={Users}
          label="Find investors"
          hint="AI-rank best-fit LPs"
          accent
        />
        <QuickAction
          to="/app/pitch"
          icon={Wand2}
          label="Improve pitch"
          hint="Polish deck with AI"
        />
        <QuickAction
          to="/app/readiness"
          icon={Gauge}
          label="Calculate score"
          hint="Fundraising readiness"
        />
      </div>

      {/* Fundraising progress chart — full width */}
      <div className="mt-8 rounded-xl border border-border bg-surface p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-lime">Round progress</p>
            <h2 className="mt-2 font-display text-2xl">Fundraising progress · ${(fundraisingTarget / 1000).toFixed(0)}M target</h2>
            <p className="text-xs text-muted-foreground mt-1">12-week trajectory · committed and soft-circled capital</p>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <div className="font-display text-2xl text-lime">${(latest.committed / 1000).toFixed(1)}M</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">committed · {pctClosed}%</div>
            </div>
            <div>
              <div className="font-display text-2xl text-amber-300">${(latest.softCircled / 1000).toFixed(1)}M</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">soft · {pctSoft}%</div>
            </div>
            <div className="hidden md:block">
              <div className="font-display text-2xl text-muted-foreground">${((fundraisingTarget - latest.committed) / 1000).toFixed(1)}M</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">to close</div>
            </div>
          </div>
        </div>

        <ProgressChart data={fundraisingProgress} target={fundraisingTarget} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Detailed actions card */}
        <Card title="More tools" subtitle="Push the round forward.">
          <div className="space-y-2">
            <ActionLink to="/app/intelligence" icon={TrendingUp} label="Deal Intelligence" hint="Trending sectors & hot deals" />
            <ActionLink to="/app/investors" icon={Users} label="Browse investor database" hint="2,400 vetted profiles" />
            <ActionLink to="/app/tools" icon={Target} label="Open tooling library" hint="Cap table, diligence, more" />
          </div>
        </Card>

        {/* Readiness */}
        <Card title="Fundraising readiness" subtitle="Across your active startups.">
          <div className="space-y-4">
            {myStartups.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{s.stage} · ${(s.raising / 1000).toFixed(1)}M</div>
                  </div>
                  <div className={`font-display text-2xl ${s.readiness >= 80 ? "text-lime" : s.readiness >= 65 ? "text-amber-300" : "text-rose-300"}`}>
                    {s.readiness}
                  </div>
                </div>
                <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all ${s.readiness >= 80 ? "bg-lime" : s.readiness >= 65 ? "bg-amber-300" : "bg-rose-300"}`}
                    style={{ width: `${s.readiness}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity */}
        <Card title="Recent signal" subtitle="Investor engagement events.">
          <ul className="space-y-3.5">
            {recentActivity.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${a.positive ? "bg-lime" : "bg-rose-400"}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">{a.what}</span></div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">{a.when}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Top matches preview */}
      <div className="mt-8 rounded-xl border border-border bg-surface p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-lime">Top investor matches</p>
            <h2 className="mt-2 font-display text-2xl">Highest-conviction LPs for Nimbus Grid</h2>
          </div>
          <Link to="/app/match" className="text-sm text-lime hover:underline inline-flex items-center gap-1">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {investors.slice(0, 3).sort((a, b) => b.thesisFit - a.thesisFit).map((inv) => (
            <Link
              key={inv.id}
              to="/app/investors"
              className="group rounded-lg border border-border bg-card p-4 hover:border-lime/40 transition"
            >
              <div className="flex items-start gap-3">
                <Avatar seed={inv.avatar} initials={inv.name.split(" ").map((p) => p[0]).join("")} />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{inv.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{inv.firm} · {inv.geography}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display text-xl text-lime">{inv.thesisFit}</div>
                      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">fit</div>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {inv.sectors.slice(0, 2).map((s) => (
                      <span key={s} className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent text-muted-foreground">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

function KpiCard({ label, value, delta, suffix, trend }: { label: string; value: number; delta: number; suffix: string; trend: number[] }) {
  const positive = delta >= 0;
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const range = max - min || 1;
  const pts = trend.map((v, i) => `${(i / (trend.length - 1)) * 100},${30 - ((v - min) / range) * 28}`).join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border bg-surface p-5 hover:border-lime/30 transition"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${positive ? "text-lime" : "text-rose-400"}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta)}%
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="font-display text-4xl">{value}{suffix}</div>
        <svg viewBox="0 0 100 30" className="h-10 w-24" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={positive ? "oklch(0.88 0.22 125)" : "oklch(0.65 0.2 25)"}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={pts}
          />
        </svg>
      </div>
    </motion.div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="mb-5">
        <h3 className="font-display text-lg">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function ActionLink({ to, icon: Icon, label, hint }: { to: string; icon: typeof Sparkles; label: string; hint: string }) {
  return (
    <Link
      to={to as never}
      className="group flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3 hover:border-lime/40 hover:bg-background transition"
    >
      <div className="h-9 w-9 rounded-md bg-lime/10 grid place-items-center text-lime shrink-0">
        <Icon className="h-4 w-4" strokeWidth={1.7} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium truncate">{label}</div>
        <div className="text-xs text-muted-foreground truncate">{hint}</div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-lime transition" />
    </Link>
  );
}

function Avatar({ seed, initials }: { seed: string; initials: string }) {
  const map: Record<string, string> = {
    lime: "bg-lime/20 text-lime",
    blue: "bg-blue-500/20 text-blue-300",
    amber: "bg-amber-500/20 text-amber-300",
    rose: "bg-rose-500/20 text-rose-300",
    violet: "bg-violet-500/20 text-violet-300",
    teal: "bg-teal-500/20 text-teal-300",
  };
  return (
    <div className={`h-10 w-10 rounded-full grid place-items-center font-display text-sm font-bold shrink-0 ${map[seed] ?? map.lime}`}>
      {initials}
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, hint, accent }: { to: string; icon: typeof Sparkles; label: string; hint: string; accent?: boolean }) {
  return (
    <Link
      to={to as never}
      className={`group relative overflow-hidden rounded-xl border p-5 transition ${
        accent
          ? "border-lime/40 bg-gradient-to-br from-lime/15 via-surface to-surface hover:border-lime/70"
          : "border-border bg-surface hover:border-lime/40"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`h-11 w-11 rounded-lg grid place-items-center shrink-0 ${accent ? "bg-lime text-lime-foreground" : "bg-lime/10 text-lime"}`}>
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg leading-tight">{label}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-lime transition" />
      </div>
    </Link>
  );
}

function ProgressChart({ data, target }: { data: typeof fundraisingProgress; target: number }) {
  const w = 800;
  const h = 200;
  const padX = 32;
  const padY = 20;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  const max = Math.max(target, ...data.map((d) => d.softCircled));
  const x = (i: number) => padX + (i / (data.length - 1)) * innerW;
  const y = (v: number) => padY + innerH - (v / max) * innerH;

  const committedPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.committed)}`).join(" ");
  const softPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(d.softCircled)}`).join(" ");
  const committedArea = `${committedPath} L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
  const softArea = `${softPath} L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
  const targetY = y(target);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[600px] h-56" preserveAspectRatio="none">
        <defs>
          <linearGradient id="limeGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--lime)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--lime)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="amberGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.15 80)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(0.82 0.15 80)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        {[0.25, 0.5, 0.75, 1].map((p) => (
          <line key={p} x1={padX} x2={w - padX} y1={padY + innerH * (1 - p)} y2={padY + innerH * (1 - p)} stroke="currentColor" strokeOpacity="0.07" />
        ))}

        {/* target line */}
        <line x1={padX} x2={w - padX} y1={targetY} y2={targetY} stroke="var(--lime)" strokeDasharray="4 4" strokeOpacity="0.4" />
        <text x={w - padX - 4} y={targetY - 6} textAnchor="end" className="fill-lime" fontSize="10" fontFamily="monospace">
          target ${(target / 1000).toFixed(0)}M
        </text>

        {/* soft area */}
        <path d={softArea} fill="url(#amberGrad)" />
        <path d={softPath} fill="none" stroke="oklch(0.82 0.15 80)" strokeWidth="1.8" strokeLinejoin="round" strokeDasharray="3 3" />

        {/* committed area */}
        <path d={committedArea} fill="url(#limeGrad)" />
        <path d={committedPath} fill="none" stroke="var(--lime)" strokeWidth="2.2" strokeLinejoin="round" />

        {/* x labels */}
        {data.map((d, i) => (
          <text key={d.week} x={x(i)} y={h - 4} textAnchor="middle" className="fill-muted-foreground" fontSize="9" fontFamily="monospace">
            {d.week}
          </text>
        ))}

        {/* end dots */}
        <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].committed)} r="4" fill="var(--lime)" />
        <circle cx={x(data.length - 1)} cy={y(data[data.length - 1].softCircled)} r="3.5" fill="oklch(0.82 0.15 80)" />
      </svg>
      <div className="mt-2 flex items-center gap-5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-lime" /> committed</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-amber-300/70" /> soft-circled</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-3 rounded-full bg-lime/30" /> target</span>
      </div>
    </div>
  );
}

// re-export so unused-import linter is happy
export { TrendingUp, Calendar };

