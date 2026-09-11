import os
import shutil
import glob
import re
import json
import base64
import urllib.request
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "offline_dist")
PUBLIC = os.path.join(ROOT, "public")
NEXT_MEDIA = os.path.join(ROOT, ".next", "static", "media")
CHAMPIONS_JSON = os.path.join(ROOT, "scripts", "champions.json")

print("[1/6] Cleaning and preparing offline distribution directory...")
if os.path.exists(DIST):
    shutil.rmtree(DIST)

assets_dir = os.path.join(DIST, "assets")
media_dir = os.path.join(assets_dir, "media")
css_dir = os.path.join(assets_dir, "css")
champions_dir = os.path.join(assets_dir, "champions")
kenya_dir = os.path.join(assets_dir, "kenya")

os.makedirs(media_dir, exist_ok=True)
os.makedirs(css_dir, exist_ok=True)
os.makedirs(champions_dir, exist_ok=True)
os.makedirs(kenya_dir, exist_ok=True)

# 1. Copy WOFF2 fonts and build base64 map
print("[2/6] Bundling Newsreader and Manrope WOFF2 fonts and preparing base64 embeds...")
woff2_files = glob.glob(os.path.join(NEXT_MEDIA, "*.woff2"))
font_b64_map = {}

for f in woff2_files:
    fname = os.path.basename(f)
    shutil.copy2(f, os.path.join(media_dir, fname))
    with open(f, "rb") as fp:
        b64_str = base64.b64encode(fp.read()).decode("ascii")
        font_b64_map[fname] = f"data:font/woff2;base64,{b64_str}"

print(f"  -> Encoded {len(woff2_files)} font files for offline typography.")

# 2. Copy image assets
print("[3/6] Copying all image assets (champions, CSA logos, field map)...")
shutil.copy2(os.path.join(PUBLIC, "csa-logo.png"), os.path.join(assets_dir, "csa-logo.png"))
shutil.copy2(os.path.join(PUBLIC, "csa-dossier-logo.png"), os.path.join(assets_dir, "csa-dossier-logo.png"))
shutil.copy2(os.path.join(PUBLIC, "kenya", "field-nodes.jpg"), os.path.join(kenya_dir, "field-nodes.jpg"))

for img in os.listdir(os.path.join(PUBLIC, "champions")):
    src_f = os.path.join(PUBLIC, "champions", img)
    if os.path.isfile(src_f):
        shutil.copy2(src_f, os.path.join(champions_dir, img))

# 3. Process live CSS & embed base64 fonts
print("[4/6] Processing CSS stylesheet with embedded typography...")
live_css = None
try:
    css_url = "http://localhost:3000/_next/static/chunks/%5Broot-of-the-server%5D__1dv4fab._.css"
    with urllib.request.urlopen(css_url, timeout=5) as resp:
        live_css = resp.read().decode("utf-8")
except Exception:
    pass

if not live_css:
    local_css_path = os.path.join(ROOT, "scripts", "live_style.css")
    with open(local_css_path, "r", encoding="utf-8") as f:
        live_css = f.read()

# Replace all font URLs with base64 data URIs
replaced_fonts = 0
for fname, data_uri in font_b64_map.items():
    # Matches url("../media/<fname>"), url(/_next/static/media/<fname>), etc.
    pat = re.compile(r'url\([\'"]?(?:\.\./media/|/_next/static/media/)?' + re.escape(fname) + r'[\'"]?\)')
    matches = len(pat.findall(live_css))
    if matches > 0:
        live_css = pat.sub(f'url("{data_uri}")', live_css)
        replaced_fonts += matches

print(f"  -> Injected {replaced_fonts} base64 font instances into stylesheet.")

# Font variables and root styles for flawless typography
font_enhancements = """
/* Atelier Editorial Offline Typography */
:root {
  --font-newsreader: "Newsreader", "Newsreader Fallback", "Charter", Georgia, serif;
  --font-manrope: "Manrope", "Manrope Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-serif: var(--font-newsreader);
  --font-sans: var(--font-manrope);
  --background: #faf7f2;
  --foreground: #1c1c19;
  --card: #f3efea;
  --card-foreground: #1c1c19;
  --popover: #faf7f2;
  --popover-foreground: #1c1c19;
  --primary: #002619;
  --primary-foreground: #ffffff;
  --secondary: #e2e8e3;
  --secondary-foreground: #133d2d;
  --muted: #f0ede9;
  --muted-foreground: #414944;
  --accent: #e2e8e3;
  --accent-foreground: #133d2d;
  --destructive: #ba1a1a;
  --border: #e5dfd7;
  --input: #e5dfd7;
  --ring: #133d2d;
}

html, body {
  font-family: var(--font-manrope) !important;
  background-color: #faf7f2 !important;
  color: #1c1c19 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, .font-serif, [class*="font-serif"], blockquote {
  font-family: var(--font-newsreader) !important;
}

.font-sans, [class*="font-sans"] {
  font-family: var(--font-manrope) !important;
}

.caps-label {
  font-family: var(--font-manrope) !important;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

/* Modal animation */
#yac-offline-modal {
  animation: yacFadeIn 0.2s ease-out;
}
@keyframes yacFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
"""

