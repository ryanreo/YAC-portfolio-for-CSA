"""Crop the template chrome strip off the top of the Kenya base map (both site asset and user download copy)."""
from PIL import Image

CROP_TOP = 58  # removes 'Atelier Studio — Selected Works & Practice' + menu icon

for path in (
    '/home/z/my-project/public/kenya/field-nodes.jpg',
    '/home/z/my-project/download/Kenya-map-high-res.jpg',
):
    im = Image.open(path)
    w, h = im.size
    out = im.crop((0, CROP_TOP, w, h))
    out.save(path, quality=92)
    print(f'{path}: {w}x{h} -> {out.size[0]}x{out.size[1]}')
