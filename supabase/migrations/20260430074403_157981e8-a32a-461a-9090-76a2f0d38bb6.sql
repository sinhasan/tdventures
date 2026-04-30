
CREATE TABLE public.payment_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  partner_id UUID REFERENCES public.partners(id) ON DELETE SET NULL,
  referral_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  cashfree_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX idx_payment_orders_order_id ON public.payment_orders(order_id);
CREATE INDEX idx_payment_orders_partner_id ON public.payment_orders(partner_id);

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders"
  ON public.payment_orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view their order by id"
  ON public.payment_orders FOR SELECT USING (true);
