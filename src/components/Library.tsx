"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, LinkIcon, PlayIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { Player } from "./Player";
import { clock, series, videos, type Video } from "@/lib/videos";

const pathFor = (v: Video | null) => (v ? `/watch/${v.slug}` : "/watch");
const fromPath = () => videos.find((v) => window.location.pathname === pathFor(v)) ?? null;

/**
 * Every video, grouped by trip. Picking one opens it over the page. Each video has
 * its own address (/watch/part-3), so the browser's back button and shared links work.
 */
export function Library({ open: initial }: { open: string | null }) {
  const [open, setOpen] = useState<Video | null>(() => videos.find((v) => v.slug === initial) ?? null);
  // Only start playing by itself after a tap, never on a page that opened straight to a video.
  const [autoPlay, setAutoPlay] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);

  const show = useCallback((v: Video | null, how: "push" | "replace" = "push") => {
    setOpen(v);
    setAutoPlay(true);
    setCopied(false);
    window.history[how === "push" ? "pushState" : "replaceState"](null, "", pathFor(v));
  }, []);

  const index = open ? videos.indexOf(open) : -1;
  const older = index > 0 ? videos[index - 1] : null;
  const newer = index >= 0 && index < videos.length - 1 ? videos[index + 1] : null;

  useEffect(() => {
    const sync = () => setOpen(fromPath());
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const keys = (e: KeyboardEvent) => {
      if (e.key === "Escape") show(null);
      else if (e.key === "ArrowLeft" && older) show(older, "replace");
      else if (e.key === "ArrowRight" && newer) show(newer, "replace");
    };
    window.addEventListener("keydown", keys);
    return () => {
      document.body.style.overflow = before;
      window.removeEventListener("keydown", keys);
    };
  }, [open, older, newer, show]);

  const round =
    "grid size-11 place-items-center rounded-full border border-sand/25 text-sand-light transition-[background-color,transform,opacity] duration-150 hover:bg-sand/10 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <>
      <div className="space-y-16">
        {series.map((s) => {
          const parts = videos.filter((v) => v.series === s.id);
          if (parts.length === 0) return null;
          return (
            <section key={s.id}>
              <div className="flex items-baseline justify-between border-b border-bark/15 pb-3">
                <h2 className="display text-3xl text-espresso md:text-4xl">{s.title}</h2>
                <p className="text-sm font-semibold text-bark">
                  {parts.length} {parts.length === 1 ? "part" : "parts"}
                </p>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
                {parts.map((v) => (
                  <li key={v.slug}>
                    <a
                      href={pathFor(v)}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                        e.preventDefault();
                        show(v);
                      }}
                      className="group block"
                    >
                      <span className="relative block aspect-[9/16] overflow-hidden rounded-2xl bg-ink">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={v.poster}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-out-strong)] group-hover:scale-[1.04]"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent via-35% to-transparent" />
                        <span className="absolute right-3 bottom-3 rounded-full bg-ink/60 px-2 py-0.5 text-xs font-semibold text-sand-light tabular-nums backdrop-blur-sm">
                          {clock(v.seconds)}
                        </span>
                        <span className="absolute bottom-3 left-3 grid size-9 place-items-center rounded-full bg-sand-light text-espresso transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:scale-110">
                          <PlayIcon size={14} weight="fill" className="translate-x-[0.5px]" />
                        </span>
                      </span>
                      <span className="mt-3 block text-xs font-bold tracking-[0.14em] text-clay uppercase">Part {v.part}</span>
                      <span className="display mt-0.5 block text-2xl leading-[1.05] text-espresso">{v.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label={`Part ${open.part}: ${open.title}`}
            tabIndex={-1}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-ink/92 p-4 outline-none backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => {
              if (e.target === e.currentTarget) show(null);
            }}
          >
            <button type="button" onClick={() => show(null)} aria-label="Close" className={`${round} absolute top-4 right-4`}>
              <XIcon size={20} weight="bold" />
            </button>
            <motion.div
              className="w-[min(100%,calc((100dvh-11rem)*9/16))]"
              initial={{ transform: "scale(0.96)" }}
              animate={{ transform: "scale(1)" }}
              exit={{ transform: "scale(0.98)" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Player
                key={open.slug}
                src={open.src}
                poster={open.poster}
                title={open.title}
                eyebrow={`Part ${open.part}`}
                seconds={open.seconds}
                autoPlay={autoPlay}
                next={newer ? { label: `Part ${newer.part}`, title: newer.title, onSelect: () => show(newer, "replace") } : undefined}
              />
            </motion.div>
            <div className="flex w-[min(100%,26rem)] items-center gap-3">
              <button type="button" onClick={() => older && show(older, "replace")} disabled={!older} aria-label="Previous part" className={round}>
                <ArrowLeftIcon size={20} weight="bold" />
              </button>
              <div className="min-w-0 flex-1 text-center">
                <p className="text-xs font-bold tracking-[0.14em] text-clay uppercase">
                  Part {open.part} of {videos.filter((v) => v.series === open.series).length}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href).then(() => setCopied(true), () => {});
                  }}
                  className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-sand/85 transition-colors hover:text-sand-light"
                >
                  {copied ? <CheckIcon size={16} weight="bold" /> : <LinkIcon size={16} weight="bold" />}
                  {copied ? "Link copied" : "Copy link"}
                </button>
              </div>
              <button type="button" onClick={() => newer && show(newer, "replace")} disabled={!newer} aria-label="Next part" className={round}>
                <ArrowRightIcon size={20} weight="bold" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
