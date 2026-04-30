import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import tdLogo from "@/assets/td-ventures-logo.png";

const nav = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/investors", label: "For Investors" },
  { to: "/founders", label: "For Founders" },
  { to: "/app", label: "Platform" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 group" aria-label="TD Ventures — Home">
          <div className="rounded-md bg-white px-2.5 py-1.5 ring-1 ring-border/60 group-hover:ring-lime/40 transition">
            <img src={tdLogo} alt="TD Ventures" className="h-5 w-auto block" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:inline">
            / Infrastructure
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "px-3 py-2 text-sm text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/contact"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            Sign in
          </Link>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 rounded-md bg-lime px-4 py-2 text-sm font-medium text-lime-foreground hover:opacity-90 transition shadow-[0_0_0_1px_rgba(0,0,0,0.05)_inset]"
          >
            Browse deals
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 -mr-2 text-foreground"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="px-6 py-4 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2 text-base text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/marketplace"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-md bg-lime px-4 py-2.5 text-sm font-medium text-lime-foreground"
            >
              Browse deals
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
