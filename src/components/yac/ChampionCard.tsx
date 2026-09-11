'use client';

import Image from 'next/image';
import { PILLAR_SHORT, type YACProfile } from '@/lib/yac';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

export function ChampionCard({
  champion,
  index,
  onSelect,
}: {
  champion: YACProfile;
  index: number;
  onSelect: (c: YACProfile) => void;
}) {
  const num = String(index + 1).padStart(2, '0');
  const initials = champion.fullName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <article className="group relative flex flex-col bg-ivory">
      {/* Plate — matted portrait, template-style internal matte padding */}
      <button
        onClick={() => onSelect(champion)}
        aria-label={`View full portfolio of ${champion.fullName}`}
        className="relative block w-full text-left"
      >
        <span className="block p-3 pb-0 sm:p-3.5 sm:pb-0">
          <span className="relative block aspect-square w-full overflow-hidden rounded-[2px] bg-sage/50">
            {champion.headshotUrl ? (
              <Image
                src={champion.headshotUrl}
                alt={`Portrait of ${champion.fullName}`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.02]"
              />
            ) : (
              <span className="grid h-full w-full place-items-center font-serif text-3xl italic text-forest">
                {initials}
              </span>
            )}
          </span>
        </span>
        <span className="absolute left-3 top-3 rounded-full border border-line bg-canvas/95 px-2.5 py-1 font-serif text-[11px] italic leading-none text-pine sm:left-3.5 sm:top-3.5">
          Nº {num}
        </span>
      </button>

      {/* Caption block */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-serif text-xl leading-tight tracking-[-0.01em] text-pine">
          {champion.fullName}
        </h3>
        <p className="caps-label mt-2 text-[9.5px] leading-relaxed text-terra">
          {champion.primaryRole}
        </p>

        <div className="mt-4 border-t border-line pt-3">
          <p className="caps-label flex flex-wrap items-center gap-x-2 gap-y-1 text-[9px] text-ink-soft">
            <span>
              {champion.county} County · {champion.age} yrs
            </span>
            {champion.verified && (
              <span className="inline-flex items-center gap-1 text-forest">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Verified
              </span>
            )}
          </p>
        </div>

        <p className="mt-3 line-clamp-3 text-[13px] leading-[1.6] text-ink-soft">
          {champion.shortBio}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {champion.thematicPillars.map((p) => (
            <span
              key={p}
              className="rounded-full border border-line bg-sage/60 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-forest"
            >
              {PILLAR_SHORT[p]}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <button
            onClick={() => onSelect(champion)}
            aria-label={`Open full profile of ${champion.fullName}`}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-pine underline decoration-line underline-offset-4 transition-colors duration-200 hover:text-terra hover:decoration-terra"
          >
            View Portfolio
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
