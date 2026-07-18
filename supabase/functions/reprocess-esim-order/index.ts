import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { finalizeEsimOrder } from "../_shared/esim-provision.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Admin-only: validate caller is authenticated admin OR internal service call
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.replace("Bearer ", "");

    // Internal service-role calls must present the actual service-role key
    // (compared server-side to the secret env var — no client-side trust).
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const isServiceRole = !!jwt && !!serviceRoleKey && jwt === serviceRoleKey;

    if (!isServiceRole) {
      if (!jwt) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
      // Verifies the JWT signature server-side
      const { data: userData, error: userErr } = await supabase.auth.getUser(jwt);
      if (userErr || !userData?.user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
      }
      const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
      if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
    }

    const { orderId, lang } = await req.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId is required" }), { status: 400, headers: corsHeaders });
    }

    const { data: order, error: orderErr } = await supabase
      .from("esim_orders")
      .select("id, order_no, customer_email, package_name, package_code")
      .eq("id", orderId)
      .maybeSingle();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404, headers: corsHeaders });
    }
    if (!order.order_no) {
      return new Response(JSON.stringify({ error: "Order has no order_no; cannot reprocess" }), { status: 400, headers: corsHeaders });
    }

    const ok = await finalizeEsimOrder(
      order.id,
      order.order_no,
      order.customer_email || "",
      order.package_name || order.package_code,
      order.package_code,
      lang || 'en'
    );

    return new Response(JSON.stringify({ success: ok }), { status: ok ? 200 : 500, headers: corsHeaders });
  } catch (e: any) {
    console.error("reprocess-esim-order error:", e);
    return new Response(JSON.stringify({ error: e.message || "Error" }), { status: 500, headers: corsHeaders });
  }
});
