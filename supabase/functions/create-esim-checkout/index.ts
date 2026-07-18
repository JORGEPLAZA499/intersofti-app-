import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";
import { resolveEsimPrice } from "../_shared/price-lookup.ts";
import { signIdentifier } from "../_shared/lookup-token.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      packageCode,
      customerEmail,
      userId,
      returnUrl,
      environment,
      topup,
      iccid,
      ghostcodeOrderNumber,
      locale,
      quantity: rawQuantity,
      promoTokenCode,
    } = await req.json();
    const quantity = Math.max(1, Math.min(10, Math.floor(Number(rawQuantity) || 1)));

    if (!packageCode || typeof packageCode !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid packageCode" }), { status: 400, headers: corsHeaders });
    }
    if (typeof customerEmail !== 'string') {
      return new Response(JSON.stringify({ error: "customerEmail must be a string" }), { status: 400, headers: corsHeaders });
    }
    const hasEmail = customerEmail.trim().length > 0;

    // Server-side authoritative price lookup — never trust the client amount
    let priced;
    try {
      priced = await resolveEsimPrice({
        packageCode,
        quantity,
        topup: !!topup,
        iccid: iccid || undefined,
        promoTokenCode: promoTokenCode || null,
      });
    } catch (e: any) {
      console.error("Price lookup failed:", e);
      return new Response(JSON.stringify({ error: e.message || "Price lookup failed" }), { status: 400, headers: corsHeaders });
    }

    if (priced.unitPriceCents < 50) {
      return new Response(JSON.stringify({ error: "Amount must be at least 50 cents" }), { status: 400, headers: corsHeaders });
    }

    const env = (environment || 'sandbox') as StripeEnv;
    const stripe = createStripeClient(env);

    const session = await stripe.checkout.sessions.create({
      ...(locale && { locale }),
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: priced.packageName,
              description: `eSIM data plan - ${packageCode}`,
            },
            unit_amount: priced.unitPriceCents,
          },
          quantity,
        },
      ],
      mode: "payment",
      ui_mode: "embedded",
      return_url: returnUrl || `${req.headers.get("origin")}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      ...(hasEmail && { customer_email: customerEmail }),
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },
      metadata: {
        packageCode,
        packageName: priced.packageName,
        customerEmail: hasEmail ? customerEmail : '',
        quantity: String(quantity),
        ...(locale && { locale }),
        ...(userId && { userId }),
        ...(topup && { topup: 'true', iccid: iccid || '' }),
        ...(ghostcodeOrderNumber && { ghostcodeOrderNumber }),
      },
    });

    const lookupToken = await signIdentifier(session.id);
    return new Response(JSON.stringify({ clientSecret: session.client_secret, sessionId: session.id, lookupToken }), { headers: corsHeaders });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
