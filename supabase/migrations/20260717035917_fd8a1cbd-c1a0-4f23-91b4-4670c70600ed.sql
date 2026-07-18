
-- 1) Add max_uses limit
ALTER TABLE public.promo_tokens
  ADD COLUMN IF NOT EXISTS max_uses integer NOT NULL DEFAULT 1;

-- Backfill: existing tokens keep working for admins that pre-provisioned them
UPDATE public.promo_tokens
  SET max_uses = GREATEST(max_uses, uses_count + 50)
  WHERE max_uses <= uses_count;

-- 2) Remove the public SELECT policy that allowed anonymous enumeration of codes
DROP POLICY IF EXISTS "Anyone can read promo tokens" ON public.promo_tokens;

-- Admins keep read access via the admin panel
CREATE POLICY "Admins can read promo tokens"
  ON public.promo_tokens FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) Safe validator: returns only validity + discount, never leaks token metadata
CREATE OR REPLACE FUNCTION public.validate_promo_token(_code text)
RETURNS TABLE(valid boolean, type text, discount_percent integer)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec public.promo_tokens%ROWTYPE;
BEGIN
  SELECT * INTO rec
  FROM public.promo_tokens
  WHERE token_code = upper(trim(_code))
    AND active = true;

  IF NOT FOUND OR rec.uses_count >= rec.max_uses THEN
    RETURN QUERY SELECT false, NULL::text, NULL::integer;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, rec.type, COALESCE(rec.discount_percent, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.validate_promo_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_promo_token(text) TO anon, authenticated, service_role;

-- 4) Atomic consumer: reserves one use or fails. Used by edge functions and client redemption paths.
CREATE OR REPLACE FUNCTION public.consume_promo_token(_code text)
RETURNS TABLE(success boolean, type text, discount_percent integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated public.promo_tokens%ROWTYPE;
BEGIN
  UPDATE public.promo_tokens
    SET uses_count = uses_count + 1,
        first_used_at = COALESCE(first_used_at, now())
    WHERE token_code = upper(trim(_code))
      AND active = true
      AND uses_count < max_uses
    RETURNING * INTO updated;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::text, NULL::integer;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, updated.type, COALESCE(updated.discount_percent, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.consume_promo_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_promo_token(text) TO anon, authenticated, service_role;
