import { useEffect, useState } from "react";
import { createServerFn, useServerFn } from "@tanstack/react-start";
const createCashfreeOrder = async (data: any) => {
  return {
    orderId: "test_order",
    paymentLink: "#",
  };
};
import { getAttributedReferral } from "@/lib/affiliate-tracking";
import { Loader2, ShieldCheck, X } from "lucide-react";

type Plan = "onboarding" | "premium_starter" | "premium_growth";

const PLAN_META: Record<Plan, { label: string; amount: number; tagline: string }> = {
  onboarding: { label: "Startup Onboarding", amount: 999, tagline: "One-time, get listed" },
  premium_starter: { label: "Premium Starter", amount: 4999, tagline: "Featured placement" },
  premium_growth: { label: "Premium Growth", amount: 14999, tagline: "Top of marketplace" },
};

interface CheckoutModalProps {
  plan: Plan | null;
  onClose: () => void;
}

export function CashfreeCheckoutModal({ plan, onClose }: CheckoutModalProps) {
  const createOrder = useServerFn(createCashfreeOrder);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);

  // Lazy-load Cashfree Web SDK
  useEffect(() => {
    if (!plan) return;
    if ((window as any).Cashfree) {
      setSdkReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.async = true;
    s.onload = () => setSdkReady(true);
    document.body.appendChild(s);
  }, [plan]);

  if (!plan) return null;
  const meta = PLAN_META[plan];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!plan) return;
    setError(null);
    setLoading(true);
    try {
      const ref = getAttributedReferral();
      const order = await createOrder({
        data: {
          plan,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          partnerId: ref?.partnerId ?? null,
          referralCode: ref?.referralCode ?? null,
        },
      });

      const cf = (window as any).Cashfree({ mode: "sandbox" });
      await cf.checkout({
        paymentSessionId: order.paymentSessionId,
        redirectTarget: "_modal",
      });
      // Webhook handles attribution; close after redirect
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0c0c10] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-xs uppercase tracking-widest text-lime">{meta.tagline}</div>
        <h2 className="mt-2 font-display text-2xl text-white">{meta.label}</h2>
        <div className="mt-1 font-display text-4xl text-white">
          ₹{meta.amount.toLocaleString("en-IN")}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            maxLength={100}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime/50"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            maxLength={255}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime/50"
          />
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="Phone (10 digits)"
            minLength={10}
            maxLength={15}
            className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime/50"
          />

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !sdkReady}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-semibold text-lime-foreground hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Creating order..." : sdkReady ? `Pay ₹${meta.amount.toLocaleString("en-IN")}` : "Loading..."}
          </button>

          <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-white/40">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure payment via Cashfree (Sandbox)
          </div>
        </form>
      </div>
    </div>
  );
}
