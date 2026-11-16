import data from "./videos.json";

/**
 * Ryan's videos. The list lives in videos.json in playing order. `pnpm video:add` appends
 * to it and `pnpm video:organize` rearranges it.
 */
export type Video = {
  slug: string;
  series: string;
  part: number;
  title: string;
  seconds: number;
  src: string;
  poster: string;
  /** Date it went up on the site, YYYY-MM-DD. Search engines need it to list the video. */
  published?: string;
  /** Which cover design it uses (scripts/video-covers). Stays with the video when the order changes. */
  look?: number;
};
export type Series = { id: string; title: string };

export const series: Series[] = data.series;
export const videos: Video[] = data.videos;

/** Newest upload first. Videos put up on the same day keep their order in the list, last one first. */
export const newestFirst: Video[] = videos
  .map((v, i) => ({ v, i }))
  .sort((a, b) => (b.v.published ?? "").localeCompare(a.v.published ?? "") || b.i - a.i)
  .map((x) => x.v);

/** The video that follows this one in its series, if there is one yet. */
export function nextVideo(v: Video): Video | undefined {
  return videos.find((x) => x.series === v.series && x.part === v.part + 1);
}

export function clock(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
