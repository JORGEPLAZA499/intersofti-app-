ALTER TABLE public.esim_orders ADD COLUMN stripe_session_id text;
CREATE INDEX idx_esim_orders_stripe_session ON public.esim_orders(stripe_session_id);