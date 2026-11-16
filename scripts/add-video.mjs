#!/usr/bin/env node
// Add one of Ryan's videos to the site.
//
//   pnpm video:add <file-or-link> "Title" [--series <id>] [--series-title "Name"] [--poster-at <seconds>]
//
// It shrinks the video for the web, draws its cover, measures the length, and adds
// the entry to src/lib/videos.json. The new video becomes "Latest" on the home page and
// joins the library at /watch. Nothing else needs editing.
//
// Give it the video file when you can. A link also works (it is fetched with yt-dlp),
// but only for videos that are public or unlisted, and the download sometimes fails.
// Needs ffmpeg and ffprobe.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const listPath = join(root, "src/lib/videos.json");
const outDir = join(root, "public/videos");

const args = process.argv.slice(2);
const flags = {};
const rest = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) flags[args[i].slice(2)] = args[++i];
  else rest.push(args[i]);
}
const [input, title] = rest;
if (!input || !title) {
  console.error('Usage: pnpm video:add <file-or-link> "Title" [--series <id>] [--series-title "Name"] [--poster-at <seconds>]');
  process.exit(1);
}

const run = (cmd, a) => execFileSync(cmd, a, { stdio: ["ignore", "pipe", "inherit"] }).toString().trim();
for (const tool of ["ffmpeg", "ffprobe"]) {
  try {
    run(tool, ["-version"]);
  } catch {
    console.error(`${tool} is not installed. On a Mac: brew install ffmpeg`);
    process.exit(1);
  }
}

const list = JSON.parse(readFileSync(listPath, "utf8"));
const seriesId = flags.series ?? list.series.at(-1).id;
if (!list.series.some((s) => s.id === seriesId)) {
  if (!flags["series-title"]) {
    console.error(`"${seriesId}" is a new series. Name it with --series-title "Sudan, December 2026".`);
    process.exit(1);
  }
  list.series.push({ id: seriesId, title: flags["series-title"] });
}
const part = Math.max(0, ...list.videos.filter((v) => v.series === seriesId).map((v) => v.part)) + 1;
let slug = `part-${part}`;
if (list.videos.some((v) => v.slug === slug)) slug = `${seriesId}-part-${part}`;
const words = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").split("-").slice(0, 4).join("-");
const base = `${slug}-${words}`;
const mp4 = join(outDir, `${base}.mp4`);
const jpg = join(outDir, `${base}.jpg`);
if (existsSync(mp4)) {
  console.error(`${mp4} already exists.`);
  process.exit(1);
}

let source = input;
let scratch;
if (/^https?:\/\//.test(input)) {
  scratch = mkdtempSync(join(tmpdir(), "malaadh-video-"));
  console.log("Downloading…");
  execFileSync("yt-dlp", ["-q", "-f", "bv*[height<=1920]+ba/b", "--merge-output-format", "mp4", "-o", join(scratch, "source.%(ext)s"), input], {
    stdio: "inherit",
  });
  source = join(scratch, readdirSync(scratch)[0]);
} else if (!existsSync(input)) {
  console.error(`Cannot find ${input}`);
  process.exit(1);
}

console.log("Encoding…");
// 720 wide for an upright video, 1280 wide for a landscape one. Faststart lets it play before it has fully loaded.
run("ffmpeg", [
  "-v", "error", "-y", "-i", source,
  "-vf", "scale='if(gt(iw,ih),1280,720)':-2",
  "-c:v", "libx264", "-crf", "25", "-preset", "medium", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", mp4,
]);
const seconds = Math.round(Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4])));
if (scratch) rmSync(scratch, { recursive: true, force: true });

list.videos.push({ slug, series: seriesId, part, title, seconds, src: `/videos/${base}.mp4`, poster: "", published: new Date().toLocaleDateString("en-CA") });
writeFileSync(listPath, JSON.stringify(list, null, 2) + "\n");

// Draw its cover. If that fails (no Chrome, say), fall back to a frame from the video.
let poster = "";
try {
  execFileSync("node", [join(root, "scripts/video-covers/build.mjs")], { stdio: "inherit" });
  poster = JSON.parse(readFileSync(listPath, "utf8")).videos.at(-1).poster;
} catch {}
if (!poster) {
  const posterAt = flags["poster-at"] ?? String(Math.round(Math.min(15, seconds / 3)));
  run("ffmpeg", ["-v", "error", "-y", "-ss", posterAt, "-i", mp4, "-frames:v", "1", "-q:v", "4", jpg]);
  poster = `/videos/${base}.jpg`;
  const saved = JSON.parse(readFileSync(listPath, "utf8"));
  saved.videos.at(-1).poster = poster;
  writeFileSync(listPath, JSON.stringify(saved, null, 2) + "\n");
  console.log(`No cover drawn, so the poster is the frame at ${posterAt}s. Use --poster-at to pick another.`);
}

console.log(`Added part ${part}: "${title}" (${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")})`);
console.log(`  page    /watch/${slug}`);
console.log(`  poster  public${poster}`);
console.log("Commit and push to publish it.");
