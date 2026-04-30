import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Globe, MapPin, Users, TrendingUp, Rocket, ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import {
  startups,
  startupStages,
  startupCountries,
  startupIndustries,
  startupSectors,
  type RawStartup,
} from "@/lib/platform-data";

export const Route = createFileRoute("/app/browse-startups")({
  head: () => ({ meta: [{ title: "Startups — Atlas Intelligence" }] }),
  component: BrowseStartupsPage,
});

type SortKey = "raised" | "seeking" | "team" | "year" | "name";

function BrowseStartupsPage() {
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("");
  const [country, setCountry] = useState("");
  const [industry, setIndustry] = useState("");
  const [sector, setSector] = useState("");
  const [seekingOnly, setSeekingOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("raised");

  const filtered = useMemo(() => {
    const list = startups.filter((s) => {
      if (q) {
        const hay = `${s.name ?? ""} ${s.pitch ?? ""} ${s.description ?? ""} ${s.industry ?? ""} ${s.sectors.join(" ")}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      if (stage && s.stage !== stage) return false;
      if (country && s.country !== country) return false;
      if (industry && s.industry !== industry) return false;
      if (sector && !s.sectors.includes(sector)) return false;
      if (seekingOnly && !(s.amountSeeking && s.amountSeeking > 0)) return false;
      return true;
    });
    const sorters: Record<SortKey, (a: RawStartup, b: RawStartup) => number> = {
      raised: (a, b) => (b.fundingRaised ?? 0) - (a.fundingRaised ?? 0),
      seeking: (a, b) => (b.amountSeeking ?? 0) - (a.amountSeeking ?? 0),
      team: (a, b) => (b.teamSize ?? 0) - (a.teamSize ?? 0),
      year: (a, b) => (b.foundedYear ?? 0) - (a.foundedYear ?? 0),
      name: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
    };
    return list.sort(sorters[sort]);
  }, [q, stage, country, industry, sector, seekingOnly, sort]);

  const totalRaised = startups.reduce((acc, s) => acc + (s.fundingRaised ?? 0), 0);

  return (
    <AppShell
      title="Startup Database"
      subtitle={`${startups.length.toLocaleString()} funded startups · $${(totalRaised / 1_000_000_000).toFixed(1)}B aggregate raised`}
    >
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className="rounded-xl border border-border bg-surface p-5 h-fit xl:sticky xl:top-24 space-y-5">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Search</label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Name, pitch, sector..."
                className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-lime/60 transition"
              />
            </div>
          </div>

          <FilterPicker label="Stage" value={stage} setValue={setStage} options={startupStages} />
          <FilterPicker label="Country" value={country} setValue={setCountry} options={startupCountries} />
          <FilterPicker label="Industry" value={industry} setValue={setIndustry} options={startupIndustries.slice(0, 30)} />
          <FilterPicker label="Sector" value={sector} setValue={setSector} options={startupSectors.slice(0, 30)} />

          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
            <input
              type="checkbox"
              checked={seekingOnly}
              onChange={(e) => setSeekingOnly(e.target.checked)}
              className="accent-lime h-3.5 w-3.5"
            />
            Currently raising only
          </label>

          <button
            onClick={() => {
              setQ(""); setStage(""); setCountry(""); setIndustry(""); setSector(""); setSeekingOnly(false);
            }}
            className="w-full text-xs text-muted-foreground hover:text-foreground py-2 border border-border rounded-md transition"
          >
            Reset filters
          </button>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {filtered.length.toLocaleString()} startups
              {filtered.length > 60 && <span className="ml-2 text-muted-foreground/70">· showing top 60</span>}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-lime/60"
            >
              <option value="raised">Sort: funding raised ↓</option>
              <option value="seeking">Sort: ask size ↓</option>
              <option value="team">Sort: team size ↓</option>
              <option value="year">Sort: newest founded</option>
              <option value="name">Sort: name A→Z</option>
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filtered.slice(0, 60).map((s) => <StartupCard key={s.id} s={s} />)}
            {filtered.length === 0 && (
              <div className="md:col-span-2 rounded-lg border border-border bg-surface p-12 text-center">
                <p className="font-display text-xl">No startups match your filters.</p>
                <p className="mt-2 text-sm text-muted-foreground">Try widening stage or country.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FilterPicker({ label, value, setValue, options }: { label: string; value: string; setValue: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button
          onClick={() => setValue("")}
          className={`px-2.5 py-1 text-[11px] rounded border transition ${value === "" ? "border-lime/60 bg-lime/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          All
        </button>
        {options.map((o) => (
          <button
            key={o}
            onClick={() => setValue(o)}
            className={`px-2.5 py-1 text-[11px] rounded border transition ${value === o ? "border-lime/60 bg-lime/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function fmtUSD(v: number | null | undefined): string {
  if (!v) return "—";
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v}`;
}

function StartupCard({ s }: { s: RawStartup }) {
  const initials = (s.name ?? "?").split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const seeking = s.amountSeeking && s.amountSeeking > 0;
  return (
    <article className="group rounded-xl border border-border bg-surface p-5 hover:border-lime/40 transition flex flex-col">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 rounded-lg bg-lime/15 text-lime grid place-items-center font-display font-bold">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="font-display text-lg leading-tight truncate">{s.name}</h3>
            {s.stage && (
              <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-accent text-muted-foreground">
                {s.stage}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {s.industry ?? "—"} · <MapPin className="inline h-3 w-3" /> {[s.city, s.country].filter(Boolean).join(", ") || "—"}
            {s.foundedYear && <> · est. {s.foundedYear}</>}
          </p>
        </div>
      </div>

      {s.pitch && (
        <p className="mt-3 text-sm text-foreground/90 line-clamp-2 italic">"{s.pitch}"</p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat icon={TrendingUp} label="Raised" value={fmtUSD(s.fundingRaised)} tone="lime" />
        <Stat icon={Rocket} label="Seeking" value={fmtUSD(s.amountSeeking)} tone={seeking ? "amber" : "muted"} />
        <Stat icon={Users} label="Team" value={s.teamSize ? s.teamSize.toLocaleString() : "—"} tone="muted" />
      </div>

      {s.sectors.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {s.sectors.slice(0, 4).map((sec) => (
            <span key={sec} className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent text-muted-foreground">
              {sec}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto pt-4 flex items-center gap-2">
        {s.website && (
          <a
            href={s.website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:border-lime/40 transition"
          >
            <Globe className="h-3 w-3" /> Website
          </a>
        )}
        {seeking && (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-lime/15 text-lime px-3 py-1.5 text-xs font-medium">
            ● Raising
          </span>
        )}
        <button className="ml-auto inline-flex items-center gap-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground transition">
          View details <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof TrendingUp; label: string; value: string; tone: "lime" | "amber" | "muted" }) {
  const colorMap = {
    lime: "text-lime",
    amber: "text-amber-300",
    muted: "text-foreground",
  };
  return (
    <div className="rounded-md border border-border bg-card/40 px-3 py-2">
      <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`text-sm font-display mt-0.5 ${colorMap[tone]}`}>{value}</div>
    </div>
  );
}
