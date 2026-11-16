"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { upload } from "@vercel/blob/client";
import { ArrowDownIcon, ArrowSquareOutIcon, ArrowUpIcon, CheckIcon, PlusIcon, FilmSlateIcon, SignOutIcon, UploadSimpleIcon, WarningIcon } from "@phosphor-icons/react/dist/ssr";
import { clock, type Series, type Video } from "@/lib/videos";

type Session = { signedIn: false; ready: boolean } | { signedIn: true; ready: boolean; videos: Video[]; series: Series[] };
type Job = { id: string; url: string; title: string; part: number; count: number; started: number };
type Phase = "uploading" | "preparing" | "publishing" | "live" | "failed";

const SITE = "https://malaadh.org";
const JOB_KEY = "malaadh-admin-job";
const ORGANIZE_KEY = "malaadh-admin-organize";
const NEW = "__new__";
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
  // Which collection the upload joins: one of the existing ones, or NEW with a name.
  const [target, setTarget] = useState(session.series.at(-1)?.id ?? NEW);
  const [newName, setNewName] = useState("");

  const current = target === NEW ? undefined : (session.series.find((s) => s.id === target) ?? session.series.at(-1));
  const nextPart = current ? Math.max(0, ...session.videos.filter((v) => v.series === current.id).map((v) => v.part)) + 1 : 1;
  const collectionName = current ? current.title : newName.trim();
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
    if (!file || !title.trim() || !collectionName) return;
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
      const res = await post("/admin/api/publish", { url: blob.url, title: title.trim(), ...(current ? { series: current.id } : { newSeries: collectionName }) });
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
            <label className="mt-4 block text-sm font-semibold">
              Collection
              <select value={current ? current.id : NEW} onChange={(e) => setTarget(e.target.value)} className={field}>
                {session.series.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
                <option value={NEW}>New collection…</option>
              </select>
            </label>
            {!current && (
              <label className="mt-4 block text-sm font-semibold">
                Collection name
                <input value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={60} required placeholder="Sudan, December 2026" className={field} />
              </label>
            )}
            {collectionName && (
              <p className="mt-3 text-sm text-bark">
                This will be <span className="font-semibold text-espresso">Part {nextPart}</span> of {collectionName}. You can change the order below afterwards.
              </p>
            )}
            {error && (
              <p role="alert" className="mt-4 flex items-start gap-2 text-sm font-semibold text-[#9a2f1f]">
                <WarningIcon size={18} weight="bold" className="mt-0.5 shrink-0" /> {error}
              </p>
            )}
            <button type="submit" disabled={!file || !title.trim() || !collectionName || !session.ready} className="btn btn-primary mt-6 w-full disabled:opacity-50">
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

      <Organize session={session} refresh={refresh} locked={working} />
    </>
  );
}

type Group = { key: string; id?: string; title: string; videos: Video[] };
type OrganizeJob = { id: string; want: string; started: number };

const groupsOf = (videos: Video[], series: Series[]): Group[] =>
  series.map((s) => ({ key: s.id, id: s.id, title: s.title, videos: videos.filter((v) => v.series === s.id) }));
/** What the site would show for an arrangement. Two arrangements that read the same are the same. */
const reading = (groups: Group[]) => JSON.stringify(groups.filter((g) => g.videos.length > 0).map((g) => [g.title.trim(), g.videos.map((v) => v.src)]));
const savedOrganize = (): OrganizeJob | null => {
  try {
    return JSON.parse(localStorage.getItem(ORGANIZE_KEY) ?? "null") as OrganizeJob | null;
  } catch {
    return null;
  }
};
const swap = <T,>(list: T[], i: number, j: number) => {
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};
const small =
  "grid size-10 shrink-0 place-items-center rounded-full border border-bark/25 text-espresso transition-[background-color,transform,opacity] duration-150 hover:bg-espresso/6 active:scale-95 disabled:opacity-25 disabled:hover:bg-transparent";

/**
 * Everything on the site, by collection, in playing order. Arrows change the order, the
 * menu on a video moves it to another collection, and a collection's name can be typed
 * over. Nothing changes on the site until "Save changes".
 */
