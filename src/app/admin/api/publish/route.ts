import { randomBytes } from "node:crypto";
import { json, sameOrigin, signedIn } from "@/lib/admin/auth";
import { github, isOurUpload } from "@/lib/admin/github";

/**
 * Starts the "Add video" job for an uploaded file. The job shrinks the video, draws its
 * cover, adds it to the list and publishes the site: the same steps as `pnpm video:add`.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request) || !signedIn(request)) return json({ error: "Sign in first." }, 401);
  const body = (await request.json().catch(() => null)) as { url?: unknown; title?: unknown } | null;
  const title = typeof body?.title === "string" ? body.title.replace(/\s+/g, " ").trim() : "";
  if (title.length < 1 || title.length > 80) return json({ error: "Give the video a title of up to 80 characters." }, 400);
  if (!isOurUpload(body?.url)) return json({ error: "That upload was not recognised." }, 400);

  const id = randomBytes(6).toString("hex");
  const started = await github("/dispatches", {
    method: "POST",
    body: JSON.stringify({ event_type: "add-video", client_payload: { id, url: body.url, title } }),
  });
  if (!started.ok) return json({ error: "Could not start publishing. Try again in a minute." }, 502);
  return json({ id });
}
