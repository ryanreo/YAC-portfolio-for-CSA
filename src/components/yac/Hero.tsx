'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { COHORT_STATS } from '@/lib/yac';
import { ArrowDown, ShieldCheck, Users, MapPin, Cake, TrendingUp } from 'lucide-react';

export function Hero({ onEngage }: { onEngage: () => void }) {
  return (
    <section id="home" className="relative overflow-hidden bg-navy text-white">
      {/* Decorative grid + glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] h-[480px] w-[480px] rounded-full bg-csa/25 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-30%] left-[-8%] h-[420px] w-[420px] rounded-full bg-gold/15 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-20 lg:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <div className="fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-200 ring-1 ring-white/15">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              INSPIRE-Kenya • Youth Evidence to Policy Lab
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              12 Youth Advocacy Champions driving{' '}
              <span className="relative text-gold sm:whitespace-nowrap">
                sub-national change
              </span>{' '}
              across Kenya
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              An interactive portfolio of verified young leaders — spanning legal reform, GIS &amp; spatial data,
              health communication, and grassroots mobilisation — turning frontline adolescent lived experience
              into evidence-based policy.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-csa px-6 font-bold text-white shadow-lg shadow-csa/30 hover:bg-csa-600"
              >
                <a href="#team">
                  Meet the Champions
                  <ArrowDown className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                onClick={onEngage}
                variant="outline"
                className="rounded-full border-white/30 bg-transparent px-6 font-bold text-white hover:bg-white/10 hover:text-white"
              >
                Commission an Evidence Sprint
              </Button>
            </div>

            {/* Verification note */}
            <p className="mt-7 flex items-center gap-2 text-xs font-medium text-slate-400">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
              All 12 ages &amp; counties verified • Zero-inference data policy
            </p>
          </div>

          {/* Photo card */}
          <div className="fade-up relative [animation-delay:150ms]">
            <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-gold/40 via-transparent to-csa/40 blur-xl" aria-hidden="true" />
            <figure className="relative overflow-hidden rounded-3xl ring-1 ring-white/20 shadow-2xl">
              <Image
                src="/champions/cohort-group-photo.jpg"
                alt="The 12 Youth Advocacy Champions of the INSPIRE-Kenya Youth Evidence to Policy Lab at a CSA Kenya convening"
                width={1200}
                height={800}
                priority
                className="h-full w-full object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/95 via-navy/60 to-transparent p-5 pt-14">
                <p className="text-sm font-bold">The Champion Cohort</p>
                <p className="text-xs text-slate-300">Youth Evidence to Policy Lab • CSA Kenya convening</p>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Stats strip */}
        <dl className="fade-up mt-14 grid grid-cols-2 gap-3 [animation-delay:300ms] sm:gap-4 lg:grid-cols-4">
          <StatCard icon={Users} value={String(COHORT_STATS.total)} label="Verified Champions" tone="cyan" />
          <StatCard icon={MapPin} value={String(COHORT_STATS.counties)} label="Operational Counties" tone="gold" />
          <StatCard icon={Cake} value={`${COHORT_STATS.ageMin}–${COHORT_STATS.ageMax}`} label="Age Range • Mean 25.7" tone="cyan" />
          <StatCard icon={TrendingUp} value={`${COHORT_STATS.youngYouthPct}%`} label="Aged 21–26 (Youth Density)" tone="gold" />
        </dl>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  tone: 'cyan' | 'gold';
}) {
  return (
    <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10 backdrop-blur-sm sm:p-5">
      <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
        <Icon className={`h-4 w-4 ${tone === 'cyan' ? 'text-csa' : 'text-gold'}`} aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">{label}</span>
        <span className="sr-only">{label}</span>
      </dt>
      <dd className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {value}
      </dd>
      <dd className="mt-1 text-xs font-medium text-slate-400 sm:hidden">{label}</dd>
    </div>
  );
}
