import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ESIM_API_BASE = "https://api.esimaccess.com";
const PRIVILEGED = new Set(['order', 'get_balance', 'query_order']);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const accessCode = Deno.env.get("ESIM_ACCESS_CODE");
    if (!accessCode) {
      return json({ error: "ESIM_ACCESS_CODE not configured" }, 500);
    }

    const { action, ...params } = await req.json();

    // Auth gate for privileged actions
    if (PRIVILEGED.has(action)) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return json({ error: "Unauthorized" }, 401);
      }
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const token = authHeader.replace("Bearer ", "");
      const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
      if (claimsError || !claimsData?.claims?.sub) {
        return json({ error: "Unauthorized" }, 401);
      }
      const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
        _user_id: claimsData.claims.sub,
        _role: "admin",
      });
      if (roleError || !isAdmin) {
        return json({ error: "Forbidden" }, 403);
      }
    }

    let endpoint: string;
    let body: Record<string, unknown>;

    switch (action) {
      case "list_packages":
        endpoint = "/api/v1/open/package/list";
        body = {
          ...(params.locationCode ? { locationCode: params.locationCode } : {}),
          ...(params.type ? { type: params.type } : {}),
        };
        break;

      case "list_topup_packages":
        endpoint = "/api/v1/open/package/list";
        body = {
          type: "TOPUP",
          iccid: params.iccid,
          ...(params.locationCode ? { locationCode: params.locationCode } : {}),
        };
        break;

      case "order":
        endpoint = "/api/v1/open/esim/order";
        body = {
          transactionId: params.transactionId,
          packageInfoList: params.packageInfoList,
        };
        break;

      case "get_balance":
        endpoint = "/api/v1/open/balance/query";
        body = {};
        break;

      case "query_order":
        endpoint = "/api/v1/open/esim/query";
        body = {
          orderNo: params.orderNo,
          iccid: params.iccid,
          pager: params.pager || { pageNum: 1, pageSize: 20 },
        };
        break;

      default:
        return json({ error: "Invalid action" }, 400);
    }

    const response = await fetch(`${ESIM_API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-AccessCode": accessCode,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error("eSIM API error:", error);
    return json({ error: (error as Error).message }, 500);
  }
});
