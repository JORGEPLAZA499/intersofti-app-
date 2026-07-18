
DROP POLICY IF EXISTS "Anyone can view ghostcode order by order_number" ON public.ghostcode_orders;

CREATE OR REPLACE FUNCTION public.lookup_ghostcode_order(_order_number text)
RETURNS TABLE(
  order_number text,
  customer_name text,
  customer_email text,
  address_line1 text,
  address_line2 text,
  city text,
  state_province text,
  postal_code text,
  country_name text,
  payment_status text,
  product text,
  total_price numeric,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    o.order_number,
    o.customer_name,
    o.customer_email,
    o.address_line1,
    o.address_line2,
    o.city,
    o.state_province,
    o.postal_code,
    o.country_name,
    o.payment_status,
    o.product,
    o.total_price,
    o.created_at
  FROM public.ghostcode_orders o
  WHERE o.order_number = upper(trim(_order_number))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.lookup_ghostcode_order(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lookup_ghostcode_order(text) TO anon, authenticated, service_role;
