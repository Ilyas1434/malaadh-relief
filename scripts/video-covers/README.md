# Video covers

Each video gets a cover in the look of Ryan's own title cards: a flat colour, her character,
and the part number in tall capitals.

- `art/` holds the drawings used on covers. The poses are hers, cut from
  `scripts/ryan-cameo/frames`. `sudan-map.png` is her hand-drawn map, lifted from a frame of
  part 4.
- `build.mjs` draws the covers (`pnpm video:covers`, or `--all` to redraw every one). `LOOKS`
  lists the colour and pose combinations and `CHOSEN` says which video uses which. A video
  not listed there takes the next look in turn.
- `cut_art.py` rebuilds `art/` if her drawings change:

```bash
python3 scripts/video-covers/cut_art.py scripts/ryan-cameo/frames scripts/video-covers/art path/to/map-frame.png
```

The colours are the ones she uses: the dark and light grey she draws on, and the pale
yellow and blue she fills her maps with.
