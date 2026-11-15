import data from "./videos.json";

/**
 * Ryan's videos. The list lives in videos.json, oldest first, so that
 * `pnpm video:add` can append to it. The last entry is the latest.
 */
export type Video = {
  slug: string;
  series: string;
  part: number;
  title: string;
  seconds: number;
  src: string;
  poster: string;
};
export type Series = { id: string; title: string };

export const series: Series[] = data.series;
export const videos: Video[] = data.videos;

/** Newest first. */
export const newestFirst: Video[] = [...videos].reverse();

/** The video that follows this one in its series, if there is one yet. */
export function nextVideo(v: Video): Video | undefined {
  return videos.find((x) => x.series === v.series && x.part === v.part + 1);
}

export function clock(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
