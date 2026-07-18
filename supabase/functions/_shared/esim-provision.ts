import * as React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { createClient } from "npm:@supabase/supabase-js@2";
import { template as esimDeliveryTemplate } from "./transactional-email-templates/esim-delivery.tsx";

const ESIM_API_BASE = "https://api.esimaccess.com";
const SITE_NAME = "intersofti";
const SENDER_DOMAIN = "notify.rpjsoftware.com";
const FROM_DOMAIN = "notify.rpjsoftware.com";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function persistQrCodeUrl(orderId: string, qrCodeUrl: string): Promise<string> {
  if (!qrCodeUrl) return "";
  if (qrCodeUrl.includes("/storage/v1/object/public/assets/")) return qrCodeUrl;

  try {
    const response = await fetch(qrCodeUrl);
    if (!response.ok) {
      console.error("Failed to download QR code:", response.status, qrCodeUrl);
      return qrCodeUrl;
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const extension = contentType.includes("jpeg") || contentType.includes("jpg") ? "jpg" : "png";
    const filePath = `esim-qr/${orderId}.${extension}`;
    const qrBytes = new Uint8Array(await response.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("assets")
      .upload(filePath, qrBytes, { contentType, upsert: true });

    if (uploadError) {
      console.error("Failed to upload QR code to storage:", uploadError);
      return qrCodeUrl;
    }

    const { data } = supabase.storage.from("assets").getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Failed to persist QR code:", error);
    return qrCodeUrl;
  }
}

async function enqueueDeliveryEmail(
  orderId: string,
  customerEmail: string,
  packageName: string,
  iccid: string,
  qrCodeUrl: string,
  activationCode: string,
  orderNo: string,
  esimTranNo: string,
  expiredTime: string,
  apn: string,
  shortUrl: string,
  lang: string = 'en'
) {
  const normalizedEmail = customerEmail.trim().toLowerCase();
  const templateName = "esim-delivery";
  const idempotencyKey = `esim-delivery-${orderId}`;
  const messageId = idempotencyKey;

  const { data: suppressed } = await supabase
    .from("suppressed_emails")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (suppressed) {
    console.log("Email suppressed for:", normalizedEmail);
    return;
  }

  let unsubscribeToken: string;
  const { data: existingToken } = await supabase
    .from("email_unsubscribe_tokens")
    .select("token, used_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token;
  } else if (!existingToken) {
    unsubscribeToken = generateToken();
    await supabase
      .from("email_unsubscribe_tokens")
      .upsert(
        { token: unsubscribeToken, email: normalizedEmail },
        { onConflict: "email", ignoreDuplicates: true }
      );

    const { data: storedToken } = await supabase
      .from("email_unsubscribe_tokens")
      .select("token")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (storedToken) unsubscribeToken = storedToken.token;
  } else {
    console.warn("Unsubscribe token already used for:", normalizedEmail);
    return;
  }

  const acParts = activationCode.match(/^LPA:1\$(.+)\$(.+)$/);
  const smdpAddress = acParts ? acParts[1] : "";
  const activationCodePart = acParts ? acParts[2] : "";

  const templateData = {
    lang,
    packageName,
    iccid,
    qrCodeUrl,
    activationCode,
    orderNo,
    esimTranNo,
    expiredTime,
    smdpAddress,
    activationCodePart,
    apn,
    shortUrl,
  };

  const html = await renderAsync(
    React.createElement(esimDeliveryTemplate.component, templateData)
  );
  const plainText = await renderAsync(
    React.createElement(esimDeliveryTemplate.component, templateData),
    { plainText: true }
  );

  const resolvedSubject =
    typeof esimDeliveryTemplate.subject === "function"
      ? esimDeliveryTemplate.subject(templateData)
      : esimDeliveryTemplate.subject;

  await supabase.from("email_send_log").insert({
    message_id: messageId,
    template_name: templateName,
    recipient_email: normalizedEmail,
    status: "pending",
  });

  const { error: enqueueError } = await supabase.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to: normalizedEmail,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject: resolvedSubject,
      html,
      text: plainText,
      purpose: "transactional",
      label: templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });

  if (enqueueError) {
    console.error("Failed to enqueue delivery email:", enqueueError);
    await supabase.from("email_send_log").insert({
      message_id: messageId,
      template_name: templateName,
      recipient_email: normalizedEmail,
      status: "failed",
      error_message: "Failed to enqueue email",
    });
  } else {
    console.log("Delivery email enqueued for:", normalizedEmail);
  }
}

