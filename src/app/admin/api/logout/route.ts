import { json, sameOrigin, sessionCookie } from "@/lib/admin/auth";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Not allowed." }, 403);
  return json({ ok: true }, 200, { "set-cookie": sessionCookie("", 0) });
}
