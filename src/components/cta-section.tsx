import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 mt-32">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-10 md:p-16">
        <div className="absolute inset-0 bg-grid opacity-30" aria-hidden />
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-lime/20 blur-3xl" aria-hidden />
        <div className="relative grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-lime">Get started</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">
              Capital meets infrastructure.
              <br />
              <span className="text-muted-foreground">In one curated pipeline.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link
              to="/investors"
              className="group inline-flex items-center justify-between gap-6 rounded-md bg-lime px-6 py-4 text-lime-foreground hover:opacity-90 transition w-full md:w-auto"
            >
              <span className="text-sm font-medium">Apply as an investor</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/founders"
              className="group inline-flex items-center justify-between gap-6 rounded-md border border-border px-6 py-4 text-foreground hover:border-lime/40 transition w-full md:w-auto"
            >
              <span className="text-sm font-medium">Submit your startup</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
