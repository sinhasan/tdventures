import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Eye,
  Target,
  Rocket,
  TrendingUp,
  AlertTriangle,
  Check,
  Clock,
  Trophy,
  Quote,
  Zap,
  ShieldCheck,
} from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { CtaSection } from "@/components/cta-section";

/* ───────────────────── Polish primitives ───────────────────── */
function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({
  children,
  tone = "lime",
}: {
  children: ReactNode;
  tone?: "lime" | "destructive";
}) {
  const color = tone === "lime" ? "text-lime" : "text-destructive";
  return (
    <p className={`eyebrow-line font-mono text-[11px] uppercase tracking-[0.18em] ${color}`}>
      {children}
    </p>
  );
}

function CountUp({
  to,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const [val, setVal] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    const fmt = (v: number) =>
      decimals > 0
        ? v.toFixed(decimals)
        : Math.round(v).toLocaleString();
    const unsub = mv.on("change", (v) => setVal(`${prefix}${fmt(v)}${suffix}`));
    return unsub;
  }, [mv, prefix, suffix, decimals]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, mv, to]);

  return <span ref={ref}>{val}</span>;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TD Ventures — Fundraising Intelligence Platform" },
      {
        name: "description",
        content:
          "The investor-grade operating system for fundraising. 500+ vetted investors, $20M+ raised, AI-powered matching, scoring, and execution.",
      },
      { property: "og:title", content: "TD Ventures — Fundraising Intelligence Platform" },
      {
        property: "og:description",
        content:
          "Visibility, conversion, execution. The operating system founders use to close rounds 3× faster.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <LogoBar />
      <ProblemSection />
      <PipelineSection />
      <UnicornShowSection />
      <BenefitsSection />
      <ScoreCalculator />
      <SocialProofSection />
      <PricingSection />
      <UrgencySection />
      <CtaSection />
    </>
  );
}

