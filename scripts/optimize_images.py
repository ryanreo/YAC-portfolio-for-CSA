#!/usr/bin/env python3
"""Optimize champion headshots for web: resize to max 640px, convert to RGB JPEG."""
import os
from PIL import Image

SRC = '/home/z/my-project/public/champions'
MAX_DIM = 640

for fname in sorted(os.listdir(SRC)):
    path = os.path.join(SRC, fname)
    if not fname.lower().endswith(('.png', '.jpg', '.jpeg')):
        continue
    img = Image.open(path)
    orig_size = os.path.getsize(path)
    # Resize
    img.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)
    # Convert to RGB JPEG for photos (smaller than PNG)
    out_path = os.path.join(SRC, fname)
    if fname.lower().endswith(('.png',)):
        out_path = os.path.join(SRC, fname.replace('.png', '.jpg'))
        os.remove(path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img.save(out_path, 'JPEG', quality=82, optimize=True, progressive=True)
    new_size = os.path.getsize(out_path)
    print(f"{fname}: {orig_size//1024}KB -> {new_size//1024}KB  ({img.size[0]}x{img.size[1]})")
