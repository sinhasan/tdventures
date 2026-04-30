import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Users, Calendar, CheckCircle2, ArrowRight, Download } from "lucide-react";
import { getDeal, deals, type Deal } from "@/lib/deals";

export const Route = createFileRoute("/deal/$slug")({
  loader: ({ params }): Deal => {
    const deal = getDeal(params.slug);
    if (!deal) throw notFound();
    return deal;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Deal"} — Atlas` },
      { name: "description", content: loaderData?.tagline ?? "Investment opportunity on Atlas." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-display text-3xl">Couldn't load this deal.</h1>
      <p className="mt-3 text-muted-foreground">{error.message}</p>
      <Link to="/marketplace" className="mt-6 inline-block text-lime">← Back to marketplace</Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-display text-4xl">Deal not found.</h1>
      <Link to="/marketplace" className="mt-6 inline-block text-lime">← Back to marketplace</Link>
    </div>
  ),
  component: DealPage,
});

function DealPage() {
  const deal = Route.useLoaderData();
  const related = deals.filter((d) => d.slug !== deal.slug && d.sector === deal.sector).slice(0, 2);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-lime transition"
          >
            <ArrowLeft className="h-3 w-3" />
            Marketplace / {deal.sector}
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
                <span className="text-muted-foreground">{deal.sector}</span>
                <span className="text-border">/</span>
                <span className="text-lime">{deal.stage}</span>
                <span className="text-border">/</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {deal.geography}
                </span>
              </div>
              <h1 className="mt-4 font-display text-5xl md:text-6xl leading-tight">{deal.name}</h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{deal.tagline}</p>
            </div>

            <div className="flex flex-col gap-2 md:items-end">
              <div className="text-right">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Raising</div>
                <div className="font-display text-4xl">{deal.raising}</div>
                <div className="font-mono text-xs text-muted-foreground mt-1">at {deal.valuation}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-12">
          {/* Metrics */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-lime mb-5">Key metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden border border-border">
              {deal.metrics.map((m: { label: string; value: string }) => (
                <div key={m.label} className="bg-surface p-5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{m.label}</div>
                  <div className="mt-2 font-display text-2xl">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-lime mb-5">The opportunity</h2>
            <p className="text-lg leading-relaxed text-foreground/90">{deal.description}</p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              The team has built a defensible position through deep technical advantages and
              strategic partnerships. Current trajectory positions them to be the category leader
              within 18 months. Atlas conducted independent reference checks with 14 customers
              and 6 industry experts.
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-lime mb-5">Investment highlights</h2>
            <ul className="space-y-3">
              {deal.highlights.map((h: string) => (
                <li key={h} className="flex items-start gap-3 rounded-md border border-border bg-surface p-4">
                  <CheckCircle2 className="h-5 w-5 text-lime shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span className="text-sm">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Team facts */}
          <div className="grid grid-cols-3 gap-4">
            <FactCard icon={Calendar} label="Founded" value={deal.founded} />
            <FactCard icon={Users} label="Team size" value={String(deal.team)} />
            <FactCard icon={MapPin} label="HQ" value={deal.geography.split(",")[0]} />
          </div>
        </div>

        {/* Sidebar — sticky enquiry */}
        <aside className="lg:sticky lg:top-24 lg:self-start space-y-4">
          <div className="rounded-xl border border-lime/40 bg-surface p-6 shadow-[var(--shadow-glow)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Round progress
              </span>
              <span className="font-mono text-xs text-lime">{deal.committed}% committed</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-lime" style={{ width: `${deal.committed}%` }} />
            </div>

            <div className="mt-6 space-y-3">
              <Link
                to="/contact"
                search={{ deal: deal.slug } as never}
                className="group flex items-center justify-between rounded-md bg-lime px-4 py-3 text-sm font-medium text-lime-foreground hover:opacity-90 transition"
              >
                Request data room
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm hover:border-lime/40 transition"
              >
                Schedule founder call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="flex w-full items-center justify-between rounded-md border border-border px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-lime/40 transition">
                Download teaser
                <Download className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center">
              Min ticket · $25,000
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Atlas confidence
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-4xl text-lime">A+</span>
              <span className="text-xs text-muted-foreground">Top 8% of vetted deals</span>
            </div>
          </div>
        </aside>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border bg-surface/30">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-display text-3xl">Similar deals in {deal.sector}</h2>
              <Link to="/marketplace" className="text-sm text-lime">View all →</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {related.map((d) => (
                <Link
                  key={d.slug}
                  to="/deal/$slug"
                  params={{ slug: d.slug }}
                  className="group rounded-lg border border-border bg-card p-6 hover:border-lime/40 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-lime">{d.stage}</div>
                      <h3 className="mt-2 font-display text-2xl group-hover:text-lime transition">{d.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{d.tagline}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-lime transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function FactCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
      <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg">{value}</div>
    </div>
  );
}
