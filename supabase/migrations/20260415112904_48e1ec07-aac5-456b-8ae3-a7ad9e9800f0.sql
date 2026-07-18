CREATE POLICY "Anyone can view ghostcode order by order_number"
ON public.ghostcode_orders
FOR SELECT
TO public
USING (true);