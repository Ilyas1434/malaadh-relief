"""Smooth the hand outline along its contour, then write a clean binary bitmap for potrace."""
import sys
import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter, gaussian_filter1d
import contourpy

src, out = sys.argv[1], sys.argv[2]
K, OX = 8, 120
m = (np.asarray(Image.open(src).convert('L')) < 128).astype(np.float32)
PAD = 240
f = np.pad(m, ((PAD, PAD), (0, PAD)))
f = np.pad(f, ((0, 0), (PAD, 0)), mode='edge')   # let the arm run on past the left edge so its cut is never rounded into view
f = gaussian_filter(f, 3)
lines = contourpy.contour_generator(z=f, name='serial', line_type='Separate').lines(0.5)
lines = sorted(lines, key=len, reverse=True)

def resample(p, step=3.0):
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(p, axis=0).T))]
    n = int(d[-1] / step)
    u = np.linspace(0, d[-1], n, endpoint=False)
    return np.c_[np.interp(u, d, p[:, 0]), np.interp(u, d, p[:, 1])]

def smooth(p, sig_fine, sig_coarse, x_lo, x_hi):
    fine = gaussian_filter1d(p, sig_fine, axis=0, mode='wrap')
    coarse = gaussian_filter1d(p, sig_coarse, axis=0, mode='wrap')
    x = (p[:, 0] - PAD) / K - OX                      # logo x
    w = np.clip((x_hi - x) / (x_hi - x_lo), 0, 1)       # 1 on the arm, 0 on the fingers
    w = gaussian_filter1d(w * w * (3 - 2 * w), 20, mode='wrap')[:, None]
    return coarse * w + fine * (1 - w)

H, W = f.shape
img = Image.new('L', (W, H), 255)
dr = ImageDraw.Draw(img)
for i, ln in enumerate(lines):
    if len(ln) < 200: continue
    p = resample(np.asarray(ln))
    if i == 0:
        p = smooth(p, 5, 22, 150, 195)      # outer: arm heavily, fingers lightly (points are 3px = 0.375 logo px apart)
    else:
        p = smooth(p, 9, 9, 0, 1)           # pinch gap: even, rounded
    dr.polygon([tuple(q) for q in p], fill=0 if i == 0 else 255)
img = img.crop((PAD, PAD, W - PAD, H - PAD))
img.save(out)
print('contours', [len(l) for l in lines][:5], img.size)
