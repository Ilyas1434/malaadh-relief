import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * Sign-in for the admin portal.
 *
 * Nothing secret lives in the code. The password is stored only as a scrypt hash, in the
 * ADMIN_PASSWORD_HASH setting, and sessions are signed with ADMIN_SESSION_SECRET. Both are
 * set by `pnpm admin:setup`.
 */

const USERNAME = process.env.ADMIN_USERNAME ?? "Ryan Khalid";
const SESSION_DAYS = 7;
export const COOKIE = process.env.NODE_ENV === "production" ? "__Host-malaadh-admin" : "malaadh-admin";

export const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 128 * 1024 * 1024 } as const;

export function configured() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && (process.env.ADMIN_SESSION_SECRET ?? "").length >= 32);
}

function derive(password: string, salt: Buffer, length: number): Promise<Buffer> {
  return new Promise((resolve, reject) => scrypt(password, salt, length, SCRYPT, (err, key) => (err ? reject(err) : resolve(key))));
}

const digest = (s: string) => createHash("sha256").update(s).digest();
const normal = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

/** True only for the right username and password. Takes the same time either way. */
export async function checkSignIn(username: string, password: string) {
  const [saltB64, hashB64] = (process.env.ADMIN_PASSWORD_HASH ?? "").split(":");
  if (!saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const got = await derive(password, Buffer.from(saltB64, "base64"), expected.length || 32);
  const passwordOk = expected.length > 0 && got.length === expected.length && timingSafeEqual(got, expected);
  const userOk = timingSafeEqual(digest(normal(username)), digest(normal(USERNAME)));
  return passwordOk && userOk;
}

const sign = (payload: string) => createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "").update(payload).digest("base64url");

/** A signed token that says "signed in until this time". It holds nothing else. */
export function newSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_DAYS * 86_400_000, n: randomBytes(8).toString("hex") })).toString("base64url");
  return { value: `${payload}.${sign(payload)}`, maxAge: SESSION_DAYS * 86_400 };
}

export function signedIn(request: Request) {
  if (!configured()) return false;
  const raw = request.headers
    .get("cookie")
    ?.split(/;\s*/)
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.slice(COOKIE.length + 1);
  if (!raw) return false;
  const [payload, mac] = raw.split(".");
  if (!payload || !mac) return false;
  const want = Buffer.from(sign(payload));
  const have = Buffer.from(mac);
  if (want.length !== have.length || !timingSafeEqual(want, have)) return false;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now();
  } catch {
    return false;
  }
}

/** Requests that change something must come from the portal's own pages. */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function sessionCookie(value: string, maxAge: number) {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${COOKIE}=${value}; Path=/; HttpOnly;${secure} SameSite=Strict; Max-Age=${maxAge}`;
}

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...headers } });
