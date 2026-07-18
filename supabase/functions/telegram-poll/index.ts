// Telegram long-polling worker.
// Cada minuto el cron invoca esta función. Hace long-polling de getUpdates
// hasta ~55s, procesa comandos (/audit, /status, /help, /start) y responde
// en el mismo chat. Solo responde al TELEGRAM_CHAT_ID configurado.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MAX_RUNTIME_MS = 55_000;
const MIN_REMAINING_MS = 5_000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function statusEmoji(status: string): string {
  switch (status) {
    case "ok":
      return "✅";
    case "slow":
      return "🟡";
    case "timeout":
      return "⏱️";
    case "error":
    default:
      return "❌";
  }
}

const SERVICE_LABELS: Record<string, string> = {
  database: "Base de datos",
  storage: "Almacenamiento",
  auth: "Autenticación",
  esim_access: "eSIM Access",
  stripe_sandbox: "Stripe Sandbox",
  stripe_live: "Stripe Live",
  plisio: "Plisio",
  emails: "Emails",
  edge_functions: "Edge Functions",
  recent_orders: "Pedidos recientes",
  email_queue: "Cola de emails",
};

async function sendTelegram(
  token: string,
  chatId: string | number,
  text: string,
): Promise<void> {
  const branded =
    `<b>🛡️ INTERSOFTI</b> · <i>Monitor de Sistema</i>\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    text;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: branded,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}

interface HealthResult {
  service: string;
  status: string;
  latency: number;
  error?: string;
  detail?: string;
}

function formatAudit(
  results: HealthResult[],
  esimBalance: any,
  checkedAt: string,
  brief = false,
): string {
  const lines: string[] = [];
  lines.push(`🔍 <b>Auditoría manual del sistema</b>`);
  lines.push("");

  for (const r of results) {
    const label = SERVICE_LABELS[r.service] ?? r.service;
    const emoji = statusEmoji(r.status);
    if (brief) {
      lines.push(`${emoji} ${escapeHtml(label)}`);
    } else {
      const latency = `${r.latency}ms`;
      let line = `${emoji} <b>${escapeHtml(label)}</b> — ${latency}`;
      if (r.detail) line += ` · <i>${escapeHtml(r.detail)}</i>`;
      if (r.error) line += `\n   ⚠️ ${escapeHtml(r.error)}`;
      lines.push(line);
    }
  }

  lines.push("");
  if (esimBalance !== null && esimBalance !== undefined) {
    let balanceStr: string;
    if (typeof esimBalance === "object") {
      const b: any = esimBalance;
      const amount = typeof b.amount === "number" ? b.amount.toFixed(2) : String(b.amount ?? "?");
      const currency = b.currency ?? "";
      const lowFlag = b.low ? " ⚠️ <i>saldo bajo</i>" : "";
      balanceStr = `${amount} ${currency}${lowFlag}`.trim();
    } else {
      balanceStr = String(esimBalance);
    }
    lines.push(`💰 <b>Saldo eSIM Access:</b> ${escapeHtml(balanceStr)}`);
  }

  const ts = new Date(checkedAt).toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
  });
  lines.push(`🕒 ${ts}`);

  return lines.join("\n");
}

function helpMessage(): string {
  return [
    `🤖 <b>Comandos disponibles</b>`,
    ``,
    `/audit — Auditoría completa del sistema`,
    `/status — Estado resumido de los servicios`,
    `/help — Mostrar esta ayuda`,
  ].join("\n");
}

async function runAudit(
  supabaseUrl: string,
  serviceRoleKey: string,
): Promise<{
  results: HealthResult[];
  esim_balance: any;
  checked_at: string;
} | null> {
  try {
    const r = await fetch(`${supabaseUrl}/functions/v1/system-health-check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${serviceRoleKey}`,
        "apikey": serviceRoleKey,
        "x-internal-trigger": serviceRoleKey,
      },
      body: JSON.stringify({ source: "telegram-audit" }),
    });
    if (!r.ok) {
      const body = await r.text();
      console.error(
        `[telegram-audit] system-health-check failed status=${r.status} body=${body}`,
      );
      return null;
    }
    return await r.json();
  } catch (e) {
    console.error("[telegram-audit] runAudit error", e);
    return null;
  }
}

async function handleCommand(
  text: string,
  token: string,
  chatId: number,
  supabaseUrl: string,
  serviceRoleKey: string,
): Promise<void> {
  const cmd = text.trim().split(/\s+/)[0].toLowerCase().split("@")[0];

  if (cmd === "/help" || cmd === "/start") {
    await sendTelegram(token, chatId, helpMessage());
    return;
  }

  if (cmd === "/audit" || cmd === "/status") {
    await sendTelegram(
      token,
      chatId,
      `⏳ Ejecutando auditoría… (puede tardar unos segundos)`,
    );
    const audit = await runAudit(supabaseUrl, serviceRoleKey);
    if (!audit) {
      await sendTelegram(
        token,
        chatId,
        `❌ Error ejecutando la auditoría. Revisa los logs del sistema.`,
      );
      return;
    }
    const msg = formatAudit(
      audit.results,
      audit.esim_balance,
      audit.checked_at,
      cmd === "/status",
    );
    await sendTelegram(token, chatId, msg);
    return;
  }

  // Comando desconocido
  await sendTelegram(
    token,
    chatId,
    `❓ Comando no reconocido: ${escapeHtml(cmd)}\n\n${helpMessage()}`,
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (
    !TELEGRAM_BOT_TOKEN ||
    !TELEGRAM_CHAT_ID ||
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY
  ) {
    return new Response(
      JSON.stringify({ error: "Missing required environment variables" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const allowedChatId = String(TELEGRAM_CHAT_ID);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Read current offset
  const { data: state, error: stateErr } = await supabase
    .from("telegram_bot_state")
    .select("update_offset")
    .eq("id", 1)
    .single();

  if (stateErr) {
    return new Response(JSON.stringify({ error: stateErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let currentOffset: number = state.update_offset ?? 0;
  let totalProcessed = 0;

  while (true) {
    const elapsed = Date.now() - startTime;
    const remainingMs = MAX_RUNTIME_MS - elapsed;
    if (remainingMs < MIN_REMAINING_MS) break;
    const timeout = Math.min(50, Math.floor(remainingMs / 1000) - 5);
    if (timeout < 1) break;

    let updates: any[] = [];
    try {
      const r = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            offset: currentOffset,
            timeout,
            allowed_updates: ["message"],
          }),
        },
      );
      const data = await r.json();
      if (!r.ok || !data.ok) {
        console.error("getUpdates failed", r.status, data);
        break;
      }
      updates = data.result ?? [];
    } catch (e) {
      console.error("getUpdates error", e);
      break;
    }

    if (updates.length === 0) continue;

    for (const u of updates) {
      const msg = u.message;
      if (!msg) continue;
      const chatId = msg.chat?.id;
      const text: string = msg.text ?? "";

      if (String(chatId) !== allowedChatId) {
        // Ignorar silenciosamente cualquier chat no autorizado
        continue;
      }
      if (!text.startsWith("/")) continue;

      try {
        await handleCommand(text, TELEGRAM_BOT_TOKEN, chatId, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        totalProcessed++;
      } catch (e) {
        console.error("handleCommand error", e);
      }
    }

    const newOffset =
      Math.max(...updates.map((u: any) => u.update_id as number)) + 1;
    const { error: offsetErr } = await supabase
      .from("telegram_bot_state")
      .update({
        update_offset: newOffset,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    if (offsetErr) {
      console.error("offset update failed", offsetErr);
      break;
    }
    currentOffset = newOffset;
  }

  return new Response(
    JSON.stringify({ ok: true, processed: totalProcessed, offset: currentOffset }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
