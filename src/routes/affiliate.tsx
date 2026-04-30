import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Users,
  DollarSign,
  Sparkles,
  MousePointerClick,
  Wallet,
  ArrowUpRight,
  Activity,
  Lightbulb,
  Building2,
  Network,
  MessagesSquare,
  GraduationCap,
  Share2,
  FileCheck2,
  BadgeDollarSign,
  Check,
  Infinity as InfinityIcon,
  Calculator,
  LayoutGrid,
  Quote,
  Star,
  MessageCircle,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/affiliate")({
  head: () => ({
    meta: [
      { title: "Partner Program — Earn by Connecting Startups to Investors | TD Ventures" },
      {
        name: "description",
        content:
          "Join the TD Ventures partner network and earn commissions for every startup that raises through our platform. 500+ investors, 200+ startups, $20M+ raised.",
      },
      { property: "og:title", content: "TD Ventures Partner Program" },
      {
        property: "og:description",
        content:
          "Earn by connecting high-quality startups to investors. Join our affiliate network today.",
      },
    ],
  }),
  component: AffiliatePage,
});

const stats = [
  { label: "Investors", value: "500+", icon: Users },
  { label: "Startups", value: "200+", icon: TrendingUp },
  { label: "Raised", value: "$20M+", icon: DollarSign },
];

function AffiliatePage() {
  return (
    <div className="min-h-screen bg-[#070708] text-foreground overflow-hidden">
      {/* Top Nav */}
      <header className="relative z-20 px-6 lg:px-12 py-5 flex items-center justify-between">
        <Link to="/" className="font-display text-lg tracking-tight text-white">
          TD <span className="text-lime">Ventures</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link to="/founders" className="hover:text-white transition">For Founders</Link>
          <Link to="/investors" className="hover:text-white transition">For Investors</Link>
          <Link to="/affiliate" className="text-white">Partners</Link>
        </nav>
        <Link
          to="/app"
          className="hidden md:inline-flex items-center gap-1.5 text-sm rounded-full border border-white/15 px-4 py-2 text-white hover:bg-white/5 transition"
        >
          Open app <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      {/* HERO */}
      <section className="relative px-6 lg:px-12 pt-12 lg:pt-20 pb-24">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-lime/20 blur-[140px]" />
          <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-violet-500/20 blur-[160px]" />
          <div className="absolute bottom-[-20%] left-[30%] h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[120px]" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur px-3 py-1.5 text-xs text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-lime" />
              Partner Program · Now accepting applications
            </div>

            <h1 className="mt-6 font-display text-[44px] leading-[1.05] sm:text-5xl lg:text-[64px] lg:leading-[1.04] tracking-tight text-white">
              Earn by{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-lime via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  Connecting
                </span>
              </span>{" "}
              High-Quality Startups to Investors
            </h1>

            <p className="mt-6 text-lg text-white/60 max-w-xl leading-relaxed">
              Join our partner network and earn commissions for every startup that
              raises through our platform.
            </p>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#apply"
                className="group inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold text-lime-foreground shadow-[0_0_40px_-8px_rgba(190,242,100,0.6)] hover:shadow-[0_0_60px_-6px_rgba(190,242,100,0.8)] transition-all"
              >
                Become a Partner
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#earnings"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                View Earnings Model
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur px-4 py-4"
                >
                  <s.icon className="h-4 w-4 text-lime mb-2" strokeWidth={1.8} />
                  <div className="font-display text-2xl text-white tracking-tight">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-wider text-white/40 mt-1">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Dashboard mock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative"
          >
            <DashboardMock />
          </motion.div>
        </div>
      </section>

      {/* WHO SHOULD JOIN */}
      <WhoShouldJoin />

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* EARNINGS */}
      <Earnings />

      {/* PARTNER DASHBOARD PREVIEW */}
      <PartnerDashboard />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FINAL CTA */}
      <FinalCta />
    </div>
  );
}

