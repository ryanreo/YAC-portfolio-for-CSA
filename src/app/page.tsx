'use client';

import { useState } from 'react';
import { Navbar } from '@/components/yac/Navbar';
import { Hero } from '@/components/yac/Hero';
import { KenyaMap } from '@/components/yac/KenyaMap';
import { TeamSection } from '@/components/yac/TeamSection';
import { ChampionModal } from '@/components/yac/ChampionModal';
import { EngageDrawer } from '@/components/yac/EngageDrawer';
import { Footer } from '@/components/yac/Footer';
import { Button } from '@/components/ui/button';
import { CHAMPIONS, type KenyaCounty, type ThematicPillar, type YACProfile } from '@/lib/yac';
import { Compass, FlaskConical, Landmark, Printer } from 'lucide-react';

export default function Home() {
  const [search, setSearch] = useState('');
  const [activePillars, setActivePillars] = useState<ThematicPillar[]>([]);
  const [activeCounty, setActiveCounty] = useState<KenyaCounty | null>(null);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [selected, setSelected] = useState<YACProfile | null>(null);
  const [engageOpen, setEngageOpen] = useState(false);
  const [engageChampion, setEngageChampion] = useState<YACProfile | null>(null);

  const togglePillar = (p: ThematicPillar) =>
    setActivePillars((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const openEngage = (champion?: YACProfile) => {
    setEngageChampion(champion ?? null);
    setEngageOpen(true);
  };

  const selectCounty = (c: KenyaCounty | null) => {
    setActiveCounty(c);
    document.getElementById('team')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onEngage={() => openEngage()} />

      <main className="flex-1">
        <Hero onEngage={() => openEngage()} />

        {/* ── Who We Are ── */}
        <section id="about" className="scroll-mt-20 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="section-label">Who We Are</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                Authentic youth leadership, backed by multidisciplinary technical rigour
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-500">
                The Youth Evidence-to-Policy Digital Portfolio transforms static Word biographies into an
                interactive showcase of the INSPIRE-Kenya champion cohort. 75% of champions are aged 21–26,
                bridging frontline adolescent lived experience with legal, spatial GIS, and health expertise —
                so donors and county directorates can find — and fund — the exact evidence capacity they need.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: Compass,
                  title: 'Evidence, not anecdotes',
                  body: 'Every profile carries verified age, county, academic background, and competency data — audited 12/12 under a strict zero-inference policy.',
                },
                {
                  icon: FlaskConical,
                  title: 'Lived experience to policy impact',
                  body: 'Champions work where policy is made: county technical working groups, assemblies, and national ministries — translating research into reform.',
                },
                {
                  icon: Landmark,
                  title: 'Sub-national by design',
                  body: 'From Nairobi’s policy hub to the Lake Victoria basin and the coastal climate corridor, the cohort covers five operational counties.',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="group rounded-3xl border border-slate-200 bg-slate-csa/40 p-6 transition-all hover:-translate-y-0.5 hover:border-csa/40 hover:bg-white hover:shadow-lg"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-navy text-white transition-colors group-hover:bg-csa">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold tracking-tight text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Team ── */}
        <section id="team" className="scroll-mt-20 bg-slate-csa py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="section-label">The Team</p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                  Meet the {CHAMPIONS.length} champions
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Search across names, counties, ages, institutions, and skills — or filter by thematic
                  pillar. Open any profile for a deep-dive into competencies and affiliations.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="no-print hidden rounded-full border-navy/20 font-bold text-navy hover:bg-navy hover:text-white md:inline-flex"
              >
                <Printer className="mr-2 h-4 w-4" />
                Export Cohort Dossier
              </Button>
            </div>

            <div className="mt-8">
              <TeamSection
                search={search}
                onSearch={setSearch}
                activePillars={activePillars}
                onTogglePillar={togglePillar}
                activeCounty={activeCounty}
                onCounty={setActiveCounty}
                view={view}
                onView={setView}
                onSelect={setSelected}
              />
            </div>
          </div>
        </section>

        {/* ── Footprint map ── */}
        <section id="footprint" className="scroll-mt-20 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <p className="section-label">Sub-National Footprint</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
                Five counties, three corridors
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Live cohort statistics by county. Click any pin to jump to the matching champions.
              </p>
            </div>
            <KenyaMap activeCounty={activeCounty} onSelectCounty={selectCounty} />
          </div>
        </section>

        {/* ── Engage ── */}
        <section id="engage" className="scroll-mt-20 bg-slate-csa py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[28px] bg-navy text-white shadow-xl">
              <div className="relative px-6 py-12 sm:px-10 sm:py-14">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                  }}
                />
                <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-csa/30 blur-[100px]" />
                <div className="relative max-w-2xl">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-200 ring-1 ring-white/15">
                    Why fund this lab
                  </p>
                  <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Donors don&apos;t fund lists of names — they fund capacity, evidence &amp; scalability
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                    Commission a technical sprint with the champions. Each engagement is scoped with CSA
                    Kenya&apos;s lab focal points and delivered through county-anchored youth expertise.
                  </p>
                </div>

                <div className="relative mt-8 grid gap-4 md:grid-cols-3">
                  {[
                    {
                      title: 'Sub-national policy scorecards',
                      body: 'County-level scorecards tracking adolescent health & SRHR policy commitments.',
                    },
                    {
                      title: 'County youth TWG representation',
                      body: 'Placed, prepared youth representation in county technical working groups.',
                    },
                    {
                      title: 'Rapid surveys & GIS mapping',
                      body: 'Grassroots data collection, spatial analysis, and evidence visualisation.',
                    },
                  ].map((o) => (
                    <div key={o.title} className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/10">
                      <h3 className="text-sm font-extrabold text-gold">{o.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-300">{o.body}</p>
                    </div>
                  ))}
                </div>

                <div className="relative mt-8">
                  <Button
                    onClick={() => openEngage()}
                    size="lg"
                    className="rounded-full bg-gold px-7 font-bold text-navy shadow-lg shadow-gold/20 hover:bg-gold-600 hover:text-navy"
                  >
                    Commission an Evidence Sprint
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onEngage={() => openEngage()} />

      {/* Overlays */}
      <ChampionModal
        champion={selected}
        onClose={() => setSelected(null)}
        onEngage={(c) => {
          setSelected(null);
          openEngage(c);
        }}
      />
      <EngageDrawer
        open={engageOpen}
        onClose={() => setEngageOpen(false)}
        champion={engageChampion}
      />
    </div>
  );
}
