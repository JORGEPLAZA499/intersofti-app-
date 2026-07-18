CREATE TABLE public.system_health_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service text NOT NULL,
  status text NOT NULL,
  latency_ms integer NOT NULL DEFAULT 0,
  error_message text,
  detail text,
  checked_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_system_health_log_service_checked_at
  ON public.system_health_log (service, checked_at DESC);

ALTER TABLE public.system_health_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view system health log"
ON public.system_health_log
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage system health log"
ON public.system_health_log
FOR ALL
TO public
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');