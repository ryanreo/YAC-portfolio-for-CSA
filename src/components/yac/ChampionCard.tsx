'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { PILLAR_SHORT, type YACProfile } from '@/lib/yac';
import { MapPin, ShieldCheck, Quote, ArrowUpRight } from 'lucide-react';

export function ChampionCard({
  champion,
  onSelect,
}: {
  champion: YACProfile;
  onSelect: (c: YACProfile) => void;
}) {
  const initials = champion.fullName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-csa/40 hover:shadow-[0_16px_40px_-16px_rgba(0,43,73,0.25)]">
      {/* Top: identity */}
      <div className="relative bg-gradient-to-br from-navy via-navy-700 to-navy-600 px-5 pb-12 pt-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '18px 18px',
          }}
        />
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/90 ring-1 ring-white/15">
              <MapPin className="h-3 w-3 text-csa" aria-hidden="true" />
              {champion.county}
            </span>
            {champion.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gold ring-1 ring-gold/30">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            )}
          </div>
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-sm font-extrabold text-navy ring-2 ring-white/25"
            aria-hidden="true"
          >
            {champion.age}
            <span className="sr-only">years old</span>
          </span>
        </div>
      </div>

      {/* Photo overlapping card edge */}
      <button
        onClick={() => onSelect(champion)}
        className="relative z-10 -mt-11 mx-auto block rounded-full outline-offset-4"
        aria-label={`View full profile of ${champion.fullName}`}
      >
        <span className="block rounded-full bg-white p-1 shadow-lg ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-[1.04]">
          <span className="relative block h-24 w-24 overflow-hidden rounded-full">
            {champion.headshotUrl ? (
              <Image
                src={champion.headshotUrl}
                alt={`Portrait of ${champion.fullName}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center bg-csa-50 text-xl font-extrabold text-csa-600">
                {initials}
              </span>
            )}
          </span>
        </span>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-3 text-center">
        <h3 className="text-base font-extrabold tracking-tight text-navy">{champion.fullName}</h3>
        <p className="mt-1 text-xs font-semibold text-csa-600">{champion.primaryRole}</p>

        {champion.impactTagline && (
          <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-gold-50 p-2.5 text-left text-[11px] font-medium leading-relaxed text-navy/80">
            <Quote className="mt-0.5 h-3 w-3 shrink-0 text-gold-600" aria-hidden="true" />
            {champion.impactTagline}
          </p>
        )}

        <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-500">{champion.shortBio}</p>

        {/* Pillars */}
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {champion.thematicPillars.map((p) => (
            <Badge
              key={p}
              variant="secondary"
              className="rounded-full border border-slate-200 bg-slate-csa px-2.5 py-0.5 text-[10px] font-bold text-navy/70"
            >
              {PILLAR_SHORT[p]}
            </Badge>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <button
            onClick={() => onSelect(champion)}
            className="inline-flex items-center gap-1 text-xs font-extrabold text-csa-600 transition-colors hover:text-navy"
            aria-label={`Open full profile of ${champion.fullName}`}
          >
            View full profile
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
