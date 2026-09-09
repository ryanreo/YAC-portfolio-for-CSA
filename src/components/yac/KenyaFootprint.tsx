'use client';

import Image from 'next/image';
import { CHAMPIONS, COUNTY_META, type KenyaCounty, type YACProfile } from '@/lib/yac';

/**
 * Sub-national footprint ledger.
 * Base: the exact satellite field-node map from the Atelier Editorial template
 * (upload/stitch_editorial_minimalist_portfolio.zip), rendered undimmed.
 *
 * Pins are GEO-LOCKED: positions are expressed in the base image's own pixel
 * space (1408 x 710, template chrome cropped) and the portrait plate keeps the
 * image's aspect ratio, so pins sit on the rendered city glows at every
 * viewport. Each county HQ is marked at its true spot with a terracotta dot,
 * a white halo and a caps name tag; the portrait cluster hugs that spot with
 * only a short dashed leader line where the basin is too tight to fit.
 */
const IMG_W = 1408;
const IMG_H = 710;

type PinSpec = {
  /** True county-HQ position on the base image, in image px */
  anchor: readonly [number, number];
  /** Portrait-cluster centre, in image px (short leader line when tight) */
  cluster: readonly [number, number];
  label: 'above' | 'below' | 'right' | 'none';
  /** Caps name tag pinned to the true spot (only where the render names nothing) */
  anchorTag?: string;
};

const PIN: Record<KenyaCounty, PinSpec> = {
  // Nairobi — the six-portrait grid sits directly on the rendered capital glow
  Nairobi: { anchor: [725, 323], cluster: [725, 323], label: 'right' },
  // Kisumu — pair tucked just south-west of the rendered KISUMU shore glow
  Kisumu: { anchor: [359, 358], cluster: [295, 420], label: 'none' },
  // Siaya — true spot NW of Kisumu; single portrait WNW of its own dot
  Siaya: { anchor: [330, 332], cluster: [240, 295], label: 'none', anchorTag: 'Siaya' },
  // Homa Bay — true spot across the gulf, SSW of Kisumu; pair due south of the dot
  'Homa Bay': { anchor: [352, 394], cluster: [360, 540], label: 'none', anchorTag: 'Homa Bay' },
  // Kilifi — dot on the shoreline NE of Mombasa; portrait steps up the coast
  Kilifi: { anchor: [1005, 392], cluster: [1040, 368], label: 'right' },
};

const pct = ([x, y]: readonly [number, number]) => ({
  left: `${((x / IMG_W) * 100).toFixed(2)}%`,
  top: `${((y / IMG_H) * 100).toFixed(2)}%`,
});

export function KenyaFootprint({ onSelect }: { onSelect: (c: YACProfile) => void }) {
  return (
    <div className="relative w-full overflow-hidden rounded-sm bg-[#0c1613] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* ── Map column — geo-locked satellite plate ── */}
        <div className="flex flex-col justify-center gap-3 bg-[#0c1613] p-4 text-white sm:p-5 lg:col-span-8">
          <div className="relative mx-auto aspect-[1408/710] w-full ring-1 ring-white/10">
            <div
              role="img"
              aria-label="Satellite field-node map of East Africa by night showing the Kenya country outline with city lights — Kampala, Kisumu, Eldoret, Nairobi and Mombasa"
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/kenya/field-nodes.jpg')" }}
            />

            {/* Cartographic layer — dashed leader lines + true-position anchors */}
            <svg
              viewBox={`0 0 ${IMG_W} ${IMG_H}`}
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {COUNTY_META.map((c) => {
                const p = PIN[c.name];
                if (p.anchor[0] === p.cluster[0] && p.anchor[1] === p.cluster[1]) return null;
                return (
                  <line
                    key={c.name}
                    x1={p.anchor[0]}
                    y1={p.anchor[1]}
                    x2={p.cluster[0]}
                    y2={p.cluster[1]}
                    stroke="rgba(243,239,234,0.38)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
              {COUNTY_META.map((c) => {
                const p = PIN[c.name];
                if (p.anchor[0] === p.cluster[0] && p.anchor[1] === p.cluster[1]) return null;
                return (
                  <g key={c.name}>
                    <circle
                      cx={p.anchor[0]}
                      cy={p.anchor[1]}
                      r="7"
                      fill="none"
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle
                      cx={p.anchor[0]}
                      cy={p.anchor[1]}
                      r="3.5"
                      fill="#D35A38"
                      stroke="#0c1613"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Caps name tags at the true county-HQ spots the render leaves unlabelled */}
            {COUNTY_META.map((c) => {
              const p = PIN[c.name];
              if (!p.anchorTag) return null;
              return (
                <div
                  key={`tag-${c.name}`}
                  className="pointer-events-none absolute z-[5] hidden -translate-y-1/2 sm:block"
                  style={pct([p.anchor[0] + 13, p.anchor[1]])}
                >
                  <span className="rounded-[2px] bg-[#0c1613]/70 px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-[#a4d0ba] ring-1 ring-white/10 backdrop-blur-sm">
                    {p.anchorTag}
                  </span>
                </div>
              );
            })}

            {/* Portrait clusters — the champions themselves, pinned to their counties */}
            {COUNTY_META.map((c) => {
              const members = CHAMPIONS.filter((x) => x.county === c.name);
              const pos = PIN[c.name];
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
                  className={`absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center ${
                    pos.label === 'right' ? '' : 'flex-col'
                  }`}
                  style={pct(pos.cluster)}
                >
                  {pos.label === 'above' && chip}
                  <div className="relative">
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
                          className="relative block h-7 w-7 shrink-0 overflow-hidden rounded-full border-2 border-[#0c1613] bg-forest ring-1 ring-white/30 transition-all duration-200 hover:z-20 hover:scale-[1.15] hover:ring-[#a4d0ba] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a4d0ba] sm:h-8 sm:w-8 lg:h-9 lg:w-9"
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
                    {pos.label === 'right' && (
                      <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2">
                        {chip}
                      </div>
                    )}
                  </div>
                  {pos.label === 'below' && chip}
                </div>
              );
            })}
          </div>

          {/* Caption strip — replaces the coordinate chip, fills the frame below the plate */}
          <div className="flex items-center justify-between gap-4">
            <span className="caps-label flex items-center gap-2 text-[9px] text-white/55">
              <span className="h-1 w-1 rounded-full bg-[#a4d0ba]" />
              12 YACs · 5 Counties · Lat 0.0236° S, Lon 37.9062° E
            </span>
            <span className="caps-label hidden text-[9px] text-white/40 sm:block">
              Base — East Africa by night
            </span>
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