function Organize({ session, refresh, locked }: { session: Extract<Session, { signedIn: true }>; refresh: () => Promise<Session>; locked: boolean }) {
  const saved = groupsOf(session.videos, session.series);
  const [draft, setDraft] = useState<Group[] | null>(null);
  const [job, setJob] = useState<OrganizeJob | null>(savedOrganize);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const groups = draft ?? saved;
  const changed = draft !== null && reading(draft) !== reading(saved);
  const frozen = locked || busy || job !== null;
  const change = (next: Group[]) => {
    setDone(false);
    setError("");
    setDraft(next);
  };
  const inGroup = (gi: number, videos: Video[]) => groups.map((g, i) => (i === gi ? { ...g, videos } : g));

  // Follow a save until the site shows the new arrangement.
  useEffect(() => {
    if (!job) return;
    let stopped = false;
    let timer = 0;
    const fail = (message: string) => {
      localStorage.removeItem(ORGANIZE_KEY);
      setJob(null);
      setError(message);
    };
    const tick = async () => {
      if (stopped) return;
      if (Date.now() - job.started > 20 * 60_000) return fail("This is taking too long. Try again, or ask Sameer to check.");
      try {
        const res = await fetch(`/admin/api/status?id=${job.id}`, { cache: "no-store" });
        const { state } = (await res.json()) as { state?: string };
        if (stopped) return;
        if (state === "failed") return fail("The changes could not be saved. Reload the page and try again.");
        if (state === "done") {
          const now = await refresh();
          if (now.signedIn && reading(groupsOf(now.videos, now.series)) === job.want) {
            localStorage.removeItem(ORGANIZE_KEY);
            setDraft(null);
            setDone(true);
            return setJob(null);
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

  const save = async () => {
    if (!draft || !changed) return;
    if (draft.some((g) => g.videos.length > 0 && !g.title.trim())) return setError("Give every collection a name.");
    setBusy(true);
    setError("");
    try {
      const layout = draft.map((g) => ({ ...(g.id ? { id: g.id } : {}), title: g.title.trim() || "Untitled", videos: g.videos.map((v) => v.slug) }));
      const res = await post("/admin/api/organize", { layout });
      const body = (await res.json()) as { id?: string; error?: string };
      if (!res.ok || !body.id) throw new Error(body.error ?? "Could not save the changes.");
      const started: OrganizeJob = { id: body.id, want: reading(draft), started: Date.now() };
      localStorage.setItem(ORGANIZE_KEY, JSON.stringify(started));
      setJob(started);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-10 pb-28">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xs font-bold tracking-[0.14em] text-clay uppercase">On the site now</h2>
        <button
          type="button"
          disabled={frozen}
          onClick={() => change([...groups, { key: `new-${Date.now()}`, title: "", videos: [] }])}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-bark/25 px-4 text-sm font-semibold transition-[background-color,opacity] duration-150 hover:bg-espresso/6 disabled:opacity-40"
        >
          <PlusIcon size={16} weight="bold" /> New collection
        </button>
      </div>
      <p className="mt-2 text-sm text-bark">Use the arrows to change the order. Nothing changes on the site until you save.</p>

      {groups.map((g, gi) => (
        <div key={g.key} className="mt-6 rounded-3xl bg-sand-light p-4 ring-1 ring-bark/10">
          <div className="flex items-center gap-2">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Collection name</span>
              <input
                value={g.title}
                disabled={frozen}
                maxLength={60}
                placeholder="Name this collection"
                onChange={(e) => change(groups.map((x, i) => (i === gi ? { ...x, title: e.target.value } : x)))}
                className="display h-11 w-full rounded-xl border border-transparent bg-transparent px-2 text-2xl text-espresso outline-none transition-[border-color,background-color] duration-150 placeholder:text-bark/40 hover:border-bark/20 focus:border-espresso focus:bg-bone"
              />
            </label>
            {groups.length > 1 && (
              <>
                <button type="button" aria-label={`Move ${g.title || "collection"} up`} disabled={frozen || gi === 0} onClick={() => change(swap(groups, gi, gi - 1))} className={small}>
                  <ArrowUpIcon size={16} weight="bold" />
                </button>
                <button type="button" aria-label={`Move ${g.title || "collection"} down`} disabled={frozen || gi === groups.length - 1} onClick={() => change(swap(groups, gi, gi + 1))} className={small}>
                  <ArrowDownIcon size={16} weight="bold" />
                </button>
              </>
            )}
          </div>

          {g.videos.length === 0 ? (
            <p className="px-2 py-4 text-sm text-bark">Empty. Move a video here with its “Move to” menu, or it will not be saved.</p>
          ) : (
            <ul className="mt-2 divide-y divide-bark/15 border-t border-bark/15">
              {g.videos.map((v, vi) => (
                <li key={v.src} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.poster} alt="" loading="lazy" className="aspect-[9/16] w-11 shrink-0 rounded-lg bg-ink object-cover" />
                  <span className="min-w-0 flex-1 basis-40">
                    <span className="block text-xs font-bold tracking-[0.14em] text-clay uppercase">
                      Part {vi + 1}
                      {(vi + 1 !== v.part || g.id !== v.series) && <span className="ml-2 text-bark/70 normal-case tracking-normal">was part {v.part}</span>}
                    </span>
                    <span className="display mt-0.5 block truncate text-2xl">{v.title}</span>
                    <span className="text-sm text-bark tabular-nums">{clock(v.seconds)}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {groups.length > 1 && (
                      <select
                        aria-label={`Move ${v.title} to another collection`}
                        disabled={frozen}
                        value=""
                        onChange={(e) => {
                          const to = e.target.value;
                          change(
                            groups.map((x, i) =>
                              i === gi ? { ...x, videos: x.videos.filter((y) => y !== v) } : x.key === to ? { ...x, videos: [...x.videos, v] } : x,
                            ),
                          );
                        }}
                        className="h-10 max-w-[8.5rem] rounded-full border border-bark/25 bg-transparent px-3 text-sm font-semibold text-espresso disabled:opacity-40"
                      >
                        <option value="">Move to…</option>
                        {groups.map((x, i) => i !== gi && (
                          <option key={x.key} value={x.key}>
                            {x.title.trim() || "New collection"}
                          </option>
                        ))}
                      </select>
                    )}
                    <button type="button" aria-label={`Move ${v.title} earlier`} disabled={frozen || vi === 0} onClick={() => change(inGroup(gi, swap(g.videos, vi, vi - 1)))} className={small}>
                      <ArrowUpIcon size={16} weight="bold" />
                    </button>
                    <button type="button" aria-label={`Move ${v.title} later`} disabled={frozen || vi === g.videos.length - 1} onClick={() => change(inGroup(gi, swap(g.videos, vi, vi + 1)))} className={small}>
                      <ArrowDownIcon size={16} weight="bold" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {error && (
        <p role="alert" className="mt-4 flex items-start gap-2 text-sm font-semibold text-[#9a2f1f]">
          <WarningIcon size={18} weight="bold" className="mt-0.5 shrink-0" /> {error}
        </p>
      )}
      {done && !draft && (
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-espresso">
          <CheckIcon size={18} weight="bold" /> Saved. The site shows the new arrangement.
        </p>
      )}

      {(draft !== null || job !== null) && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-bark/15 bg-sand-light/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-xl flex-wrap items-center gap-3">
            {job ? (
              <p className="flex items-center gap-3 text-sm text-bark">
                <span className="size-2 shrink-0 animate-pulse rounded-full bg-espresso" />
                <span>
                  <span className="block font-semibold text-espresso">Saving the new arrangement</span>
                  About 3 minutes. You can close this page.
                </span>
              </p>
            ) : (
              <>
                <p className="min-w-0 flex-1 basis-48 text-sm text-bark">
                  {changed ? "Saving renumbers the parts and redraws their covers. Links to videos that move will change." : "No changes yet."}
                </p>
                <button type="button" onClick={() => {
                    setError("");
                    setDraft(null);
                  }} disabled={busy} className="btn btn-secondary h-11 px-5 text-sm">
                  Discard
                </button>
                <button type="button" onClick={save} disabled={!changed || busy || locked || !session.ready} className="btn btn-primary h-11 px-5 text-sm disabled:opacity-50">
                  {busy ? "Saving…" : "Save changes"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
