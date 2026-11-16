import { randomBytes } from "node:crypto";
import { json, sameOrigin, signedIn } from "@/lib/admin/auth";
import { github, isOurUpload } from "@/lib/admin/github";
import { series } from "@/lib/videos";

/**
 * Starts the "Add video" job for an uploaded file. The job shrinks the video, draws its
 * cover, adds it to the list and publishes the site: the same steps as `pnpm video:add`.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request) || !signedIn(request)) return json({ error: "Sign in first." }, 401);
  const body = (await request.json().catch(() => null)) as { url?: unknown; title?: unknown; series?: unknown; newSeries?: unknown } | null;
  const title = typeof body?.title === "string" ? body.title.replace(/\s+/g, " ").trim() : "";
  if (title.length < 1 || title.length > 80) return json({ error: "Give the video a title of up to 80 characters." }, 400);
  if (!isOurUpload(body?.url)) return json({ error: "That upload was not recognised." }, 400);

  // Which collection it joins: one that exists, a new one named here, or (neither given) the last one.
  let collection: { series?: string; series_title?: string } = {};
  if (typeof body?.newSeries === "string") {
    const name = body.newSeries.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").replace(/^-+/, "").trim();
    if (name.length < 1 || name.length > 60) return json({ error: "Give the collection a name of up to 60 characters." }, 400);
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "collection";
    const taken = series.some((s) => s.id === base);
    collection = { series: taken ? `${base}-${randomBytes(2).toString("hex")}` : base, series_title: name };
  } else if (typeof body?.series === "string") {
    if (!series.some((s) => s.id === body.series)) return json({ error: "That collection was not recognised. Reload the page and try again." }, 400);
    collection = { series: body.series };
  }

  const id = randomBytes(6).toString("hex");
  const started = await github("/dispatches", {
    method: "POST",
    body: JSON.stringify({ event_type: "add-video", client_payload: { id, url: body.url, title, ...collection } }),
  });
  if (!started.ok) return json({ error: "Could not start publishing. Try again in a minute." }, 502);
  return json({ id });
}
