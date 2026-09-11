# 📘 CSA Kenya — Portfolio Maintenance & Profile Update Guide

**SRHR Youth Advocacy Champions: Digital Portfolio**  
*Centre for the Study of Adolescence (CSA Kenya) · INSPIRE-Kenya Youth Evidence to Policy Lab*

---

## 🧭 1. Overview & Architecture

The **SRHR Youth Advocacy Champions Digital Portfolio** is designed for sustainability and ease of maintenance. It is built on a **single source of truth** architecture:

- All **12 champion profiles**, county assignments, thematic pillars, biographies, and verification badges live in **one centralized file**:  
  👉 [`src/lib/yac.ts`](file:///c:/Users/osage/OneDrive/Documents/ChatGPT%20projects/YAC%20portfolio/src/lib/yac.ts)
- Whenever you make changes to this file, the updates immediately and automatically cascade across:
  1. **The Live Digital Portfolio** (`/`: hero statistics, interactive cards, thematic filters, and the national Kenya field footprint map).
  2. **The Executive Printable Dossier** (`/dossier`: formal print-ready dossier plates for all champions with one-click PDF export).
  3. **The Offline Standalone Distribution** (`offline_dist/` and `YAC_Digital_Portfolio_Offline.zip`).

---

## 📂 2. Key Directories & File Locations

| File / Directory | Purpose | What to Edit Here |
| :--- | :--- | :--- |
| [`src/lib/yac.ts`](file:///c:/Users/osage/OneDrive/Documents/ChatGPT%20projects/YAC%20portfolio/src/lib/yac.ts) | **Core Data Layer** | Edit champion names, ages, counties, bios, degrees, skills, and quotes. |
| `public/champions/` | **Portrait Headshots** | Add or replace champion `.jpg` photos (e.g. `public/champions/john-doe.jpg`). |
| `public/csa-logo.png` | **CSA Branding** | Official CSA Kenya logo emblem. |
| `public/kenya/field-nodes.jpg` | **Map Satellite Base** | High-resolution field node map of Kenya. |
| `offline_dist/` | **Offline Distribution** | Double-clickable standalone package (`Open_Portfolio.html`). |
| `YAC_Digital_Portfolio_Offline.zip` | **Downloadable ZIP** | Self-contained package to email to stakeholders or partners. |

---

## ✍️ 3. How to Update Champion Profiles

All profiles are defined in the `CHAMPIONS` array inside [`src/lib/yac.ts`](file:///c:/Users/osage/OneDrive/Documents/ChatGPT%20projects/YAC%20portfolio/src/lib/yac.ts).

### Step-by-Step Example

To edit an existing champion, open [`src/lib/yac.ts`](file:///c:/Users/osage/OneDrive/Documents/ChatGPT%20projects/YAC%20portfolio/src/lib/yac.ts) and locate the champion block:

```typescript
{
  id: 'stanley-hayo-yongo',
  fullName: 'Stanley Hayo Yongo',
  age: 24,                                 // Chronological age (verified)
  county: 'Siaya',                         // Must be one of the 5 operational counties
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
    'Human Subject Protection',
    'Data Analytics',
    'Social Media Management',
    'Communications'
  ],
  affiliations: [
    'Mildmay International Kenya',
    'Marie Stopes Kenya',
    'Family Health Options Kenya',
    'Centre for the Study of Adolescence (SHE SOARS Project)',
    'County Government of Siaya AYSRHR TWG'
  ],
  shortBio:
    'Community Development and Meaningful Youth Engagement practitioner with over seven years of experience implementing SRHR, gender, economic empowerment, and advocacy programmes.',
  fullBio:
    'Stanley Hayo Yongo is a Community Development and Meaningful Youth Engagement practitioner with over seven years of experience in youth leadership and SRHR programming. He serves as a Technical Working Group member in Siaya County...',
  impactTagline: 'Translating community scorecards into county AYSRHR accountability.',
  verified: true,                          // Zero-inference verification indicator
}
```

### Profile Fields Guide

1. **`fullName`**: Full name of the champion as officially registered.
2. **`age`**: Integer number (e.g. `24`).
3. **`county`**: Must exactly match one of the 5 counties:
   - `'Nairobi'`
   - `'Kisumu'`
   - `'Homa Bay'`
   - `'Siaya'`
   - `'Kilifi'`
4. **`shortBio`**: 1–2 sentences summarizing their core focus (displayed on the portfolio card).
5. **`fullBio`**: 1–3 paragraphs detailing their project involvement, achievements, and technical background (displayed in the modal and dossier).
6. **`thematicPillars`**: Select up to 3 pillars from the 6 approved thematic areas:
   - `'SRHR & Public Health'`
   - `'Legal & Policy Advocacy'`
   - `'Data, GIS & Tech'`
   - `'Media, Storytelling & Comms'`
   - `'Environment & Climate'`
   - `'Disability & Social Inclusion'`
7. **`impactTagline`** *(Optional)*: An inspiring quote or advocacy motto from the champion.
8. **`verified`**: Set to `true` once documentation has been cross-checked by CSA staff.

---

## 📸 4. How to Add or Update Champion Photos

1. **Photo Specifications**:
   - Format: **JPEG** (`.jpg`)
   - Aspect ratio: **Square (1:1)** or **Portrait (4:5)**
   - Recommended size: **640 × 640 px** to **800 × 1000 px**
   - High contrast, professional lighting, centered portrait.

2. **File Placement**:
   - Save the image to the `public/champions/` folder.
   - Use lowercase letters and hyphens: `public/champions/firstname-lastname.jpg`.

3. **Link in Code**:
   - In [`src/lib/yac.ts`](file:///c:/Users/osage/OneDrive/Documents/ChatGPT%20projects/YAC%20portfolio/src/lib/yac.ts), set:
     ```typescript
     headshotUrl: '/champions/firstname-lastname.jpg',
     ```

---

## 🚀 5. Testing Updates Locally

### Running the Live App
To view your changes in your browser:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the updated cards, map, and dossier instantly.

### Validating Code & Types
To verify there are no syntax or type errors:
```bash
npm run build
```

---

## 📦 6. Regenerating the Offline Package

Whenever you modify profiles, bios, or photos, regenerate the self-contained offline package with one command:

```bash
npm run build:offline
```
*(or run: `python scripts/build_pixel_perfect_offline.py`)*

This script automatically:
1. Re-exports the updated HTML for `Open_Portfolio.html` and `Print_PDF_Dossier.html`.
2. Re-embeds the **Newsreader** and **Manrope** typography as Base64 data so the fonts work offline without internet.
3. Packages the whole distribution into [**`YAC_Digital_Portfolio_Offline.zip`**](file:///c:/Users/osage/OneDrive/Documents/ChatGPT%20projects/YAC%20portfolio/YAC_Digital_Portfolio_Offline.zip) in the root and in `public/`.

---

## 🛡️ 7. CSA Data Integrity & Verification Standards

1. **Zero-Inference Policy**: All details (age, qualifications, credentials, affiliations) must originate from verified CSA project records or signed champion profiles. Never guess or fabricate personal information.
2. **Editorial Consistency**:
   - Portfolio Title: `SRHR Youth Advocacy Champions: Turning Lived Experience into Policy Evidence.` (always use a colon).
   - Capitalize official degrees and role titles consistently.
3. **Supervisor-Friendly Sharing**:
   - When sharing the offline version with CSA supervisors, partners, or government officials, send `YAC_Digital_Portfolio_Offline.zip`.
   - Tell them to simply unzip and double-click **`Open_Portfolio.html`**. No command line or technical setup is ever required.

---

*Prepared by Centre for the Study of Adolescence (CSA Kenya) · INSPIRE Lab*  
*For questions or technical support, contact the CSA Kenya IT & Communications Team.*
