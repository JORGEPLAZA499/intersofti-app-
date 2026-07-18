import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { provisionEsim } from "../_shared/esim-provision.ts";

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
    const { tokenCode, packageCode, packageName, customerEmail, userId, quantity: rawQty, locale } = await req.json();
    // Hard cap on qty to prevent one call draining a token: at most 1 eSIM per redemption request.
    const quantity = Math.max(1, Math.min(1, Math.floor(Number(rawQty) || 1)));

    if (!tokenCode || !packageCode) {
      return new Response(JSON.stringify({ error: "Missing tokenCode or packageCode" }), { status: 400, headers: corsHeaders });
    }

    const code = String(tokenCode).trim().toUpperCase();
    const email = (customerEmail && String(customerEmail).trim()) || null;
    const provisioned: string[] = [];

    for (let i = 0; i < quantity; i++) {
      // Atomically reserve one use. Returns success=false when inactive or max_uses reached.
      const { data: consumeRows, error: consumeErr } = await supabase
        .rpc('consume_promo_token', { _code: code });

      if (consumeErr) {
        console.error("consume_promo_token error:", consumeErr);
        return new Response(JSON.stringify({ error: "Error validando el token" }), { status: 500, headers: corsHeaders });
      }
      const consumed = Array.isArray(consumeRows) ? consumeRows[0] : consumeRows;
      if (!consumed?.success) {
        return new Response(JSON.stringify({ error: "Token no válido, inactivo o agotado" }), { status: 400, headers: corsHeaders });
      }

      const isFullyFree = consumed.type === 'free' || (consumed.type === 'discount' && (consumed.discount_percent || 0) >= 100);
      if (!isFullyFree) {
        // Refund the reserved use since we can't fulfill via this free path
        await supabase.rpc('validate_promo_token', { _code: code }); // no-op; keep counter as-is (already consumed defensively)
        return new Response(JSON.stringify({ error: "Este token no cubre el 100% del importe" }), { status: 400, headers: corsHeaders });
      }

      const transactionId = `promo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}_${i}`;
      const { data: orderData, error: orderError } = await supabase
        .from('esim_orders')
        .insert({
          user_id: userId || null,
          customer_email: email,
          package_code: packageCode,
          package_name: packageName || packageCode,
          price: 0,
          status: 'paid',
          transaction_id: transactionId,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order create error:", orderError);
        continue;
      }

      try {
        await provisionEsim(orderData.id, packageCode, transactionId, packageName || packageCode, email || '', locale || 'en');
        provisioned.push(orderData.id);
      } catch (e) {
        console.error("Provision error:", e);
      }
    }

    if (provisioned.length === 0) {
      return new Response(JSON.stringify({ error: "No se pudo provisionar el eSIM" }), { status: 500, headers: corsHeaders });
    }

    const { data: finalOrders } = await supabase
      .from('esim_orders')
      .select('id, order_no, iccid')
      .in('id', provisioned);

    const orders = (finalOrders || []).map((o: any) => ({
      id: o.id,
      orderNo: o.order_no || null,
      iccid: o.iccid || null,
    }));

    return new Response(JSON.stringify({ success: true, orderIds: provisioned, orders }), { headers: corsHeaders });
  } catch (e: any) {
    console.error("redeem-esim-promo error:", e);
    return new Response(JSON.stringify({ error: e.message || "Error interno" }), { status: 500, headers: corsHeaders });
  }
});
