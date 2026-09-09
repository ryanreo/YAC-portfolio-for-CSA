'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { ChampionCard } from '@/components/yac/ChampionCard';
import { ChampionModal } from '@/components/yac/ChampionModal';
import { KenyaFootprint } from '@/components/yac/KenyaFootprint';
import { CHAMPIONS, type YACProfile } from '@/lib/yac';

const STATS = [
  { value: '12', label: 'Champions' },
  { value: '05', label: 'Counties' },
  { value: '100%', label: 'Data verified' },
] as const;

export default function Home() {
  const [selected, setSelected] = useState<YACProfile | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      {/* ── Masthead — hairline editorial header ── */}
      <header className="no-print sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-16">
          <a href="#top" className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-white" aria-label="Centre for the Study of Adolescence logo">
              <Image
                src="/csa-logo.png"
                alt=""
                width={36}
                height={36}
                className="scale-[1.46] object-contain"
                priority
              />
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-lg tracking-[-0.01em] text-pine">
                YAC — Digital Portfolio
              </span>
              <span className="caps-label block text-[9px] text-ink-soft">CSA Kenya · INSPIRE Lab</span>
            </span>
          </a>
          <div className="flex items-center gap-6">
            <span className="caps-label hidden text-[9px] text-ink-soft md:block">
              Nairobi, Kenya — 2026
            </span>
            <Link
              href="/dossier"
              className="hidden items-center gap-1.5 rounded-[2px] border border-line bg-canvas px-3 py-1.5 text-[12.5px] font-medium text-pine transition-colors duration-200 hover:bg-ivory sm:inline-flex"
            >
              <FileText className="h-3.5 w-3.5" /> PDF Dossier
            </Link>
            <a
              href="#portfolios"
              className="hidden rounded-[2px] bg-slatedark px-4 py-2 text-[13px] font-medium text-canvas transition-colors duration-300 hover:bg-terra sm:inline-block"
            >
              The Twelve Portfolios
            </a>
          </div>
        </div>
      </header>

      {/* ── Nº 01 — The Cohort ── */}
      <section id="top" className="border-b border-line">
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="fade-up lg:col-span-8">
              <p className="caps-label text-terra">Nº 01 — The Cohort · Youth Advocacy Champions</p>
              <h1 className="mt-6 max-w-3xl font-serif text-[2.5rem] leading-[1.06] tracking-[-0.03em] text-pine sm:text-6xl lg:text-[4.25rem]">
                Twelve young Kenyans turning lived experience into{' '}
                <em className="italic text-terra">policy evidence</em>.
              </h1>
            </div>
            <div className="fade-up flex flex-col justify-end lg:col-span-4">
              <p className="max-w-md text-[15px] leading-[1.65] text-ink-soft">
                Legal reform, GIS &amp; spatial data, health communication, grassroots
                mobilisation — the working portfolios of the 12 Youth Advocacy Champions,
                verified county by county. Open any profile to read it in full.
              </p>
              <p className="caps-label mt-5 flex items-center gap-2 text-[9px] text-ink-soft">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-forest" aria-hidden="true" />
                All 12 ages &amp; counties verified — zero-inference policy
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-14 grid grid-cols-3 gap-6 border-t border-line pt-6 sm:mt-16">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-4xl tracking-[-0.02em] text-pine sm:text-5xl">{s.value}</p>
                <p className="caps-label mt-2 text-[9px] text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Nº 02 — The portfolios ── */}
      <main className="flex-1">
        <section
          aria-label="The 12 champion portfolios"
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-16"
        >
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
            <div>
              <p className="caps-label text-terra">Nº 02 — Portfolios</p>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-pine sm:text-4xl">
                Selected champions &amp; <em className="italic text-forest">field profiles</em>
              </h2>
            </div>
            <p className="caps-label text-[9px] text-ink-soft">12 profiles — 2024–2026</p>
          </div>

          {/* Hairline archive grid — one specimen sheet, twelve plates */}
          <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {CHAMPIONS.map((c, i) => (
              <ChampionCard key={c.id} champion={c} index={i} onSelect={setSelected} />
            ))}
          </div>
        </section>

        {/* ── Nº 03 — Field footprint (Excluded from print) ── */}
        <section aria-label="Sub-national footprint" className="no-print border-t border-line">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-16">
            <div className="mb-10 max-w-2xl border-b border-line pb-6">
              <p className="caps-label text-terra">Nº 03 — Field Footprint</p>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-pine sm:text-4xl">
                Where the twelve <em className="italic text-forest">work</em>
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-[1.65] text-ink-soft">
                Live cohort distribution across five operational counties — from the Lake
                Victoria basin to the capital&apos;s policy hub and the coastal climate
                corridor.
              </p>
            </div>
            <KenyaFootprint onSelect={setSelected} />
          </div>
        </section>
      </main>

      {/* ── Colophon ── */}
      <footer className="no-print border-t border-line bg-canvas">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-8 sm:flex-row sm:items-center sm:px-6 lg:px-16">
          <p className="font-serif text-base tracking-[-0.01em] text-pine">
            YAC Digital Portfolio — The Twelve
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/dossier"
              className="caps-label text-[9.5px] text-terra underline-offset-4 hover:underline"
            >
              View Complete PDF Dossier &rarr;
            </Link>
            <span className="text-ink-soft/40">·</span>
            <p className="caps-label text-[9px] text-ink-soft">
              Centre for the Study of Adolescence (CSA Kenya) · csakenya.org
            </p>
          </div>
        </div>
      </footer>

      {/* Portfolio deep-dive */}
      <ChampionModal champion={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
