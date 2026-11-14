# Ryan's cameo character

The little niqab character that drops in around the site is Ryan's own artwork. `frames/`
holds the drawings she sent, untouched:

- `frames/bottom/` (16 drawings): she comes up from below a ledge, gives a thumbs up, points,
  peeks, and waves. These are the drawings from her "We're flying to Sudan" video.
- `frames/side/` (8 drawings): she leans in from the side, swings an arm out, and waves.

`build_sprites.py` cuts her out of the grey canvas, adds the pale sticker outline, and packs
each set into one sprite sheet in `public/ryan/`.

```bash
python3 scripts/ryan-cameo/build_sprites.py scripts/ryan-cameo/frames/bottom public/ryan/rise.webp 480 13 4
python3 scripts/ryan-cameo/build_sprites.py scripts/ryan-cameo/frames/side public/ryan/peek.webp 420 18 4
```

The arguments are frame width in pixels, outline thickness in source pixels, and columns.
The script prints the frame size and gap. If they change, update `RISE` and `PEEK` in
`src/components/Cameo.tsx`. Needs Pillow, NumPy and SciPy.

## Adding drawings

Drop new JPGs into a `frames/` folder, on the same canvas and in the same position as the
others, then rebuild. Files are packed in name order, so a new file at the end keeps the
existing frame numbers. Name the new frame in `Cameo.tsx` and use it in an act.

## Timing

The acts in `Cameo.tsx` copy the timing of her videos: one drawing every 0.1 seconds with
long holds on the main poses, then sped up a little (`SPEED`). Nothing slides or fades. Motion comes only from one drawing
replacing the next.
