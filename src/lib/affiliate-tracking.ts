import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "td_referral";
const ATTRIBUTION_WINDOW_DAYS = 30;

interface StoredReferral {
  partnerId: string;
  referralCode: string;
  clickedAt: string;
}

/**
 * Capture ?ref=CODE from the URL, log a click, and store attribution
 * (last-click wins, 30-day window).
 */
export async function captureReferralFromUrl(): Promise<void> {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const code = params.get("ref");
  if (!code) return;

  const { data: partner } = await supabase
    .from("partners")
    .select("id, referral_code")
    .eq("referral_code", code)
    .eq("status", "active")
    .maybeSingle();

  if (!partner) return;

  // Last-click attribution: overwrite any previous referral
  const stored: StoredReferral = {
    partnerId: partner.id,
    referralCode: partner.referral_code,
    clickedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));

  // Log the click
  await supabase.from("referral_clicks").insert({
    partner_id: partner.id,
    referral_code: partner.referral_code,
    user_agent: navigator.userAgent,
    landing_path: window.location.pathname,
  });
}

/**
 * Get the currently attributed partner from localStorage,
 * respecting the 30-day attribution window.
 */
export function getAttributedReferral(): StoredReferral | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const stored: StoredReferral = JSON.parse(raw);
    const ageDays =
      (Date.now() - new Date(stored.clickedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > ATTRIBUTION_WINDOW_DAYS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

/**
 * Record a conversion (signup or paid) attributed to the stored partner.
 */
export async function recordConversion(opts: {
  type: "signup" | "paid";
  startupName?: string;
  customerEmail?: string;
  commissionAmount?: number;
}): Promise<boolean> {
  const referral = getAttributedReferral();
  if (!referral) return false;

  const { error } = await supabase.from("referral_conversions").insert({
    partner_id: referral.partnerId,
    referral_code: referral.referralCode,
    conversion_type: opts.type,
    startup_name: opts.startupName ?? null,
    customer_email: opts.customerEmail ?? null,
    commission_amount: opts.commissionAmount ?? 0,
  });

  return !error;
}
