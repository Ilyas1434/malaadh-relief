import { randomBytes } from "node:crypto";
import { json, sameOrigin, signedIn } from "@/lib/admin/auth";
import { github } from "@/lib/admin/github";

type Collection = { id?: string; title: string; videos: string[] };

const SLUG = /^[a-z0-9-]{1,80}$/;

/** Reads one collection from the request, or returns null if anything about it is off. */
function collection(raw: unknown): Collection | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { id, title, videos } = raw as Record<string, unknown>;
  const name = typeof title === "string" ? title.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim() : "";
  if (name.length < 1 || name.length > 60) return null;
  if (id !== undefined && (typeof id !== "string" || !SLUG.test(id))) return null;
  if (!Array.isArray(videos) || !videos.every((s) => typeof s === "string" && SLUG.test(s))) return null;
  return { ...(id === undefined ? {} : { id }), title: name, videos: videos as string[] };
}

/**
 * Starts the "Organize videos" job with a new arrangement: every collection in order, and
 * in each one every video's slug in playing order. The job renumbers the parts, redraws
 * their covers and publishes the site: the same steps as `pnpm video:organize`. The job
 * checks the arrangement against the real list before changing anything.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request) || !signedIn(request)) return json({ error: "Sign in first." }, 401);
  const body = (await request.json().catch(() => null)) as { layout?: unknown } | null;
  const layout = Array.isArray(body?.layout) && body.layout.length <= 50 ? body.layout.map(collection) : [];
  const slugs = layout.flatMap((c) => c?.videos ?? []);
  const valid = layout.length > 0 && layout.every(Boolean) && slugs.length >= 1 && slugs.length <= 500 && new Set(slugs).size === slugs.length;
  if (!valid) return json({ error: "That arrangement was not recognised. Reload the page and try again." }, 400);

  const id = randomBytes(6).toString("hex");
  const started = await github("/dispatches", {
    method: "POST",
    body: JSON.stringify({ event_type: "organize-videos", client_payload: { id, layout } }),
  });
  if (!started.ok) return json({ error: "Could not save the changes. Try again in a minute." }, 502);
  return json({ id });
}
