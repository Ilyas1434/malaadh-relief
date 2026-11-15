"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { upload } from "@vercel/blob/client";
import { ArrowSquareOutIcon, CheckIcon, FilmSlateIcon, SignOutIcon, UploadSimpleIcon, WarningIcon } from "@phosphor-icons/react/dist/ssr";
import { clock, type Series, type Video } from "@/lib/videos";

type Session = { signedIn: false; ready: boolean } | { signedIn: true; ready: boolean; videos: Video[]; series: Series[] };
type Job = { id: string; url: string; title: string; part: number; count: number; started: number };
type Phase = "uploading" | "preparing" | "publishing" | "live" | "failed";

const SITE = "https://malaadh.org";
const JOB_KEY = "malaadh-admin-job";
const savedJob = (): Job | null => {
  try {
    return JSON.parse(localStorage.getItem(JOB_KEY) ?? "null") as Job | null;
  } catch {
    return null;
  }
};
const post = (path: string, body?: unknown) =>
  fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body ?? {}) });

const field =
  "mt-1.5 h-12 w-full rounded-xl border border-bark/25 bg-bone px-4 text-base text-espresso outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-bark/45 focus:border-espresso focus:ring-2 focus:ring-clay/40";

/** `mark` is the logo, drawn on the server and handed in. */
export function AdminApp({ mark }: { mark: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const refresh = useCallback(async () => {
    const res = await fetch("/admin/api/session", { cache: "no-store" });
    const next = (await res.json()) as Session;
    setSession(next);
    return next;
  }, []);
  useEffect(() => {
    let live = true;
    fetch("/admin/api/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((next: Session) => live && setSession(next))
      .catch(() => live && setSession({ signedIn: false, ready: true }));
    return () => {
      live = false;
    };
  }, []);

  return (
    <main className="min-h-[100dvh] bg-sand px-4 py-8 text-espresso">
      <div className="mx-auto max-w-xl">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-7">{mark}</span>
            <span className="display pt-1 text-2xl">Malaadh admin</span>
          </div>
          {session?.signedIn && (
            <button
              type="button"
              onClick={async () => {
                await post("/admin/api/logout");
                refresh();
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-bark transition-colors hover:text-espresso"
            >
              <SignOutIcon size={18} weight="bold" /> Sign out
            </button>
          )}
        </header>

        {session === null ? (
          <p className="mt-16 text-bark">Loading…</p>
        ) : session.signedIn ? (
          <Dashboard session={session} refresh={refresh} />
        ) : (
          <SignIn ready={session.ready} onDone={refresh} />
        )}
      </div>
    </main>
  );
}

function SignIn({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="mt-14 rounded-3xl bg-sand-light p-6 ring-1 ring-bark/10 md:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        setBusy(true);
        setError("");
        try {
          const res = await post("/admin/api/login", { username: data.get("username"), password: data.get("password") });
          if (res.ok) return onDone();
          setError(((await res.json()) as { error?: string }).error ?? "Could not sign in.");
        } catch {
          setError("Could not reach the site. Check your connection.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h1 className="display text-4xl">Sign in</h1>
      {!ready && <p className="mt-3 text-sm text-bark">The portal has not been set up yet.</p>}
      <label className="mt-6 block text-sm font-semibold">
        Name
        <input name="username" autoComplete="username" required className={field} />
      </label>
      <label className="mt-4 block text-sm font-semibold">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={field} />
      </label>
      {error && (
        <p role="alert" className="mt-4 flex items-start gap-2 text-sm font-semibold text-[#9a2f1f]">
          <WarningIcon size={18} weight="bold" className="mt-0.5 shrink-0" /> {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full disabled:opacity-60">
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

const STEPS: { phase: Phase; label: string; note: string }[] = [
  { phase: "uploading", label: "Uploading", note: "Keep this page open." },
  { phase: "preparing", label: "Preparing the video", note: "Shrinking it and drawing the cover. About 2 minutes." },
  { phase: "publishing", label: "Publishing the site", note: "About 1 minute." },
  { phase: "live", label: "Live", note: "" },
];

function Dashboard({ session, refresh }: { session: Extract<Session, { signedIn: true }>; refresh: () => Promise<Session> }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  // A job that was running when the page was last open carries on from where it was.
  const [job, setJob] = useState<Job | null>(savedJob);
  const [phase, setPhase] = useState<Phase | null>(() => (savedJob() ? "preparing" : null));
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState("");
  const picker = useRef<HTMLInputElement>(null);

  const current = session.series.at(-1);
  const nextPart = Math.max(0, ...session.videos.filter((v) => v.series === current?.id).map((v) => v.part)) + 1;
  const newest = [...session.videos].reverse();

  // Follow the job from "started" to "live".
  useEffect(() => {
    if (!job) return;
    let stopped = false;
    let timer = 0;
    const fail = (message: string) => {
      localStorage.removeItem(JOB_KEY);
      setError(message);
      setPhase("failed");
    };
    const tick = async () => {
      if (stopped) return;
      if (Date.now() - job.started > 20 * 60_000) return fail("This is taking too long. Try again, or ask Sameer to check.");
      try {
        const res = await fetch(`/admin/api/status?id=${job.id}&url=${encodeURIComponent(job.url)}`, { cache: "no-store" });
        const { state } = (await res.json()) as { state?: string };
        if (stopped) return;
        if (state === "failed") return fail("The video could not be prepared. Check that the file plays, then try again.");
        if (state === "done") {
          setPhase("publishing");
          const now = await refresh();
          if (now.signedIn && now.videos.length > job.count) {
            localStorage.removeItem(JOB_KEY);
            return setPhase("live");
          }
        }
      } catch {
        // A dropped connection is not a failure. Ask again on the next tick.
      }
      timer = window.setTimeout(tick, 5000);
    };
    timer = window.setTimeout(tick, 3000);
    return () => {
      stopped = true;
      window.clearTimeout(timer);
    };
  }, [job, refresh]);

  const start = async () => {
    if (!file || !title.trim()) return;
    setError("");
    setPercent(0);
    setPhase("uploading");
    try {
      const name = file.name.replace(/[^\w.-]+/g, "-").slice(-80) || "video.mp4";
      const blob = await upload(`uploads/${name}`, file, {
        access: "public",
        handleUploadUrl: "/admin/api/upload",
        multipart: file.size > 20 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setPercent(Math.round(percentage)),
      });
      const res = await post("/admin/api/publish", { url: blob.url, title: title.trim() });
      const body = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !body.id) throw new Error(body.error ?? "Could not start publishing.");
      const started: Job = { id: body.id, url: blob.url, title: title.trim(), part: nextPart, count: session.videos.length, started: Date.now() };
      localStorage.setItem(JOB_KEY, JSON.stringify(started));
      setPhase("preparing");
      setJob(started);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setPhase("failed");
    }
  };

  const reset = () => {
    setFile(null);
    setTitle("");
    setPhase(null);
    setJob(null);
    setError("");
  };
  const working = phase !== null && phase !== "failed" && phase !== "live";
  const at = STEPS.findIndex((s) => s.phase === phase);

  return (
    <>
      <section className="mt-12 rounded-3xl bg-sand-light p-6 ring-1 ring-bark/10 md:p-8">
        <h1 className="display text-4xl">Add a video</h1>
        {!session.ready && (
          <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-[#9a2f1f]">
            <WarningIcon size={18} weight="bold" className="mt-0.5 shrink-0" /> Uploading is not switched on yet. Ask Sameer to finish the setup.
          </p>
        )}

        {phase === null || phase === "failed" ? (
          <form
            className="mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              start();
            }}
          >
            <input ref={picker} type="file" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.m4v,.webm" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <button
              type="button"
              onClick={() => picker.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dropped = e.dataTransfer.files?.[0];
                if (dropped?.type.startsWith("video/")) setFile(dropped);
              }}
              className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-bark/30 bg-bone px-4 py-9 text-center transition-colors duration-150 hover:border-espresso active:bg-sand"
            >
              {file ? <FilmSlateIcon size={30} weight="regular" /> : <UploadSimpleIcon size={30} weight="regular" />}
              <span className="max-w-full truncate text-base font-semibold">{file ? file.name : "Choose a video"}</span>
              <span className="text-sm text-bark">{file ? `${(file.size / 1048576).toFixed(1)} MB · tap to change` : "MP4 or MOV, straight from your phone"}</span>
            </button>
            <label className="mt-5 block text-sm font-semibold">
              Title
              <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} required placeholder="Next stop: the orphanage" className={field} />
            </label>
            {current && (
              <p className="mt-3 text-sm text-bark">
                This will be <span className="font-semibold text-espresso">Part {nextPart}</span> of {current.title}.
              </p>
            )}
            {error && (
              <p role="alert" className="mt-4 flex items-start gap-2 text-sm font-semibold text-[#9a2f1f]">
                <WarningIcon size={18} weight="bold" className="mt-0.5 shrink-0" /> {error}
              </p>
            )}
            <button type="submit" disabled={!file || !title.trim() || !session.ready} className="btn btn-primary mt-6 w-full disabled:opacity-50">
              Publish
            </button>
          </form>
        ) : (
          <div className="mt-6">
            <p className="text-sm text-bark">
              Part {job?.part ?? nextPart}: <span className="font-semibold text-espresso">{job?.title ?? title}</span>
            </p>
            <ol className="mt-4 space-y-4">
              {STEPS.map((s, i) => {
                const done = i < at || phase === "live";
                const now = i === at && phase !== "live";
                return (
                  <li key={s.phase} className={`flex gap-3 ${i > at ? "opacity-40" : ""}`}>
                    <span
                      className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 ${
                        done ? "border-espresso bg-espresso text-sand-light" : now ? "border-espresso" : "border-bark/40"
                      }`}
                    >
                      {done ? <CheckIcon size={13} weight="bold" /> : now ? <span className="size-2 animate-pulse rounded-full bg-espresso" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">
                        {s.label}
                        {now && s.phase === "uploading" ? ` ${percent}%` : ""}
                      </span>
                      {now && s.note && <span className="block text-sm text-bark">{s.note}</span>}
                      {now && s.phase === "uploading" && (
                        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-bark/15">
                          <span className="block h-full origin-left rounded-full bg-espresso transition-transform duration-300" style={{ transform: `scaleX(${percent / 100})` }} />
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ol>
            {working && phase !== "uploading" && <p className="mt-5 text-sm text-bark">You can close this page. It will carry on by itself.</p>}
            {phase === "live" && (
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`${SITE}/watch/${newest[0]?.slug ?? ""}`} target="_blank" rel="noreferrer" className="btn btn-primary">
                  See it on the site <ArrowSquareOutIcon size={18} weight="bold" />
                </a>
                <button type="button" onClick={reset} className="btn btn-secondary">
                  Add another
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-bold tracking-[0.14em] text-clay uppercase">On the site now</h2>
        <ul className="mt-3 divide-y divide-bark/15 border-y border-bark/15">
          {newest.map((v) => (
            <li key={v.slug}>
              <a href={`${SITE}/watch/${v.slug}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.poster} alt="" loading="lazy" className="aspect-[9/16] w-11 shrink-0 rounded-lg bg-ink object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold tracking-[0.14em] text-clay uppercase">Part {v.part}</span>
                  <span className="display mt-0.5 block truncate text-2xl">{v.title}</span>
                </span>
                <span className="text-sm font-semibold text-bark tabular-nums">{clock(v.seconds)}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
