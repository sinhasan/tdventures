import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Rocket, Sparkles, Wrench, Gauge, Wand2, TrendingUp, ArrowLeft, Search, Bell, Briefcase } from "lucide-react";
import type { ReactNode } from "react";
import tdLogo from "@/assets/td-ventures-logo.png";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/investors", label: "Investors", icon: Users },
  { to: "/app/browse-startups", label: "Startups", icon: Rocket },
  { to: "/app/match", label: "AI Match", icon: Sparkles },
  { to: "/app/readiness", label: "Readiness", icon: Gauge },
  { to: "/app/pitch", label: "Pitch Polish", icon: Wand2 },
  { to: "/app/intelligence", label: "Intelligence", icon: TrendingUp },
  { to: "/app/startups", label: "Portfolio", icon: Briefcase },
  { to: "/app/tools", label: "Tools", icon: Wrench },
];

export function AppShell({ children, title, subtitle, actions }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-surface/40 sticky top-0 h-screen">
        <div className="px-4 h-16 flex items-center border-b border-border">
          <div className="rounded-md bg-white px-2.5 py-1.5 ring-1 ring-border/60">
            <img src={tdLogo} alt="TD Ventures" className="h-5 w-auto block" />
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to as never}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-lime/10 text-foreground border border-lime/30"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground border border-transparent"
                }`}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.7} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Link to="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to marketing site
          </Link>
          <div className="mt-3 rounded-lg border border-border bg-surface p-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-lime grid place-items-center font-display text-sm text-lime-foreground font-bold">
                EM
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">Elena Marsh</div>
                <div className="text-[10px] text-muted-foreground truncate">CEO · Nimbus Grid</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center px-6 gap-4">
          <div className="lg:hidden flex items-center">
            <div className="rounded-md bg-white px-2 py-1 ring-1 ring-border/60">
              <img src={tdLogo} alt="TD Ventures" className="h-4 w-auto block" />
            </div>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search investors, startups, signals..."
              className="w-full rounded-md border border-border bg-surface pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-lime/60 transition"
            />
          </div>
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-lime" />
          </button>
        </header>

        {/* Mobile nav */}
        <div className="lg:hidden border-b border-border overflow-x-auto">
          <div className="flex gap-1 px-3 py-2">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to as never}
                  className={`shrink-0 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs whitespace-nowrap transition ${
                    active ? "bg-lime/10 text-foreground border border-lime/30" : "text-muted-foreground border border-transparent"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Page header */}
        <div className="px-6 lg:px-10 pt-8 pb-6 border-b border-border">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
              {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 px-6 lg:px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
