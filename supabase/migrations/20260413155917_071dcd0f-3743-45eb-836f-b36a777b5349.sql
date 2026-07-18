
-- Add customer_email column to esim_orders
ALTER TABLE public.esim_orders ADD COLUMN customer_email text;

-- Make user_id nullable for guest checkout
ALTER TABLE public.esim_orders ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS: allow service role inserts (webhook creates orders for guests)
CREATE POLICY "Service role can manage orders"
ON public.esim_orders FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
