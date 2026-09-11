import os
import re

css_path = os.path.join('offline_dist', 'assets', 'css', 'site.css')
print(f"site.css size: {os.path.getsize(css_path) / 1024:.1f} KB")

for page in ['Open_Portfolio.html', 'Print_PDF_Dossier.html']:
    html_path = os.path.join('offline_dist', page)
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    next_refs = re.findall(r'(/_next[^\s"\'\>]+)', html)
    print(f"[{page}] Any _next references?: {len(next_refs)}")
    if next_refs:
        print(f"  Sample: {next_refs[:3]}")

    imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
    print(f"[{page}] Total img tags: {len(imgs)}")
    missing = [src for src in imgs if not os.path.exists(os.path.join('offline_dist', src))]
    print(f"[{page}] Missing images on disk: {missing}")

print("Verification script finished.")
