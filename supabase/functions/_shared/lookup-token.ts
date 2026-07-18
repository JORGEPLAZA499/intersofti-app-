// HMAC-based ownership token for anonymous order lookups.
// The token binds a session_id / transaction_id to a server-side secret so
// possession of the identifier alone is not enough to retrieve order details.

const SECRET_NAME = "ORDER_LOOKUP_SECRET";

function getSecret(): string {
  const s = Deno.env.get(SECRET_NAME);
  if (!s) throw new Error(`${SECRET_NAME} is not configured`);
  return s;
}

function toB64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function hmac(id: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(id));
  return toB64Url(new Uint8Array(sig)).slice(0, 32); // 32-char URL-safe token
}

export async function signIdentifier(id: string): Promise<string> {
  return hmac(id);
}

export async function verifyIdentifier(id: string, token: string): Promise<boolean> {
  if (!id || !token || typeof token !== "string") return false;
  const expected = await hmac(id);
  if (expected.length !== token.length) return false;
  // constant-time compare
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}
