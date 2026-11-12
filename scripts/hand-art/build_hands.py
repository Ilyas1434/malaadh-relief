import sys, json
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

LOGO, OUT = sys.argv[1], sys.argv[2]
K = 8                      # upscale
OX, OY = 120, 80           # padding (logo px) so the arm can be extended past the image edge
W, H = 300, 335            # logo region used for the left hand

cfg0 = json.load(open(sys.argv[3]))
im = Image.open(LOGO).convert('RGB')
a = np.asarray(im).astype(float)
bg = np.array([241, 219, 195.]); hand = np.array([203, 186, 165.])
d = hand - bg
t = ((a - bg) * d).sum(-1) / float((d * d).sum())            # 0 = background, 1 = hand colour, >2 = shadow / ink
soft = np.clip(1 - np.abs(t - 1) / 0.75, 0, 1)   # peak at hand colour
soft = soft[:H, :W]
big = Image.fromarray((soft * 255).astype(np.uint8)).resize((W * K, H * K), Image.BICUBIC)
big = big.filter(ImageFilter.GaussianBlur(cfg0.get('base_blur', 10)))
m = np.asarray(big) > 110

canvas = np.zeros(((H + OY) * K, (W + OX) * K), bool)
canvas[OY * K:, OX * K:] = m
img = Image.fromarray((canvas * 255).astype(np.uint8))
dr = ImageDraw.Draw(img)
P = lambda x, y: ((x + OX) * K, (y + OY) * K)

# 1. erase everything right of the trusted boundary (ink, ink shadows, half-covered fingers)
cfg = json.load(open(sys.argv[3]))
bnd = cfg['boundary']
poly = [P(*p) for p in bnd] + [P(W + 5, bnd[-1][1]), P(W + 5, bnd[0][1])]
dr.polygon(poly, fill=0)

# 2. fingers as tapered capsule chains
def chain(pts):
    for (x0, y0, r0), (x1, y1, r1) in zip(pts, pts[1:]):
        n = int(max(abs(x1 - x0), abs(y1 - y0)) * K) + 1
        for i in range(n + 1):
            u = i / n
            x, y, r = x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, r0 + (r1 - r0) * u
            cx, cy = P(x, y)
            dr.ellipse([cx - r * K, cy - r * K, cx + r * K, cy + r * K], fill=255)
for f in cfg['fingers']:
    chain(f)
for pg in cfg.get('fill', []):
    dr.polygon([P(*p) for p in pg], fill=255)
for pg in cfg.get('erase', []):
    dr.polygon([P(*p) for p in pg], fill=0)

# 3. extend the arm past the image's left edge along its own edges
m2 = np.asarray(img) > 127
def col(x):
    ys = np.where(m2[:, (x + OX) * K])[0]
    return ys.min() / K - OY, ys.max() / K - OY
t0, b0 = col(3); t1, b1 = col(73); print('arm', t0, b0, t1, b1)
st = sb = ((t1 - t0) + (b1 - b0)) / 140   # parallel edges: the forearm is already at full width here
L = -OX
dr.polygon([P(4, t0), P(L, t0 + st * (L - 3)), P(L, b0 + sb * (L - 3)), P(4, b0)], fill=255)

# 4. smooth, keep the main body, fill stray holes (keep the pinch gap)
img = img.filter(ImageFilter.GaussianBlur(cfg.get('blur', 9)))
m3 = np.asarray(img) > 127
lab, n = ndi.label(m3)
sizes = ndi.sum(m3, lab, range(1, n + 1))
m3 = lab == (1 + int(np.argmax(sizes)))
holes, hn = ndi.label(~m3)
hs = ndi.sum(~m3, holes, range(1, hn + 1))
outside = holes[0, -1]
for i in range(1, hn + 1):
    if i != outside and hs[i - 1] < cfg.get('min_hole', 60) * K * K:
        m3[holes == i] = True
Image.fromarray(((~m3) * 255).astype(np.uint8)).save(OUT)
print('mask', m3.shape)
