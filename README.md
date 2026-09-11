# 🇰🇪 SRHR Youth Advocacy Champions: Digital Portfolio

> **Centre for the Study of Adolescence (CSA Kenya) · INSPIRE Lab**  
> *SRHR Youth Advocacy Champions: Turning Lived Experience into Policy Evidence.*

[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://app.netlify.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📖 Overview

The **SRHR Youth Advocacy Champions Digital Portfolio** is an interactive, editorial digital dossier showcasing the working portfolios of the **Youth Advocacy Champions (YACs)** supported by the **Centre for the Study of Adolescence (CSA Kenya)**.

From legal reform and GIS spatial epidemiology to health communication, adolescent SRHR, and community mobilization, these verified young leaders operate at the intersection of lived community reality and legislative change.

### 🌟 Core Highlights
- **Verified Champions**: 100% verified ages, counties, academic backgrounds, and field competencies under a strict zero-inference data contract.
- **5 Operational Counties**: Active footprint spanning **Nairobi**, **Kisumu**, **Kilifi**, **Siaya**, and **Homa Bay**.
- **Interactive Impact Areas Map**: Calibrated perspective satellite plate mapping operational hubs with inland avatar fanout, hover grace debouncing, and cluster resolution.
- **Specimen Portfolio Cards & Modals**: Clean, editorial dossier layout displaying full professional biographies, technical skills, core pillars, and organizational affiliations.
- **Print & Executive Dossier Support**: Native `@media print` styling that formats the entire portfolio into a publication-grade briefing document.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI & Components**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography & Styling**: Custom editorial palette (Pine, Ivory, Terra, Forest, Slate)
- **Database & Data Layer**: [Prisma](https://www.prisma.io/) with local SQLite engine
- **Hosting & CI/CD**: [Netlify](https://www.netlify.com/) with `@netlify/plugin-nextjs`

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v20.9.0 or higher (`node -v`)
- **npm**: v10+ (`npm -v`)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/ryanreo/YAC-portfolio-for-CSA.git
cd YAC-portfolio-for-CSA

# Install dependencies
npm install

# Initialize Prisma Client
npx prisma generate
```

### 3. Run Locally
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 🌐 Deploying to Netlify

This project is pre-configured for automated continuous deployment on **Netlify** via [`netlify.toml`](./netlify.toml).

### Steps to Deploy:
1. Log in to [Netlify](https://app.netlify.com).
2. Click **"Add new site"** &rarr; **"Import an existing project"**.
3. Connect your **GitHub** account and select **`YAC-portfolio-for-CSA`**.
4. Netlify will automatically detect the build settings from `netlify.toml`:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
   - **Node Version**: `20`
   - **Plugin**: `@netlify/plugin-nextjs`
5. Click **"Deploy YAC-portfolio-for-CSA"**.
6. Your live site will be provisioned with free SSL and global CDN distribution!

---

## 📂 Project Structure

```
├── db/                       # Local SQLite database
├── prisma/
│   └── schema.prisma         # Prisma schema definitions
├── public/
│   ├── champions/            # Optimized headshots for the 12 champions
│   ├── kenya/                # Kenya footprint plates & assets
│   └── csa-logo.png          # CSA Kenya institutional branding
├── src/
│   ├── app/
│   │   ├── globals.css       # Editorial styling tokens & animations
│   │   ├── layout.tsx        # SEO metadata, OpenGraph tags & viewport
│   │   └── page.tsx          # Single-page portfolio composition
│   ├── components/
│   │   ├── ui/               # Radix UI primitives
│   │   └── yac/
│   │       ├── ChampionCard.tsx    # Specimen card
│   │       ├── ChampionModal.tsx   # Portfolio deep-dive modal
│   │       └── KenyaFootprint.tsx  # Interactive geographic plate & pins
│   └── lib/
│       └── yac.ts            # 12 verified champion profiles & county data
├── netlify.toml              # Netlify build and deployment config
├── package.json              # Scripts & dependencies
└── LICENSE                   # MIT License (CSA Kenya)
```

---

## 📄 License

This project is open-source and released under the [MIT License](LICENSE).  
Copyright &copy; 2026 **Centre for the Study of Adolescence (CSA Kenya)**.
