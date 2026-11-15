import { checkSignIn, configured, json, newSession, sameOrigin, sessionCookie } from "@/lib/admin/auth";
import { recordFailure, tooManyAttempts } from "@/lib/admin/throttle";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  if (!configured()) return json({ error: "The portal has not been set up yet." }, 503);
  if (await tooManyAttempts(request)) return json({ error: "Too many tries. Wait 15 minutes and try again." }, 429);

  const body = (await request.json().catch(() => null)) as { username?: unknown; password?: unknown } | null;
  const username = typeof body?.username === "string" ? body.username.slice(0, 200) : "";
  const password = typeof body?.password === "string" ? body.password.slice(0, 200) : "";

  if (!(await checkSignIn(username, password))) {
    await recordFailure(request);
    return json({ error: "That name or password is not right." }, 401);
  }
  const session = newSession();
  return json({ ok: true }, 200, { "set-cookie": sessionCookie(session.value, session.maxAge) });
}