with open(os.path.join(css_dir, "site.css"), "w", encoding="utf-8") as f:
    f.write(live_css + "\n" + font_enhancements)

# 4. Load verified champion data
with open(CHAMPIONS_JSON, "r", encoding="utf-8") as f:
    champions_list = json.load(f)

# Adjust image URLs for offline relative path
for ch in champions_list:
    if ch.get("headshotUrl"):
        # e.g. /champions/tonny.jpg -> assets/champions/tonny.jpg
        ch["headshotUrl"] = "assets" + ch["headshotUrl"]

# 5. Fetch and transform Main Page HTML from localhost:3000
print("[5/6] Exporting pixel-perfect Main Portfolio HTML...")
with urllib.request.urlopen("http://localhost:3000", timeout=5) as resp:
    page_html = resp.read().decode("utf-8")

def clean_html(html, is_dossier=False):
    # Remove Next.js script hydration tags
    html = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', html, flags=re.IGNORECASE)
    
    # Replace stylesheet links with local bundled CSS
    html = re.sub(r'<link[^>]+rel="stylesheet"[^>]*>', '<link rel="stylesheet" href="assets/css/site.css">', html)
    
    # Remove preload links that point to Next internals
    html = re.sub(r'<link[^>]+rel="preload"[^>]*>', '', html)
    
    # Replace next/image complex src with local clean relative path
    # e.g. /_next/image?url=%2Fchampions%2Ftonny-elvis-otieno.jpg&amp;w=144&amp;q=75 -> assets/champions/tonny-elvis-otieno.jpg
    html = re.sub(r'/_next/image\?url=%2Fchampions%2F([^&"\']+)&amp;[^"\']+', r'assets/champions/\1', html)
    html = re.sub(r'/_next/image\?url=%2Fcsa-logo\.png&amp;[^"\']+', r'assets/csa-logo.png', html)
    html = re.sub(r'/_next/image\?url=%2Fcsa-dossier-logo\.png&amp;[^"\']+', r'assets/csa-dossier-logo.png', html)
    html = re.sub(r'/_next/image\?url=%2Fkenya%2Ffield-nodes\.jpg&amp;[^"\']+', r'assets/kenya/field-nodes.jpg', html)
    
    # Also handle non-&amp; URLs
    html = re.sub(r'/_next/image\?url=%2Fchampions%2F([^&"\']+)[^"\']*', r'assets/champions/\1', html)
    html = re.sub(r'/_next/image\?url=%2Fcsa-logo\.png[^"\']*', r'assets/csa-logo.png', html)
    html = re.sub(r'/_next/image\?url=%2Fcsa-dossier-logo\.png[^"\']*', r'assets/csa-dossier-logo.png', html)
    html = re.sub(r'/_next/image\?url=%2Fkenya%2Ffield-nodes\.jpg[^"\']*', r'assets/kenya/field-nodes.jpg', html)

    # Convert remaining root-relative image paths that were not in /_next/image
    html = re.sub(r'(["\'\s=&#x27;])/(?:champions)/', r'\1assets/champions/', html)
    html = re.sub(r'(["\'\s=&#x27;])/csa-logo\.png', r'\1assets/csa-logo.png', html)
    html = re.sub(r'(["\'\s=&#x27;])/csa-dossier-logo\.png', r'\1assets/csa-dossier-logo.png', html)
    html = re.sub(r'(["\'\s=&#x27;])/kenya/field-nodes\.jpg', r'\1assets/kenya/field-nodes.jpg', html)
    html = html.replace("&#x27;/kenya/field-nodes.jpg&#x27;", "&#x27;assets/kenya/field-nodes.jpg&#x27;")
    html = html.replace("'/kenya/field-nodes.jpg'", "'assets/kenya/field-nodes.jpg'")
    html = html.replace('"/kenya/field-nodes.jpg"', '"assets/kenya/field-nodes.jpg"')
    html = html.replace('href="/YAC_Digital_Portfolio_Offline.zip"', 'href="YAC_Digital_Portfolio_Offline.zip"')
    
    # Clean any accidental double prefixing
    html = html.replace('assetsassets/', 'assets/')
    html = html.replace('assets/assets/', 'assets/')

    # Ensure stats numbers are explicitly populated (12 Champions, 05 Counties, 100% Data verified)
    html = re.sub(r'<span class="inline-block tabular-nums tracking-normal\s*">0</span>', '<span class="inline-block tabular-nums tracking-normal">12</span>', html)
    html = re.sub(r'<span class="inline-block tabular-nums tracking-normal\s*">00</span>', '<span class="inline-block tabular-nums tracking-normal">05</span>', html)
    html = re.sub(r'<span class="inline-block tabular-nums tracking-normal\s*">0<!-- -->%</span>', '<span class="inline-block tabular-nums tracking-normal">100%</span>', html)
    html = re.sub(r'<span class="inline-block tabular-nums tracking-normal\s*">0%</span>', '<span class="inline-block tabular-nums tracking-normal">100%</span>', html)

    # Navigation links
    html = html.replace('href="/dossier"', 'href="Print_PDF_Dossier.html"')
    html = html.replace('href="/"', 'href="Open_Portfolio.html"')
    
    # Remove srcset attributes so browser cleanly uses the local src without requesting _next
    html = re.sub(r'srcset="[^"]*"', '', html, flags=re.IGNORECASE)
    
    return html

