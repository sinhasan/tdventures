import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Rocket, Globe, DollarSign, Clock } from "lucide-react";
import { CtaSection } from "@/components/cta-section";

export const Route = createFileRoute("/founders")({
  head: () => ({
    meta: [
      { title: "For Founders — Raise on Atlas" },
      { name: "description", content: "Skip the cold-intro grind. Get in front of 12,000 vetted investors in a single application." },
    ],
  }),
  component: Founders,
});

function Founders() {
  const steps = [
    { n: "01", t: "Apply", d: "10-minute application. Share metrics, deck, and round terms." },
    { n: "02", t: "Vetting", d: "Atlas runs diligence in 5 business days. Founder-friendly, transparent process." },
    { n: "03", t: "List", d: "Your deal goes live to 12k+ investors with a curated, polished data room." },
    { n: "04", t: "Close", d: "Average close in 47 days. Atlas handles intros, terms, and operational lift." },
  ];

  return (
    <>
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="font-mono text-xs uppercase tracking-widest text-lime">For founders</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl leading-[0.95] max-w-4xl">
            Raise from the
            <br />
            <span className="text-lime">right capital.</span>{" "}
            <span className="text-muted-foreground">In half the time.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            Atlas connects revenue-generating infrastructure startups with 12,000+ vetted
            institutional investors. No placement fees. No gatekeeping.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-md bg-lime px-6 py-3.5 text-sm font-medium text-lime-foreground hover:opacity-90 transition shadow-[var(--shadow-glow)]"
            >
              Submit your startup
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-7xl px-6 mt-32">
        <h2 className="font-display text-4xl md:text-5xl max-w-2xl">Four steps. No surprises.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-xl border border-border bg-surface p-6">
              <div className="font-mono text-[10px] uppercase tracking-widest text-lime">Step {s.n}</div>
              <h3 className="mt-4 font-display text-2xl">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-7xl px-6 mt-32 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: DollarSign, t: "Zero placement fees", d: "We make money from investors, not founders." },
          { icon: Globe, t: "Global investor base", d: "LPs and funds across US, EU, MENA, and APAC." },
          { icon: Clock, t: "47-day median close", d: "60% faster than traditional fundraising." },
          { icon: Rocket, t: "Post-raise support", d: "Intros, advisors, and follow-on access." },
        ].map((f) => (
          <div key={f.t} className="rounded-xl border border-border bg-surface p-6">
            <f.icon className="h-6 w-6 text-lime" strokeWidth={1.5} />
            <h3 className="mt-5 font-display text-xl">{f.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
          </div>
        ))}
      </section>

      <CtaSection />
    </>
  );
}
