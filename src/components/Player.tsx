"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowClockwiseIcon,
  CornersOutIcon,
  PauseIcon,
  PlayIcon,
  SkipForwardIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
} from "@phosphor-icons/react/dist/ssr";
import { clock } from "@/lib/videos";

// Only one video plays at a time across the page.
let nowPlaying: HTMLVideoElement | null = null;

type Status = "idle" | "playing" | "paused" | "ended";

/**
 * The site's video player: a poster with one play button, then a quiet set of
 * controls (play, scrub, mute, fullscreen) that fade away while the video runs.
 * Give it a new `key` to switch videos.
 */
export function Player({
  src,
  poster,
  title,
  eyebrow,
  seconds,
  autoPlay = false,
  next,
  className = "",
}: {
  src: string;
  poster?: string;
  title: string;
  /** Small line above the title, such as "Latest · Part 3". */
  eyebrow?: string;
  /** Length in seconds, shown before the video has loaded. */
  seconds?: number;
  autoPlay?: boolean;
  /** Offered on the end card. */
  next?: { label: string; title: string; onSelect: () => void };
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const time = useRef<HTMLSpanElement>(null);
  const hideTimer = useRef(0);
  const [status, setStatus] = useState<Status>("idle");
  const [muted, setMuted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [controls, setControls] = useState(true);

  const length = () => {
    const d = video.current?.duration;
    return d && Number.isFinite(d) ? d : (seconds ?? 0);
  };

  const paint = () => {
    const v = video.current;
    if (!v) return;
    const total = length();
    if (fill.current) fill.current.style.transform = `scaleX(${total ? Math.min(1, v.currentTime / total) : 0})`;
    if (time.current) time.current.textContent = `${clock(v.currentTime)} / ${clock(total)}`;
  };

  // While playing, repaint the progress bar every frame so it moves smoothly.
  useEffect(() => {
    if (status !== "playing") return;
    let frame = 0;
    const tick = () => {
      paint();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    const v = video.current;
    if (autoPlay && v) v.play().catch(() => {});
    return () => {
      window.clearTimeout(hideTimer.current);
      if (nowPlaying === v) nowPlaying = null;
    };
  }, [autoPlay]);

  // Show the controls, then let them fade once the video has run untouched for a moment.
  const wake = () => {
    setControls(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (video.current && !video.current.paused) setControls(false);
    }, 2200);
  };

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused || v.ended) v.play().catch(() => {});
    else v.pause();
  };

  const seekTo = (clientX: number, bar: HTMLElement) => {
    const v = video.current;
    const total = length();
    if (!v || !total) return;
    const r = bar.getBoundingClientRect();
    v.currentTime = Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * total;
    paint();
  };

  const fullscreen = () => {
    const el = box.current;
    const v = video.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!el || !v) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else v.webkitEnterFullscreen?.(); // iPhone Safari only lets the video itself go fullscreen
  };

  const started = status !== "idle";
  const showControls = started && status !== "ended" && (controls || status === "paused");
  const button =
    "grid size-10 place-items-center rounded-full text-sand-light transition-[background-color,transform] duration-150 hover:bg-sand-light/15 active:scale-95";

  return (
    <div
      ref={box}
      role="group"
      aria-label={title}
      tabIndex={0}
      onPointerMove={() => status === "playing" && wake()}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).closest("button") && (e.key === " " || e.key === "Enter")) return;
        const v = video.current;
        if (!v) return;
        if (e.key === " " || e.key === "k") toggle();
        else if (e.key === "ArrowRight") v.currentTime = Math.min(length(), v.currentTime + 5);
        else if (e.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - 5);
        else if (e.key === "m") v.muted = !v.muted;
        else if (e.key === "f") fullscreen();
        else return;
        e.preventDefault();
        e.stopPropagation();
        paint();
        wake();
      }}
      className={`group/player relative isolate aspect-[9/16] overflow-hidden rounded-2xl bg-ink outline-none select-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 focus-visible:ring-offset-sand [&:fullscreen]:rounded-none [&:fullscreen_video]:object-contain ${className}`}
    >
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        playsInline
        preload="none"
        onClick={() => {
          // On a touch screen the first tap only brings the controls back.
          if (status === "playing" && !controls) wake();
          else toggle();
        }}
        onPlay={(e) => {
          if (nowPlaying && nowPlaying !== e.currentTarget) nowPlaying.pause();
          nowPlaying = e.currentTarget;
          setStatus("playing");
          wake();
        }}
        onPause={(e) => {
          if (!e.currentTarget.ended) setStatus("paused");
          setControls(true);
        }}
        onEnded={() => {
          setStatus("ended");
          if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        }}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onLoadedMetadata={paint}
        onSeeked={paint}
      />

      {/* Before it starts: a poster, the title, and one play button. */}
      <div
        className={`pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/10 to-ink/25 p-5 transition-opacity duration-300 ${
          started ? "opacity-0" : "opacity-100"
        }`}
      >
        {seconds ? (
          <span className="absolute top-4 right-4 rounded-full bg-ink/60 px-2.5 py-1 text-xs font-semibold text-sand-light tabular-nums backdrop-blur-sm">
            {clock(seconds)}
          </span>
        ) : null}
        {eyebrow && <p className="text-xs font-bold tracking-[0.14em] text-sand uppercase">{eyebrow}</p>}
        <p className="display mt-1 text-3xl leading-[1.05] text-sand-light">{title}</p>
      </div>
      {!started && (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Play ${title}`}
          className="absolute top-1/2 left-1/2 grid size-[4.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-sand-light text-espresso shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover/player:scale-105 active:scale-95"
        >
          <PlayIcon size={26} weight="fill" className="translate-x-[1px]" />
        </button>
      )}

      {waiting && status === "playing" && (
        <span className="pointer-events-none absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-sand-light/25 border-t-sand-light" />
      )}

      {/* While it runs: play, scrub, mute, fullscreen. */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-3 pt-10 pb-2 transition-opacity duration-200 ${
          showControls ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(seconds ?? 0)}
          aria-valuenow={0}
          tabIndex={-1}
          className="group/bar flex h-5 cursor-pointer touch-none items-center px-1"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            seekTo(e.clientX, e.currentTarget);
            wake();
          }}
          onPointerMove={(e) => {
            if (e.buttons || e.pointerType === "touch") {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) seekTo(e.clientX, e.currentTarget);
            }
          }}
        >
          <div className="h-1 w-full overflow-hidden rounded-full bg-sand-light/25 transition-[height] duration-150 group-hover/bar:h-1.5">
            <div ref={fill} className="h-full origin-left scale-x-0 rounded-full bg-sand-light" />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={toggle} aria-label={status === "playing" ? "Pause" : "Play"} className={button}>
            {status === "playing" ? <PauseIcon size={20} weight="fill" /> : <PlayIcon size={20} weight="fill" />}
          </button>
          <span ref={time} className="ml-1 text-xs font-semibold text-sand-light/90 tabular-nums">
            0:00 / {clock(seconds ?? 0)}
          </span>
          <button
            type="button"
            onClick={() => {
              if (video.current) video.current.muted = !video.current.muted;
            }}
            aria-label={muted ? "Unmute" : "Mute"}
            className={`${button} ml-auto`}
          >
            {muted ? <SpeakerSlashIcon size={20} weight="fill" /> : <SpeakerHighIcon size={20} weight="fill" />}
          </button>
          <button type="button" onClick={fullscreen} aria-label="Fullscreen" className={button}>
            <CornersOutIcon size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* After it ends: watch again, or go on to the next part. */}
      {status === "ended" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/75 p-6 text-center backdrop-blur-sm">
          {next && (
            <>
              <p className="text-xs font-bold tracking-[0.14em] text-sand/80 uppercase">Up next · {next.label}</p>
              <p className="display text-3xl leading-[1.05] text-sand-light">{next.title}</p>
              <button type="button" onClick={next.onSelect} className="btn btn-on-dark mt-2">
                <SkipForwardIcon size={18} weight="fill" /> Play next
              </button>
            </>
          )}
          <button type="button" onClick={toggle} className={`btn ${next ? "btn-ghost-on-dark" : "btn-on-dark"}`}>
            <ArrowClockwiseIcon size={18} weight="bold" /> Watch again
          </button>
        </div>
      )}
    </div>
  );
}