/* ───────────────────────── HERO ───────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/65 to-background" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-radial-spot" />
        {/* Ambient orbs */}
        <div className="orb-float absolute top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-lime/15 blur-[120px]" />
        <div className="orb-float-slow absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-lime/[0.07] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-28 md:pt-36 md:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Fundraising Intelligence · Live Cohort Q2
            </span>
          </div>

          <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95]">
            Raise capital
            <br />
            <span className="text-lime">like the top 1%</span>
            <br />
            <span className="text-muted-foreground">of founders.</span>
          </h1>

          <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
            TD Ventures is the operating system for modern fundraising — investor
            intelligence, AI-driven matching, and execution support that turns cold lists
            into closed rounds.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/app"
              className="cta-sheen group inline-flex items-center gap-2 rounded-md bg-lime px-6 py-3.5 text-sm font-medium text-lime-foreground hover:opacity-95 transition shadow-[var(--shadow-glow)]"
            >
              Launch the platform
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <a
              href="#calculator"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-6 py-3.5 text-sm font-medium hover:border-lime/40 hover:bg-background/80 transition backdrop-blur"
            >
              Score my round
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            {[
              { node: <><CountUp to={500} suffix="+" /></>, l: "Vetted investors" },
              { node: <><CountUp to={20} prefix="$" suffix="M+" /></>, l: "Raised on platform" },
              { node: <><CountUp to={47} suffix=" days" /></>, l: "Median close time" },
              { node: <><CountUp to={3.4} decimals={1} suffix="×" /></>, l: "Higher reply rate" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="card-lift rounded-lg border border-border bg-surface/60 backdrop-blur p-4 hover:border-lime/30"
              >
                <div className="font-display text-3xl md:text-4xl text-lime tabular-nums">
                  {s.node}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.l}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────── LOGO BAR ─────────────────────── */
function LogoBar() {
  return (
    <div className="border-y border-border/60 bg-background/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center gap-x-12 gap-y-3 justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Founders raised from
        </span>
        <div className="flex flex-wrap gap-x-10 gap-y-2 font-display text-lg text-muted-foreground/70">
          <span>Sequoia</span>
          <span>Index</span>
          <span>Accel</span>
          <span>a16z</span>
          <span>Lightspeed</span>
          <span>Y Combinator</span>
          <span>Tiger</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── PROBLEM ──────────────────────── */
function ProblemSection() {
  const problems = [
    {
      stat: "73%",
      title: "Wrong investor targeting",
      desc: "Founders waste 4 months pitching investors who never fund their stage, sector, or geography.",
    },
    {
      stat: "61%",
      title: "Weak narrative",
      desc: "Decks fail the 30-second test. Investors skim, don't reply, and the round stalls before it starts.",
    },
    {
      stat: "84%",
      title: "No execution layer",
      desc: "Spreadsheets, cold emails, and broken CRMs. No signal on who's warm, who's ghosting, who's about to wire.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 mt-32">
      <div className="max-w-3xl">
        <Eyebrow tone="destructive">The problem</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
          90% of startups <span className="text-muted-foreground">fail to raise</span> —
          not because the idea is bad.
        </h2>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          They run an unstructured process against a market that has compressed, gone quiet,
          and gotten ruthless about quality of signal.
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {problems.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <div className="card-lift group rounded-xl border border-border bg-surface p-8 hover:border-destructive/40 hover:bg-surface-elevated h-full">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" strokeWidth={1.5} />
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Failure mode
                </span>
              </div>
              <div className="mt-6 font-display text-5xl text-destructive">{p.stat}</div>
              <h3 className="mt-4 font-display text-xl">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────── PRODUCT PIPELINE ─────────────────── */
function PipelineSection() {
  const stages = [
    {
      icon: Eye,
      n: "01",
      t: "Visibility",
      sub: "Get on every relevant radar.",
      d: "AI ranks 500+ investors against your sector, stage, ticket, and geography. No more guessing who to chase.",
      kpis: [
        { k: "Investor matches", v: "120+" },
        { k: "Targeting accuracy", v: "94%" },
      ],
    },
    {
      icon: Target,
      n: "02",
      t: "Conversion",
      sub: "Turn meetings into term sheets.",
      d: "Pitch polish, narrative scoring, and warm-intro pathing built on what actually closes rounds in your category.",
      kpis: [
        { k: "Reply rate uplift", v: "3.4×" },
        { k: "Meeting → IC", v: "38%" },
      ],
    },
    {
      icon: Rocket,
      n: "03",
      t: "Execution",
      sub: "Close, paper, wire — clean.",
      d: "Pipeline CRM, diligence rooms, term sheet templates, and signal tracking until the funds hit your account.",
      kpis: [
        { k: "Close time", v: "47d" },
        { k: "Drop-off rate", v: "−62%" },
      ],
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 mt-32">
      <div className="flex items-end justify-between gap-6 mb-14">
        <Reveal>
          <Eyebrow>Product pipeline</Eyebrow>
          <h2 className="mt-3 font-display text-4xl md:text-5xl max-w-2xl leading-tight">
            Visibility <span className="text-muted-foreground">→</span> Conversion{" "}
            <span className="text-muted-foreground">→</span>{" "}
            <span className="text-lime">Execution</span>
          </h2>
        </Reveal>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-3 rounded-xl overflow-hidden border border-border">
        {stages.map((s, idx) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="bg-surface p-8 hover:bg-surface-elevated transition-colors group"
          >
            <div className="flex items-center justify-between">
              <s.icon className="h-6 w-6 text-lime transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-0.5" strokeWidth={1.5} />
              <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
            </div>
            <h3 className="mt-8 font-display text-2xl">{s.t}</h3>
            <p className="mt-1 text-sm text-lime/90">{s.sub}</p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{s.d}</p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {s.kpis.map((k) => (
                <div
                  key={k.k}
                  className="rounded-md border border-border bg-background/40 p-3"
                >
                  <div className="font-display text-xl">{k.v}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                    {k.k}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ────────────── GREAT UNICORN SHOW ────────────── */
function UnicornShowSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 mt-32">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-lime/20 blur-3xl" />

        <div className="relative grid md:grid-cols-2 gap-10 p-10 md:p-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1">
              <Trophy className="h-3.5 w-3.5 text-lime" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-lime">
                The Great Unicorn Show
              </span>
            </div>
            <h2 className="mt-6 font-display text-4xl md:text-5xl leading-tight">
              The investor attention engine.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              A monthly closed-door showcase where the top 1% of vetted founders pitch live
              to 200+ check-writing investors. No noise, no panels — just term sheets, in
              the room.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "200+ active investors per show",
                "Average $4.2M committed per cohort",
                "Founders selected by readiness score",
                "Direct DMs, not warm intros",
              ].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-lime mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground">{i}</span>
                </div>
              ))}
            </div>

            <Link
              to="/app"
              className="mt-10 inline-flex items-center gap-2 rounded-md bg-lime px-5 py-3 text-sm font-medium text-lime-foreground hover:opacity-90 transition"
            >
              Apply for the next show <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="rounded-xl border border-border bg-background/60 backdrop-blur p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Live Cohort · 12 / 14 seats
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
                  <span className="font-mono text-[10px] text-lime uppercase">Open</span>
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { co: "Helix.ai", st: "Series A", ask: "$8M", cm: 72 },
                  { co: "Volt Edge", st: "Seed", ask: "$3M", cm: 91 },
                  { co: "Northbeam", st: "Series A", ask: "$12M", cm: 64 },
                  { co: "Caldera", st: "Seed+", ask: "$5M", cm: 83 },
                ].map((r) => (
                  <div
                    key={r.co}
                    className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3"
                  >
                    <div>
                      <div className="font-display text-base">{r.co}</div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {r.st} · ask {r.ask}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden">
                        <div
                          className="h-full bg-lime"
                          style={{ width: `${r.cm}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-lime w-8 text-right">
                        {r.cm}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 pt-4 border-t border-border">
                <Stat v="$4.2M" l="Avg raised" />
                <Stat v="38%" l="Term sheet rate" />
                <Stat v="14d" l="To first wire" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div>
      <div className="font-display text-xl text-lime">{v}</div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
        {l}
      </div>
    </div>
  );
}

/* ─────────────────────── BENEFITS ─────────────────────── */
function BenefitsSection() {
  const items = [
    { v: "3.4×", t: "Reply rate", d: "vs. cold outbound benchmarks" },
    { v: "62%", t: "Less drop-off", d: "in mid-funnel investor conversations" },
    { v: "47", t: "Days to close", d: "median, from first intro to wire" },
    { v: "$4.2M", t: "Average raise", d: "across active platform cohorts" },
    { v: "94%", t: "Targeting accuracy", d: "AI match against ticket + thesis fit" },
    { v: "12k", t: "Investor signals", d: "tracked in real time across the network" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 mt-32">
      <div className="max-w-3xl">
        <Eyebrow>Outcomes, not features</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
          Numbers founders care about.
        </h2>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i, idx) => (
          <Reveal key={i.t} delay={idx * 0.06}>
            <div className="card-lift rounded-xl border border-border bg-surface p-8 hover:border-lime/30 hover:bg-surface-elevated h-full">
              <div className="font-display text-5xl text-lime">{i.v}</div>
              <h3 className="mt-4 font-display text-xl">{i.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────── SCORE CALCULATOR ─────────────────── */
function ScoreCalculator() {
  const [traction, setTraction] = useState(60);
  const [team, setTeam] = useState(70);
  const [market, setMarket] = useState(80);
  const [product, setProduct] = useState(50);
  const [deck, setDeck] = useState(65);

  const score = useMemo(() => {
    return Math.round(
      traction * 0.3 + team * 0.2 + market * 0.2 + product * 0.15 + deck * 0.15,
    );
  }, [traction, team, market, product, deck]);

  const tier =
    score >= 80
      ? { label: "Top decile — IC ready", color: "text-lime" }
      : score >= 65
        ? { label: "Fundable — needs polish", color: "text-lime" }
        : score >= 50
          ? { label: "Promising — gaps to close", color: "text-amber-300" }
          : { label: "Pre-ready — work needed", color: "text-destructive" };

  const inputs = [
    { label: "Traction (revenue / users)", v: traction, set: setTraction },
    { label: "Team experience", v: team, set: setTeam },
    { label: "Market size", v: market, set: setMarket },
    { label: "Product stage", v: product, set: setProduct },
    { label: "Pitch deck quality", v: deck, set: setDeck },
  ];

  return (
    <section id="calculator" className="mx-auto max-w-7xl px-6 mt-32">
      <div className="max-w-3xl">
        <Eyebrow>Try it now</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
          Score your fundraise in 30 seconds.
        </h2>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-5">
        {/* Inputs */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-surface p-8">
          <div className="space-y-6">
            {inputs.map((i) => (
              <div key={i.label}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm">{i.label}</label>
                  <span className="font-mono text-xs text-lime">{i.v}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={i.v}
                  onChange={(e) => i.set(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-border accent-lime cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gauge */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-8 flex flex-col items-center justify-center text-center">
          <Gauge score={score} />
          <div className={`mt-4 font-mono text-xs uppercase tracking-widest ${tier.color}`}>
            {tier.label}
          </div>
          <Link
            to="/app/readiness"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-lime px-5 py-2.5 text-sm font-medium text-lime-foreground hover:opacity-90 transition"
          >
            Get full breakdown <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Gauge({ score }: { score: number }) {
  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-[220px] h-[130px]">
      <svg viewBox="0 0 200 110" className="w-full h-full">
        <path
          d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`}
          fill="none"
          stroke="var(--border)"
          strokeWidth={14}
          strokeLinecap="round"
        />
        <path
          d={`M 20 100 A ${radius} ${radius} 0 0 1 180 100`}
          fill="none"
          stroke="var(--lime)"
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        <div className="font-display text-5xl text-lime leading-none">{score}</div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
          / 100
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── SOCIAL PROOF ─────────────────── */
function SocialProofSection() {
  const stories = [
    {
      co: "Helix.ai",
      raised: "$8.2M Series A",
      lead: "led by Index",
      quote:
        "We had 11 investor meetings booked in the first week. Closed the round in 39 days against a 6-month plan.",
      who: "Maya Chen, CEO",
    },
    {
      co: "Volt Edge",
      raised: "$3.5M Seed",
      lead: "led by Lightspeed",
      quote:
        "TD's matching cut our investor list from 400 to 28 actually relevant funds. Reply rate went from 4% to 31%.",
      who: "Daniel Park, Co-founder",
    },
    {
      co: "Caldera",
      raised: "$5.1M Seed+",
      lead: "led by a16z scout",
      quote:
        "The readiness score told us exactly what to fix before going out. We hit the market when we were actually ready.",
      who: "Priya Anand, Founder",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 mt-32">
      <div className="max-w-3xl">
        <Eyebrow>Funding outcomes</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
          Founders who closed on the platform.
        </h2>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {stories.map((s, i) => (
          <Reveal key={s.co} delay={i * 0.08}>
            <div className="card-lift rounded-xl border border-border bg-surface p-8 hover:bg-surface-elevated flex flex-col h-full">
              <Quote className="h-5 w-5 text-lime" strokeWidth={1.5} />
              <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{s.quote}"</p>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="font-display text-xl">{s.co}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-lime mt-1">
                  {s.raised} · {s.lead}
                </div>
                <div className="text-xs text-muted-foreground mt-2">— {s.who}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────── PRICING ─────────────────────── */
function PricingSection() {
  const tiers = [
    {
      name: "Starter",
      price: "$199",
      cadence: "/ mo",
      desc: "For founders mapping their round.",
      features: [
        "Investor database (500+)",
        "AI match engine — 25 / mo",
        "Pitch polish — 5 docs",
        "Readiness scoring",
      ],
      cta: "Start free trial",
      highlight: false,
    },
    {
      name: "Growth",
      price: "$599",
      cadence: "/ mo",
      desc: "For founders actively raising.",
      features: [
        "Everything in Starter",
        "Unlimited matching",
        "Pipeline CRM + signal tracking",
        "Warm-intro pathing",
        "1 Unicorn Show seat / quarter",
      ],
      cta: "Start raising",
      highlight: true,
    },
    {
      name: "Scale",
      price: "Custom",
      cadence: "",
      desc: "For repeat founders & syndicates.",
      features: [
        "Everything in Growth",
        "Dedicated fundraising lead",
        "Diligence room + legal templates",
        "Investor concierge",
        "Priority Unicorn Show access",
      ],
      cta: "Talk to us",
      highlight: false,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 mt-32">
      <div className="max-w-3xl">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mt-3 font-display text-4xl md:text-5xl leading-tight">
          Investor-grade. Founder-priced.
        </h2>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {tiers.map((t, idx) => (
          <Reveal key={t.name} delay={idx * 0.08}>
            <div
              className={`card-lift relative rounded-xl border p-8 flex flex-col h-full ${
                t.highlight
                  ? "border-lime bg-surface-elevated shadow-[var(--shadow-glow)]"
                  : "border-border bg-surface hover:bg-surface-elevated"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-lime-foreground">
                  <Zap className="h-3 w-3" /> Most popular
                </div>
              )}
              <h3 className="font-display text-2xl">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-5xl">{t.price}</span>
                <span className="font-mono text-xs text-muted-foreground">{t.cadence}</span>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-lime mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/app"
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition ${
                  t.highlight
                    ? "cta-sheen bg-lime text-lime-foreground hover:opacity-95"
                    : "border border-border hover:border-lime/40 hover:bg-surface-elevated"
                }`}
              >
                {t.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────── URGENCY ─────────────────────── */
function UrgencySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 mt-32">
      <div className="relative overflow-hidden rounded-2xl border border-destructive/30 bg-surface p-10 md:p-14">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-destructive/15 blur-3xl" />
        <div className="relative grid md:grid-cols-3 gap-10 items-center">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1">
              <Clock className="h-3.5 w-3.5 text-destructive" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-destructive">
                Closing soon
              </span>
            </div>
            <h2 className="mt-5 font-display text-3xl md:text-5xl leading-tight">
              Only <span className="text-destructive">14 founder seats</span> open in the
              next cohort.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-xl">
              We cap each cohort to keep investor attention dense. Apply now or wait for
              the Q3 window.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background/40 backdrop-blur p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Cohort capacity
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-5xl text-destructive">9</span>
              <span className="font-mono text-sm text-muted-foreground">/ 14 taken</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-destructive"
                style={{ width: `${(9 / 14) * 100}%` }}
              />
            </div>
            <Link
              to="/app"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-lime px-5 py-3 text-sm font-medium text-lime-foreground hover:opacity-90 transition"
            >
              Claim a seat <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              No commitment until accepted
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
