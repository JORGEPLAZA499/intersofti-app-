CREATE POLICY "Admins can view all orders"
ON public.esim_orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));