clean_page_html = clean_html(page_html)

# Modal HTML template & client-side interactions to wire up every card & map portrait
modal_and_script = r"""
<!-- ── Fully Offline Interactive Dossier Modal ── -->
<div id="yac-offline-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style="display: none; background: rgba(22, 27, 24, 0.65); backdrop-filter: blur(8px);" onclick="closeYacModal(event)">
  <div class="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2px] border border-line bg-canvas shadow-2xl" onclick="event.stopPropagation()">
    <button onclick="closeYacModalDirect()" aria-label="Close" class="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full border border-line bg-canvas/90 font-serif text-lg text-pine transition hover:bg-terra hover:text-white">&times;</button>
    <div id="yac-modal-body"></div>
  </div>
</div>

<script>
  const CHAMPIONS_DATA = """ + json.dumps(champions_list, indent=2) + r""";
  const PILLAR_SHORT_MAP = {
    "SRHR & Public Health": "SRHR & Health",
    "Legal & Policy Advocacy": "Policy & Law",
    "Data, GIS & Tech": "Data & Tech",
    "Media, Storytelling & Comms": "Media & Comms",
    "Environment & Climate": "Environment",
    "Disability & Social Inclusion": "Inclusion"
  };

  function openChampionModal(champId) {
    const champ = CHAMPIONS_DATA.find(c => c.id === champId);
    if (!champ) return;

    const modalBody = document.getElementById('yac-modal-body');
    const pillarsHtml = champ.thematicPillars.map(p => 
      `<span class="rounded-full bg-sage/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-forest">${PILLAR_SHORT_MAP[p] || p}</span>`
    ).join(' ');

    const toolsHtml = champ.skillsAndTools.map(s => 
      `<span class="rounded-full border border-line bg-ivory px-3 py-1.5 text-[11px] font-medium text-ink-soft">${s}</span>`
    ).join(' ');

    const affiliationsHtml = champ.affiliations.map((a, i) => `
      <li class="flex items-baseline gap-4 border-b border-line py-2.5 last:border-b-0">
        <span class="shrink-0 font-serif text-xs italic text-ink-soft/60">${String(i + 1).padStart(2, '0')}</span>
        <span class="text-[13px] leading-snug text-ink-soft">${a}</span>
      </li>
    `).join('');

    const quoteHtml = champ.impactTagline ? `
      <blockquote class="border-l-2 border-terra pl-5 my-6">
        <p class="font-serif text-xl italic leading-[1.4] tracking-[-0.01em] text-forest">
          &ldquo;${champ.impactTagline}&rdquo;
        </p>
        <cite class="caps-label mt-3 block text-[9px] not-italic text-ink-soft">
          Lived Experience &rarr; Policy Impact
        </cite>
      </blockquote>
    ` : '';

    const fullBioHtml = champ.fullBio ? `<p class="mt-3 text-sm leading-[1.7] text-ink-soft">${champ.fullBio}</p>` : '';

    modalBody.innerHTML = `
      <div class="border-b border-line bg-ivory p-6 sm:p-8">
        <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-start text-center sm:text-left">
          <div class="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-[2px] border border-line bg-sage/50">
            <img src="${champ.headshotUrl}" alt="${champ.fullName}" class="h-full w-full object-cover">
          </div>
          <div>
            <p class="caps-label text-[9.5px] leading-relaxed text-terra">${champ.primaryRole}</p>
            <h2 class="mt-2 font-serif text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-pine sm:text-4xl">${champ.fullName}</h2>
            <p class="caps-label mt-3 text-[9px] text-ink-soft">
              ${champ.county} County · ${champ.age} Years · <span class="text-forest font-semibold">✓ Data Verified</span>
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-8 p-6 sm:p-8">
        ${quoteHtml}

        <section>
          <div class="flex items-baseline justify-between border-b border-line pb-2">
            <h4 class="caps-label text-[10px] text-pine">01: Biography</h4>
          </div>
          <p class="mt-3 text-sm leading-[1.7] text-ink-soft">${champ.shortBio}</p>
          ${fullBioHtml}
        </section>

        <section>
          <div class="flex items-baseline justify-between border-b border-line pb-2">
            <h4 class="caps-label text-[10px] text-pine">02: Academic Background</h4>
          </div>
          <p class="mt-3 font-serif text-lg leading-snug tracking-[-0.01em] text-pine">${champ.academicBackground}</p>
        </section>

        <section>
          <div class="flex items-baseline justify-between border-b border-line pb-2">
            <h4 class="caps-label text-[10px] text-pine">03: Competencies &amp; Tools</h4>
          </div>
          <div class="mt-3.5 flex flex-wrap gap-1.5">${toolsHtml}</div>
        </section>

        <section>
          <div class="flex items-baseline justify-between border-b border-line pb-2">
            <h4 class="caps-label text-[10px] text-pine">04: Thematic Pillars</h4>
          </div>
          <div class="mt-3.5 flex flex-wrap gap-1.5">${pillarsHtml}</div>
        </section>

        <section>
          <div class="flex items-baseline justify-between border-b border-line pb-2">
            <h4 class="caps-label text-[10px] text-pine">05: Affiliations &amp; Movements</h4>
          </div>
          <ul class="mt-1">${affiliationsHtml}</ul>
        </section>
      </div>
    `;

    document.getElementById('yac-offline-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeYacModal(e) {
    if (e.target === document.getElementById('yac-offline-modal')) {
      closeYacModalDirect();
    }
  }

  function closeYacModalDirect() {
    const m = document.getElementById('yac-offline-modal');
    if (m) m.style.display = 'none';
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeYacModalDirect();
  });

  // Wire up every card & map button to open the corresponding modal
  window.addEventListener('DOMContentLoaded', () => {
    // 1. Wire up Champion Cards
    const cards = document.querySelectorAll('article');
    cards.forEach((card) => {
      // Find champion name from the portrait alt or headings
      const img = card.querySelector('img');
      const alt = img ? img.getAttribute('alt') || '' : '';
      let match = CHAMPIONS_DATA.find(c => alt.includes(c.fullName));
      if (!match) {
        const text = card.innerText;
        match = CHAMPIONS_DATA.find(c => text.includes(c.fullName));
      }
      if (match) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (ev) => {
          ev.preventDefault();
          openChampionModal(match.id);
        });
        const btns = card.querySelectorAll('button');
        btns.forEach(b => {
          b.style.cursor = 'pointer';
          b.onclick = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            openChampionModal(match.id);
          };
        });
      }
    });

    // 2. Wire up Map fan member buttons
    const mapBtns = document.querySelectorAll('.map-fan-member');
    mapBtns.forEach(btn => {
      const aria = btn.getAttribute('aria-label') || '';
      for (const c of CHAMPIONS_DATA) {
        if (aria.includes(c.fullName)) {
          btn.style.cursor = 'pointer';
          btn.onclick = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            openChampionModal(c.id);
          };
          break;
        }
      }
    });

    // 3. Wire up Map mobile chips
    const chipBtns = document.querySelectorAll('button[aria-label^="Show profile of"]');
    chipBtns.forEach(btn => {
      const aria = btn.getAttribute('aria-label') || '';
      for (const c of CHAMPIONS_DATA) {
        if (aria.includes(c.fullName)) {
          btn.style.cursor = 'pointer';
          btn.onclick = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            openChampionModal(c.id);
          };
          break;
        }
      }
    });
  });
</script>
</body>
"""

