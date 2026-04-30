import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Filter, Bell, FileCheck2, Users, ShieldCheck, LineChart } from "lucide-react";
import { CtaSection } from "@/components/cta-section";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "For Investors — Atlas Deal Flow" },
      { name: "description", content: "Pre-vetted infrastructure deals, standardized diligence, and direct founder access. Built for institutional capital." },
    ],
  }),
  component: Investors,
});

function Investors() {
  return (
    <>
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="font-mono text-xs uppercase tracking-widest text-lime">For investors</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl leading-[0.95] max-w-4xl">
            Better deals.
            <br />
            <span className="text-muted-foreground">Faster diligence.</span>
            <br />
            <span className="text-lime">Higher conviction.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            Atlas is the institutional-grade marketplace for infrastructure deal flow.
            We curate, vet, and structure — you deploy with conviction.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-md bg-lime px-6 py-3.5 text-sm font-medium text-lime-foreground hover:opacity-90 transition shadow-[var(--shadow-glow)]"
            >
              Apply for access
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3.5 text-sm font-medium hover:border-lime/40 transition"
            >
              Preview marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 mt-32">
        <h2 className="font-display text-4xl md:text-5xl max-w-2xl">Everything an LP needs in one terminal.</h2>

        <div className="mt-12 grid gap-px bg-border rounded-xl overflow-hidden border border-border md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Filter, t: "Thesis-matched alerts", d: "Tell us your sector, stage, geography, and check size. We surface only relevant deals." },
            { icon: FileCheck2, t: "Standardized data rooms", d: "Every deal has the same diligence template. Compare apples to apples in minutes." },
            { icon: Users, t: "Direct founder access", d: "No intros, no gatekeepers. Book founder calls directly through Atlas." },
            { icon: ShieldCheck, t: "Independent vetting", d: "Atlas runs technical, financial, and reference diligence before any deal lists." },
            { icon: Bell, t: "Real-time alerts", d: "Get pinged the moment a deal in your thesis goes live or hits a closing milestone." },
            { icon: LineChart, t: "Portfolio dashboard", d: "Track committed deals, follow-on opportunities, and post-investment KPIs." },
          ].map((f) => (
            <div key={f.t} className="bg-surface p-8 group hover:bg-surface-elevated transition">
              <f.icon className="h-6 w-6 text-lime" strokeWidth={1.5} />
              <h3 className="mt-6 font-display text-xl">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 mt-32 grid gap-8 md:grid-cols-4">
        {[
          { v: "60%", l: "Faster diligence" },
          { v: "47", l: "Avg days to close" },
          { v: "$1.4B", l: "Capital deployed" },
          { v: "12k", l: "Active investors" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-surface p-8">
            <div className="font-display text-5xl text-lime">{s.v}</div>
            <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </section>

      {/* Quote */}
      <section className="mx-auto max-w-4xl px-6 mt-32 text-center">
        <p className="font-display text-3xl md:text-4xl leading-tight">
          "Atlas cut our diligence cycle in half. We've deployed into 6 deals in the last
          quarter — three of which we'd never have seen otherwise."
        </p>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Partner · Top-tier seed fund
        </p>
      </section>

      <CtaSection />
    </>
  );
}
