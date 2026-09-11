'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PILLAR_SHORT, type YACProfile } from '@/lib/yac';

function SectionHead({ title, index }: { title: string; index: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-line pb-2.5">
      <h4 className="caps-label text-[10px] text-pine">{title}</h4>
      <span className="font-serif text-xs italic text-ink-soft/60" aria-hidden="true">
        {index}
      </span>
    </div>
  );
}

export function ChampionModal({
  champion,
  onClose,
}: {
  champion: YACProfile | null;
  onClose: () => void;
}) {
  const initials = champion
    ? champion.fullName
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
    : '';

  return (
    <Dialog open={!!champion} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] overflow-y-auto rounded-sm border-line bg-canvas p-0 text-ink sm:max-w-2xl">
        {champion && (
          <div>
            {/* Plate header */}
            <div className="border-b border-line p-6 sm:p-8">
              <DialogHeader className="text-left">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <span className="relative mx-auto block aspect-[4/5] w-36 shrink-0 overflow-hidden rounded-[2px] bg-sage/50 sm:mx-0">
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
                  </span>
                  <div className="text-center sm:text-left">
                    <p className="caps-label text-[9.5px] leading-relaxed text-terra">
                      {champion.primaryRole}
                    </p>
                    <DialogTitle className="mt-2 font-serif text-3xl font-normal leading-[1.1] tracking-[-0.02em] text-pine sm:text-4xl">
                      {champion.fullName}
                    </DialogTitle>
                    <DialogDescription className="caps-label mt-4 text-[9px] text-ink-soft">
                      {champion.county} County · {champion.age} Years
                      {champion.verified ? ' · Data Verified' : ''}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* Dossier body */}
            <div className="space-y-8 p-6 sm:p-8">
              {champion.impactTagline && (
                <blockquote className="border-l-2 border-terra pl-5">
                  <p className="font-serif text-xl italic leading-[1.4] tracking-[-0.01em] text-forest">
                    &ldquo;{champion.impactTagline}&rdquo;
                  </p>
                  <cite className="caps-label mt-3 block text-[9px] not-italic text-ink-soft">
                    Lived Experience &rarr; Policy Impact
                  </cite>
                </blockquote>
              )}

              {/* 01 — Biography */}
              <section aria-label="Biography">
                <SectionHead title="Biography" index="01" />
                <p className="mt-3 text-sm leading-[1.7] text-ink-soft">{champion.shortBio}</p>
                {champion.fullBio && (
                  <p className="mt-3 text-sm leading-[1.7] text-ink-soft">{champion.fullBio}</p>
                )}
              </section>

              {/* 02 — Academic background */}
              <section aria-label="Academic background">
                <SectionHead title="Academic Background" index="02" />
                <p className="mt-3 font-serif text-lg leading-snug tracking-[-0.01em] text-pine">
                  {champion.academicBackground}
                </p>
              </section>

              {/* 03 — Competencies & tools */}
              <section aria-label="Competencies and tools">
                <SectionHead title="Competencies &amp; Tools" index="03" />
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {champion.skillsAndTools.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line bg-ivory px-3 py-1.5 text-[11px] font-medium text-ink-soft"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              {/* 04 — Thematic pillars */}
              <section aria-label="Thematic pillars">
                <SectionHead title="Thematic Pillars" index="04" />
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {champion.thematicPillars.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-sage/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-forest"
                    >
                      {PILLAR_SHORT[p]}
                    </span>
                  ))}
                </div>
              </section>

              {/* 05 — Affiliations */}
              <section aria-label="Affiliations and movements">
                <SectionHead title="Affiliations &amp; Movements" index="05" />
                <ul className="mt-1">
                  {champion.affiliations.map((a, i) => (
                    <li
                      key={a}
                      className="flex items-baseline gap-4 border-b border-line py-2.5 last:border-b-0"
                    >
                      <span
                        className="shrink-0 font-serif text-xs italic text-ink-soft/60"
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[13px] leading-snug text-ink-soft">{a}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
