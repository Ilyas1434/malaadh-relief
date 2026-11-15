"""Cut the cover artwork out of Ryan's drawings.

usage: cut_art.py <ryan-cameo frames dir> <out dir> [<video frame with her Sudan map>]

Poses come from the same drawings as the cameos, without the sticker outline. Every pose
from one set keeps that set's crop, so they line up the same way on a cover. The optional
map is lifted from a frame of her video: only the outline of Sudan, its label and its star.
"""
import glob
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

frames, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)

# name -> (set, drawing number)
POSES = {
    "stand": ("bottom", 0),
    "thumb": ("bottom", 4),
    "grin": ("bottom", 9),
    "squint": ("bottom", 11),
    "eyes": ("bottom", 14),
    "eyes-wave": ("bottom", 16),
    "lean-wave": ("side", 4),
}


def cut(path):
    im = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    h, w, _ = im.shape
    bg = float(np.median(im[20:200, w - 200 : w - 20]))
    coloured = (im.max(-1) - im.min(-1)) > 16
    alpha = np.where(coloured, 1.0, np.clip((bg - im.mean(-1) - 7) / (bg - 12), 0, 1))
    rgb = np.where(coloured[..., None], im, 0.0)
    return np.dstack([rgb, alpha * 255]).astype(np.uint8)


for group in ("bottom", "side"):
    cuts = {os.path.basename(p)[:2]: cut(p) for p in sorted(glob.glob(os.path.join(frames, group, "*.jpg")))}
    union = np.zeros(next(iter(cuts.values())).shape[:2], bool)
    for c in cuts.values():
        union |= c[..., 3] > 20
    ys, xs = np.where(union)
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    for name, (g, n) in POSES.items():
        if g == group:
            Image.fromarray(cuts[f"{n:02d}"]).crop(box).save(os.path.join(out, f"{name}.png"))
            print(name, box)

if len(sys.argv) > 3:
    im = np.asarray(Image.open(sys.argv[3]).convert("RGB")).astype(np.float32)
    h, w, _ = im.shape
    white = im.min(-1) > 235
    labels, _ = ndimage.label(white)
    # Sudan is the white region under its hand-written label.
    inside = labels == labels[int(h * 0.385), int(w * 0.50)]
    inside = ndimage.binary_fill_holes(inside)
    near = ndimage.binary_dilation(inside, iterations=7)
    ink = np.clip((200 - im.mean(-1)) / 160, 0, 1)
    star = (im[..., 2] < 150) & (im[..., 0] > 200)
    alpha = np.where(near, np.maximum(ink, star), 0)
    rgb = np.where(star[..., None], im, 0)
    ys, xs = np.where(alpha > 0.1)
    art = np.dstack([rgb, alpha * 255]).astype(np.uint8)[ys.min() : ys.max() + 1, xs.min() : xs.max() + 1]
    Image.fromarray(art).save(os.path.join(out, "sudan-map.png"))
    print("sudan-map", art.shape)
