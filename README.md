# Malaadh Relief

Website for Malaadh Relief, a student-run humanitarian nonprofit carrying aid by hand to families and clinics in Sudan.

## Stack

Next.js 16 (App Router), Tailwind CSS v4, Motion, Phosphor Icons. Fonts: Bebas Neue, Manrope, Aref Ruqaa via `next/font`.

## Editing the site

- All copy, links, and video slots live in `src/lib/content.ts`.
- To add one of Ryan's videos, run `pnpm video:add path/to/video.mp4 "Title"`, then commit and push. It shrinks the file, makes a poster, and adds the entry to `src/lib/videos.json`. The newest video becomes "Latest" on the home page and joins the library at `/watch`. Needs ffmpeg.
  - Start a new trip with `--series sudan-2027 --series-title "Sudan, 2027"`.
  - Pick a different poster frame with `--poster-at 12` (seconds).
- The other video slots (program pages, the trip page) take a `video` in `src/lib/content.ts`:
  - `{ kind: "instagram", url: "https://www.instagram.com/reel/..." }`
  - `{ kind: "file", src: "/videos/clip.mp4", poster: "/videos/clip.jpg" }`
- Brand assets (logo layers as SVG + PNG) are in `public/brand/`.
- Donate button opens a placeholder modal until a payment link exists. Swap `openDonate` for a link in `Nav.tsx`, `HeroClient.tsx`, and `DonateSection.tsx`.

## Run

```bash
pnpm install
pnpm dev
```
