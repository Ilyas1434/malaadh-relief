"use client";
import { useState } from "react";
import { PlayIcon } from "@phosphor-icons/react/dist/ssr";
import { Player } from "./Player";
import { clock, videos, type Video } from "@/lib/videos";

/**
 * A short run of videos played in one player, with the parts listed under it.
 * `files` are video file paths from videos.json, in playing order. Files are used
 * instead of part numbers because part numbers change when videos are rearranged.
 */
export function Journey({ files }: { files: string[] }) {
  const list = files.map((f) => videos.find((v) => v.src === f)).filter((v): v is Video => Boolean(v));
  const [current, setCurrent] = useState<Video | undefined>(list[0]);
  const [autoPlay, setAutoPlay] = useState(false);
  if (!current) return null;

  const play = (v: Video) => {
    setCurrent(v);
    setAutoPlay(true);
  };
  const next = list[list.indexOf(current) + 1];

  return (
    <div>
      <Player
        key={current.slug}
        src={current.src}
        poster={current.poster}
        title={current.title}
        eyebrow={`Part ${current.part}`}
        seconds={current.seconds}
        autoPlay={autoPlay}
        next={next && { label: `Part ${next.part}`, title: next.title, onSelect: () => play(next) }}
        className="shadow-[0_30px_80px_-40px_rgba(43,29,20,0.7)]"
      />
      {list.length > 1 && (
        <ol className="mt-4 divide-y divide-bark/15 border-y border-bark/15">
          {list.map((v) => {
            const on = v.slug === current.slug;
            return (
              <li key={v.slug}>
                <button
                  type="button"
                  onClick={() => play(v)}
                  aria-current={on || undefined}
                  className="group flex w-full items-center gap-3 py-2.5 text-left transition-colors duration-150 active:bg-espresso/5"
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full transition-colors duration-150 ${
                      on ? "bg-espresso text-sand-light" : "border border-bark/25 text-espresso group-hover:bg-espresso group-hover:text-sand-light"
                    }`}
                  >
                    <PlayIcon size={12} weight="fill" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.7rem] font-bold tracking-[0.14em] text-clay uppercase">Part {v.part}</span>
                    <span className="display block truncate text-xl text-espresso">{v.title}</span>
                  </span>
                  <span className="text-sm font-semibold text-bark tabular-nums">{clock(v.seconds)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
