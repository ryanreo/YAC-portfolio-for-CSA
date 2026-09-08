'use client';

import { useMemo, useState } from 'react';
import { CHAMPIONS, COUNTY_META, championsByCounty, type KenyaCounty } from '@/lib/yac';
import { MapPin, ChevronRight } from 'lucide-react';

/** Simplified Kenya national outline — lon 33.5–42, lat 5 to -5 mapped to an 850×1000 viewBox. */
const KENYA_OUTLINE =
  'M 60 77 L 180 38 L 235 38 L 300 55 L 350 80 L 450 135 L 535 148 L 625 115 L 727 73 L 840 105 ' +
  'L 755 250 L 745 315 L 805 335 L 750 415 L 805 535 L 805 665 L 740 725 L 680 765 L 665 820 ' +
  'L 615 905 L 570 968 L 445 905 L 410 805 L 305 715 L 235 630 L 105 605 L 55 545 L 50 510 ' +
  'L 60 485 L 50 455 L 40 435 L 60 385 L 125 360 L 105 260 L 90 160 Z';

/** Subtle Lake Victoria hint (Kenyan portion) */
const LAKE_HINT = 'M 40 445 C 8 480, 4 560, 42 620 C 62 648, 84 640, 78 610 C 66 560, 62 505, 74 462 C 78 448, 56 436, 40 445 Z';

export function KenyaMap({
  activeCounty,
  onSelectCounty,
}: {
  activeCounty: KenyaCounty | null;
  onSelectCounty: (c: KenyaCounty | null) => void;
}) {
  const [hovered, setHovered] = useState<KenyaCounty | null>(null);
  const highlighted = hovered ?? activeCounty;

  const countyCounts = useMemo(() => {
    const map = new Map<KenyaCounty, number>();
    for (const meta of COUNTY_META) map.set(meta.name, championsByCounty(meta.name).length);
    return map;
  }, []);

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
      {/* Map */}
      <div className="relative mx-auto w-full max-w-[440px]">
        <svg
          viewBox="0 0 850 1000"
          role="img"
          aria-label="Map of Kenya highlighting the five operational counties: Nairobi, Kisumu, Homa Bay, Siaya and Kilifi"
          className="h-auto w-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="kenyaFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0a3d61" />
              <stop offset="100%" stopColor="#002b49" />
            </linearGradient>
          </defs>

          {/* Country silhouette */}
          <path d={KENYA_OUTLINE} fill="url(#kenyaFill)" stroke="#3fb6e3" strokeWidth="3" strokeLinejoin="round" />
          {/* Lake Victoria hint */}
          <path d={LAKE_HINT} fill="#3fb6e3" opacity="0.35" />

          {/* Equator marker for character */}
          <line x1="180" y1="500" x2="380" y2="500" stroke="#ffffff" strokeWidth="2" strokeDasharray="10 12" opacity="0.25" />
          <text x="392" y="505" fill="#ffffff" opacity="0.4" fontSize="22" fontWeight="600">Equator</text>

          {/* County pins */}
          {COUNTY_META.map((c) => {
            const count = countyCounts.get(c.name) ?? 0;
            const isActive = highlighted === c.name;
            const dimmed = highlighted !== null && !isActive;
            return (
              <g
                key={c.name}
                transform={`translate(${c.x} ${c.y})`}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`${c.name} County — ${count} champion${count === 1 ? '' : 's'}. Filter directory by ${c.name}.`}
                onClick={() => onSelectCounty(activeCounty === c.name ? null : c.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCounty(activeCounty === c.name ? null : c.name);
                  }
                }}
                onMouseEnter={() => setHovered(c.name)}
                onMouseLeave={() => setHovered(null)}
                opacity={dimmed ? 0.45 : 1}
                style={{ transition: 'opacity 200ms' }}
              >
                <title>{`${c.name} County — ${count} champion${count === 1 ? '' : 's'}`}</title>
                <circle className="pin-ping" r="26" fill={isActive ? '#e5a823' : '#0090d0'} opacity="0.5" />
                <circle r="30" fill="transparent" />
                <circle r="22" fill={isActive ? '#e5a823' : '#0090d0'} stroke="#ffffff" strokeWidth="4" />
                <text
                  y="8"
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="800"
                  fill={isActive ? '#002b49' : '#ffffff'}
                >
                  {count}
                </text>
                <text
                  x={c.labelDx}
                  y={c.labelDy}
                  textAnchor={c.labelAnchor}
                  fontSize="26"
                  fontWeight="700"
                  fill={isActive ? '#e5a823' : '#ffffff'}
                  stroke="#002b49"
                  strokeWidth="6"
                  paintOrder="stroke"
                >
                  {c.name}
                </text>
              </g>
            );
          })}
        </svg>

        <p className="mt-3 text-center text-xs font-medium text-slate-400">
          Tap a county pin to filter the champion directory
        </p>
      </div>

      {/* County panel */}
      <div>
        <h3 className="text-2xl font-extrabold tracking-tight text-navy">Where the evidence lives</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          The cohort operates across five verified counties, organised into three regional corridors —
          from the Lake Victoria basin to the capital&apos;s policy hub and the coastal climate corridor.
        </p>

        <ul className="mt-6 space-y-3">
          {COUNTY_META.map((c) => {
            const champs = championsByCounty(c.name);
            const isActive = activeCounty === c.name;
            return (
              <li key={c.name}>
                <button
                  onClick={() => onSelectCounty(isActive ? null : c.name)}
                  onMouseEnter={() => setHovered(c.name)}
                  onMouseLeave={() => setHovered(null)}
                  aria-pressed={isActive}
                  className={`group w-full rounded-2xl border p-4 text-left transition-all ${
                    isActive
                      ? 'border-csa bg-csa-50 shadow-sm ring-1 ring-csa/30'
                      : 'border-slate-200 bg-white hover:border-csa/40 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5 text-sm font-bold text-navy">
                      <MapPin className={`h-4 w-4 ${isActive ? 'text-csa-600' : 'text-csa'}`} aria-hidden="true" />
                      {c.name} County
                      <span className="rounded-full bg-navy px-2 py-0.5 text-[10px] font-extrabold text-white">
                        {champs.length}
                      </span>
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${isActive ? 'rotate-90 text-csa-600' : 'text-slate-300 group-hover:text-csa'}`}
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-1.5 pl-6.5 text-xs leading-relaxed text-slate-500">{c.regionNote}</p>
                  <p className="mt-1 pl-6.5 text-[11px] font-semibold uppercase tracking-wider text-gold-600">
                    {c.region}
                  </p>
                  <p className="mt-2 pl-6.5 text-xs text-slate-400">
                    {champs.map((ch) => ch.fullName.split(' ')[0]).join(' • ')}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>

        {activeCounty && (
          <button
            onClick={() => onSelectCounty(null)}
            className="mt-4 text-xs font-bold text-csa-600 underline-offset-4 hover:underline"
          >
            Clear {activeCounty} filter — show all {CHAMPIONS.length} champions
          </button>
        )}
      </div>
    </div>
  );
}
