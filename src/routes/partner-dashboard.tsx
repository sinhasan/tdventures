import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  Copy,
  Check,
  TrendingUp,
  MousePointerClick,
  UserPlus,
  IndianRupee,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/partner-dashboard")({
  head: () => ({
    meta: [
      { title: "Partner Dashboard — TD Ventures" },
      { name: "description", content: "Track your referrals, conversions, and earnings as a TD Ventures partner." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PartnerDashboardPage,
});

interface Partner {
  id: string;
  referral_code: string;
  name: string;
  email: string;
}

interface Conversion {
  id: string;
  conversion_type: string;
  startup_name: string | null;
  commission_amount: number;
  created_at: string;
}

function PartnerDashboardPage() {
  const [code, setCode] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [clicks, setClicks] = useState(0);
  const [signups, setSignups] = useState(0);
  const [paid, setPaid] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [copied, setCopied] = useState(false);

  // Auto-load if ?code= present
  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    const c = url.get("code");
    if (c) {
      setCode(c);
      void loadPartner(c);
    }
  }, []);

  async function loadPartner(referralCode: string) {
    setLoading(true);
    setSearched(true);
    const { data: p } = await supabase
      .from("partners")
      .select("id, referral_code, name, email")
      .eq("referral_code", referralCode.trim())
      .maybeSingle();

    if (!p) {
      setPartner(null);
      setLoading(false);
      return;
    }
    setPartner(p);

    const [clicksRes, convRes] = await Promise.all([
      supabase
        .from("referral_clicks")
        .select("id", { count: "exact", head: true })
        .eq("partner_id", p.id),
      supabase
        .from("referral_conversions")
        .select("*")
        .eq("partner_id", p.id)
        .order("created_at", { ascending: false }),
    ]);

    setClicks(clicksRes.count ?? 0);
    const cs = (convRes.data ?? []) as Conversion[];
    setConversions(cs);
    setSignups(cs.filter((c) => c.conversion_type === "signup").length);
    setPaid(cs.filter((c) => c.conversion_type === "paid").length);
    setEarnings(cs.reduce((sum, c) => sum + Number(c.commission_amount || 0), 0));
    setLoading(false);
  }

  const referralUrl = partner
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/?ref=${partner.referral_code}`
    : "";
  const conversionRate = clicks > 0 ? ((signups / clicks) * 100).toFixed(1) : "0.0";

  function handleCopy() {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="min-h-screen bg-[#070708] text-white">
      <div className="absolute top-[-10%] left-[20%] h-[400px] w-[400px] rounded-full bg-lime/10 blur-[140px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <Link to="/affiliate" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to affiliate program
        </Link>

        <h1 className="font-display text-4xl sm:text-5xl tracking-tight">Partner Dashboard</h1>
        <p className="mt-3 text-white/60">Track your referrals, conversions, and earnings in real time.</p>

        {/* Lookup form */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <label className="text-xs uppercase tracking-widest text-white/50">Enter your referral code</label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim()) void loadPartner(code);
            }}
            className="mt-3 flex flex-col sm:flex-row gap-3"
          >
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. ARJUN24"
              className="flex-1 rounded-full border border-white/15 bg-black/40 px-5 py-3 text-sm placeholder:text-white/30 focus:outline-none focus:border-lime/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground hover:opacity-90 transition disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              {loading ? "Loading..." : "View dashboard"}
            </button>
          </form>
        </div>

        {searched && !loading && !partner && (
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-amber-200">
            No partner found with that code. Check the spelling or apply as a partner first.
          </div>
        )}

        {partner && (
          <>
            {/* Partner info + referral link */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-lime">Welcome back</div>
                  <div className="mt-1 font-display text-2xl">{partner.name}</div>
                  <div className="text-sm text-white/50">{partner.email}</div>
                </div>
                <div className="flex-1 md:max-w-md">
                  <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Your referral link</div>
                  <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 pl-4 pr-1 py-1">
                    <code className="flex-1 truncate text-sm text-white/80">{referralUrl}</code>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 rounded-full bg-lime px-4 py-2 text-xs font-semibold text-lime-foreground hover:opacity-90 transition"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={MousePointerClick} label="Total clicks" value={clicks.toString()} accent="text-cyan-300" />
              <StatCard icon={UserPlus} label="Signups" value={signups.toString()} accent="text-lime" sub={`${conversionRate}% conv. rate`} />
              <StatCard icon={TrendingUp} label="Paid conversions" value={paid.toString()} accent="text-violet-300" />
              <StatCard icon={IndianRupee} label="Total earnings" value={`₹${earnings.toLocaleString("en-IN")}`} accent="text-emerald-300" highlight />
            </div>

            {/* Conversions table */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-display text-lg">Recent conversions</h2>
                <span className="text-xs text-white/50">{conversions.length} total</span>
              </div>
              {conversions.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-white/40">
                  No conversions yet. Share your link to start earning.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/[0.03] text-xs uppercase tracking-widest text-white/50">
                      <tr>
                        <th className="text-left px-6 py-3 font-medium">Startup / Customer</th>
                        <th className="text-left px-6 py-3 font-medium">Type</th>
                        <th className="text-left px-6 py-3 font-medium">Date</th>
                        <th className="text-right px-6 py-3 font-medium">Commission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {conversions.map((c) => (
                        <tr key={c.id} className="hover:bg-white/[0.02] transition">
                          <td className="px-6 py-4 text-white">{c.startup_name || "—"}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                c.conversion_type === "paid"
                                  ? "bg-emerald-500/15 text-emerald-300"
                                  : "bg-cyan-500/15 text-cyan-300"
                              }`}
                            >
                              {c.conversion_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white/60">
                            {new Date(c.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-emerald-300">
                            ₹{Number(c.commission_amount).toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  sub,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  accent: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight
          ? "border-lime/30 bg-gradient-to-br from-lime/10 to-transparent"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <Icon className={`h-5 w-5 ${accent}`} strokeWidth={1.8} />
      <div className="mt-3 text-xs uppercase tracking-widest text-white/50">{label}</div>
      <div className="mt-1 font-display text-3xl tracking-tight text-white">{value}</div>
      {sub && <div className="mt-1 text-xs text-white/40">{sub}</div>}
    </div>
  );
}