const audiences = [
  {
    icon: Lightbulb,
    title: "Startup Consultants",
    desc: "Already advising founders on fundraising? Earn for every investor connection that converts into a closed round.",
    accent: "from-lime/30 to-emerald-400/10",
    iconColor: "text-lime",
  },
  {
    icon: Building2,
    title: "Accelerators & Incubators",
    desc: "Plug your cohort into our investor network and unlock recurring commissions across every batch you graduate.",
    accent: "from-cyan-400/30 to-cyan-400/5",
    iconColor: "text-cyan-300",
  },
  {
    icon: Network,
    title: "Angel Networks",
    desc: "Surface deal flow for your members and earn placement fees when startups raise through our matching engine.",
    accent: "from-violet-500/30 to-violet-500/5",
    iconColor: "text-violet-300",
  },
  {
    icon: MessagesSquare,
    title: "Founder Communities",
    desc: "Refer founders from your Slack, Discord, or newsletter and turn engagement into a real revenue stream.",
    accent: "from-amber-400/30 to-amber-400/5",
    iconColor: "text-amber-300",
  },
  {
    icon: GraduationCap,
    title: "Advisors",
    desc: "Independent operators and ex-founders earn commissions while helping portfolio companies close their next round.",
    accent: "from-rose-400/30 to-rose-400/5",
    iconColor: "text-rose-300",
  },
];

