#!/usr/bin/env node
// Rearrange the videos: change their order, move them between collections, rename or
// reorder collections, and start new ones.
//
//   pnpm video:organize '<layout>'      or      pnpm video:organize layout.json
//
// The layout lists every collection in order, and inside each one every video's current
// slug in the order it should play:
//
//   [{ "id": "sudan-2026", "title": "Sudan, June 2026", "videos": ["part-4", "part-1", "part-2", "part-3"] },
//    { "title": "Behind the scenes", "videos": [] }]
//
// Leave out "id" for a new collection. Collections left empty are dropped. Parts are
// renumbered from 1 in each collection, each video's address follows its new number, and
// covers that show a part number are redrawn. The admin portal runs this through the
// "Organize videos" job.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const listPath = join(root, "src/lib/videos.json");
const stop = (message) => {
  console.error(message);
  process.exit(1);
};

const given = process.env.VIDEO_LAYOUT || process.argv[2] || "";
let layout;
try {
  layout = JSON.parse(given.trim().startsWith("[") ? given : readFileSync(given, "utf8"));
} catch {
  stop("Give the layout as JSON, or as the path of a JSON file.");
}

const list = JSON.parse(readFileSync(listPath, "utf8"));
const bySlug = new Map(list.videos.map((v) => [v.slug, v]));
const known = new Map(list.series.map((s) => [s.id, s]));
const clean = (text) => String(text ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();

if (!Array.isArray(layout) || layout.length === 0 || layout.length > 50) stop("The layout must be a list of collections.");
const seen = new Set();
const ids = new Set();
for (const c of layout) {
  c.title = clean(c?.title);
  if (c.title.length < 1 || c.title.length > 60) stop("Every collection needs a name of up to 60 characters.");
  if (c.id !== undefined && !known.has(c.id)) stop(`There is no collection "${c.id}".`);
  if (c.id !== undefined && ids.has(c.id)) stop(`Collection "${c.id}" is listed twice.`);
  if (c.id !== undefined) ids.add(c.id);
  if (!Array.isArray(c.videos)) stop("Every collection needs a list of videos.");
  for (const slug of c.videos) {
    if (!bySlug.has(slug) || seen.has(slug)) stop(`The videos have changed since this was arranged ("${slug}"). Reload and try again.`);
    seen.add(slug);
  }
}
if (seen.size !== list.videos.length) stop("The layout must name every video once. Current videos: " + [...bySlug.keys()].join(","));

// New collections get an id made from their name.
for (const c of layout.filter((c) => c.id === undefined && c.videos.length > 0)) {
  const base = c.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "collection";
  let id = base;
  for (let n = 2; ids.has(id) || known.has(id); n++) id = `${base}-${n}`;
  c.id = id;
  ids.add(id);
}
const kept = layout.filter((c) => c.videos.length > 0);

const before = JSON.stringify(list);
const taken = new Set();
const stale = [];
const next = [];
for (const c of kept) {
  c.videos.forEach((old, i) => {
    const v = bySlug.get(old);
    const part = i + 1;
    let slug = `part-${part}`;
    if (taken.has(slug)) slug = `${c.id}-part-${part}`;
    taken.add(slug);
    next.push({ v, part, slug, series: c.id, redraw: part !== v.part || slug !== v.slug });
  });
}
// Drawn covers carry the old part number and name, so they go before anything is renamed.
for (const n of next) {
  if (n.redraw && n.v.poster.startsWith("/videos/covers/")) stale.push(join(root, "public", n.v.poster));
}
for (const { v, part, slug, series } of next) Object.assign(v, { part, slug, series });
list.series = kept.map((c) => ({ id: c.id, title: c.title }));
list.videos = next.map((n) => n.v);

if (JSON.stringify(list) === before) {
  console.log("Nothing to change.");
  process.exit(0);
}
for (const file of stale) rmSync(file, { force: true });
writeFileSync(listPath, JSON.stringify(list, null, 2) + "\n");

if (stale.length) execFileSync("node", [join(root, "scripts/video-covers/build.mjs")], { stdio: "inherit" });
const after = JSON.parse(readFileSync(listPath, "utf8"));
const missing = after.videos.filter((v) => !existsSync(join(root, "public", v.poster)));
if (missing.length) stop("No cover for: " + missing.map((v) => v.slug).join(", "));
for (const s of after.series) {
  console.log(s.title);
  for (const v of after.videos.filter((x) => x.series === s.id)) console.log(`  Part ${v.part}: ${v.title}  /watch/${v.slug}`);
}
