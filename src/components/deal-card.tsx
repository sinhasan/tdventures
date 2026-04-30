import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Deal } from "@/lib/deals";

export function DealCard({ deal }: { deal: Deal }) {
  return (
    <Link
      to="/deal/$slug"
      params={{ slug: deal.slug }}
      className="group relative flex flex-col rounded-lg border border-border bg-card p-6 transition-all hover:border-lime/40 hover:shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>{deal.sector}</span>
            <span className="text-border">·</span>
            <span className="text-lime">{deal.stage}</span>
          </div>
          <h3 className="mt-3 font-display text-2xl text-foreground">{deal.name}</h3>
        </div>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all group-hover:text-lime group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{deal.tagline}</p>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Raising</div>
          <div className="mt-1 font-display text-lg">{deal.raising}</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">ARR</div>
          <div className="mt-1 font-display text-lg">{deal.arr}</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Growth</div>
          <div className="mt-1 font-display text-lg text-lime">{deal.growth}</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-xs">
          <span className="font-mono uppercase tracking-widest text-muted-foreground">Committed</span>
          <span className="font-mono text-foreground">{deal.committed}%</span>
        </div>
        <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-lime transition-all"
            style={{ width: `${deal.committed}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3 w-3" />
          {deal.geography}
        </span>
        <span className="text-lime opacity-0 group-hover:opacity-100 transition font-medium">View deal →</span>
      </div>
    </Link>
  );
}
