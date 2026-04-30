
-- Partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Referral clicks
CREATE TABLE public.referral_clicks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  landing_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Referral conversions (signups + paid)
CREATE TABLE public.referral_conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  conversion_type TEXT NOT NULL, -- 'signup' or 'paid'
  startup_name TEXT,
  customer_email TEXT,
  commission_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_partners_referral_code ON public.partners(referral_code);
CREATE INDEX idx_clicks_partner_id ON public.referral_clicks(partner_id);
CREATE INDEX idx_conv_partner_id ON public.referral_conversions(partner_id);

-- RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;

-- Public can read partners (to validate referral codes) and create new partner applications
CREATE POLICY "Anyone can view partners"
  ON public.partners FOR SELECT USING (true);

CREATE POLICY "Anyone can apply as partner"
  ON public.partners FOR INSERT WITH CHECK (true);

-- Public can record clicks (tracking)
CREATE POLICY "Anyone can record clicks"
  ON public.referral_clicks FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view clicks"
  ON public.referral_clicks FOR SELECT USING (true);

-- Public can record conversions (signup attribution)
CREATE POLICY "Anyone can record conversions"
  ON public.referral_conversions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view conversions"
  ON public.referral_conversions FOR SELECT USING (true);
