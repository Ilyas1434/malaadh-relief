import { configured, json, signedIn } from "@/lib/admin/auth";
import { series, videos } from "@/lib/videos";

/** Whether the visitor is signed in, and, only if they are, what is on the site now. */
export async function GET(request: Request) {
  if (!signedIn(request)) return json({ signedIn: false, ready: configured() });
  return json({
    signedIn: true,
    ready: Boolean(process.env.BLOB_READ_WRITE_TOKEN && process.env.GITHUB_DISPATCH_TOKEN),
    videos,
    series,
  });
}
