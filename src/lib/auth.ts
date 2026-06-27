/**
 * Tiny single-password admin auth. No database, no Supabase Auth.
 *
 * The session cookie holds `${expires}.${hmac}` where the HMAC is signed
 * with ADMIN_PASSWORD as the key. The password itself is never stored in
 * the cookie, and the cookie can't be forged or its expiry extended without
 * knowing ADMIN_PASSWORD. Uses Web Crypto so it works in the Edge
 * middleware runtime as well as Node.
 */

export const SESSION_COOKIE = "tb_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is not set");
  return secret;
}

function toHex(buf: ArrayBuffer): string {
  let out = "";
  for (const b of new Uint8Array(buf)) out += b.toString(16).padStart(2, "0");
  return out;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toHex(sig);
}

/** Constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionToken(): Promise<{
  token: string;
  expires: number;
}> {
  const expires = Date.now() + SESSION_DURATION_MS;
  const sig = await hmacHex(getSecret(), String(expires));
  return { token: `${expires}.${sig}`, expires };
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;

  const expiresStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  let expected: string;
  try {
    expected = await hmacHex(getSecret(), expiresStr);
  } catch {
    return false; // ADMIN_PASSWORD not configured
  }
  return safeEqual(sig, expected);
}
