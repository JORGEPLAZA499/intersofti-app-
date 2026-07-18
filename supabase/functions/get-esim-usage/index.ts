import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ESIM_API_BASE = "https://api.esimaccess.com";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { iccid } = await req.json();

    if (!iccid || typeof iccid !== "string") {
      return new Response(JSON.stringify({ error: "MISSING_ICCID", usage: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: order, error: dbError } = await supabase
      .from("esim_orders")
      .select("id, order_no, package_name, status, price, customer_email")
      .eq("iccid", iccid)
      .maybeSingle();

    if (dbError) {
      console.error("DB query error:", dbError);
      return new Response(JSON.stringify({ error: "Query failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!order) {
      return new Response(JSON.stringify({ error: "ORDER_NOT_FOUND", usage: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessCode = Deno.env.get("ESIM_ACCESS_CODE");
    if (!accessCode) {
      return new Response(JSON.stringify({ error: "ESIM_ACCESS_CODE not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const queryBody = order.order_no
      ? { orderNo: order.order_no, pager: { pageNum: 1, pageSize: 20 } }
      : { iccid, pager: { pageNum: 1, pageSize: 1 } };

    console.log("Querying eSIM API with:", JSON.stringify(queryBody));

    const response = await fetch(`${ESIM_API_BASE}/api/v1/open/esim/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-AccessCode": accessCode,
      },
      body: JSON.stringify(queryBody),
    });

    const apiData = await response.json();
    console.log("eSIM API response:", JSON.stringify(apiData));

    if (!apiData?.obj?.esimList?.length) {
      return new Response(JSON.stringify({ error: "No usage data available", usage: null }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const esim = apiData.obj.esimList.find((e: any) => e.iccid === iccid) || apiData.obj.esimList[0];
    const pkg = esim.packageList?.[0];

    const totalVolume = esim.totalVolume || 0;
    const orderUsage = esim.orderUsage || 0;
    const remaining = totalVolume - orderUsage;
    const usagePercent = totalVolume > 0 ? Math.round((orderUsage / totalVolume) * 100) : 0;

    // Calculate remaining time as raw numbers
    let remainingDays = 0;
    let remainingHours = 0;
    let isExpired = false;
    if (esim.expiredTime) {
      const now = new Date();
      const exp = new Date(esim.expiredTime);
      const diffMs = exp.getTime() - now.getTime();
      if (diffMs > 0) {
        remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        remainingHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      } else {
        isExpired = true;
      }
    }

    // Calculate time remaining percentage
    let timePercent = 0;
    if (esim.activateTime && esim.expiredTime) {
      const start = new Date(esim.activateTime).getTime();
      const end = new Date(esim.expiredTime).getTime();
      const now = Date.now();
      const total = end - start;
      const elapsed = now - start;
      timePercent = total > 0 ? Math.max(0, Math.min(100, Math.round(((total - elapsed) / total) * 100))) : 0;
    }

    const usage = {
      // Data usage
      totalVolume,
      orderUsage,
      remaining,
      usagePercent,
      totalVolumeMB: Math.round(totalVolume / (1024 * 1024)),
      orderUsageMB: Math.round(orderUsage / (1024 * 1024)),
      remainingMB: Math.round(remaining / (1024 * 1024)),
      remainingBytes: remaining,
      // Status
      esimStatus: esim.esimStatus || "UNKNOWN",
      // Time
      totalDuration: esim.totalDuration || 0,
      durationUnit: esim.durationUnit || "DAY",
      activateTime: esim.activateTime || null,
      expiredTime: esim.expiredTime || null,
      installationTime: esim.installationTime || null,
      remainingDays,
      remainingHours,
      isExpired,
      timePercent,
      // Package details
      packageName: order.package_name || pkg?.packageName || "Unknown",
      packageCode: pkg?.packageCode || "",
      slug: pkg?.slug || "",
      createTime: pkg?.createTime || null,
      esimTranNo: esim.esimTranNo || "",
      orderNo: esim.orderNo || order.order_no || "",
      // Connection details
      apn: esim.apn || "",
      ipExport: esim.ipExport || "",
      locationCode: pkg?.locationCode || "",
      // Price
      price: order.price || 0,
      // ICCID
      iccid: esim.iccid || iccid,
      // Customer email from original purchase (for recharge notifications)
      customerEmail: order.customer_email || null,
    };

    return new Response(JSON.stringify({ usage }), {
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
