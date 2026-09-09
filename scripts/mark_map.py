"""Mark detected blobs on the map and save overview + zoomed crops for identification."""
from PIL import Image, ImageDraw

im = Image.open('/home/z/my-project/public/kenya/field-nodes.jpg').convert('RGB')

blobs = [
    (768, 383), (534, 409), (725, 380), (331, 418), (986, 477), (483, 431),
    (1025, 478), (1014, 649), (438, 325), (480, 483), (449, 483), (467, 320),
    (492, 322), (452, 431), (788, 501), (932, 541), (471, 260), (869, 656),
    (545, 460), (665, 518), (935, 648), (980, 649),
]

d = ImageDraw.Draw(im)
for i, (x, y) in enumerate(blobs):
    d.ellipse([x - 9, y - 9, x + 9, y + 9], outline=(255, 60, 60), width=3)
    d.text((x + 12, y - 6), str(i), fill=(255, 255, 0))

im.save('/home/z/my-project/scripts/map_marked.png')

# Zoomed crop: Lake Victoria basin (western cluster)
im.crop((150, 300, 750, 650)).resize((1200, 700)).save('/home/z/my-project/scripts/map_zoom_lake.png')
# Zoomed crop: Nairobi / central
im.crop((550, 250, 1100, 560)).resize((1100, 620)).save('/home/z/my-project/scripts/map_zoom_central.png')
print('saved')
