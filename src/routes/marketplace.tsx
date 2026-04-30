import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { deals } from "@/lib/deals";
import { DealCard } from "@/components/deal-card";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Atlas Infrastructure Deals" },
      { name: "description", content: "Browse 240+ vetted infrastructure startup deals. Filter by sector, stage, geography, and revenue." },
    ],
  }),
  component: Marketplace,
});

const sectors = ["All", "Cloud Infra", "Fintech Infra", "DevTools", "AI Infra"];
const stages = ["All", "Pre-Seed", "Seed", "Series A", "Series B"];

function Marketplace() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("All");
  const [stage, setStage] = useState("All");

  const filtered = useMemo(
    () =>
      deals.filter(
        (d) =>
          (sector === "All" || d.sector === sector) &&
          (stage === "All" || d.stage === stage) &&
          (q === "" || d.name.toLowerCase().includes(q.toLowerCase()) || d.tagline.toLowerCase().includes(q.toLowerCase())),
      ),
    [q, sector, stage],
  );

  return (
    <>
      {/* Page header */}
      <section className="border-b border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-lime">Marketplace</p>
          <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h1 className="font-display text-5xl md:text-6xl leading-tight max-w-2xl">
              Active deal flow.
              <br />
              <span className="text-muted-foreground">Updated daily.</span>
            </h1>
            <div className="flex gap-8">
              <div>
                <div className="font-display text-3xl">{deals.length}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Active</div>
              </div>
              <div>
                <div className="font-display text-3xl">$78M</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Raising</div>
              </div>
              <div>
                <div className="font-display text-3xl text-lime">12</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Closing this week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search deals, sectors, founders..."
              className="w-full rounded-md border border-border bg-surface pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime/60 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden md:block" />
            <FilterGroup label="Sector" value={sector} setValue={setSector} options={sectors} />
            <FilterGroup label="Stage" value={stage} setValue={setStage} options={stages} />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {filtered.length} deals
          </p>
          <Link to="/investors" className="text-sm text-lime hover:underline">
            Want personalized matches? →
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-16 text-center">
            <p className="font-display text-2xl">No deals match your filters.</p>
            <p className="mt-2 text-sm text-muted-foreground">Try broadening the search.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <DealCard key={d.slug} deal={d} />
            ))}
          </div>
        )}

        {/* Inline CTA */}
        <div className="mt-16 rounded-xl border border-border bg-surface p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl md:text-3xl">Don't see the right fit?</h3>
            <p className="mt-2 text-muted-foreground">
              Tell us your thesis. We'll surface 5 matched deals within 48 hours.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-lime px-6 py-3 text-sm font-medium text-lime-foreground hover:opacity-90 transition whitespace-nowrap"
          >
            Talk to deal flow <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function FilterGroup({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-surface p-1">
      <span className="px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hidden md:inline">
        {label}
      </span>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => setValue(o)}
          className={`px-3 py-1.5 text-xs rounded-sm transition ${
            value === o
              ? "bg-lime text-lime-foreground font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
