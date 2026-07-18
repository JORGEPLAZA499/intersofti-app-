CREATE POLICY "Admins can read invoices in assets"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'assets'
  AND (storage.foldername(name))[1] = 'invoices'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Deny public reads of invoices"
ON storage.objects
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (
  NOT (bucket_id = 'assets' AND (storage.foldername(name))[1] = 'invoices')
  OR public.has_role(auth.uid(), 'admin')
);
