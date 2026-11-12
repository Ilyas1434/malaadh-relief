import sys, re, subprocess
from PIL import Image
src, out, rot = sys.argv[1], sys.argv[2], sys.argv[3] == 'rot'
im = Image.open(src).convert('L').point(lambda v: 255 if v > 127 else 0).convert('1')
if rot: im = im.rotate(180)
bmp = out + '.bmp'; im.save(bmp)
raw = subprocess.run(['potrace', bmp, '-s', '-o', '-', '--turdsize', '200', '--alphamax', '1.334', '--opttolerance', '0.9', '--unit', '1'],
                     check=True, capture_output=True, text=True).stdout
w, h = im.size
paths = re.findall(r'<path d="([^"]+)"', raw)
tr = re.search(r'<g transform="([^"]+)"', raw).group(1)
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">\n'
       f'<g transform="{tr}" fill="currentColor" stroke="none">\n'
       + '\n'.join(f'<path d="{" ".join(p.split())}"/>' for p in paths) + '\n</g>\n</svg>\n')
open(out, 'w').write(svg)
import os; os.remove(bmp)
print(out, len(svg), 'bytes', len(paths), 'paths', tr)
