'use client';

import { CHAMPIONS, COUNTY_META, type KenyaCounty } from '@/lib/yac';

/**
 * Sub-national footprint ledger.
 * Uses the exact satellite field-node map from the Atelier Editorial template
 * (upload/stitch_editorial_minimalist_portfolio.zip) with restrained editorial
 * pins for the 12 YACs' five operational counties.
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
    <div className="relative w-full overflow-hidden rounded-sm bg-[#0c1613] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* ── Map canvas (exact template Kenya outline) ── */}
        <div className="relative min-h-[300px] overflow-hidden lg:col-span-8 lg:min-h-[430px]">
          <div
            role="img"
            aria-label="Satellite field-node map of East Africa showing the Kenya country outline with city lights — Kampala, Kisumu, Eldoret, Nairobi and Mombasa"
            className="h-full w-full bg-cover bg-center opacity-90 transition-opacity duration-500 hover:opacity-100"
            style={{ backgroundImage: "url('/kenya/field-nodes.jpg')" }}
          />

          {/* County pins — restrained, editorial */}
          {COUNTY_META.map((c) => {
            const pos = PIN_POS[c.name];
            const count = CHAMPIONS.filter((x) => x.county === c.name).length;
            const isHub = c.name === 'Nairobi';
            return (
              <div
                key={c.name}
                className="absolute"
                style={{ top: pos.top, left: pos.left }}
              >
                <div className="relative flex items-center justify-center">
                  {isHub && (
                    <span className="pin-ping absolute inline-flex h-7 w-7 rounded-full bg-[#a4d0ba]/40" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full ${
                      isHub
                        ? 'h-3 w-3 border border-[#0c1613] bg-[#a4d0ba]'
                        : 'h-2 w-2 bg-terra'
                    }`}
                  />
                </div>
                <div
                  className={`pointer-events-none mt-1.5 whitespace-nowrap rounded-[2px] backdrop-blur-sm ${
                    pos.labelShift
                  } ${
                    isHub
                      ? 'bg-[#a4d0ba]/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#0c1613]'
                      : 'bg-[#0c1613]/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/85'
                  }`}
                >
                  {c.name} — {count} {count === 1 ? 'YAC' : 'YACs'}
                </div>
              </div>
            );
          })}

          {/* Coordinate tag */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-[2px] bg-[#0c1613]/85 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/55 backdrop-blur-sm">
            <span className="h-1 w-1 rounded-full bg-[#a4d0ba]" />
            12 YACs · 5 Counties · Lat 0.0236° S, Lon 37.9062° E
          </div>
        </div>

        {/* ── Ledger panel ── */}
        <div className="flex flex-col justify-between gap-8 bg-forest p-6 sm:p-8 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <span className="caps-label text-[9px] text-white/60">Sub-National Footprint</span>
              <span className="caps-label inline-flex items-center gap-1.5 text-[9px] text-white/60">
                <span className="h-1 w-1 rounded-full bg-[#a4d0ba]" />
                Verified
              </span>
            </div>
            <h3 className="mt-5 font-serif text-2xl leading-[1.25] tracking-[-0.01em] text-white">
              Five counties, three corridors of{' '}
              <em className="italic text-[#a4d0ba]">youth evidence</em>
            </h3>
            <ul className="mt-6">
              {COUNTY_META.map((c) => {
                const count = CHAMPIONS.filter((x) => x.county === c.name).length;
                return (
                  <li
                    key={c.name}
                    className="flex items-start justify-between gap-4 border-b border-white/10 py-3"
                  >
                    <div>
                      <p className="font-serif text-base leading-snug text-white">
                        {c.name} County
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-white/50">
                        {c.regionNote}
                      </p>
                    </div>
                    <span className="mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/25 font-serif text-sm text-white">
                      {count}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="caps-label text-[8.5px] leading-relaxed text-white/40">
            Regional clusters — Lake Victoria Basin · Capital &amp; National Policy Hub ·
            Coastal Marine &amp; Climate Corridor
          </p>
        </div>
      </div>
    </div>
  );
}
