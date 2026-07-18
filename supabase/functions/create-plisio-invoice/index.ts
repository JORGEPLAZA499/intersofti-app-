import { createClient } from "npm:@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { resolveEsimPrice } from "../_shared/price-lookup.ts";
import { signIdentifier } from "../_shared/lookup-token.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const PLISIO_BASE_URL = "https://plisio.net/api/v1";
const PREFERRED_PSYS_CIDS = [
  "BTC",
  "SOL",
  "ETH",
  "ETH_BASE",
  "LTC",
  "USDT_TRX",
  "USDT",
  "USDT_BSC",
  "USDT_TON",
  "USDC",
  "USDC_BASE",
  "BNB",
  "TRX",
  "TON",
] as const;
const FALLBACK_PSYS_CIDS = ["BTC", "SOL"] as const;

type PlisioCurrency = {
  cid: string;
  hidden?: number | string;
  maintenance?: boolean;
  min_sum_in?: string;
  fiat_rate?: string;
};

type PlisioCurrenciesResponse = {
  status: string;
  data?: PlisioCurrency[];
};

function getEligiblePsysCids(currencies: PlisioCurrency[], sourceAmount: number) {
  return currencies
    .filter((currency) => {
      if (!PREFERRED_PSYS_CIDS.includes(currency.cid as (typeof PREFERRED_PSYS_CIDS)[number])) {
        return false;
      }

      if (Number(currency.hidden ?? 0) !== 0 || currency.maintenance) {
        return false;
      }

      const fiatRate = Number(currency.fiat_rate ?? 0);
      const minSumIn = Number(currency.min_sum_in ?? 0);

      if (!Number.isFinite(fiatRate) || fiatRate <= 0) {
        return false;
      }

      if (!Number.isFinite(minSumIn) || minSumIn <= 0) {
        return true;
      }

      return sourceAmount * fiatRate >= minSumIn;
    })
    .map((currency) => currency.cid);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { packageCode, customerEmail, userId, topup, iccid, quantity: rawQuantity, language, promoTokenCode } = await req.json();
    const quantity = Math.max(1, Math.min(10, Math.floor(Number(rawQuantity) || 1)));

    if (!packageCode) {
      return new Response(JSON.stringify({ error: "Missing packageCode" }), { status: 400, headers: corsHeaders });
    }
    const hasEmail = typeof customerEmail === 'string' && customerEmail.trim().length > 0;
    const effectiveEmail = hasEmail ? customerEmail.trim() : null;

    // Server-side authoritative price lookup — never trust client amount
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

    const sourceAmount = priced.totalEur;
    const packageName = priced.packageName;
    if (sourceAmount <= 0) {
      return new Response(JSON.stringify({ error: "Invalid amount" }), { status: 400, headers: corsHeaders });
    }

    const apiKey = Deno.env.get("PLISIO_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Plisio not configured" }), { status: 500, headers: corsHeaders });
    }

    const currenciesParams = new URLSearchParams({ api_key: apiKey });
    const currenciesResponse = await fetch(`${PLISIO_BASE_URL}/currencies/eur?${currenciesParams.toString()}`);
    const currenciesData = await currenciesResponse.json() as PlisioCurrenciesResponse;

    const allowedPsysCids = getEligiblePsysCids(currenciesData.data ?? [], sourceAmount);
    const effectiveAllowedPsysCids = allowedPsysCids.length > 0
      ? allowedPsysCids
      : [...FALLBACK_PSYS_CIDS];

    console.log("Plisio eligible currencies:", effectiveAllowedPsysCids.join(","));

    const masterTransactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const unitPrice = priced.unitPriceEur;

    // Create N orders for N eSIMs
    const orderIds: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const transactionId = quantity === 1 ? masterTransactionId : `${masterTransactionId}_${i}`;
      const { data: orderData, error: orderError } = await supabase
        .from("esim_orders")
        .insert({
          user_id: userId || null,
          customer_email: effectiveEmail,
          package_code: packageCode,
          package_name: packageName || packageCode,
          price: unitPrice,
          status: "pending_crypto",
          transaction_id: transactionId,
        })
        .select()
        .single();

      if (orderError) {
        console.error(`Failed to create order ${i + 1}/${quantity}:`, orderError);
        continue;
      }
      orderIds.push(orderData.id);
    }

    if (orderIds.length === 0) {
      return new Response(JSON.stringify({ error: "Failed to create orders" }), { status: 500, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const callbackUrl = `${supabaseUrl}/functions/v1/plisio-webhook?json=true`;

    const origin = req.headers.get("origin") || "https://intersofti.lovable.app";
    const lookupToken = await signIdentifier(masterTransactionId);
    const successUrl = `${origin}/checkout/return?transaction_id=${masterTransactionId}&method=crypto&t=${lookupToken}`;

    const params = new URLSearchParams({
      source_currency: "EUR",
      source_amount: sourceAmount.toString(),
      allowed_psys_cids: effectiveAllowedPsysCids.join(","),
      order_name: `${packageName || packageCode}${quantity > 1 ? ` x${quantity}` : ''}`,
      order_number: masterTransactionId,
      ...(hasEmail && { email: customerEmail.trim() }),
      callback_url: callbackUrl,
      success_invoice_url: successUrl,
      language: 'en_US',
      api_key: apiKey,
    });

    const plisioResponse = await fetch(`${PLISIO_BASE_URL}/invoices/new?${params.toString()}`);
    const plisioData = await plisioResponse.json();

    console.log("Plisio response:", JSON.stringify(plisioData));

    if (plisioData.status === "success" && plisioData.data?.invoice_url) {
      return new Response(JSON.stringify({
        invoiceUrl: plisioData.data.invoice_url,
        orderId: orderIds[0],
        transactionId: masterTransactionId,
        lookupToken,
      }), { headers: corsHeaders });
    }

    console.error("Plisio error:", plisioData);
    for (const oid of orderIds) {
      await supabase.from("esim_orders").update({ status: "failed" }).eq("id", oid);
    }
    return new Response(JSON.stringify({ error: plisioData.data?.message || "Failed to create invoice" }), { status: 500, headers: corsHeaders });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});