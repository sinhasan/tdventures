import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowLeft, Sparkles } from "lucide-react";
import { CashfreeCheckoutModal } from "@/components/cashfree-checkout-modal";

type Plan = "onboarding" | "premium_starter" | "premium_growth";

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [
      { title: "Get Started — TD Ventures" },
      { name: "description", content: "List your startup on TD Ventures. One-time onboarding or premium placement plans." },
    ],
  }),
  component: GetStartedPage,
});

const PLANS = [
  {
    id: "onboarding" as Plan,
    name: "Startup Onboarding",
    price: 999,
    cadence: "one-time",
    description: "Get your startup listed on the TD Ventures marketplace.",
    features: [
      "Profile on the marketplace",
      "Investor-ready listing",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get listed",
    highlight: false,
  },
  {
    id: "premium_starter" as Plan,
    name: "Premium Starter",
    price: 4999,
    cadence: "/ month",
    description: "Stand out with featured placement and warm intros.",
    features: [
      "Featured marketplace placement",
      "Priority investor matching",
      "2 warm intros / month",
      "Priority support",
    ],
    cta: "Go premium",
    highlight: true,
  },
  {
    id: "premium_growth" as Plan,
    name: "Premium Growth",
    price: 14999,
    cadence: "/ month",
    description: "Top-of-marketplace visibility for fundraising rounds.",
    features: [
      "Top of marketplace listing",
      "Unlimited warm intros",
      "Pitch deck review",
      "Dedicated success manager",
    ],
    cta: "Scale up",
    highlight: false,
  },
];

function GetStartedPage() {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);

  return (
    <div className="min-h-screen bg-[#070708] text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[20%] h-[500px] w-[500px] rounded-full bg-lime/10 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition mb-8">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>

        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
            <Sparkles className="h-3.5 w-3.5 text-lime" /> For Startups
          </div>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            List your startup,{" "}
            <span className="bg-gradient-to-r from-lime via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              get funded
            </span>
          </h1>
          <p className="mt-4 text-white/60">
            Pick a plan, complete checkout, and get in front of vetted investors.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-2xl border p-6 flex flex-col ${
                p.highlight
                  ? "border-lime/40 bg-gradient-to-b from-lime/[0.07] to-transparent shadow-[0_0_60px_-20px_rgba(190,242,100,0.4)]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime px-3 py-1 text-[10px] uppercase tracking-widest font-semibold text-lime-foreground">
                  Most popular
                </div>
              )}
              <div className="text-xs uppercase tracking-widest text-white/50">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-4xl tracking-tight">
                  ₹{p.price.toLocaleString("en-IN")}
                </span>
                <span className="text-sm text-white/50">{p.cadence}</span>
              </div>
              <p className="mt-3 text-sm text-white/60">{p.description}</p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                    <Check className="h-4 w-4 text-lime shrink-0 mt-0.5" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setActivePlan(p.id)}
                className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
                  p.highlight
                    ? "bg-lime text-lime-foreground hover:opacity-90 shadow-[0_0_30px_-8px_rgba(190,242,100,0.6)]"
                    : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-white/40">
          Payments processed securely by Cashfree • Sandbox mode active
        </p>
      </div>

      <CashfreeCheckoutModal plan={activePlan} onClose={() => setActivePlan(null)} />
    </div>
  );
}