final_page_html = clean_page_html.replace('</body>', modal_and_script)

# Add Maintenance Guide link to header navigation
guide_nav_button = '<a class="hidden items-center gap-1.5 rounded-[2px] border border-line bg-canvas px-3 py-1.5 text-[12.5px] font-medium text-pine transition-colors duration-200 hover:bg-ivory sm:inline-flex" href="CSA_PORTFOLIO_MAINTENANCE_GUIDE.html" title="View CSA maintenance and update guide"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open h-3.5 w-3.5" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> Guide</a>'
final_page_html = final_page_html.replace('href="Print_PDF_Dossier.html">', 'href="Print_PDF_Dossier.html">' + guide_nav_button)

with open(os.path.join(DIST, "index.html"), "w", encoding="utf-8") as f:
    f.write(final_page_html)

with open(os.path.join(DIST, "Open_Portfolio.html"), "w", encoding="utf-8") as f:
    f.write(final_page_html)

# 6. Fetch and export the Executive PDF Dossier
print("[6/6] Exporting pixel-perfect Executive Dossier HTML...")
with urllib.request.urlopen("http://localhost:3000/dossier", timeout=5) as resp:
    dossier_raw_html = resp.read().decode("utf-8")

clean_dossier_html = clean_html(dossier_raw_html, is_dossier=True)

dossier_script = r"""
<script>
  window.addEventListener('DOMContentLoaded', () => {
    const printBtns = document.querySelectorAll('button');
    printBtns.forEach(b => {
      if (b.innerText.includes('Print')) {
        b.onclick = () => window.print();
        b.style.cursor = 'pointer';
      }
    });
  });
</script>
</body>
"""
final_dossier_html = clean_dossier_html.replace('</body>', dossier_script)

