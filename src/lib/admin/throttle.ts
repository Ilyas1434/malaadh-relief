import { createHash } from "node:crypto";
import { del, list, put } from "@vercel/blob";

/**
 * Limits on wrong passwords, so the password cannot be guessed by trying thousands.
 *
 * Each failed sign-in leaves a small marker in the upload store. A visitor with five
 * recent failures, or the whole portal with thirty, is told to wait. Markers are kept in
 * storage because the site's servers do not share memory between requests.
 */

const WINDOW = 15 * 60_000;
const PER_VISITOR = 5;
const OVERALL = 30;
const PREFIX = "sign-in-failures/";

// Without the upload store (local development) the counts live in memory.
const local: { who: string; at: number }[] = [];
const stored = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function visitor(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

async function recent(): Promise<{ who: string; at: number }[]> {
  if (!stored()) return local.filter((f) => Date.now() - f.at < WINDOW);
  const { blobs } = await list({ prefix: PREFIX, limit: 200 });
  const old = blobs.filter((b) => Date.now() - b.uploadedAt.getTime() > WINDOW * 4);
  if (old.length) await del(old.map((b) => b.url)).catch(() => {});
  return blobs
    .filter((b) => Date.now() - b.uploadedAt.getTime() < WINDOW)
    .map((b) => ({ who: b.pathname.slice(PREFIX.length).split("/")[0], at: b.uploadedAt.getTime() }));
}

export async function tooManyAttempts(request: Request) {
  const who = visitor(request);
  const failures = await recent();
  return failures.length >= OVERALL || failures.filter((f) => f.who === who).length >= PER_VISITOR;
}

export async function recordFailure(request: Request) {
  const who = visitor(request);
  if (!stored()) {
    local.push({ who, at: Date.now() });
    return;
  }
  await put(`${PREFIX}${who}/${Date.now()}.txt`, "x", { access: "public", addRandomSuffix: true, contentType: "text/plain" });
}
