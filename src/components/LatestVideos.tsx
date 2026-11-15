"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, PlayIcon } from "@phosphor-icons/react/dist/ssr";
import { Player } from "./Player";
import { Cameo } from "./Cameo";
import { clock, newestFirst, nextVideo, type Video } from "@/lib/videos";

const SHOWN = 3;

/**
 * The latest video in a large player, with the most recent parts listed beside it.
 * Picking a part from the list plays it in the same player. Both halves are grid
 * children of the Follow section, so they render as a fragment.
 */
export function LatestVideos() {
  const latest = newestFirst[0];
  const [current, setCurrent] = useState<Video>(latest);
  const [autoPlay, setAutoPlay] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  if (!latest) return null;

  const play = (v: Video) => {
    setCurrent(v);
    setAutoPlay(true);
    // On a phone the player sits above the list, so bring it back into view.
    const r = stage.current?.getBoundingClientRect();
    if (r && (r.top < 0 || r.bottom > window.innerHeight)) stage.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  const next = nextVideo(current);

  return (
    <>
      <div ref={stage} className="relative mx-auto mt-10 w-full max-w-[20rem] md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0 md:max-w-none">
        {/* She peeks over the top of a video she is in. */}
        <Cameo act="peekWave" side="right" say="Wait, that's me!" size="w-[clamp(8.5rem,34vw,11rem)]" place="bottom-full right-[4%]" />
        <Player
          key={current.slug}
          src={current.src}
          poster={current.poster}
          title={current.title}
          eyebrow={current === latest ? `Latest · Part ${current.part}` : `Part ${current.part}`}
          seconds={current.seconds}
          autoPlay={autoPlay}
          next={next && { label: `Part ${next.part}`, title: next.title, onSelect: () => play(next) }}
          className="shadow-[0_30px_80px_-40px_rgba(43,29,20,0.7)]"
        />
      </div>

      <div className="md:col-start-1 md:row-start-2 md:self-start">
        <p className="text-xs font-bold tracking-[0.14em] text-clay uppercase">Latest parts</p>
        <ol className="mt-3 divide-y divide-bark/15 border-y border-bark/15">
          {newestFirst.slice(0, SHOWN).map((v) => {
            const on = v.slug === current.slug;
            return (
              <li key={v.slug}>
                <button
                  type="button"
                  onClick={() => play(v)}
                  aria-current={on || undefined}
                  className="group flex w-full items-center gap-4 py-3 text-left transition-colors duration-150 active:bg-espresso/5"
                >
                  <span className="relative block aspect-[9/16] w-12 shrink-0 overflow-hidden rounded-lg bg-ink">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
                    <span
                      className={`absolute inset-0 grid place-items-center bg-ink/45 text-sand-light transition-opacity duration-150 ${
                        on ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <PlayIcon size={16} weight="fill" />
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold tracking-[0.14em] text-clay uppercase">
                      Part {v.part}
                      {on && <span className="text-bark/70"> · Now showing</span>}
                    </span>
                    <span className="display mt-0.5 block truncate text-2xl text-espresso">{v.title}</span>
                  </span>
                  <span className="text-sm font-semibold text-bark tabular-nums">{clock(v.seconds)}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <Link href="/watch" className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-espresso">
          See all videos
          <ArrowRightIcon size={18} weight="bold" className="text-clay transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1" />
        </Link>
      </div>
    </>
  );
}
