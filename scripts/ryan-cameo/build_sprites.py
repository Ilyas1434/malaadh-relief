"""Build the sprite sheets for Ryan's cameo character.

usage: build_sprites.py <frames_dir> <out.webp> <frame_width> <outline_px> [cols]

Ryan draws each pose on a flat grey canvas. This script:
1. Un-mixes the black ink from the grey into alpha, so her motion smears stay see-through.
   Eye pixels keep their colour.
2. Crops every frame of a set to the same box, so the poses stay registered.
3. Adds a pale sticker outline so she reads on the dark sections too. The outline skips
   any edge where her drawing runs off the canvas.
4. Packs the frames into one grid and prints the numbers Cameo.tsx needs.
"""
import glob
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

OUTLINE = (251, 245, 236)  # --color-bone

src, out, frame_w, outline_px = sys.argv[1], sys.argv[2], int(sys.argv[3]), float(sys.argv[4])
cols = int(sys.argv[5]) if len(sys.argv) > 5 else 4

frames = []
for path in sorted(glob.glob(os.path.join(src, "*.jpg"))):
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    h, w, _ = im.shape
    bg = float(np.median(im[20:200, w - 200 : w - 20]))
    lum = im.mean(-1)
    coloured = (im.max(-1) - im.min(-1)) > 16
    alpha = np.clip((bg - lum - 7) / (bg - 12), 0, 1)
    alpha = np.where(coloured, 1.0, alpha)
    rgb = np.where(coloured[..., None], im, 0.0)
    frames.append((rgb, alpha))

h, w = frames[0][1].shape
union = np.zeros((h, w), bool)
for _, a in frames:
    union |= a > 0.08
ys, xs = np.where(union)
pad = int(outline_px) + 6
x0, y0 = max(xs.min() - pad, 0), max(ys.min() - pad, 0)
x1, y1 = min(xs.max() + pad, w), min(ys.max() + pad, h)
cw, ch = x1 - x0, y1 - y0
scale = frame_w / cw
frame_h = round(ch * scale)

rows = (len(frames) + cols - 1) // cols
# A clear gap between tiles, so a neighbour never bleeds in when a tile lands on a half pixel.
GAP = 8
sheet = Image.new("RGBA", (cols * frame_w + (cols - 1) * GAP, rows * frame_h + (rows - 1) * GAP), (0, 0, 0, 0))
for n, (rgb, alpha) in enumerate(frames):
    rgb, alpha = rgb[y0:y1, x0:x1], alpha[y0:y1, x0:x1].copy()
    # Distance from the solid ink. Padding with the edge value means a shape that runs
    # off the canvas has no boundary there, so it gets no outline along the cut.
    solid = alpha > 0.5
    # Stray specks of ink get no outline, and the tiniest are wiped.
    labels, count = ndimage.label(solid)
    sizes = ndimage.sum(solid, labels, range(1, count + 1))
    for i, size in enumerate(sizes, start=1):
        if size < 40:
            solid[labels == i] = False
        if size < 12:
            alpha[ndimage.binary_dilation(labels == i, iterations=3)] = 0
    solid = np.pad(solid, pad, mode="edge")
    dist = ndimage.distance_transform_edt(~solid)[pad:-pad, pad:-pad]
    ring = np.clip(outline_px + 0.5 - dist, 0, 1)
    out_a = alpha + ring * (1 - alpha)
    out_rgb = (rgb * alpha[..., None] + np.array(OUTLINE) * (ring * (1 - alpha))[..., None]) / np.maximum(out_a, 1e-6)[..., None]
    rgba = np.dstack([out_rgb, out_a * 255]).clip(0, 255).astype(np.uint8)
    tile = Image.fromarray(rgba).resize((frame_w, frame_h), Image.LANCZOS)
    sheet.paste(tile, ((n % cols) * (frame_w + GAP), (n // cols) * (frame_h + GAP)))

sheet.save(out, "WEBP", quality=82, alpha_quality=92, method=6)
print(f"{os.path.basename(out)}: frames={len(frames)} cols={cols} rows={rows} frame={frame_w}x{frame_h} gap={GAP} sheet={sheet.size} "
      f"crop=({x0},{y0})-({x1},{y1}) of {w}x{h} bytes={os.path.getsize(out)}")
