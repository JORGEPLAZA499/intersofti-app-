import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode } from "https://deno.land/std@0.168.0/encoding/hex.ts";
import { provisionEsim } from "../_shared/esim-provision.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function verifyPlisioHash(data: Record<string, unknown>, receivedHash: string): Promise<boolean> {
  const secret = Deno.env.get("PLISIO_API_KEY");
  if (!secret) return false;

  // Build object without verify_hash, preserving original key order
  const ordered: Record<string, unknown> = { ...data };
  delete ordered.verify_hash;
  const payload = JSON.stringify(ordered);

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const expected = new TextDecoder().decode(encode(new Uint8Array(signed)));
  return expected === receivedHash;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.text();
    const contentType = req.headers.get("content-type") || "";
    console.log("Plisio webhook content-type:", contentType);
    console.log("Plisio webhook raw body (first 500):", body.substring(0, 500));

    let data: Record<string, unknown>;

    try {
      data = JSON.parse(body);
      // Plisio may wrap in { data: {...} }
      if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
        data = data.data as Record<string, unknown>;
      }
    } catch {
      console.error("Failed to parse body as JSON, body:", body.substring(0, 200));
      return new Response("Bad request", { status: 400 });
    }

    console.log("Plisio webhook parsed data:", JSON.stringify(data));

    // Verify hash — required. Missing signature is treated as an auth failure.
    const receivedHash = data.verify_hash;
    if (typeof receivedHash !== "string" || receivedHash.length === 0) {
      console.error("Rejected Plisio webhook: missing verify_hash");
      return new Response("Missing signature", { status: 403 });
    }
    const isValid = await verifyPlisioHash(data, receivedHash);
    if (!isValid) {
      const ordered: Record<string, unknown> = { ...data };
      delete ordered.verify_hash;
      console.error("Invalid verify_hash. Received:", receivedHash, "Payload for hash:", JSON.stringify(ordered).substring(0, 300));
      return new Response("Invalid signature", { status: 403 });
    }
    console.log("Hash verification passed");

    const orderNumber = String(data.order_number || "");
    const status = String(data.status || "");

    console.log("Order number:", orderNumber, "Status:", status);

    if (!orderNumber) {
      console.error("Missing order_number in parsed data");
      return new Response("OK", { status: 200 });
    }

    // Find orders by transaction_id (supports multiple orders for quantity > 1)
    const { data: orders, error: orderError } = await supabase
      .from("esim_orders")
      .select("*")
      .or(`transaction_id.eq.${orderNumber},transaction_id.like.${orderNumber}_%`);

    if (orderError || !orders || orders.length === 0) {
      console.error("Orders not found:", orderNumber, orderError);
      return new Response("OK", { status: 200 });
    }

    // Filter out already processed orders (paid = being provisioned, active/provisioned = done)
    const pendingOrders = orders.filter(o => 
      o.status !== "active" && o.status !== "provisioned" && o.status !== "paid"
    );
    if (pendingOrders.length === 0) {
      console.log("All orders already processed for:", orderNumber);
      return new Response("OK", { status: 200 });
    }

    if (status === "completed" || status === "mismatch") {
      console.log(`Payment completed for ${pendingOrders.length} order(s):`, orderNumber);

      for (const order of pendingOrders) {
        await supabase.from("esim_orders").update({ status: "paid" }).eq("id", order.id);

        try {
          await provisionEsim(
            order.id,
            order.package_code,
            order.transaction_id,
            order.package_name || order.package_code,
            order.customer_email || '',
            'en'
          );
        } catch (provisionError) {
          console.error(`Failed to provision eSIM for order ${order.id}:`, provisionError);
        }
      }
    } else if (status === "expired" || status === "cancelled" || status === "error") {
      console.log("Payment failed/expired for orders:", orderNumber, "status:", status);
      for (const order of pendingOrders) {
        await supabase.from("esim_orders").update({ status: "failed" }).eq("id", order.id);
      }
    } else {
      console.log("Intermediate status for orders:", orderNumber, "status:", status);
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("Plisio webhook error:", e);
    return new Response("Error", { status: 500 });
  }
});
