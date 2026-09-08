'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { ChampionCard } from '@/components/yac/ChampionCard';
import { ChampionModal } from '@/components/yac/ChampionModal';
import { CHAMPIONS, type YACProfile } from '@/lib/yac';

export default function Home() {
  const [selected, setSelected] = useState<YACProfile | null>(null);

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Top band: brand + portfolio intro ── */}
      <header className="relative overflow-hidden bg-navy text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-csa/25 blur-[130px]" />
        <div aria-hidden="true" className="pointer-events-none absolute bottom-[-60%] left-[-8%] h-[380px] w-[380px] rounded-full bg-gold/15 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 sm:pb-16 lg:px-8">
          {/* Brand row */}
          <div className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-sm font-extrabold ring-1 ring-white/25"
              aria-hidden="true"
            >
              YAC
            </span>
            <div className="leading-tight">
              <p className="text-[13px] font-extrabold tracking-tight">YAC Digital Portfolio</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                CSA Kenya • INSPIRE Lab
              </p>
            </div>
          </div>

          {/* Intro */}
          <div className="mt-12 max-w-3xl sm:mt-14">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-200 ring-1 ring-white/15">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              One cohort • 12 portfolios
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              The 12 YACs —{' '}
              <span className="text-gold">Youth Advocacy Champions</span> of Kenya
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
              Legal reform, GIS &amp; spatial data, health communication, and grassroots
              mobilisation — twelve verified young leaders turning frontline adolescent
              lived experience into evidence-based policy. Open any profile to explore
              their portfolio.
            </p>
            <p className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
              All 12 ages &amp; counties verified • Zero-inference data policy
            </p>
          </div>
        </div>
      </header>

      {/* ── The 12 portfolios ── */}
      <main className="flex-1 bg-slate-csa">
        <section aria-label="The 12 champion portfolios" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <h2 className="sr-only">The 12 champion portfolios</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {CHAMPIONS.map((c) => (
              <ChampionCard key={c.id} champion={c} onSelect={setSelected} />
            ))}
          </div>
        </section>
      </main>

      {/* ── Minimal footer ── */}
      <footer className="mt-auto bg-navy text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p className="text-xs font-bold">YAC Digital Portfolio — the 12 Youth Advocacy Champions</p>
          <p className="text-[11px] font-medium text-slate-400">
            Centre for the Study of Adolescence (CSA Kenya) • csakenya.org
          </p>
        </div>
      </footer>

      {/* Portfolio deep-dive */}
      <ChampionModal champion={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
