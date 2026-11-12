# Malaadh Relief

Website for Malaadh Relief, a student-run humanitarian nonprofit carrying aid by hand to families and clinics in Sudan.

## Stack

Next.js 16 (App Router), Tailwind CSS v4, Motion, Phosphor Icons. Fonts: Bebas Neue, Manrope, Aref Ruqaa via `next/font`.

## Editing the site

- All copy, links, and video slots live in `src/lib/content.ts`.
- To add a video, set `video` on the relevant entry to one of:
  - `{ kind: "youtube", id: "VIDEO_ID" }`
  - `{ kind: "instagram", url: "https://www.instagram.com/reel/..." }`
  - `{ kind: "file", src: "/videos/clip.mp4", poster: "/videos/clip.jpg" }` (put files in `public/videos/`)
- Brand assets (logo layers as SVG + PNG) are in `public/brand/`.
- Donate button opens a placeholder modal until a payment link exists. Swap `openDonate` for a link in `Nav.tsx`, `HeroClient.tsx`, and `DonateSection.tsx`.

## Run

```bash
pnpm install
pnpm dev
```