with open(os.path.join(DIST, "dossier.html"), "w", encoding="utf-8") as f:
    f.write(final_dossier_html)

with open(os.path.join(DIST, "Print_PDF_Dossier.html"), "w", encoding="utf-8") as f:
    f.write(final_dossier_html)

# Copy and generate Maintenance Guides in distribution
shutil.copy2(os.path.join(ROOT, "CSA_PORTFOLIO_MAINTENANCE_GUIDE.md"), os.path.join(DIST, "CSA_PORTFOLIO_MAINTENANCE_GUIDE.md"))

# Generate styled HTML Maintenance Guide for supervisors
guide_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CSA Kenya — Portfolio Maintenance & Profile Update Guide</title>
  <link rel="stylesheet" href="assets/css/site.css">
  <style>
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; color: black !important; }
    }
  </style>
</head>
<body class="bg-[#faf7f2] text-[#1c1c19] antialiased" style="font-family: var(--font-manrope, sans-serif);">
  <header class="no-print sticky top-0 z-30 border-b border-[#e5dfd7] bg-[#faf7f2]/90 backdrop-blur-md">
    <div class="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-8">
      <div class="flex items-center gap-3">
        <img src="assets/csa-logo.png" alt="CSA Kenya Logo" class="h-9 w-9 object-contain">
        <div>
          <span class="block font-serif text-lg text-[#0a2f24]">Maintenance &amp; Operations Guide</span>
          <span class="caps-label block text-[9px] text-[#414944]">Centre for the Study of Adolescence (CSA Kenya)</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <a href="Open_Portfolio.html" class="rounded-[2px] border border-[#e5dfd7] bg-white px-3 py-1.5 text-xs font-medium text-[#0a2f24] hover:bg-[#faf7f2]">
          &larr; Back to Portfolio
        </a>
        <button onclick="window.print()" class="rounded-[2px] bg-[#002619] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#c85a32]">
          🖨️ Print / Save as PDF
        </button>
      </div>
    </div>
  </header>

  <main class="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
    <div class="border-b border-[#e5dfd7] pb-8">
      <p class="caps-label text-[#c85a32] text-[11px]">CSA Kenya · Operational Documentation</p>
      <h1 class="mt-3 font-serif text-3xl sm:text-5xl text-[#0a2f24] tracking-[-0.02em] leading-tight">
        How to Update Profiles &amp; Maintain the Digital Portfolio
      </h1>
      <p class="mt-4 text-base sm:text-lg text-[#414944] leading-relaxed max-w-3xl">
        This practical guide explains how CSA staff and project officers can easily modify champion details, update photos, manage thematic pillars, and regenerate the offline package.
      </p>
    </div>

    <section class="mt-12">
      <div class="flex items-baseline gap-3 border-b border-[#e5dfd7] pb-2">
        <span class="font-serif text-xl italic text-[#c85a32]">01</span>
        <h2 class="caps-label text-sm text-[#0a2f24]">Single Source of Truth Architecture</h2>
      </div>
      <p class="mt-4 text-sm sm:text-[15px] leading-relaxed text-[#414944]">
        The portfolio is engineered so that you <strong>never have to edit HTML files manually</strong>. All 12 champion profiles, county coordinates, competencies, and verified verification badges live in a single centralized configuration file:
      </p>
      <div class="mt-4 rounded border border-[#e5dfd7] bg-white p-4 font-mono text-xs sm:text-sm text-[#0a2f24]">
        📁 src / lib / <strong>yac.ts</strong>
      </div>
      <p class="mt-3 text-sm text-[#414944]">
        When you edit this single file, all changes automatically update the <strong>Web Portfolio</strong>, the <strong>Executive PDF Dossier</strong>, and the <strong>Offline ZIP Package</strong>.
      </p>
    </section>

    <section class="mt-12">
      <div class="flex items-baseline gap-3 border-b border-[#e5dfd7] pb-2">
        <span class="font-serif text-xl italic text-[#c85a32]">02</span>
        <h2 class="caps-label text-sm text-[#0a2f24]">Step-by-Step Profile Update Guide</h2>
      </div>
      <p class="mt-4 text-sm sm:text-[15px] leading-relaxed text-[#414944]">
        Open <code class="rounded bg-[#e2e8e3] px-1.5 py-0.5 font-mono text-xs">src/lib/yac.ts</code> in any text editor and find the champion block to update:
      </p>

      <div class="mt-4 overflow-x-auto rounded border border-[#e5dfd7] bg-white p-5 text-xs sm:text-sm font-mono leading-relaxed">
