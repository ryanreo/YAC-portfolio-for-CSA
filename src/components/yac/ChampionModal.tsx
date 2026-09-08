'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PILLAR_SHORT, type YACProfile } from '@/lib/yac';
import {
  MapPin,
  ShieldCheck,
  GraduationCap,
  Quote,
  Building2,
  Wrench,
  Cake,
  FileText,
  Handshake,
} from 'lucide-react';

export function ChampionModal({
  champion,
  onClose,
  onEngage,
}: {
  champion: YACProfile | null;
  onClose: () => void;
  onEngage: (champion: YACProfile) => void;
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
      <DialogContent className="max-h-[88vh] overflow-y-auto border-slate-200 p-0 sm:max-w-2xl">
        {champion && (
          <div>
            {/* Header band */}
            <div className="relative bg-gradient-to-br from-navy via-navy-700 to-navy-600 px-6 pb-16 pt-7 text-white sm:px-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
                  backgroundSize: '18px 18px',
                }}
              />
              <DialogHeader className="relative text-left">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="relative mx-auto block h-28 w-28 shrink-0 overflow-hidden rounded-full ring-4 ring-gold/70 sm:mx-0">
                    {champion.headshotUrl ? (
                      <Image
                        src={champion.headshotUrl}
                        alt={`Portrait of ${champion.fullName}`}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center bg-csa-50 text-2xl font-extrabold text-csa-600">
                        {initials}
                      </span>
                    )}
                  </span>
                  <div className="text-center sm:text-left">
                    <DialogTitle className="text-2xl font-extrabold tracking-tight">
                      {champion.fullName}
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm font-semibold text-cyan-200">
                      {champion.primaryRole}
                    </DialogDescription>
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:justify-start">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-white/15">
                        <MapPin className="h-3 w-3 text-csa" aria-hidden="true" />
                        {champion.county} County
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-white/15">
                        <Cake className="h-3 w-3 text-gold" aria-hidden="true" />
                        {champion.age} years
                      </span>
                      {champion.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold ring-1 ring-gold/30">
                          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                          Data Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>
            </div>

            {/* Body */}
            <div className="space-y-6 px-6 py-6 sm:px-8">
              {champion.impactTagline && (
                <blockquote className="flex items-start gap-3 rounded-2xl border-l-4 border-gold bg-gold-50 p-4">
                  <Quote className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold leading-relaxed text-navy">
                      &ldquo;{champion.impactTagline}&rdquo;
                    </p>
                    <cite className="mt-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-gold-600 not-italic">
                      Lived Experience → Policy Impact
                    </cite>
                  </div>
                </blockquote>
              )}

              {/* Bio */}
              <section aria-label="Biography">
                <h4 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-csa-600">Biography</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{champion.shortBio}</p>
                {champion.fullBio && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{champion.fullBio}</p>
                )}
              </section>

              <Separator />

              {/* Academic background */}
              <section aria-label="Academic background" className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-csa-50">
                  <GraduationCap className="h-4.5 w-4.5 text-csa-600" aria-hidden="true" />
                </span>
                <div>
                  <h4 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-csa-600">
                    Academic Background
                  </h4>
                  <p className="mt-1 text-sm font-semibold text-navy">{champion.academicBackground}</p>
                </div>
              </section>

              {/* Skills */}
              <section aria-label="Skills and tools">
                <h4 className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-csa-600">
                  <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                  Competencies &amp; Tools
                </h4>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {champion.skillsAndTools.map((s) => (
                    <Badge
                      key={s}
                      className="rounded-full bg-navy px-3 py-1 text-[11px] font-bold text-white hover:bg-navy-700"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </section>

              {/* Pillars */}
              <section aria-label="Thematic pillars">
                <h4 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-csa-600">
                  Thematic Pillars
                </h4>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {champion.thematicPillars.map((p) => (
                    <Badge
                      key={p}
                      variant="outline"
                      className="rounded-full border-csa/40 bg-csa-50 px-3 py-1 text-[11px] font-bold text-csa-600"
                    >
                      {PILLAR_SHORT[p]}
                    </Badge>
                  ))}
                </div>
              </section>

              {/* Affiliations */}
              <section aria-label="Affiliations">
                <h4 className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-csa-600">
                  <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Affiliations &amp; Movements
                </h4>
                <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                  {champion.affiliations.map((a) => (
                    <li
                      key={a}
                      className="flex items-start gap-2 rounded-xl bg-slate-csa px-3 py-2 text-xs font-medium leading-snug text-navy/80"
                    >
                      <Handshake className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
                      {a}
                    </li>
                  ))}
                </ul>
              </section>

              {/* CTA */}
              <div className="flex flex-col gap-2 rounded-2xl bg-navy p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <FileText className="h-4 w-4 text-gold" aria-hidden="true" />
                  Engage this champion for a policy working group or evidence brief.
                </p>
                <Button
                  onClick={() => onEngage(champion)}
                  className="shrink-0 rounded-full bg-gold font-bold text-navy hover:bg-gold-600 hover:text-navy"
                >
                  Request Brief
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
