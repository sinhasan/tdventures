import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Mail, Bookmark, ArrowUpRight, MapPin, Linkedin, Globe } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";
import { investors, allSectors, allStages, allGeos, type Investor } from "@/lib/platform-data";

const TYPES = ["VC", "Angel"] as const;
const REGIONS = ["India", "USA"] as const;

export const Route = createFileRoute("/app/investors")({
  head: () => ({ meta: [{ title: "Investors — Atlas Intelligence" }] }),
  component: InvestorsPage,
});

type SortKey = "fit" | "response" | "ticket" | "name" | "portfolio";

function InvestorsPage() {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("");
  const [stage, setStage] = useState<string>("");
  const [geo, setGeo] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [ticket, setTicket] = useState<number>(0);
  const [sort, setSort] = useState<SortKey>("fit");

  const filtered = useMemo(() => {
    const list = investors.filter((i) => {
      if (q) {
        const hay = `${i.name} ${i.firm ?? ""} ${i.title ?? ""} ${i.keywords ?? ""}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      if (sector && !i.sectors.includes(sector)) return false;
      if (stage && !i.stages.includes(stage)) return false;
      if (geo && i.city !== geo && i.country !== geo) return false;
      if (type && i.type !== type) return false;
      if (region && i.region !== region) return false;
      if (ticket && i.ticketMax < ticket) return false;
      return true;
    });
    const sorters: Record<SortKey, (a: Investor, b: Investor) => number> = {
      fit: (a, b) => b.thesisFit - a.thesisFit,
      response: (a, b) => b.responseRate - a.responseRate,
      ticket: (a, b) => b.ticketMax - a.ticketMax,
      portfolio: (a, b) => b.portfolio - a.portfolio,
      name: (a, b) => (a.name ?? "").localeCompare(b.name ?? ""),
    };
    return list.sort(sorters[sort]);
  }, [q, sector, stage, geo, type, region, ticket, sort]);

  return (
    <AppShell
      title="Investor Database"
      subtitle={`${investors.length.toLocaleString()} vetted investors · live signals across portfolios`}
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
                placeholder="Name, firm, title, keyword..."
                className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-lime/60 transition"
              />
            </div>
          </div>

          <FilterPicker label="Type" value={type} setValue={setType} options={[...TYPES]} />
          <FilterPicker label="Region" value={region} setValue={setRegion} options={[...REGIONS]} />
          <FilterPicker label="Sector" value={sector} setValue={setSector} options={allSectors.slice(0, 30)} />
          <FilterPicker label="Stage" value={stage} setValue={setStage} options={allStages} />
          <FilterPicker label="Geography" value={geo} setValue={setGeo} options={allGeos.slice(0, 40)} />

          <div>
            <div className="flex items-center justify-between">
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Min ticket</label>
              <span className="font-mono text-xs text-lime">{ticket > 0 ? `$${ticket}K+` : "Any"}</span>
            </div>
            <input
              type="range"
              min={0}
              max={5000}
              step={250}
              value={ticket}
              onChange={(e) => setTicket(Number(e.target.value))}
              className="mt-3 w-full accent-lime"
            />
          </div>

          <button
            onClick={() => { setQ(""); setSector(""); setStage(""); setGeo(""); setType(""); setRegion(""); setTicket(0); }}
            className="w-full text-xs text-muted-foreground hover:text-foreground py-2 border border-border rounded-md transition"
          >
            Reset filters
          </button>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {filtered.length.toLocaleString()} investors
              {filtered.length > 50 && <span className="ml-2 text-muted-foreground/70">· showing top 50</span>}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-lime/60"
            >
              <option value="fit">Sort: thesis fit ↓</option>
              <option value="response">Sort: response rate ↓</option>
              <option value="ticket">Sort: ticket size ↓</option>
              <option value="portfolio">Sort: portfolio size ↓</option>
              <option value="name">Sort: name A→Z</option>
            </select>
          </div>

          <div className="space-y-3">
            {filtered.slice(0, 50).map((inv) => <InvestorRow key={inv.id} inv={inv} />)}
            {filtered.length === 0 && (
              <div className="rounded-lg border border-border bg-surface p-12 text-center">
                <p className="font-display text-xl">No investors match your filters.</p>
                <p className="mt-2 text-sm text-muted-foreground">Try widening the sector or geography.</p>
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

function InvestorRow({ inv }: { inv: Investor }) {
  const initials = (inv.name || inv.firm || "?").split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const colorMap: Record<string, string> = {
    lime: "bg-lime/20 text-lime", blue: "bg-blue-500/20 text-blue-300",
    amber: "bg-amber-500/20 text-amber-300", rose: "bg-rose-500/20 text-rose-300",
    violet: "bg-violet-500/20 text-violet-300", teal: "bg-teal-500/20 text-teal-300",
  };
  return (
    <div className="group rounded-xl border border-border bg-surface p-5 hover:border-lime/40 transition">
      <div className="flex items-start gap-4">
        <div className={`h-12 w-12 rounded-full grid place-items-center font-display font-bold shrink-0 ${colorMap[inv.avatar]}`}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-lg truncate">{inv.name}</h3>
                <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-accent text-muted-foreground">{inv.type}</span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-lime">● {inv.region}</span>
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {inv.firm ?? "Independent"}
                {inv.title && <> <span className="text-border">·</span> {inv.title}</>}
                {" "}<span className="text-border">·</span>{" "}
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{inv.geography}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display text-3xl text-lime leading-none">{inv.thesisFit}</div>
              <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mt-1">thesis fit</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Ticket" value={`$${inv.ticketMin}–${inv.ticketMax}K`} />
            <Stat label="Stages" value={inv.stages.join(", ")} />
            <Stat label="Industry" value={inv.industry ?? "—"} />
            <Stat label="Response" value={`${inv.responseRate}%`} />
          </div>

          {inv.sectors.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              {inv.sectors.slice(0, 5).map((s) => (
                <span key={s} className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent text-muted-foreground">{s}</span>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {inv.email && (
              <a href={`mailto:${inv.email}`} className="inline-flex items-center gap-1.5 rounded-md bg-lime px-3 py-1.5 text-xs font-medium text-lime-foreground hover:opacity-90 transition">
                <Mail className="h-3 w-3" /> Email
              </a>
            )}
            {inv.linkedin && (
              <a href={inv.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:border-lime/40 transition">
                <Linkedin className="h-3 w-3" /> LinkedIn
              </a>
            )}
            {inv.website && (
              <a href={inv.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:border-lime/40 transition">
                <Globe className="h-3 w-3" /> Website
              </a>
            )}
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:border-lime/40 transition">
              <Bookmark className="h-3 w-3" /> Save
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-lime/40 transition ml-auto">
              View profile <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="text-sm mt-0.5 truncate">{value}</div>
    </div>
  );
}