function WhoShouldJoin() {
  return (
    <section className="relative px-6 lg:px-12 py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-lime/5 blur-[160px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
            <Users className="h-3.5 w-3.5 text-lime" /> Partner profiles
          </div>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight text-white leading-[1.05]">
            Who Should{" "}
            <span className="bg-gradient-to-r from-lime to-emerald-300 bg-clip-text text-transparent">
              Join
            </span>
          </h2>
          <p className="mt-4 text-white/60 text-lg">
            If you sit close to founders or investors, you're already doing the
            work. Get paid for it.
          </p>
        </motion.div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              {/* Glow on hover */}
              <div
                className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${a.accent} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
              />
              <div className="relative h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur p-6 transition-all duration-300 group-hover:border-white/20 group-hover:-translate-y-1">
                <div
                  className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${a.accent}`}
                >
                  <a.icon className={`h-5 w-5 ${a.iconColor}`} strokeWidth={1.8} />
                </div>

                <h3 className="mt-5 font-display text-xl text-white tracking-tight">
                  {a.title}
                </h3>
                <p className="mt-2.5 text-sm text-white/55 leading-relaxed">
                  {a.desc}
                </p>

                <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-white/40 group-hover:text-lime transition-colors">
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── Dashboard Illustration ────────── */
function DashboardMock() {
  return (
    <div className="relative">
      {/* Glow ring */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-lime/30 via-violet-500/20 to-cyan-400/20 rounded-[32px] blur-2xl opacity-70" />

      <div className="relative rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-2xl p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <div className="ml-3 text-[10px] text-white/30 font-mono">partner.tdventures.in/dashboard</div>
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/40">Lifetime earnings</div>
            <div className="font-display text-3xl text-white tracking-tight mt-1">
              $48,290<span className="text-lime">.00</span>
            </div>
          </div>
          <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-300 font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +24.6%
          </div>
        </div>

        {/* KPI Tiles */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: MousePointerClick, label: "Referrals", value: "342", tone: "text-cyan-300" },
            { icon: Activity, label: "Conversions", value: "58", tone: "text-violet-300" },
            { icon: Wallet, label: "Pending", value: "$3.2k", tone: "text-lime" },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <k.icon className={`h-3.5 w-3.5 ${k.tone} mb-1.5`} strokeWidth={2} />
              <div className="text-base font-display text-white">{k.value}</div>
              <div className="text-[10px] text-white/40">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-white/10 bg-black/30 p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-white/50">Earnings · last 30d</div>
            <div className="text-[10px] text-white/30">USD</div>
          </div>
          <svg viewBox="0 0 300 90" className="w-full h-20">
            <defs>
              <linearGradient id="aff-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(190,242,100)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="rgb(190,242,100)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="aff-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgb(110,231,183)" />
                <stop offset="100%" stopColor="rgb(190,242,100)" />
              </linearGradient>
            </defs>
            <path
              d="M0,70 L20,62 L40,66 L60,55 L80,58 L100,45 L120,48 L140,38 L160,42 L180,30 L200,34 L220,22 L240,26 L260,15 L280,18 L300,8 L300,90 L0,90 Z"
              fill="url(#aff-grad)"
            />
            <path
              d="M0,70 L20,62 L40,66 L60,55 L80,58 L100,45 L120,48 L140,38 L160,42 L180,30 L200,34 L220,22 L240,26 L260,15 L280,18 L300,8"
              fill="none"
              stroke="url(#aff-line)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Recent referrals */}
        <div className="space-y-2">
          <div className="text-[11px] text-white/50 mb-2">Recent referrals</div>
          {[
            { name: "Nimbus Grid", stage: "Seed · $1.2M", status: "Closed", color: "text-emerald-300", dot: "bg-emerald-400" },
            { name: "Halo Robotics", stage: "Series A · $4M", status: "In DD", color: "text-amber-300", dot: "bg-amber-400" },
            { name: "Lumen Health", stage: "Pre-seed · $600k", status: "New", color: "text-cyan-300", dot: "bg-cyan-400" },
          ].map((r) => (
            <div
              key={r.name}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-7 w-7 rounded-md bg-gradient-to-br from-white/10 to-white/5 grid place-items-center text-[10px] text-white/70 font-semibold shrink-0">
                  {r.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-white truncate">{r.name}</div>
                  <div className="text-[10px] text-white/40">{r.stage}</div>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 text-[10px] ${r.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
                {r.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating commission card */}
      <motion.div
        initial={{ opacity: 0, x: 30, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="absolute -right-4 -bottom-6 lg:-right-8 lg:-bottom-8 rounded-2xl border border-lime/30 bg-gradient-to-br from-lime/20 to-lime/5 backdrop-blur-xl p-4 shadow-[0_20px_60px_-10px_rgba(190,242,100,0.4)] w-52"
      >
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-lime/80 mb-1.5">
          <DollarSign className="h-3 w-3" /> New commission
        </div>
        <div className="font-display text-xl text-white">+$2,450</div>
        <div className="text-[10px] text-white/50 mt-1">Nimbus Grid · 5% of round</div>
      </motion.div>
    </div>
  );
}

/* ────────── How It Works ────────── */
const steps = [
  {
    n: "01",
    icon: Share2,
    title: "Refer Startups",
    desc: "Share your unique link",
    accent: "from-lime/40 to-emerald-400/10",
    iconColor: "text-lime",
    ring: "ring-lime/30",
  },
  {
    n: "02",
    icon: FileCheck2,
    title: "They Apply",
    desc: "Startup joins platform",
    accent: "from-cyan-400/40 to-cyan-400/5",
    iconColor: "text-cyan-300",
    ring: "ring-cyan-400/30",
  },
  {
    n: "03",
    icon: BadgeDollarSign,
    title: "You Earn",
    desc: "Get paid when they convert",
    accent: "from-violet-500/40 to-violet-500/5",
    iconColor: "text-violet-300",
    ring: "ring-violet-400/30",
  },
];

function HowItWorks() {
  return (
    <section className="relative px-6 lg:px-12 py-24 lg:py-32 border-t border-white/5">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-lime/10 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
            <Sparkles className="h-3.5 w-3.5 text-lime" /> How it works
          </div>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight text-white leading-[1.05]">
            Three steps to your{" "}
            <span className="bg-gradient-to-r from-lime to-emerald-300 bg-clip-text text-transparent">
              first payout
            </span>
          </h2>
          <p className="mt-4 text-white/60 text-lg">
            No contracts, no quotas. Refer, track, and get paid.
          </p>
        </motion.div>

        <div className="mt-16 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-[60px] left-[16%] right-[16%] h-px">
            <div className="h-full w-full bg-gradient-to-r from-lime/40 via-cyan-400/40 to-violet-400/40" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6 relative">
            {steps.map((s, i) => (
              <div key={s.n} className="relative flex flex-col items-center lg:items-stretch">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative w-full"
                >
                  {/* Glow */}
                  <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-100 blur-xl transition duration-500`} />

                  <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur p-8 text-center transition group-hover:border-white/20 group-hover:-translate-y-1">
                    {/* Icon disc */}
                    <div className="relative mx-auto">
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${s.accent} blur-md`} />
                      <div className={`relative mx-auto h-16 w-16 rounded-2xl border border-white/10 bg-[#0d0d10] ring-1 ${s.ring} grid place-items-center`}>
                        <s.icon className={`h-7 w-7 ${s.iconColor}`} strokeWidth={1.6} />
                      </div>
                    </div>

                    <div className="mt-5 font-mono text-[11px] tracking-[0.2em] text-white/40">
                      STEP {s.n}
                    </div>
                    <h3 className="mt-2 font-display text-2xl text-white tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/55">{s.desc}</p>
                  </div>
                </motion.div>

                {/* Arrow between steps */}
                {i < steps.length - 1 && (
                  <>
                    {/* Desktop arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.3, duration: 0.5 }}
                      className="hidden lg:flex absolute top-[44px] -right-3 z-10 h-8 w-8 items-center justify-center rounded-full bg-[#0d0d10] border border-white/15 ring-4 ring-[#070708]"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-white/70" />
                    </motion.div>

                    {/* Mobile arrow (down) */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.3, duration: 0.5 }}
                      className="lg:hidden mt-6 mb-2 h-10 w-10 grid place-items-center rounded-full border border-white/10 bg-white/5"
                    >
                      <ArrowRight className="h-4 w-4 text-white/70 rotate-90" />
                    </motion.div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────── Earnings ────────── */


function Earnings() {
  return (
    <section id="earnings" className="relative px-6 lg:px-12 py-24 lg:py-32 border-t border-white/5">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-lime/10 blur-[180px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
            <Wallet className="h-3.5 w-3.5 text-lime" /> Earnings model
          </div>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight text-white leading-[1.05]">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-lime to-emerald-300 bg-clip-text text-transparent">
              Earnings
            </span>
          </h2>
          <p className="mt-4 text-white/60 text-lg">
            Two ways to earn. One simple structure. Zero ceiling.
          </p>
        </motion.div>

        {/* Two earning cards */}
        <div className="mt-14 grid lg:grid-cols-2 gap-5">
          {/* Card 1: Onboarding */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="group relative"
          >
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-lime/30 to-emerald-400/10 opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />
            <div className="relative h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur p-8 lg:p-10">
              <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                Per onboarding
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display text-2xl text-white/60">₹</span>
                <span className="font-display text-7xl lg:text-8xl text-white tracking-tight leading-none">
                  999
                </span>
              </div>
              <div className="mt-3 text-sm text-white/55">
                paid on every successful startup onboarding
              </div>

              <div className="mt-8 space-y-2.5">
                {[
                  "Credited within 24 hours of activation",
                  "Stackable across unlimited referrals",
                  "Tracked live in your partner dashboard",
                ].map((b) => (
                  <div key={b} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check className="h-4 w-4 text-lime mt-0.5 shrink-0" strokeWidth={2.5} />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 2: Commission */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative"
          >
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-violet-500/30 to-cyan-400/10 opacity-100 blur-xl transition duration-500" />
            <div className="relative h-full rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur p-8 lg:p-10 overflow-hidden">
              {/* Highlight badge */}
              <div className="absolute top-5 right-5 inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/15 px-2.5 py-1 text-[10px] text-violet-200 font-medium">
                <Sparkles className="h-3 w-3" /> Premium
              </div>

              <div className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                Recurring commission
              </div>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-display text-7xl lg:text-8xl bg-gradient-to-br from-white via-violet-100 to-cyan-200 bg-clip-text text-transparent tracking-tight leading-none">
                  30
                </span>
                <span className="font-display text-3xl text-white/70">%</span>
              </div>
              <div className="mt-3 text-sm text-white/55">
                of revenue from premium plans your referrals subscribe to
              </div>

              <div className="mt-8 space-y-2.5">
                {[
                  "Paid monthly for as long as they stay subscribed",
                  "Applies to every premium tier",
                  "Compounds with onboarding bonuses",
                ].map((b) => (
                  <div key={b} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check className="h-4 w-4 text-violet-300 mt-0.5 shrink-0" strokeWidth={2.5} />
                    {b}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* No cap banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-5 relative overflow-hidden rounded-3xl border border-lime/30 bg-gradient-to-r from-lime/15 via-lime/5 to-transparent p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(190,242,100,0.15),_transparent_60%)]" />
          <div className="relative flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-lime/15 border border-lime/30 grid place-items-center">
              <InfinityIcon className="h-7 w-7 text-lime" strokeWidth={2} />
            </div>
            <div>
              <div className="font-display text-2xl text-white tracking-tight">
                No cap on earnings
              </div>
              <div className="text-sm text-white/60 mt-0.5">
                Refer one. Refer a thousand. Your ceiling is your reach.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Example calculator */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 relative"
        >
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-lime/20 via-violet-500/20 to-cyan-400/20 blur-2xl opacity-50" />
          <div className="relative rounded-3xl border border-white/10 bg-[#0b0b0d] p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs text-white/50">
                  <Calculator className="h-3.5 w-3.5 text-lime" />
                  Quick math
                </div>
                <h3 className="mt-3 font-display text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                  Refer 10 startups,
                  <br />
                  <span className="bg-gradient-to-r from-lime to-emerald-300 bg-clip-text text-transparent">
                    earn ₹3,000+ instantly
                  </span>
                </h3>
                <p className="mt-4 text-white/55 text-sm leading-relaxed">
                  That's just the onboarding bonus. Add 30% recurring on every
                  one that upgrades to a premium plan, and a single referral
                  can pay you for years.
                </p>
              </div>

              {/* Visual breakdown */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">10 onboardings</span>
                  <span className="font-mono text-white">10 × ₹999</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-white/60">Onboarding bonus</span>
                  <span className="font-display text-lg text-white">₹9,990</span>
                </div>
                <div className="my-4 h-px bg-white/10" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">3 upgrade to premium</span>
                  <span className="font-mono text-white">30% × MRR</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-white/60">Recurring / month</span>
                  <span className="font-display text-lg text-violet-200">+ ₹4,500</span>
                </div>
                <div className="my-4 h-px bg-white/10" />
                <div className="flex items-end justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    Year 1 estimate
                  </span>
                  <span className="font-display text-3xl bg-gradient-to-r from-lime to-emerald-300 bg-clip-text text-transparent">
                    ₹63,990+
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────── Partner Dashboard ────────── */
const dashStats = [
  { label: "Total Referrals", value: "128", delta: "+12 this month", icon: MousePointerClick, tone: "text-cyan-300", ring: "ring-cyan-400/20" },
  { label: "Conversions", value: "34", delta: "26.5% rate", icon: Activity, tone: "text-violet-300", ring: "ring-violet-400/20" },
  { label: "Total Earnings", value: "₹48,290", delta: "+₹6,200 pending", icon: Wallet, tone: "text-lime", ring: "ring-lime/20" },
];

const dashRows = [
  { name: "Nimbus Grid", sector: "Climate · Seed", status: "Converted", commission: "₹2,997", state: "ok" },
  { name: "Halo Robotics", sector: "Hardware · Series A", status: "Converted", commission: "₹999", state: "ok" },
  { name: "Lumen Health", sector: "Healthtech · Pre-seed", status: "Applied", commission: "—", state: "pending" },
  { name: "Forge AI", sector: "AI Infra · Seed", status: "Converted", commission: "₹999", state: "ok" },
  { name: "Cinder Labs", sector: "Devtools · Pre-seed", status: "Applied", commission: "—", state: "pending" },
  { name: "Quill & Co", sector: "Fintech · Seed", status: "Converted", commission: "₹2,400", state: "ok" },
];

function PartnerDashboard() {
  return (
    <section className="relative px-6 lg:px-12 py-24 lg:py-32 border-t border-white/5">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-violet-500/10 blur-[160px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
            <LayoutGrid className="h-3.5 w-3.5 text-lime" /> Live preview
          </div>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight text-white leading-[1.05]">
            Your{" "}
            <span className="bg-gradient-to-r from-lime to-emerald-300 bg-clip-text text-transparent">
              partner dashboard
            </span>
          </h2>
          <p className="mt-4 text-white/60 text-lg">
            Track every referral, conversion, and rupee earned in real time.
          </p>
        </motion.div>

        {/* Mock dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-14 relative"
        >
          <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-lime/20 via-violet-500/15 to-cyan-400/15 blur-2xl" />

          <div className="relative rounded-3xl border border-white/10 bg-[#0a0a0c] overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.8)]">
            {/* Window chrome */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <div className="ml-3 hidden sm:block text-[11px] text-white/30 font-mono">
                  partner.tdventures.in/dashboard
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-[11px] text-white/40">Welcome back, Aarav</div>
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-lime to-emerald-400 grid place-items-center text-[10px] text-lime-foreground font-bold">
                  A
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 lg:p-8">
              {/* Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                {dashStats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                    className={`rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5 ring-1 ${s.ring}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] uppercase tracking-wider text-white/40">
                        {s.label}
                      </div>
                      <s.icon className={`h-4 w-4 ${s.tone}`} strokeWidth={1.8} />
                    </div>
                    <div className="mt-3 font-display text-3xl text-white tracking-tight">
                      {s.value}
                    </div>
                    <div className={`mt-1.5 text-[11px] ${s.tone}`}>{s.delta}</div>
                  </motion.div>
                ))}
              </div>

              {/* Table */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">Recent referrals</div>
                    <div className="text-[11px] text-white/40 mt-0.5">Last 30 days</div>
                  </div>
                  <div className="text-[11px] text-white/40 hidden sm:block">
                    Showing 6 of 128
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-wider text-white/40 bg-white/[0.02]">
                        <th className="text-left font-medium px-5 py-3">Startup</th>
                        <th className="text-left font-medium px-5 py-3">Status</th>
                        <th className="text-right font-medium px-5 py-3">Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashRows.map((r) => (
                        <tr
                          key={r.name}
                          className="border-t border-white/5 hover:bg-white/[0.02] transition"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-white/10 to-white/5 grid place-items-center text-[11px] text-white/70 font-semibold shrink-0">
                                {r.name[0]}
                              </div>
                              <div className="min-w-0">
                                <div className="text-white text-sm">{r.name}</div>
                                <div className="text-[11px] text-white/40">
                                  {r.sector}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            {r.state === "ok" ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-300 font-medium">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                {r.status}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[10px] text-amber-300 font-medium">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                {r.status}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <span className={`font-mono text-sm ${r.state === "ok" ? "text-white" : "text-white/30"}`}>
                              {r.commission}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <a
            href="#apply"
            className="group inline-flex items-center gap-2 rounded-full bg-lime px-8 py-4 text-base font-semibold text-lime-foreground shadow-[0_0_50px_-10px_rgba(190,242,100,0.7)] hover:shadow-[0_0_70px_-6px_rgba(190,242,100,0.9)] transition-all"
          >
            Start Earning
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <div className="mt-3 text-xs text-white/40">
            Free to join · Get your link in under 2 minutes
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────── Testimonials ────────── */
const testimonials = [
  {
    quote: "Earned ₹50,000+ in 2 months just by referring startups from my consulting practice. The dashboard makes tracking effortless.",
    name: "Aarav Mehta",
    role: "Startup Consultant",
    org: "Mumbai",
    earned: "₹52,400",
    referrals: 18,
    avatarBg: "from-lime to-emerald-400",
    accent: "from-lime/30 to-emerald-400/5",
    star: "text-lime",
  },
  {
    quote: "Plugged our accelerator's cohort into the platform. Three startups closed rounds within the first batch — recurring commissions are real.",
    name: "Priya Nair",
    role: "Program Director",
    org: "Catalyst Accelerator",
    earned: "₹1,28,000",
    referrals: 32,
    avatarBg: "from-violet-400 to-violet-600",
    accent: "from-violet-500/30 to-violet-500/5",
    star: "text-violet-300",
    featured: true,
  },
  {
    quote: "The 30% recurring on premium plans changed the game. One Series A referral now pays my mortgage.",
    name: "Rohan Kapoor",
    role: "Angel Investor & Advisor",
    org: "Bangalore",
    earned: "₹84,600",
    referrals: 9,
    avatarBg: "from-cyan-400 to-cyan-600",
    accent: "from-cyan-400/30 to-cyan-400/5",
    star: "text-cyan-300",
  },
];

function Testimonials() {
  return (
    <section className="relative px-6 lg:px-12 py-24 lg:py-32 border-t border-white/5">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-0 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-lime/10 blur-[160px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
            <Star className="h-3.5 w-3.5 text-lime fill-lime" /> Partner stories
          </div>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl tracking-tight text-white leading-[1.05]">
            Real partners.{" "}
            <span className="bg-gradient-to-r from-lime to-emerald-300 bg-clip-text text-transparent">
              Real payouts.
            </span>
          </h2>
          <p className="mt-4 text-white/60 text-lg">
            See what our top partners are earning every month.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-14 grid lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative ${t.featured ? "lg:-translate-y-3" : ""}`}
            >
              {/* Glow */}
              <div className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${t.accent} ${t.featured ? "opacity-100" : "opacity-0 group-hover:opacity-100"} blur-xl transition duration-500`} />

              <div className={`relative h-full rounded-3xl border ${t.featured ? "border-white/20" : "border-white/10"} bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur p-7 flex flex-col transition group-hover:border-white/20`}>
                {/* Featured badge */}
                {t.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full border border-violet-400/30 bg-violet-500/20 backdrop-blur px-3 py-1 text-[10px] text-violet-100 font-medium">
                    <Sparkles className="h-3 w-3" /> Top earner
                  </div>
                )}

                <Quote className="h-7 w-7 text-white/15" strokeWidth={1.5} />

                {/* Stars */}
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className={`h-3.5 w-3.5 ${t.star} fill-current`} />
                  ))}
                </div>

                {/* Quote */}
                <p className="mt-4 text-white/85 text-[15px] leading-relaxed flex-1">
                  "{t.quote}"
                </p>

                {/* Earnings stat */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/40">
                      Earned
                    </div>
                    <div className={`mt-1 font-display text-xl bg-gradient-to-r ${t.accent} bg-clip-text text-transparent`}>
                      <span className="text-white">{t.earned}</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/40">
                      Referrals
                    </div>
                    <div className="mt-1 font-display text-xl text-white">
                      {t.referrals}
                    </div>
                  </div>
                </div>

                {/* Author */}
                <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.avatarBg} grid place-items-center text-sm font-bold text-black/80 shrink-0`}>
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-white truncate">{t.name}</div>
                    <div className="text-[11px] text-white/50 truncate">
                      {t.role} · {t.org}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aggregate proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.04] via-lime/5 to-white/[0.04] p-6 lg:p-8 grid sm:grid-cols-3 gap-6 text-center"
        >
          {[
            { v: "₹42L+", l: "Paid to partners YTD" },
            { v: "180+", l: "Active partners" },
            { v: "4.9 / 5", l: "Avg partner rating" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl bg-gradient-to-r from-lime to-emerald-300 bg-clip-text text-transparent tracking-tight">
                {s.v}
              </div>
              <div className="mt-1 text-xs text-white/50 uppercase tracking-wider">
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────── Final CTA ────────── */
function FinalCta() {
  return (
    <section id="apply" className="relative px-6 lg:px-12 py-28 lg:py-40 border-t border-white/5 overflow-hidden">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(190,242,100,0.18),_transparent_60%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-violet-500/15 blur-[180px]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-4xl mx-auto text-center"
      >
        {/* Urgency badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur px-3.5 py-1.5 text-xs text-amber-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          Limited partner onboarding each month
        </div>

        <h2 className="mt-8 font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.02]">
          Turn Your Network into{" "}
          <span className="bg-gradient-to-r from-lime via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            Revenue
          </span>
        </h2>

        <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Apply once. Earn forever. Join a curated network of partners who get
          paid for the introductions they're already making.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#apply-form"
            className="group inline-flex items-center gap-2 rounded-full bg-lime px-8 py-4 text-base font-semibold text-lime-foreground shadow-[0_0_60px_-8px_rgba(190,242,100,0.7)] hover:shadow-[0_0_80px_-4px_rgba(190,242,100,0.9)] transition-all"
          >
            Apply as Partner
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <Link
            to="/partner-dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-8 py-4 text-base font-semibold text-white hover:bg-white/10 hover:border-white/30 transition"
          >
            View Dashboard
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-8 py-4 text-base font-semibold text-white hover:bg-white/10 hover:border-white/30 transition"
          >
            <MessageCircle className="h-4 w-4" />
            Talk to Us
          </Link>
        </div>

        {/* Reassurance */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/40">
          <div className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-lime" />
            48-hour application review
          </div>
          <div className="hidden sm:block h-1 w-1 rounded-full bg-white/20" />
          <div className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-lime" strokeWidth={2.5} />
            No upfront fees, ever
          </div>
          <div className="hidden sm:block h-1 w-1 rounded-full bg-white/20" />
          <div className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-lime" />
            Only 25 new partners / month
          </div>
        </div>
      </motion.div>
    </section>
  );
}
