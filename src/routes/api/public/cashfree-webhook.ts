import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Cashfree webhook: verifies signature, marks order paid, records affiliate conversion.
// Docs: https://www.cashfree.com/docs/payments/online/webhooks/payment
export const Route = createFileRoute("/api/public/cashfree-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const SECRET = process.env.CASHFREE_SECRET_KEY;
        if (!SECRET) {
          return new Response("Server not configured", { status: 500 });
        }

        const rawBody = await request.text();
        const timestamp = request.headers.get("x-webhook-timestamp");
        const signature = request.headers.get("x-webhook-signature");

        if (!timestamp || !signature) {
          return new Response("Missing signature headers", { status: 401 });
        }

        // Cashfree signature = base64( HMAC_SHA256( timestamp + rawBody, secret ) )
        const expected = createHmac("sha256", SECRET)
          .update(timestamp + rawBody)
          .digest("base64");

        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expected);
        if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: any;
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const eventType = payload?.type as string | undefined;
        const order = payload?.data?.order;
        const payment = payload?.data?.payment;
        const orderId = order?.order_id as string | undefined;
        if (!orderId) return new Response("ok"); // ignore unrelated events

        // Look up the pending order we created
        const { data: pending } = await supabaseAdmin
          .from("payment_orders")
          .select("*")
          .eq("order_id", orderId)
          .maybeSingle();

        if (!pending) return new Response("ok");

        if (eventType === "PAYMENT_SUCCESS_WEBHOOK") {
          await supabaseAdmin
            .from("payment_orders")
            .update({
              status: "paid",
              cashfree_payment_id: payment?.cf_payment_id?.toString() ?? null,
              paid_at: new Date().toISOString(),
            })
            .eq("order_id", orderId);

          // Affiliate attribution: 30% commission on premium plans, ₹999 flat on onboarding
          if (pending.partner_id) {
            const amount = Number(pending.amount);
            const commission =
              pending.plan === "onboarding" ? 999 : Math.round(amount * 0.3);

            await supabaseAdmin.from("referral_conversions").insert({
              partner_id: pending.partner_id,
              referral_code: pending.referral_code ?? "",
              conversion_type: "paid",
              startup_name: pending.customer_name,
              customer_email: pending.customer_email,
              commission_amount: commission,
            });
          }
        } else if (eventType === "PAYMENT_FAILED_WEBHOOK") {
          await supabaseAdmin
            .from("payment_orders")
            .update({ status: "failed" })
            .eq("order_id", orderId);
        }

        return new Response("ok");
      },
    },
  },
});