<pre class="text-[#1c1c19]">{
  <span class="text-[#c85a32]">id</span>: <span class="text-[#1b4d3e]">'stanley-hayo-yongo'</span>,
  <span class="text-[#c85a32]">fullName</span>: <span class="text-[#1b4d3e]">'Stanley Hayo Yongo'</span>,
  <span class="text-[#c85a32]">age</span>: <span class="text-[#0a2f24] font-bold">24</span>,                                <span class="text-[#888]">// Verified age</span>
  <span class="text-[#c85a32]">county</span>: <span class="text-[#1b4d3e]">'Siaya'</span>,                           <span class="text-[#888]">// 'Nairobi' | 'Kisumu' | 'Homa Bay' | 'Siaya' | 'Kilifi'</span>
  <span class="text-[#c85a32]">headshotUrl</span>: <span class="text-[#1b4d3e]">'/champions/stanley-hayo-yongo.jpg'</span>,
  <span class="text-[#c85a32]">academicBackground</span>: <span class="text-[#1b4d3e]">'Community Development'</span>,
  <span class="text-[#c85a32]">primaryRole</span>: <span class="text-[#1b4d3e]">'Meaningful Youth Engagement Practitioner'</span>,
  <span class="text-[#c85a32]">thematicPillars</span>: [
    <span class="text-[#1b4d3e]">'SRHR & Public Health'</span>,
    <span class="text-[#1b4d3e]">'Data, GIS & Tech'</span>,
    <span class="text-[#1b4d3e]">'Legal & Policy Advocacy'</span>
  ],
  <span class="text-[#c85a32]">skillsAndTools</span>: [
    <span class="text-[#1b4d3e]">'Community Scorecards'</span>,
    <span class="text-[#1b4d3e]">'Data Analytics'</span>,
    <span class="text-[#1b4d3e]">'Intergenerational Dialogues'</span>
  ],
  <span class="text-[#c85a32]">shortBio</span>: <span class="text-[#1b4d3e]">'1-2 sentences shown on the specimen card.'</span>,
  <span class="text-[#c85a32]">fullBio</span>: <span class="text-[#1b4d3e]">'Full paragraph narrative shown in the modal and executive dossier.'</span>,
  <span class="text-[#c85a32]">impactTagline</span>: <span class="text-[#1b4d3e]">'Pull-quote motto displayed in italics.'</span>,
  <span class="text-[#c85a32]">verified</span>: <span class="text-[#0a2f24] font-bold">true</span>                          <span class="text-[#888]">// Shows the green "✓ Verified" badge</span>
}</pre>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div class="rounded border border-[#e5dfd7] bg-white p-4">
          <h4 class="font-serif text-base text-[#0a2f24]">Approved Thematic Pillars</h4>
          <p class="mt-1 text-xs text-[#414944]">Choose from the 6 approved thematic areas:</p>
          <ul class="mt-2 space-y-1 text-xs text-[#1b4d3e]">
            <li>• SRHR &amp; Public Health</li>
            <li>• Legal &amp; Policy Advocacy</li>
            <li>• Data, GIS &amp; Tech</li>
            <li>• Media, Storytelling &amp; Comms</li>
            <li>• Environment &amp; Climate</li>
            <li>• Disability &amp; Social Inclusion</li>
          </ul>
        </div>
        <div class="rounded border border-[#e5dfd7] bg-white p-4">
          <h4 class="font-serif text-base text-[#0a2f24]">Approved Operational Counties</h4>
          <p class="mt-1 text-xs text-[#414944]">Must match the exact county name (pins on the map automatically link):</p>
          <ul class="mt-2 space-y-1 text-xs text-[#1b4d3e]">
            <li>• <strong>Nairobi</strong> (Capital &amp; National Policy Hub)</li>
            <li>• <strong>Kisumu</strong> (Lake Region Hub)</li>
            <li>• <strong>Homa Bay</strong> (Lake Victoria Southern Basin)</li>
            <li>• <strong>Siaya</strong> (Lake Victoria Northern Basin)</li>
            <li>• <strong>Kilifi</strong> (Coastal Climate &amp; Health Corridor)</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mt-12">
      <div class="flex items-baseline gap-3 border-b border-[#e5dfd7] pb-2">
        <span class="font-serif text-xl italic text-[#c85a32]">03</span>
        <h2 class="caps-label text-sm text-[#0a2f24]">Adding or Replacing Champion Photos</h2>
      </div>
      <ol class="mt-4 space-y-3 text-sm text-[#414944]">
        <li class="flex items-start gap-3">
          <span class="font-mono font-bold text-[#c85a32]">1.</span>
          <span><strong>Format &amp; Quality:</strong> Use standard JPEG (<code class="font-mono text-xs">.jpg</code>) images with square (1:1) or portrait (4:5) framing at 640×640 or 800×1000 resolution.</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="font-mono font-bold text-[#c85a32]">2.</span>
          <span><strong>File Location:</strong> Place the photo inside <code class="rounded bg-[#e2e8e3] px-1.5 py-0.5 font-mono text-xs">public/champions/</code> using lowercase letters and dashes (e.g. <code class="font-mono text-xs">public/champions/jane-doe.jpg</code>).</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="font-mono font-bold text-[#c85a32]">3.</span>
          <span><strong>Link in Code:</strong> In <code class="font-mono text-xs">src/lib/yac.ts</code>, set: <code class="font-mono text-xs">headshotUrl: '/champions/jane-doe.jpg'</code>.</span>
        </li>
      </ol>
    </section>

    <section class="mt-12">
      <div class="flex items-baseline gap-3 border-b border-[#e5dfd7] pb-2">
        <span class="font-serif text-xl italic text-[#c85a32]">04</span>
        <h2 class="caps-label text-sm text-[#0a2f24]">How to Regenerate the Offline ZIP Package</h2>
      </div>
      <p class="mt-4 text-sm sm:text-[15px] leading-relaxed text-[#414944]">
        Whenever you update champion profiles or photos, regenerate the self-contained offline package with a single command in your terminal:
      </p>
      <div class="mt-4 rounded border border-[#e5dfd7] bg-[#002619] p-4 font-mono text-sm text-[#faf7f2]">
        npm run build:offline
      </div>
      <p class="mt-3 text-xs sm:text-sm text-[#414944]">
        This automatically updates <strong>`Open_Portfolio.html`</strong>, embeds the Newsreader &amp; Manrope fonts as Base64, and packages a fresh <strong>`YAC_Digital_Portfolio_Offline.zip`</strong> file ready to email to supervisors and partners.
      </p>
    </section>

    <section class="mt-12">
      <div class="flex items-baseline gap-3 border-b border-[#e5dfd7] pb-2">
        <span class="font-serif text-xl italic text-[#c85a32]">05</span>
        <h2 class="caps-label text-sm text-[#0a2f24]">Zero-Inference Policy &amp; Editorial Standards</h2>
      </div>
      <div class="mt-4 space-y-4 text-sm text-[#414944]">
        <div class="rounded border-l-4 border-[#1b4d3e] bg-white p-4 shadow-sm">
          <h4 class="font-serif text-base text-[#0a2f24]">Strict Zero-Inference Verification</h4>
          <p class="mt-1 text-xs sm:text-sm text-[#414944]">
            Never infer or assume a champion's age, county, academic qualification, or project involvement. Every detail must be cross-checked against official CSA project records or signed profile consent sheets.
          </p>
        </div>
        <div class="rounded border-l-4 border-[#c85a32] bg-white p-4 shadow-sm">
          <h4 class="font-serif text-base text-[#0a2f24]">Punctuation &amp; Main Title Standard</h4>
          <p class="mt-1 text-xs sm:text-sm text-[#414944]">
            Always use a <strong>colon</strong> in the main title: <br>
            <em class="font-serif text-sm text-[#0a2f24]">“SRHR Youth Advocacy Champions: Turning Lived Experience into Policy Evidence.”</em>
          </p>
        </div>
      </div>
    </section>

    <footer class="mt-16 border-t border-[#e5dfd7] pt-8 text-center text-xs text-[#414944]">
      <p>Centre for the Study of Adolescence (CSA Kenya) · INSPIRE-Kenya Youth Evidence to Policy Lab</p>
      <p class="mt-1">Website: csakenya.org · Nairobi, Kenya</p>
    </footer>
  </main>
