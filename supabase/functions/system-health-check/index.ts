import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-internal-trigger",
};

const SERVICE_LABELS: Record<string, string> = {
  database: "Base de datos",
  storage: "Almacenamiento",
  auth: "Autenticación",
  esim_access: "eSIM Access",
  stripe_sandbox: "Stripe (Sandbox)",
  stripe_live: "Stripe (Live)",
  plisio: "Plisio",
  emails: "Emails (Lovable)",
  edge_functions: "Órdenes / Webhooks",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendTelegramAlert(text: string): Promise<void> {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) {
    console.log("[telegram] secrets not configured, skipping alert");
    return;
  }
  try {
    const brandedText =
      `<b>🛡️ INTERSOFTI</b> · <i>Monitor de Sistema</i>\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      text;
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: brandedText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!r.ok) {
      const body = await r.text().catch(() => "");
      console.error(`[telegram] sendMessage failed ${r.status}: ${body}`);
    }
  } catch (e) {
    console.error("[telegram] error sending alert:", e);
  }
}

type CheckStatus = "ok" | "slow" | "error" | "timeout";

interface HealthResult {
  service: string;
  status: CheckStatus;
  latency: number;
  error?: string;
  detail?: string;
}

const TIMEOUT_MS = 8000;
const SLOW_MS = 2000;

function classify(latency: number, ok: boolean): CheckStatus {
  if (!ok) return "error";
  return latency >= SLOW_MS ? "slow" : "ok";
}

async function timed(
  service: string,
  fn: (signal: AbortSignal) => Promise<{ ok: boolean; detail?: string; error?: string }>
): Promise<HealthResult> {
  const start = Date.now();
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fn(controller.signal);
    const latency = Date.now() - start;
    return {
      service,
      status: classify(latency, res.ok),
      latency,
      error: res.error,
      detail: res.detail,
    };
  } catch (e: any) {
    const latency = Date.now() - start;
    const isTimeout = e?.name === "AbortError";
    return {
      service,
      status: isTimeout ? "timeout" : "error",
      latency,
      error: isTimeout ? `Timeout >${TIMEOUT_MS}ms` : String(e?.message ?? e),
    };
  } finally {
    clearTimeout(t);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Internal trigger (cron/monitor) bypasses admin check by presenting service-role key
    const internalHeader = req.headers.get("x-internal-trigger");
    const isInternal = !!internalHeader && internalHeader === serviceKey;

    if (!isInternal) {
      const authHeader = req.headers.get("Authorization") ?? "";
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: userData } = await userClient.auth.getUser();
      const user = userData?.user;
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: roleRow } = await admin
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleRow) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const checks: Promise<HealthResult>[] = [];

    // --- Internal: database ---
    checks.push(
      timed("database", async () => {
        const { error } = await admin
          .from("esim_settings")
          .select("key")
          .limit(1);
        return error
          ? { ok: false, error: error.message }
          : { ok: true, detail: "Conexión OK" };
      })
    );

    // --- Internal: storage ---
    checks.push(
      timed("storage", async () => {
        const { data, error } = await admin.storage.listBuckets();
        return error
          ? { ok: false, error: error.message }
          : { ok: true, detail: `${data?.length ?? 0} buckets` };
      })
    );

    // --- Internal: auth ---
    checks.push(
      timed("auth", async () => {
        const { data, error } = await admin.auth.admin.listUsers({
          page: 1,
          perPage: 1,
        });
        return error
          ? { ok: false, error: error.message }
          : { ok: true, detail: `Usuarios accesibles` };
      })
    );

    // --- External: eSIM Access ---
    checks.push(
      timed("esim_access", async (signal) => {
        const code = Deno.env.get("ESIM_ACCESS_CODE");
        if (!code) return { ok: false, error: "ESIM_ACCESS_CODE no configurado" };
        const r = await fetch(
          "https://api.esimaccess.com/api/v1/open/package/list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "RT-AccessCode": code,
            },
            body: JSON.stringify({}),
            signal,
          }
        );
        if (!r.ok) return { ok: false, error: `HTTP ${r.status}` };
        const json = await r.json().catch(() => null);
        if (json && json.success === false) {
          return { ok: false, error: json.errorMsg ?? "Respuesta inválida" };
        }
        return { ok: true, detail: "API responde" };
      })
    );

    // --- External: Stripe Sandbox ---
    if (Deno.env.get("STRIPE_SANDBOX_API_KEY")) {
      checks.push(
        timed("stripe_sandbox", async () => {
          try {
            const stripe = createStripeClient("sandbox");
            const balance = await stripe.balance.retrieve();
            return { ok: true, detail: `Sandbox OK (livemode=${balance.livemode})` };
          } catch (e: any) {
            return { ok: false, error: String(e?.message ?? e) };
          }
        })
      );
    }

    // --- External: Stripe Live ---
    if (Deno.env.get("STRIPE_LIVE_API_KEY")) {
      checks.push(
        timed("stripe_live", async () => {
          try {
            const stripe = createStripeClient("live");
            const balance = await stripe.balance.retrieve();
            return { ok: true, detail: `Live OK (livemode=${balance.livemode})` };
          } catch (e: any) {
            return { ok: false, error: String(e?.message ?? e) };
          }
        })
      );
    }

    // --- External: Plisio ---
    checks.push(
      timed("plisio", async (signal) => {
        const key = Deno.env.get("PLISIO_API_KEY");
        if (!key) return { ok: false, error: "PLISIO_API_KEY no configurado" };
        const r = await fetch(
          `https://api.plisio.net/api/v1/operations?api_key=${encodeURIComponent(key)}&limit=1`,
          { signal }
        );
        if (!r.ok) return { ok: false, error: `HTTP ${r.status}` };
        const json = await r.json().catch(() => null);
        if (json && json.status === "error") {
          return { ok: false, error: json?.data?.message ?? "Error Plisio" };
        }
        return { ok: true, detail: "API responde" };
      })
    );

    // --- Internal: Lovable Emails (cron + cola pgmq) ---
    checks.push(
      timed("emails", async () => {
        const { error: stateErr } = await admin
          .from("email_send_state")
          .select("id")
          .limit(1);
        if (stateErr) return { ok: false, error: stateErr.message };

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count: failed, error: logErr } = await admin
          .from("email_send_log")
          .select("id", { count: "exact", head: true })
          .in("status", ["dlq", "failed", "bounced"])
          .gte("created_at", since);
        if (logErr) return { ok: false, error: logErr.message };

        return {
          ok: true,
          detail: `${failed ?? 0} fallos últimas 24h`,
        };
      })
    );

    // --- Internal: Órdenes (proxy de salud de webhooks/edge functions) ---
    checks.push(
      timed("edge_functions", async () => {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: recentOrders, error } = await admin
          .from("esim_orders")
          .select("status")
          .gte("created_at", since)
          .limit(500);
        if (error) return { ok: false, error: error.message };
        const failed = (recentOrders ?? []).filter(
          (o) => o.status === "failed" || o.status === "error"
        ).length;
        const total = recentOrders?.length ?? 0;
        return {
          ok: true,
          detail: `${total} órdenes / ${failed} fallidas (24h)`,
        };
      })
    );

    const results = await Promise.all(checks);
    const checkedAt = new Date().toISOString();

    // --- Fetch eSIM Access balance (informational, for alerts) ---
    let esimBalance: { amount: number; currency: string; low: boolean } | null = null;
    try {
      const code = Deno.env.get("ESIM_ACCESS_CODE");
      if (code) {
        const br = await fetch("https://api.esimaccess.com/api/v1/open/balance/query", {
          method: "POST",
          headers: { "Content-Type": "application/json", "RT-AccessCode": code },
          body: JSON.stringify({}),
        });
        if (br.ok) {
          const bj = await br.json().catch(() => null);
          if (bj?.success) {
            const d = bj.obj || bj.data || {};
            const raw = d.balance ?? d.amount ?? 0;
            const amount = typeof raw === "number" ? (raw > 100000 ? raw / 10000 : raw) : Number(raw) || 0;
            esimBalance = {
              amount,
              currency: d.currency || "USD",
              low: amount < 10,
            };
          }
        }
      }
    } catch (e) {
      console.error("[health] balance fetch failed:", e);
    }

    // --- Persist results ---
    try {
      await admin.from("system_health_log").insert(
        results.map((r) => ({
          service: r.service,
          status: r.status,
          latency_ms: r.latency,
          error_message: r.error ?? null,
          detail: r.detail ?? null,
          checked_at: checkedAt,
        }))
      );
    } catch (e) {
      console.error("[health] failed to persist log:", e);
    }

    // --- Compare with previous state, send Telegram alerts on transitions ---
    const newFailures: string[] = [];
    const recoveries: string[] = [];

    try {
      const isBad = (s: string) => s === "error" || s === "timeout";
      const isGood = (s: string) => s === "ok" || s === "slow";

      for (const r of results) {
        const { data: prev } = await admin
          .from("system_health_log")
          .select("status")
          .eq("service", r.service)
          .lt("checked_at", checkedAt)
          .order("checked_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const prevStatus = prev?.status ?? null;

        if (isBad(r.status) && (prevStatus === null || isGood(prevStatus))) {
          newFailures.push(r.service);
        } else if (isGood(r.status) && prevStatus && isBad(prevStatus)) {
          recoveries.push(r.service);
        }
      }

      // Read previous balance-low state to detect transitions
      let balanceLowAlert = false;
      let balanceRecoveredAlert = false;
      if (esimBalance) {
        const { data: prevBal } = await admin
          .from("system_health_log")
          .select("status")
          .eq("service", "esim_balance")
          .lt("checked_at", checkedAt)
          .order("checked_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        const prevLow = prevBal?.status === "error";
        if (esimBalance.low && !prevLow) balanceLowAlert = true;
        if (!esimBalance.low && prevLow) balanceRecoveredAlert = true;

        // Persist balance state so transitions work next run
        await admin.from("system_health_log").insert({
          service: "esim_balance",
          status: esimBalance.low ? "error" : "ok",
          latency_ms: 0,
          detail: `${esimBalance.amount.toFixed(2)} ${esimBalance.currency}`,
          checked_at: checkedAt,
        });
      }

      if (newFailures.length > 0 || recoveries.length > 0 || balanceLowAlert || balanceRecoveredAlert) {
        const lines: string[] = [];
        if (newFailures.length > 0 || balanceLowAlert) {
          lines.push(`🚨 <b>Alerta de salud del sistema</b>`);
          lines.push("");
        }
        if (newFailures.length > 0) {
          lines.push(`<b>❌ Servicios caídos (${newFailures.length}):</b>`);
          for (const svc of newFailures) {
            const r = results.find((x) => x.service === svc)!;
            const label = SERVICE_LABELS[svc] ?? svc;
            const errTxt = r.error ? escapeHtml(r.error) : "Error desconocido";
            lines.push(
              `• <b>${escapeHtml(label)}</b> — ${r.status.toUpperCase()} (${r.latency}ms)`
            );
            lines.push(`  <code>${errTxt}</code>`);
          }
        }
        if (balanceLowAlert && esimBalance) {
          if (newFailures.length > 0) lines.push("");
          lines.push(`<b>⚠️ Saldo eSIM Access bajo:</b>`);
          lines.push(`• <code>${esimBalance.amount.toFixed(2)} ${escapeHtml(esimBalance.currency)}</code>`);
        }
        if (recoveries.length > 0) {
          if (lines.length > 0) lines.push("");
          lines.push(`✅ <b>Servicios recuperados (${recoveries.length}):</b>`);
          for (const svc of recoveries) {
            const r = results.find((x) => x.service === svc)!;
            const label = SERVICE_LABELS[svc] ?? svc;
            lines.push(
              `• <b>${escapeHtml(label)}</b> — ${r.status.toUpperCase()} (${r.latency}ms)`
            );
          }
        }
        if (balanceRecoveredAlert && esimBalance) {
          if (lines.length > 0) lines.push("");
          lines.push(`✅ <b>Saldo eSIM Access recuperado:</b> <code>${esimBalance.amount.toFixed(2)} ${escapeHtml(esimBalance.currency)}</code>`);
        }

        // Always include current balance line at the end if available
        if (esimBalance) {
          lines.push("");
          lines.push(`💰 <b>Saldo disponible:</b> <code>${esimBalance.amount.toFixed(2)} ${escapeHtml(esimBalance.currency)}</code>`);
        }

        lines.push("");
        lines.push(`<i>${escapeHtml(new Date(checkedAt).toLocaleString("es-ES"))}</i>`);

        await sendTelegramAlert(lines.join("\n"));
      }
    } catch (e) {
      console.error("[health] failed transition compare/alert:", e);
    }

    return new Response(
      JSON.stringify({
        results,
        checked_at: checkedAt,
        new_failures: newFailures,
        recoveries,
        esim_balance: esimBalance,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: String(e?.message ?? e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
