'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Printer, ShieldCheck } from 'lucide-react';
import { CHAMPIONS, PILLAR_SHORT, type YACProfile } from '@/lib/yac';

const STATS = [
  { value: '12', label: 'Champions' },
  { value: '05', label: 'Counties' },
  { value: '100%', label: 'Data verified' },
] as const;

function SectionHead({ title, index }: { title: string; index: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-line pb-2">
      <h4 className="caps-label text-[10px] text-pine">{title}</h4>
      <span className="font-serif text-xs italic text-ink-soft/60" aria-hidden="true">
        {index}
      </span>
    </div>
  );
}

function ChampionDossierPlate({
  champion,
  index,
}: {
  champion: YACProfile;
  index: number;
}) {
  const num = String(index + 1).padStart(2, '0');
  const initials = champion.fullName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <article
      className="border border-line bg-ivory p-6 sm:p-8"
      style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
    >
      {/* Header with Photo & Identity */}
      <div className="flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-start">
        <div className="relative aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-[2px] border border-line bg-sage/50">
          {champion.headshotUrl ? (
            <Image
              src={champion.headshotUrl}
              alt={`Portrait of ${champion.fullName}`}
              fill
              sizes="144px"
              className="object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center font-serif text-3xl italic text-forest">
              {initials}
            </span>
          )}
          <span className="absolute left-2 top-2 rounded-full border border-line bg-canvas/95 px-2 py-0.5 font-serif text-[10px] italic leading-none text-pine">
            Nº {num}
          </span>
        </div>

        <div className="flex-1">
          <p className="caps-label text-[10px] text-terra">{champion.primaryRole}</p>
          <h3 className="mt-1 font-serif text-2xl tracking-[-0.02em] text-pine sm:text-3xl">
            {champion.fullName}
          </h3>
          <p className="caps-label mt-2 flex items-center gap-2 text-[10px] text-ink-soft">
            <span className="font-semibold text-pine">{champion.county} County</span>
            <span>·</span>
            <span>{champion.age} Years</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-forest">
              <ShieldCheck className="h-3 w-3" /> Data Verified
            </span>
          </p>

          {champion.impactTagline && (
            <blockquote className="mt-4 border-l-2 border-terra pl-4">
              <p className="font-serif text-base italic leading-snug text-forest">
                &ldquo;{champion.impactTagline}&rdquo;
              </p>
              <cite className="caps-label mt-1.5 block text-[8.5px] not-italic text-ink-soft">
                Lived Experience &rarr; Policy Impact
              </cite>
            </blockquote>
          )}
        </div>
      </div>

      {/* Full Biography & Credentials */}
      <div className="grid gap-6 pt-6 sm:grid-cols-12 sm:gap-8">
        {/* Left Column: Full Biography & Academic Background */}
        <div className="space-y-6 sm:col-span-7">
          <section aria-label="Biography">
            <SectionHead title="Full Biography" index="01" />
            <p className="mt-3 text-sm leading-[1.7] text-ink-soft">{champion.shortBio}</p>
            {champion.fullBio && (
              <p className="mt-3 text-sm leading-[1.7] text-ink-soft">{champion.fullBio}</p>
            )}
          </section>

          <section aria-label="Academic Background">
            <SectionHead title="Academic Background" index="02" />
            <p className="mt-2.5 font-serif text-base leading-snug text-pine">
              {champion.academicBackground}
            </p>
          </section>
        </div>

        {/* Right Column: Pillars, Competencies, Affiliations */}
        <div className="space-y-6 sm:col-span-5">
          <section aria-label="Thematic Pillars">
            <SectionHead title="Thematic Pillars" index="03" />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {champion.thematicPillars.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-sage/70 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-wider text-forest"
                >
                  {PILLAR_SHORT[p]}
                </span>
              ))}
            </div>
          </section>

          <section aria-label="Competencies & Tools">
            <SectionHead title="Competencies &amp; Tools" index="04" />
            <div className="mt-3 flex flex-wrap gap-1.5">
              {champion.skillsAndTools.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line bg-canvas px-2.5 py-1 text-[10.5px] font-medium text-ink-soft"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section aria-label="Affiliations & Working Groups">
            <SectionHead title="Affiliations &amp; Movements" index="05" />
            <ul className="mt-2 space-y-1.5">
              {champion.affiliations.map((a, i) => (
                <li key={a} className="flex items-baseline gap-2 text-xs text-ink-soft">
                  <span className="font-serif italic text-ink-soft/50">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}

export default function DossierPage() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      {/* ── Action Banner (Excluded from Print) ── */}
      <div className="no-print sticky top-0 z-50 border-b border-line bg-ivory/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-pine hover:text-terra"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Interactive Portfolio
          </Link>
          <div className="flex items-center gap-3">
            <a
              href="/YAC-Digital-Portfolio-CSA.pdf"
              download="YAC-Digital-Portfolio-CSA.pdf"
              className="hidden rounded-[2px] border border-line bg-canvas px-3 py-1.5 text-xs font-medium text-pine hover:bg-sage/40 sm:inline-block"
            >
              Download Pre-built PDF
            </a>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-[2px] bg-slatedark px-4 py-1.5 text-xs font-medium text-canvas hover:bg-terra"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Masthead ── */}
      <header className="border-b border-line bg-canvas px-4 py-8 sm:px-6 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-pine p-1 shadow-sm">
              <Image
                src="/csa-dossier-logo.png"
                alt="Centre for the Study of Adolescence logo"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </span>
            <div>
              <span className="caps-label block text-[10px] text-terra">
                Centre for the Study of Adolescence (CSA Kenya) · INSPIRE Lab
              </span>
              <h1 className="mt-1 font-serif text-3xl tracking-[-0.02em] text-pine sm:text-4xl">
                SRHR Youth Advocacy Champions — Executive Dossier
              </h1>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-serif text-sm italic text-forest">SRHR Youth Advocacy Champions</p>
            <p className="caps-label mt-1 text-[9px] text-ink-soft">Nairobi, Kenya — 2024–2026</p>
          </div>
        </div>
      </header>

      {/* ── Intro & Stats Strip ── */}
      <section className="border-b border-line bg-canvas px-4 py-10 sm:px-6 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="caps-label text-terra">Nº 01 — Executive Overview</p>
            <h2 className="mt-3 font-serif text-3xl leading-snug tracking-[-0.02em] text-pine sm:text-4xl">
              SRHR Youth Advocacy Champions — turning lived experience into{' '}
              <em className="italic text-terra">policy evidence</em>.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft">
              Legal reform, GIS &amp; spatial data, health communication, grassroots mobilisation —
              the complete working profiles of the Youth Advocacy Champions across five
              operational counties. All biographies, education, and credentials presented in full.
            </p>
            <p className="caps-label mt-4 flex items-center gap-2 text-[9.5px] text-ink-soft">
              <ShieldCheck className="h-3.5 w-3.5 text-forest" />
              All champion ages &amp; counties verified — zero-inference data contract
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-line pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl tracking-[-0.02em] text-pine sm:text-4xl">{s.value}</p>
                <p className="caps-label mt-1 text-[9px] text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The 12 Full Champion Dossier Plates ── */}
      <main className="mx-auto max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-16">
        <div className="mb-8 border-b border-line pb-4">
          <p className="caps-label text-terra">Nº 02 — Complete Champion Portfolios</p>
          <h2 className="mt-2 font-serif text-2xl tracking-[-0.01em] text-pine sm:text-3xl">
            Champion Profiles (Full Biographies)
          </h2>
        </div>

        <div className="space-y-8">
          {CHAMPIONS.map((champion, index) => (
            <ChampionDossierPlate key={champion.id} champion={champion} index={index} />
          ))}
        </div>
      </main>

      {/* ── Colophon ── */}
      <footer className="border-t border-line bg-canvas px-4 py-8 sm:px-6 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-pine p-1">
              <Image
                src="/csa-dossier-logo.png"
                alt="CSA Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </span>
            <p className="font-serif text-sm text-pine">
              SRHR Youth Advocacy Champions — Complete Executive Dossier
            </p>
          </div>
          <p className="caps-label text-[9.5px] text-ink-soft">
            Centre for the Study of Adolescence (CSA Kenya) · csakenya.org
          </p>
        </div>
      </footer>
    </div>
  );
}
