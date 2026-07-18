import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { verifyIdentifier } from "../_shared/lookup-token.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function pickBestOrder(rows: any[]): any | null {
  if (!rows || rows.length === 0) return null;
  const priority: Record<string, number> = {
    active: 0,
    provisioned: 1,
    paid: 2,
    pending_crypto: 3,
    pending: 4,
    failed: 5,
    provision_failed: 5,
  };
  const sorted = [...rows].sort((a, b) => {
    const pa = priority[a.status] ?? 9;
    const pb = priority[b.status] ?? 9;
    if (pa !== pb) return pa - pb;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  return sorted[0];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id, transaction_id, token } = await req.json();

    if ((!session_id && !transaction_id) || (session_id && typeof session_id !== "string") || (transaction_id && typeof transaction_id !== "string")) {
      return new Response(JSON.stringify({ error: "Missing session_id or transaction_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ownership proof: caller must present the HMAC token issued when the
    // checkout/invoice was created. This prevents anyone with just a session
    // or transaction id from retrieving activation credentials.
    const identifier = (transaction_id || session_id) as string;
    const ok = await verifyIdentifier(identifier, token);
    if (!ok) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let query = supabase
      .from("esim_orders")
      .select("package_name, iccid, qr_code_url, activation_code, status, customer_email, created_at");

    if (transaction_id) {
      query = query.or(`transaction_id.eq.${transaction_id},transaction_id.like.${transaction_id}_%`);
    } else {
      query = query.eq("stripe_session_id", session_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Query error:", error);
      return new Response(JSON.stringify({ error: "Query failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const best = pickBestOrder(data || []);

    if (!best) {
      return new Response(JSON.stringify({ order: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { created_at, ...order } = best;

    return new Response(JSON.stringify({ order }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