</body>
</html>"""

with open(os.path.join(DIST, "CSA_PORTFOLIO_MAINTENANCE_GUIDE.html"), "w", encoding="utf-8") as f:
    f.write(guide_html)

txt_guide = """================================================================================
     CSA KENYA — HOW TO UPDATE PROFILES & MAINTAIN THE PORTFOLIO
     Centre for the Study of Adolescence · INSPIRE Lab
================================================================================

All 12 champion profiles, bios, credentials, and photos are driven by ONE
central configuration file. You never need to edit HTML code manually!

--------------------------------------------------------------------------------
1. THE CENTRAL DATA FILE:
--------------------------------------------------------------------------------
Open this file in your text editor:
    👉 src/lib/yac.ts

Inside you will see the CHAMPIONS list. Each champion looks like this:

{
  id: 'stanley-hayo-yongo',
  fullName: 'Stanley Hayo Yongo',
  age: 24,
  county: 'Siaya',
  headshotUrl: '/champions/stanley-hayo-yongo.jpg',
  academicBackground: 'Community Development',
  primaryRole: 'Meaningful Youth Engagement Practitioner & TWG Member',
  thematicPillars: [
    'SRHR & Public Health',
    'Data, GIS & Tech',
    'Legal & Policy Advocacy'
  ],
  skillsAndTools: [
    'Community Scorecards',
    'Intergenerational Dialogues',
    'Human Subject Protection'
  ],
  affiliations: [
    'Centre for the Study of Adolescence (SHE SOARS Project)',
    'County Government of Siaya AYSRHR TWG'
  ],
  shortBio: '1-2 sentences displayed on the specimen card.',
  fullBio: 'Full narrative bio displayed in the popup modal and printable dossier.',
  impactTagline: 'Advocacy motto quote shown in italics.',
  verified: true
}

