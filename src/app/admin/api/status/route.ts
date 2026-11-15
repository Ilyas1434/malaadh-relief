import { del } from "@vercel/blob";
import { json, signedIn } from "@/lib/admin/auth";
import { github, isOurUpload } from "@/lib/admin/github";

type Run = { name: string; status: string; conclusion: string | null };

/** Where an "Add video" job has got to. Once it has finished, the raw upload is deleted. */
export async function GET(request: Request) {
  if (!signedIn(request)) return json({ error: "Sign in first." }, 401);
  const params = new URL(request.url).searchParams;
  const id = params.get("id") ?? "";
  if (!/^[a-f0-9]{12}$/.test(id)) return json({ error: "Unknown job." }, 400);

  const res = await github("/actions/runs?event=repository_dispatch&per_page=30");
  if (!res.ok) return json({ state: "unknown" });
  const { workflow_runs: runs } = (await res.json()) as { workflow_runs: Run[] };
  const run = runs.find((r) => r.name === `Add video ${id}`);
  if (!run) return json({ state: "queued" });
  if (run.status !== "completed") return json({ state: "working" });

  const upload = params.get("url");
  if (isOurUpload(upload)) await del(upload).catch(() => {});
  return json({ state: run.conclusion === "success" ? "done" : "failed" });
}
