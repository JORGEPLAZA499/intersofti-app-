import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";
import { provisionEsim } from "../_shared/esim-provision.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const env = (url.searchParams.get('env') || 'sandbox') as StripeEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Received event:", event.type, "env:", env);

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const { packageCode, packageName, userId, customerEmail, ghostcodeOrderNumber, locale } = session.metadata || {};

  if (!packageCode) {
    console.error("Missing packageCode in session metadata");
    return;
  }

  // customerEmail is now optional (customer may opt out of providing email)
  const effectiveEmail = (customerEmail && customerEmail.trim().length > 0) ? customerEmail.trim() : null;

  // --- GhostCode S10 order ---
  if (ghostcodeOrderNumber) {
    console.log("GhostCode order detected:", ghostcodeOrderNumber);

    // Update order status to paid
    const { data: orderData, error } = await supabase
      .from("ghostcode_orders")
      .update({
        payment_status: "paid",
        stripe_session_id: session.id,
        payment_reference: session.payment_intent || session.id,
      })
      .eq("order_number", ghostcodeOrderNumber)
      .select()
      .single();

    if (error) {
      console.error("Failed to update ghostcode order:", error);
      return;
    }

    console.log("GhostCode order updated to paid:", ghostcodeOrderNumber);

    // Send confirmation email
    try {
      const address = [
        orderData.address_line1,
        orderData.address_line2,
        `${orderData.postal_code} ${orderData.city}${orderData.state_province ? `, ${orderData.state_province}` : ''}`,
        orderData.country_name,
      ].filter(Boolean).join('\n');

      const siteUrl = Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '').replace('https://spudbndneoaltpseizye', 'https://intersofti.lovable.app') || 'https://intersofti.lovable.app';

      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'ghostcode-order-confirmation',
          recipientEmail: orderData.customer_email,
          idempotencyKey: `gc-order-confirm-${orderData.id}`,
          templateData: {
            lang: locale || 'en',
            orderNumber: ghostcodeOrderNumber,
            customerName: orderData.customer_name,
            productName: 'GhostCode S10',
            totalPrice: `€${Number(orderData.total_price).toFixed(2)}`,
            address,
            trackingUrl: `https://intersofti.lovable.app/order-tracking?order=${ghostcodeOrderNumber}`,
          },
        },
      });
      console.log("Confirmation email sent for order:", ghostcodeOrderNumber);
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
      // Don't fail the webhook for email errors
    }

    return;
  }

  // --- eSIM order (supports quantity) ---
  const quantity = Math.max(1, Math.min(10, parseInt(session.metadata?.quantity || '1', 10) || 1));
  const totalAmountPaid = (session.amount_total || 0) / 100;
  const unitPrice = totalAmountPaid / quantity;

  console.log(`Processing ${quantity} eSIM(s) for package ${packageCode}`);

  for (let i = 0; i < quantity; i++) {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}_${i}`;

    const { data: orderData, error: orderError } = await supabase
      .from("esim_orders")
      .insert({
        user_id: userId || null,
        customer_email: effectiveEmail,
        package_code: packageCode,
        package_name: packageName || packageCode,
        price: unitPrice,
        status: "paid",
        transaction_id: transactionId,
        stripe_session_id: session.id,
      })
      .select()
      .single();

    if (orderError) {
      console.error(`Failed to create order ${i + 1}/${quantity}:`, orderError);
      continue;
    }

    console.log(`Order ${i + 1}/${quantity} created:`, orderData.id);

    try {
      await provisionEsim(orderData.id, packageCode, transactionId, packageName || packageCode, effectiveEmail || '', locale || 'en');
    } catch (provisionError) {
      console.error(`Failed to provision eSIM ${i + 1}/${quantity}:`, provisionError);
    }
  }
}
