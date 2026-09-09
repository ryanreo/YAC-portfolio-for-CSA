"""Detect city-light blobs on the Kenya field-node map and fit a lon/lat -> pixel model."""
from PIL import Image
import numpy as np
from scipy import ndimage

im = Image.open('/home/z/my-project/public/kenya/field-nodes.jpg').convert('RGB')
W, H = im.size
a = np.asarray(im).astype(float)
lum = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]

mask = lum > 170
mask = ndimage.binary_dilation(mask, iterations=1)
lab, n = ndimage.label(mask)
sizes = ndimage.sum(mask, lab, range(1, n + 1))
cents = ndimage.center_of_mass(mask, lab, range(1, n + 1))

order = np.argsort(sizes)[::-1]
print(f"image {W}x{H}, {n} blobs; top 30 by size:")
print(f"{'rank':>4} {'x':>5} {'y':>5} {'size':>6} {'peak':>5}")
for r, i in enumerate(order[:30]):
    cy, cx = cents[i]
    ys, xs = np.where(lab == i + 1)
    peak = lum[ys, xs].max()
    print(f"{r:>4} {cx:>5.0f} {cy:>5.0f} {sizes[i]:>6.0f} {peak:>5.0f}")
