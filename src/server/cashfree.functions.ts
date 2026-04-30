import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CASHFREE_BASE = "https://sandbox.cashfree.com/pg"; // sandbox
const API_VERSION = "2023-08-01";

const Input = z.object({
  plan: z.enum(["onboarding", "premium_starter", "premium_growth"]),
  customerName: z.string().trim().min(1).max(100),
  customerEmail: z.string().trim().email().max(255),
  customerPhone: z.string().trim().min(10).max(15),
  partnerId: z.string().uuid().nullable().optional(),
  referralCode: z.string().trim().max(50).nullable().optional(),
});

const PLANS = {
  onboarding: { amount: 999, label: "Startup Onboarding" },
  premium_starter: { amount: 4999, label: "Premium Starter" },
  premium_growth: { amount: 14999, label: "Premium Growth" },
} as const;

export const createCashfreeOrder = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    const APP_ID = process.env.CASHFREE_APP_ID;
    const SECRET = process.env.CASHFREE_SECRET_KEY;
    if (!APP_ID || !SECRET) {
      throw new Error("Cashfree credentials are not configured");
    }

    const plan = PLANS[data.plan];
    const orderId = `td_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Persist a pending order so the webhook can attribute to a partner later
    await supabaseAdmin.from("payment_orders").insert({
      order_id: orderId,
      plan: data.plan,
      amount: plan.amount,
      customer_email: data.customerEmail,
      customer_name: data.customerName,
      partner_id: data.partnerId ?? null,
      referral_code: data.referralCode ?? null,
      status: "pending",
    });

    const res = await fetch(`${CASHFREE_BASE}/orders`, {
      method: "POST",
      headers: {
        "x-api-version": API_VERSION,
        "x-client-id": APP_ID,
        "x-client-secret": SECRET,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: plan.amount,
        order_currency: "INR",
        customer_details: {
          customer_id: data.customerEmail.replace(/[^a-zA-Z0-9]/g, "_"),
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_phone: data.customerPhone,
        },
        order_meta: {
          notify_url: `${process.env.SITE_URL ?? ""}/api/public/cashfree-webhook`,
        },
        order_note: `${plan.label} (${data.plan})`,
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      console.error("Cashfree order error", res.status, body);
      throw new Error(body?.message ?? "Failed to create payment order");
    }

    return {
      orderId,
      paymentSessionId: body.payment_session_id as string,
      amount: plan.amount,
      label: plan.label,
    };
  });
