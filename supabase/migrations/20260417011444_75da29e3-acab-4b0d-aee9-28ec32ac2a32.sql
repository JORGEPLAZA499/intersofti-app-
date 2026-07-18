-- Allow admins to upload invoice PDFs to the public 'assets' bucket under invoices/
CREATE POLICY "Admins can upload invoices to assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'assets'
  AND (storage.foldername(name))[1] = 'invoices'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update invoices in assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'assets'
  AND (storage.foldername(name))[1] = 'invoices'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);