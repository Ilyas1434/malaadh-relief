#!/usr/bin/env node
// Draw a cover for every video, in the look of Ryan's own title cards: a flat colour,
// her character, and the part number in tall white or black capitals.
//
//   pnpm video:covers            draw the covers that are missing
//   pnpm video:covers --all      redraw every cover
//
// Each cover is a small web page photographed by Google Chrome, so Chrome must be
// installed. The result goes to public/videos/covers/<slug>.jpg and becomes that video's
// poster in src/lib/videos.json.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");
const listPath = join(root, "src/lib/videos.json");
const outDir = join(root, "public/videos/covers");
const art = (name) => pathToFileURL(join(here, "art", `${name}.png`)).href;
// Chrome on a Mac, or on the Linux machine that runs the "Add video" job.
const CHROME = [process.env.CHROME_PATH, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium-browser", "/usr/bin/chromium"].find(
  (path) => path && existsSync(path),
);

// The colours are hers: the two greys she draws on, and the yellow and blue she fills
// her maps with. `pose` is a drawing in art/. `css` places it on a 360 x 640 card, clear
// of the play button in the middle. `extra` adds another drawing.
const LOOKS = [
  { bg: "#454545", ink: "#ffffff", pose: "grin", css: "bottom:0;left:1px;width:302px" },
  { bg: "#cacaca", ink: "#0a0a0a", pose: "lean-wave", css: "bottom:-34px;left:0;width:204px" },
  { bg: "#d0f8f8", ink: "#0a0a0a", pose: "squint", css: "bottom:0;left:-78px;width:432px" },
  {
    bg: "#f8f0b8",
    ink: "#0a0a0a",
    pose: "thumb",
    css: "bottom:0;left:1px;width:302px",
    extra: { art: "sudan-map", css: "top:172px;right:18px;width:132px;transform:rotate(-5deg)" },
  },
];
// A video keeps the look listed here. Any other video takes the next look in turn.
const CHOSEN = { "part-1": 0, "part-2": 1, "part-3": 2, "part-4": 3 };

const page = (video, index) => {
  const look = LOOKS[CHOSEN[video.slug] ?? index % LOOKS.length];
  return `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=block">
<style>
  html, body { margin: 0; }
  body { position: relative; width: 360px; height: 640px; overflow: hidden; background: ${look.bg}; }
  h1 { position: absolute; inset: 58px 0 auto; margin: 0; text-align: center; font: 400 116px/1 "Bebas Neue", sans-serif;
       letter-spacing: 0.02em; color: ${look.ink}; }
  img { position: absolute; }
</style>
<h1>PART ${video.part}</h1>
${look.extra ? `<img src="${art(look.extra.art)}" style="${look.extra.css}">` : ""}
<img src="${art(look.pose)}" style="${look.css}">`;
};

const list = JSON.parse(readFileSync(listPath, "utf8"));
const all = process.argv.includes("--all");
const jobs = list.videos
  .map((video, index) => ({ video, index, file: join(outDir, `${video.slug}.jpg`) }))
  .filter((j) => all || !existsSync(j.file));
if (jobs.length === 0) {
  console.log("Every video already has a cover. Use --all to redraw them.");
  process.exit(0);
}
if (!CHROME) {
  console.error("Google Chrome is needed to draw the covers.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const scratch = mkdtempSync(join(tmpdir(), "malaadh-covers-"));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${join(scratch, "profile")}`, "--hide-scrollbars", "--no-first-run", ...(process.env.CI ? ["--no-sandbox"] : []), "about:blank"], {
  stdio: "ignore",
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    try {
      target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page");
    } catch {}
  }
  if (!target) throw new Error("Chrome did not start.");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const waiting = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    waiting.get(msg.id)?.(msg.result ?? {});
    waiting.delete(msg.id);
  };
  const send = (method, params = {}) => new Promise((r) => (waiting.set(++id, r), ws.send(JSON.stringify({ id, method, params }))));
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 360, height: 640, deviceScaleFactor: 2, mobile: false });
  for (const { video, index, file } of jobs) {
    const html = join(scratch, `${video.slug}.html`);
    writeFileSync(html, page(video, index));
    await send("Page.navigate", { url: pathToFileURL(html).href });
    await sleep(400);
    await send("Runtime.evaluate", {
      expression: "Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.decode().catch(() => {}))]).then(() => document.fonts.check('116px \"Bebas Neue\"'))",
      awaitPromise: true,
    });
    await sleep(150);
    const { data } = await send("Page.captureScreenshot", { format: "jpeg", quality: 88 });
    writeFileSync(file, Buffer.from(data, "base64"));
    video.poster = `/videos/covers/${video.slug}.jpg`;
    console.log(`Cover for part ${video.part}: public/videos/covers/${video.slug}.jpg`);
  }
  ws.close();
} finally {
  chrome.kill();
  await new Promise((r) => chrome.once("exit", r));
  // Chrome can still be writing its profile for a moment after it exits.
  rmSync(scratch, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
writeFileSync(listPath, JSON.stringify(list, null, 2) + "\n");