--------------------------------------------------------------------------------
2. HOW TO UPDATE OR ADD PHOTOS:
--------------------------------------------------------------------------------
1. Crop the photo to a square (1:1) or portrait (4:5) aspect ratio (640x640px).
2. Save it inside: public/champions/your-name.jpg
3. In src/lib/yac.ts, set: headshotUrl: '/champions/your-name.jpg'

--------------------------------------------------------------------------------
3. APPROVED THEMATIC PILLARS (Must use exact text):
--------------------------------------------------------------------------------
• 'SRHR & Public Health'
• 'Legal & Policy Advocacy'
• 'Data, GIS & Tech'
• 'Media, Storytelling & Comms'
• 'Environment & Climate'
• 'Disability & Social Inclusion'

--------------------------------------------------------------------------------
4. APPROVED OPERATIONAL COUNTIES:
--------------------------------------------------------------------------------
• 'Nairobi'
• 'Kisumu'
• 'Homa Bay'
• 'Siaya'
• 'Kilifi'

--------------------------------------------------------------------------------
5. HOW TO REGENERATE THE OFFLINE ZIP PACKAGE:
--------------------------------------------------------------------------------
After making any edits, open your terminal and run:
    npm run build:offline

This automatically updates Open_Portfolio.html, embeds the Newsreader & Manrope
fonts, and creates a fresh "YAC_Digital_Portfolio_Offline.zip" file ready to share!

================================================================================
Centre for the Study of Adolescence (CSA Kenya)
Website: csakenya.org
================================================================================
"""

with open(os.path.join(DIST, "HOW_TO_UPDATE_PROFILES.txt"), "w", encoding="utf-8") as f:
    f.write(txt_guide)

# Non-technical supervisor instructions
supervisor_guide = """================================================================================
     SRHR Youth Advocacy Champions: Digital Portfolio (Offline Edition)
     Centre for the Study of Adolescence (CSA Kenya) · INSPIRE Lab
================================================================================

WELCOME! This offline package lets you review the complete digital portfolio
with zero internet access or Wi-Fi required.

HOW TO OPEN (NON-TECHNICAL & INSTANT):
Simply double-click the file named:
    👉 "Open_Portfolio.html"

• It opens directly in your standard web browser (Google Chrome, Microsoft Edge,
  Apple Safari, or Firefox).
• NO command prompt (black terminal window) will ever open.
• All fonts (Newsreader and Manrope), photos, interactive maps, and champion
  profiles are completely self-contained.
• You can click on any champion card or map avatar to open their full verified
  dossier modal.

HOW TO VIEW OR PRINT THE FULL EXECUTIVE DOSSIER:
• Double-click "Print_PDF_Dossier.html" (or click "PDF Dossier" in the top bar
  of the portfolio).
• Click the "Print / Save as PDF" button at the top to print or export an executive
  summary document for stakeholders.

HOW CSA CAN UPDATE PROFILES & MAINTAIN THE PORTFOLIO:
• Double-click "CSA_PORTFOLIO_MAINTENANCE_GUIDE.html" (or click "Guide" in the top bar).
• You can also read "HOW_TO_UPDATE_PROFILES.txt" or "CSA_PORTFOLIO_MAINTENANCE_GUIDE.md".

================================================================================
Centre for the Study of Adolescence (CSA Kenya)
Website: csakenya.org
================================================================================
"""

with open(os.path.join(DIST, "HOW_TO_OPEN.txt"), "w", encoding="utf-8") as f:
    f.write(supervisor_guide)
with open(os.path.join(DIST, "README.txt"), "w", encoding="utf-8") as f:
    f.write(supervisor_guide)

# 7. Create ZIP archive
print("Packaging into YAC_Digital_Portfolio_Offline.zip...")
root_zip = os.path.join(ROOT, "YAC_Digital_Portfolio_Offline.zip")
public_zip = os.path.join(PUBLIC, "YAC_Digital_Portfolio_Offline.zip")

with zipfile.ZipFile(root_zip, "w", zipfile.ZIP_DEFLATED) as z:
    for root_dir, dirs, files in os.walk(DIST):
        for f in files:
            full_p = os.path.join(root_dir, f)
            rel_p = os.path.relpath(full_p, DIST)
            z.write(full_p, os.path.join("YAC_Digital_Portfolio_Offline", rel_p))

shutil.copy2(root_zip, public_zip)
size_mb = os.path.getsize(root_zip) / (1024 * 1024)
print(f"-> Created ZIP successfully ({size_mb:.2f} MB):")
print(f"   {root_zip}")
print(f"   {public_zip}")
print("ALL DONE! Pixel-perfect offline bundle ready.")
