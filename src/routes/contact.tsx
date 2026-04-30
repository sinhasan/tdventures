import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Mail, MapPin, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — TD Ventures" },
      { name: "description", content: "Talk to deal flow. Apply for investor access or submit your startup." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState("investor");

  return (
    <>
      <section className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-lime">Contact</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl leading-tight max-w-3xl">
            Let's get you into the right deals.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Tell us a little about you. We respond to every enquiry within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-surface p-8 md:p-10">
          {submitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-lime/15 grid place-items-center">
                <CheckCircle2 className="h-6 w-6 text-lime" />
              </div>
              <h2 className="mt-6 font-display text-3xl">Thanks — we've got it.</h2>
              <p className="mt-3 text-muted-foreground max-w-sm mx-auto">
                A member of the TD Ventures team will be in touch within one business day.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-6"
            >
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  I am a
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(["investor", "founder"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-md border px-4 py-3 text-sm transition ${
                        role === r
                          ? "border-lime bg-lime/10 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {r === "investor" ? "Investor / LP" : "Founder"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Full name" name="name" required />
                <Field label="Work email" name="email" type="email" required />
              </div>
              <Field label={role === "investor" ? "Fund / firm" : "Company"} name="company" required />

              {role === "investor" ? (
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Typical check size" name="check" placeholder="$250k – $2M" />
                  <Field label="Sectors of interest" name="sectors" placeholder="Cloud, AI Infra..." />
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Stage" name="stage" placeholder="Seed, Series A..." />
                  <Field label="Raising" name="raising" placeholder="$5M" />
                </div>
              )}

              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Tell us more
                </label>
                <textarea
                  rows={4}
                  className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime/60 transition"
                  placeholder={role === "investor" ? "Your thesis, fund stage, anything else..." : "What you're building, traction, key metrics..."}
                />
              </div>

              <button
                type="submit"
                className="group w-full inline-flex items-center justify-center gap-2 rounded-md bg-lime px-6 py-4 text-sm font-medium text-lime-foreground hover:opacity-90 transition shadow-[var(--shadow-glow)]"
              >
                {role === "investor" ? "Request investor access" : "Submit my startup"}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center">
                We respond within 1 business day
              </p>
            </form>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-border bg-surface p-6">
            <Mail className="h-5 w-5 text-lime" strokeWidth={1.5} />
            <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Email</div>
            <p className="mt-1">hello@tdventures.in</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <MapPin className="h-5 w-5 text-lime" strokeWidth={1.5} />
            <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Offices</div>
            <p className="mt-1">Bangalore, India</p>
          </div>
          <div className="rounded-xl border border-lime/40 bg-surface p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-lime">Office hours</div>
            <p className="mt-3 text-sm text-muted-foreground">
              Every Thursday at 10am PT, TD Ventures hosts an open AMA for new investors and founders.
            </p>
            <a href="#" className="mt-4 inline-flex items-center gap-2 text-sm text-lime">
              Reserve a seat <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </aside>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-lime/60 transition"
      />
    </div>
  );
}
