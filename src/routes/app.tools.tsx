import { createFileRoute } from "@tanstack/react-router";
import { FileText, Mail, Calculator, Wand2, Database, BarChart3, Shield, ScrollText, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app/app-shell";

export const Route = createFileRoute("/app/tools")({
  head: () => ({ meta: [{ title: "Tools — Atlas Intelligence" }] }),
  component: ToolsPage,
});

const tools = [
  { icon: Wand2, title: "Pitch generator", desc: "AI drafts your one-pager from your metrics in seconds.", tag: "AI", featured: true },
  { icon: Mail, title: "Cold outreach composer", desc: "Personalized first emails tuned to each investor's thesis.", tag: "AI", featured: true },
  { icon: FileText, title: "Diligence pack builder", desc: "Auto-generates a polished investor data room.", tag: "AI" },
  { icon: Calculator, title: "Valuation modeler", desc: "Comp-driven valuation ranges with sensitivity tables.", tag: "Calc" },
  { icon: ScrollText, title: "SAFE & term sheet wizard", desc: "Generate compliant term sheets in minutes.", tag: "Legal" },
  { icon: Database, title: "Cap table simulator", desc: "Model dilution across rounds with stack scenarios.", tag: "Calc" },
  { icon: BarChart3, title: "Benchmark explorer", desc: "Compare your KPIs to 4,000+ stage-matched startups.", tag: "Data" },
  { icon: Shield, title: "Investor due diligence", desc: "Background, fund vintage, and portfolio overlap checks.", tag: "Data" },
];

function ToolsPage() {
  return (
    <AppShell
      title="Tools & Workflows"
      subtitle="AI and analytical workflows for every stage of your raise."
    >
      {/* Featured */}
      <div className="grid gap-5 md:grid-cols-2 mb-10">
        {tools.filter((t) => t.featured).map((t) => (
          <div key={t.title} className="relative overflow-hidden rounded-xl border border-lime/30 bg-surface p-7 hover:border-lime/60 transition group">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-lime/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="h-11 w-11 rounded-md bg-lime/15 grid place-items-center text-lime">
                  <t.icon className="h-5 w-5" strokeWidth={1.7} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-lime border border-lime/40 rounded px-1.5 py-0.5">{t.tag}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <button className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-lime px-4 py-2 text-sm font-medium text-lime-foreground hover:opacity-90 transition">
                Launch <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">All tools</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.filter((t) => !t.featured).map((t) => (
          <button key={t.title} className="group text-left rounded-lg border border-border bg-surface p-5 hover:border-lime/40 transition">
            <div className="flex items-start justify-between">
              <div className="h-9 w-9 rounded-md bg-accent grid place-items-center text-foreground group-hover:text-lime transition">
                <t.icon className="h-4 w-4" strokeWidth={1.7} />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border rounded px-1.5 py-0.5">{t.tag}</span>
            </div>
            <h3 className="mt-4 font-display text-lg">{t.title}</h3>
            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{t.desc}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs text-lime opacity-0 group-hover:opacity-100 transition">
              Open tool <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
