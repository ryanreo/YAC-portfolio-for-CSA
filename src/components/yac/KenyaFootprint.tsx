'use client';

import { CHAMPIONS, COUNTY_META, type KenyaCounty } from '@/lib/yac';

/**
 * Sub-national footprint panel.
 * Uses the exact satellite field-node map from the Atelier Editorial template
 * (upload/stitch_editorial_minimalist_portfolio.zip) with glowing hub pins
 * adapted to the 12 YACs' five operational counties.
 */
const PIN_POS: Record<KenyaCounty, { top: string; left: string; labelShift: string }> = {
  Nairobi: { top: '52%', left: '53%', labelShift: '-translate-x-1/2' },
  Kisumu: { top: '50%', left: '23%', labelShift: '-translate-x-1/2' },
  Siaya: { top: '43%', left: '19%', labelShift: '-translate-x-1/2' },
  'Homa Bay': { top: '58%', left: '23%', labelShift: '-translate-x-1/2' },
  Kilifi: { top: '56%', left: '73%', labelShift: '-translate-x-1/2' },
};

export function KenyaFootprint() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-[#0c1613] text-white shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* ── Map canvas (exact template image) ── */}
        <div className="relative min-h-[300px] overflow-hidden lg:col-span-8 lg:min-h-[420px]">
          <div
            role="img"
            aria-label="Satellite field-node map of East Africa showing the Kenya country outline with city lights — Kampala, Kisumu, Eldoret, Nairobi and Mombasa"
            className="h-full w-full bg-cover bg-center opacity-90 transition-opacity duration-500 hover:opacity-100"
            style={{ backgroundImage: "url('/kenya/field-nodes.jpg')" }}
          />

          {/* Glowing county pins */}
          {COUNTY_META.map((c) => {
            const pos = PIN_POS[c.name];
            const count = CHAMPIONS.filter((x) => x.county === c.name).length;
            const isHub = c.name === 'Nairobi';
            return (
              <div
                key={c.name}
                className="group absolute cursor-default"
                style={{ top: pos.top, left: pos.left }}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className={`animate-ping absolute inline-flex rounded-full opacity-60 ${
                      isHub ? 'h-8 w-8 bg-csa' : 'h-6 w-6 bg-amber'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full ${
                      isHub
                        ? 'h-4 w-4 border-2 border-[#0c1613] bg-csa'
                        : 'h-3.5 w-3.5 bg-amber'
                    }`}
                  />
                </div>
                <div
                  className={`pointer-events-none mt-1 whitespace-nowrap rounded backdrop-blur-sm ${
                    pos.labelShift
                  } ${
                    isHub
                      ? 'bg-csa-600/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md'
                      : 'bg-[#0c1613]/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/85'
                  }`}
                >
                  {c.name} — {count} {count === 1 ? 'YAC' : 'YACs'}
                </div>
              </div>
            );
          })}

          {/* Coordinate tag */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded bg-[#0c1613]/85 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-csa" />
            12 YACs • 5 Counties • Lat 0.0236° S, Lon 37.9062° E
          </div>
        </div>

        {/* ── Side panel ── */}
        <div className="flex flex-col justify-between gap-8 bg-forest p-6 sm:p-8 lg:col-span-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-csa-50/80">
                Sub-National Footprint
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-csa-50/80">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
                Verified data
              </span>
            </div>
            <h3 className="text-xl font-extrabold leading-snug tracking-tight text-white">
              Five counties, three corridors of youth evidence
            </h3>
            <ul className="space-y-2.5">
              {COUNTY_META.map((c) => {
                const count = CHAMPIONS.filter((x) => x.county === c.name).length;
                return (
                  <li
                    key={c.name}
                    className="flex items-start justify-between gap-3 rounded-lg bg-white/5 px-3.5 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-extrabold text-white">{c.name} County</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-white/55">{c.regionNote}</p>
                    </div>
                    <span className="mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber text-xs font-extrabold text-forest">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
            Regional clusters — Lake Victoria Basin • Capital &amp; National Policy Hub • Coastal Marine &amp; Climate Corridor
          </p>
        </div>
      </div>
    </div>
  );
}
