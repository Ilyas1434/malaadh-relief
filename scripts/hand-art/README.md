# Hero hand artwork

The logo's calligraphy covers the fingertips of both hands, so the hands cannot be lifted
straight out of `public/brand/logo-original.jpg`. These scripts rebuild one complete hand:

1. `build_hands.py` keeps the part of the left hand the logo shows cleanly (arm, back of hand,
   thumb, index), erases everything under the ink and its shadow, redraws the three covered
   fingers along the tips that are still visible (`hand.json`), and runs the forearm on past
   the image edge.
2. `smooth.py` smooths the outline along its contour (heavier on the arm, lighter on the fingers).
3. `trace.py` traces the result with potrace. The right hand is the same drawing turned 180 degrees.

```bash
python3 scripts/hand-art/build_hands.py public/brand/logo-original.jpg /tmp/hand-mask.png scripts/hand-art/hand.json
python3 scripts/hand-art/smooth.py /tmp/hand-mask.png /tmp/hand-smooth.png
python3 scripts/hand-art/trace.py /tmp/hand-smooth.png public/brand/hand-left.svg no
python3 scripts/hand-art/trace.py /tmp/hand-smooth.png public/brand/hand-right.svg rot
```

Needs Pillow, NumPy, SciPy, contourpy and the `potrace` CLI. The canvas is 420 x 415 logo
pixels with its origin at (-120, -80); `HeroClient.tsx` relies on those numbers.