export async function provisionEsim(
  orderId: string,
  packageCode: string,
  transactionId: string,
  packageName: string,
  customerEmail: string,
  lang: string = 'en'
) {
  const accessCode = Deno.env.get("ESIM_ACCESS_CODE");
  if (!accessCode) {
    console.error("ESIM_ACCESS_CODE not configured");
    await supabase.from("esim_orders").update({ status: "provision_failed" }).eq("id", orderId);
    return;
  }

  try {
    const response = await fetch(`${ESIM_API_BASE}/api/v1/open/esim/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "RT-AccessCode": accessCode,
      },
      body: JSON.stringify({
        transactionId,
        packageInfoList: [{ packageCode, count: 1 }],
      }),
    });

    const esimData = await response.json();
    console.log("eSIM API response:", JSON.stringify(esimData));

    if (esimData?.success && esimData?.obj?.orderNo) {
      await supabase
        .from("esim_orders")
        .update({ order_no: esimData.obj.orderNo, status: "provisioned" })
        .eq("id", orderId);

      await finalizeEsimOrder(orderId, esimData.obj.orderNo, customerEmail, packageName, packageCode, lang);
    } else {
      console.error("eSIM order failed:", esimData?.errorMessage);
      await supabase.from("esim_orders").update({ status: "provision_failed" }).eq("id", orderId);
    }
  } catch (err) {
    console.error("eSIM provisioning error:", err);
    await supabase.from("esim_orders").update({ status: "provision_failed" }).eq("id", orderId);
  }
}

async function queryEsimWithRetry(orderNo: string, accessCode: string, maxAttempts = 4) {
  const delaysMs = [1500, 3000, 6000, 10000];
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const resp = await fetch(`${ESIM_API_BASE}/api/v1/open/esim/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "RT-AccessCode": accessCode },
        body: JSON.stringify({ orderNo, pager: { pageNum: 1, pageSize: 20 } }),
      });
      const data = await resp.json();
      if (data?.obj?.esimList?.[0]) return data;
      console.log(`esim/query empty for ${orderNo} (attempt ${attempt + 1}/${maxAttempts})`);
    } catch (e) {
      console.error(`esim/query error for ${orderNo} (attempt ${attempt + 1}):`, e);
    }
    if (attempt < maxAttempts - 1) {
      await new Promise((r) => setTimeout(r, delaysMs[attempt]));
    }
  }
  return null;
}

export async function finalizeEsimOrder(
  orderId: string,
  orderNo: string,
  customerEmail: string,
  packageName: string,
  packageCode: string,
  lang: string = 'en'
) {
  const accessCode = Deno.env.get("ESIM_ACCESS_CODE");
  if (!accessCode) {
    console.error("ESIM_ACCESS_CODE not configured");
    return false;
  }

  const queryData = await queryEsimWithRetry(orderNo, accessCode);
  if (!queryData?.obj?.esimList?.[0]) {
    console.error(`Could not retrieve eSIM details after retries for order ${orderId} (${orderNo})`);
    return false;
  }

  const esim = queryData.obj.esimList[0];
  const pkg = esim.packageList?.[0];
  const persistedQrCodeUrl = await persistQrCodeUrl(orderId, esim.qrCodeUrl || "");

  await supabase
    .from("esim_orders")
    .update({
      iccid: esim.iccid || null,
      qr_code_url: persistedQrCodeUrl || esim.qrCodeUrl || null,
      activation_code: esim.ac || null,
      status: "active",
    })
    .eq("id", orderId);

  if (customerEmail && customerEmail.trim().length > 0) {
    try {
      await enqueueDeliveryEmail(
        orderId,
        customerEmail,
        pkg?.packageName || packageName || packageCode,
        esim.iccid || "",
        persistedQrCodeUrl || esim.qrCodeUrl || "",
        esim.ac || "",
        esim.orderNo || orderNo || "",
        esim.esimTranNo || "",
        esim.expiredTime || "",
        pkg?.apn || esim.apn || "",
        esim.shortUrl || "",
        lang
      );
    } catch (emailErr) {
      console.error("Failed to enqueue delivery email:", emailErr);
    }
  } else {
    console.log("Customer opted out of email; skipping delivery email for order", orderId);
  }
  return true;
}
