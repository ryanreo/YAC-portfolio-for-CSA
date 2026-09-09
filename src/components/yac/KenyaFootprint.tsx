'use client';

import Image from 'next/image';
import { CHAMPIONS, COUNTY_META, type KenyaCounty, type YACProfile } from '@/lib/yac';

/**
 * Sub-national footprint ledger.
 * Uses the exact satellite field-node map from the Atelier Editorial template
 * (upload/stitch_editorial_minimalist_portfolio.zip) — rendered at full opacity —
 * with the 12 YACs' own portraits pinned at their five operational counties.
 * Selecting any portrait opens that champion's full portfolio.
 */
const PIN_POS: Record<KenyaCounty, { cls: string; label: 'above' | 'below' | 'right' }> = {
  Nairobi: { cls: 'top-[52%] left-[53%]', label: 'below' },
  Kisumu: { cls: 'top-[50%] left-[23%] -translate-x-[30px]', label: 'right' },
  Siaya: { cls: 'top-[38%] left-[15%]', label: 'above' },
  'Homa Bay': { cls: 'top-[62%] left-[23%]', label: 'below' },
  Kilifi: { cls: 'top-[56%] left-[74%]', label: 'below' },
};

export function KenyaFootprint({ onSelect }: { onSelect: (c: YACProfile) => void }) {
  return (
    <div className="relative w-full overflow-hidden rounded-sm bg-[#0c1613] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* ── Map canvas (exact template Kenya outline, undimmed) ── */}
        <div className="relative min-h-[300px] overflow-hidden lg:col-span-8 lg:min-h-[430px]">
          <div
            role="img"
            aria-label="Satellite field-node map of East Africa showing the Kenya country outline with city lights — Kampala, Kisumu, Eldoret, Nairobi and Mombasa"
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: "url('/kenya/field-nodes.jpg')" }}
          />

          {/* Portrait pins — the champions themselves, pinned to their counties */}
          {COUNTY_META.map((c) => {
            const members = CHAMPIONS.filter((x) => x.county === c.name);
            const pos = PIN_POS[c.name];
            const isHub = c.name === 'Nairobi';
            const chip = (
              <div
                className={`hidden w-max whitespace-nowrap rounded-[2px] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm sm:block ${
                  isHub
                    ? 'bg-[#a4d0ba]/95 text-[#0c1613]'
                    : 'bg-[#0c1613]/85 text-white/85'
                }`}
              >
                {c.name} — {members.length} {members.length === 1 ? 'YAC' : 'YACs'}
              </div>
            );
            return (
              <div
                key={c.name}
                className={`absolute z-10 flex -translate-y-1/2 items-center ${
                  pos.label === 'right' ? 'flex-row gap-1.5' : 'flex-col -translate-x-1/2'
                } ${pos.cls}`}
              >
                {pos.label === 'above' && chip}
                <div
                  className={
                    members.length > 2
                      ? 'grid grid-cols-3 gap-1'
                      : `flex items-center ${members.length > 1 ? '-space-x-1.5' : ''}`
                  }
                >
                  {members.map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => onSelect(ch)}
                      title={`${ch.fullName} — ${ch.county} County`}
                      aria-label={`Open the portfolio of ${ch.fullName}, ${ch.county} County`}
                      className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-[#0c1613] bg-forest ring-1 ring-white/30 transition-all duration-200 hover:z-20 hover:scale-[1.15] hover:ring-[#a4d0ba] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4d0ba] lg:h-9 lg:w-9"
                    >
                      {ch.headshotUrl && (
                        <Image
                          src={ch.headshotUrl}
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
                {(pos.label === 'below' || pos.label === 'right') && chip}
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
            <p className="mt-3 font-serif text-[13px] italic leading-relaxed text-white/60">
              Select any portrait on the map to open that champion&apos;s full portfolio.
            </p>
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
