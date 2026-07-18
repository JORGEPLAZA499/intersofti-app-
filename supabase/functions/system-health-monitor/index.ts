// Public cron-callable function that triggers system-health-check with service-role auth.
// Must stay public (verify_jwt = false) so pg_cron can call it via net.http_post.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const r = await fetch(`${supabaseUrl}/functions/v1/system-health-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // service-role as bearer to pass verify_jwt if ever enabled
        Authorization: `Bearer ${serviceKey}`,
        // internal trigger header — health-check skips admin check when this matches service key
        "x-internal-trigger": serviceKey,
      },
      body: JSON.stringify({ source: "cron" }),
    });

    const bodyText = await r.text();
    console.log(
      `[monitor] health-check returned ${r.status}: ${bodyText.slice(0, 500)}`
    );

    return new Response(
      JSON.stringify({ ok: r.ok, status: r.status }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e: any) {
    console.error("[monitor] error:", e);
    return new Response(
      JSON.stringify({ ok: false, error: String(e?.message ?? e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
