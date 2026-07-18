
-- Create promo_tokens table
CREATE TABLE public.promo_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('discount', 'free')),
  discount_percent integer DEFAULT 0,
  uses_count integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promo_tokens ENABLE ROW LEVEL SECURITY;

-- Anyone can read tokens (for frontend validation)
CREATE POLICY "Anyone can read promo tokens"
  ON public.promo_tokens FOR SELECT
  USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert promo tokens"
  ON public.promo_tokens FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update promo tokens"
  ON public.promo_tokens FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete promo tokens"
  ON public.promo_tokens FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Service role full access
CREATE POLICY "Service role can manage promo tokens"
  ON public.promo_tokens FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Add promo_token column to ghostcode_orders
ALTER TABLE public.ghostcode_orders ADD COLUMN promo_token text DEFAULT NULL;
