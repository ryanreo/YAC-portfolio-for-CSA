'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FocusEvent, type KeyboardEvent } from 'react';
import { CHAMPIONS, COUNTY_META, type KenyaCounty, type YACProfile } from '@/lib/yac';

/** The rendered East Africa plate's native coordinate space. */
const IMG_W = 1408;
const IMG_H = 710;
const CLUSTER_DISTANCE = 36;
const HOVER_CLOSE_DELAY = 420;
const FALSE_KISUMU_ARTIFACT: PlatePoint = { x: 329, y: 359 };

/**
 * A full circular fan is safe at the capital. Lake Victoria locations sit close
 * to Kenya's western edge, so their two-member fans open toward the country's
 * interior instead of temporarily placing an avatar across the border/lake.
 */
const INLAND_FAN_ANGLE: Partial<Record<KenyaCounty, number>> = {
  Kisumu: 0,
  'Homa Bay': 0,
  Siaya: 0.35,
  Kilifi: Math.PI,
};

type PlatePoint = { x: number; y: number };
type GeoPoint = { latitude: number; longitude: number };
type MemberPin = PlatePoint & { champion: YACProfile };
type MarkerCluster = PlatePoint & { id: string; members: MemberPin[] };

/**
 * Geographic control points tie WGS84 city centres to the matching city lights on
 * the supplied plate. The image is a perspective satellite illustration, not a
 * Web Mercator tile; inverse-distance interpolation avoids treating its pixels as
 * a flat geographic projection while retaining accurate placement at every known
 * city. Add a control point when adding a new operational location.
 */
const PLATE_CONTROL_POINTS: Record<KenyaCounty, PlatePoint> = {
  Nairobi: { x: 725, y: 323 },
  // The user-marked reference was 1778 × 890. These targets are mapped into
  // this plate's 1408 × 710 coordinate space: upper = Kisumu; lower = Homa Bay.
  // The false baked KISUMU landmark remains masked and is never used as an anchor.
  Siaya: { x: 561, y: 275 },
  Kisumu: { x: 596, y: 255 },
  'Homa Bay': { x: 585, y: 303 },
  Kilifi: { x: 1005, y: 392 },
};

const COUNTY_BY_NAME = new Map(COUNTY_META.map((county) => [county.name, county]));

function squaredGeoDistance(a: GeoPoint, b: GeoPoint) {
  const latitudeScale = 111.32;
  const longitudeScale = 111.32 * Math.cos(((a.latitude + b.latitude) / 2) * (Math.PI / 180));
  return (
    (a.latitude - b.latitude) ** 2 * latitudeScale ** 2 +
    (a.longitude - b.longitude) ** 2 * longitudeScale ** 2
  );
}

function projectToPlate(point: GeoPoint): PlatePoint {
  const controls = COUNTY_META.map((county) => ({
    geo: county,
    plate: PLATE_CONTROL_POINTS[county.name],
  }));

  const exactControl = controls.find(({ geo }) => squaredGeoDistance(point, geo) < 0.000001);
  if (exactControl) return exactControl.plate;

  // Inverse-distance weighting is stable for nearby counties on a perspective raster.
  const weighted = controls.reduce(
    (result, { geo, plate }) => {
      const weight = 1 / squaredGeoDistance(point, geo);
      return {
        x: result.x + plate.x * weight,
        y: result.y + plate.y * weight,
        weight: result.weight + weight,
      };
    },
    { x: 0, y: 0, weight: 0 },
  );

  return { x: weighted.x / weighted.weight, y: weighted.y / weighted.weight };
}

function buildClusters(pins: MemberPin[]): MarkerCluster[] {
  const ungrouped = new Set(pins);
  const clusters: MarkerCluster[] = [];

  while (ungrouped.size) {
    const seed = ungrouped.values().next().value as MemberPin;
    const members = [seed];
    ungrouped.delete(seed);

    // Grow the cluster so a chain of close points is grouped as one location.
    let didAdd = true;
    while (didAdd) {
      didAdd = false;
      for (const candidate of [...ungrouped]) {
        const nearMember = members.some(
          (member) => Math.hypot(candidate.x - member.x, candidate.y - member.y) <= CLUSTER_DISTANCE,
        );
        if (nearMember) {
          members.push(candidate);
          ungrouped.delete(candidate);
          didAdd = true;
        }
      }
    }

    const x = members.reduce((sum, member) => sum + member.x, 0) / members.length;
    const y = members.reduce((sum, member) => sum + member.y, 0) / members.length;
    clusters.push({ id: members.map(({ champion }) => champion.id).sort().join('-'), x, y, members });
  }

  return clusters;
}

function spiderOffset(index: number, count: number, inlandAngle?: number) {
  const angle =
    inlandAngle === undefined
      ? -Math.PI / 2 + (Math.PI * 2 * index) / count
      : inlandAngle + (count === 1 ? 0 : ((index / (count - 1)) * 2 - 1) * 0.55);
  // Larger clusters begin a second ring rather than compressing avatars together.
  const ring = count > 7 && index >= 7 ? 1 : 0;
  const radius = 49 + ring * 25;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, angle: (angle * 180) / Math.PI };
}

const percent = (point: PlatePoint) => ({
  left: `${((point.x / IMG_W) * 100).toFixed(3)}%`,
  top: `${((point.y / IMG_H) * 100).toFixed(3)}%`,
});

function ProfileCard({ champion }: { champion: YACProfile }) {
  const location = COUNTY_BY_NAME.get(champion.county)?.location ?? `${champion.county} County`;
  return (
    <span className="map-profile-card" role="tooltip">
      <span className="map-profile-card__title">{champion.fullName}</span>
      <span className="map-profile-card__role">{champion.primaryRole}</span>
      <span className="map-profile-card__location">{location}</span>
    </span>
  );
}

export function KenyaFootprint({ onSelect }: { onSelect: (champion: YACProfile) => void }) {
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clusters = useMemo(() => {
    const pins = CHAMPIONS.map((champion) => {
      const location = COUNTY_BY_NAME.get(champion.county);
      if (!location) throw new Error(`Missing geographic reference for ${champion.county} County`);
      return { champion, ...projectToPlate(location) };
    });
    return buildClusters(pins);
  }, []);

  const keepClusterOpen = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setExpandedCluster(id);
  };

  const scheduleClusterClose = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setExpandedCluster((activeCluster) => (activeCluster === id ? null : activeCluster));
    }, HOVER_CLOSE_DELAY);
  };

  const closeOnBlur = (event: FocusEvent<HTMLDivElement>, id: string) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleClusterClose(id);
  };

  const closeOnEscape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setExpandedCluster(null);
    }
  };

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-sm bg-[#0c1613] text-white">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="flex flex-col justify-center gap-3 bg-[#0c1613] p-4 text-white sm:p-5 lg:col-span-8">
          <div className="relative mx-auto aspect-[1408/710] w-full ring-1 ring-white/10">
            <div
              role="img"
              aria-label="Satellite field-node map of Kenya and East Africa, positioned using WGS84 city-centre control points"
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/kenya/field-nodes.jpg')" }}
            />

            {/* The base plate is a raster. Its old KISUMU label/dot is in Uganda,
                so it is explicitly suppressed rather than used as a map anchor. */}
            <span
              aria-hidden="true"
              className="map-kisumu-artifact-mask"
              style={{ ...percent(FALSE_KISUMU_ARTIFACT), width: '6.4%', height: '5.8%' }}
            />

            <svg viewBox={`0 0 ${IMG_W} ${IMG_H}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
              {COUNTY_META.map((county) => {
                const point = projectToPlate(county);
                return (
                  <g key={county.name}>
                    <circle cx={point.x} cy={point.y} r="10" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    <circle cx={point.x} cy={point.y} r="3.5" fill="#D35A38" stroke="#0c1613" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  </g>
                );
              })}
            </svg>

            {clusters.map((cluster) => {
              const expanded = expandedCluster === cluster.id;
              const countyNames = [...new Set(cluster.members.map(({ champion }) => champion.county))];
              const clusterLabel = countyNames.map((county) => COUNTY_BY_NAME.get(county)?.location ?? county).join(', ');
              const inlandFanAngle = countyNames.length === 1 ? INLAND_FAN_ANGLE[countyNames[0]] : undefined;

              return (
                <div
                  key={cluster.id}
                  className={`map-marker-cluster absolute ${expanded ? 'z-50 is-expanded' : 'z-20'}`}
                  style={percent(cluster)}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== 'touch') keepClusterOpen(cluster.id);
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType !== 'touch') scheduleClusterClose(cluster.id);
                  }}
                  onFocus={() => keepClusterOpen(cluster.id)}
                  onBlur={(event) => closeOnBlur(event, cluster.id)}
                  onKeyDown={closeOnEscape}
                >
                  {cluster.members.length > 1 && (
                    <button
                      type="button"
                      className="map-cluster-facepile"
                      aria-label={`Show ${cluster.members.length} champions in ${clusterLabel}`}
                      aria-expanded={expanded}
                      onClick={() => {
                        if (closeTimer.current) clearTimeout(closeTimer.current);
                        setExpandedCluster(expanded ? null : cluster.id);
                      }}
                    >
                      <span className="map-cluster-facepile__layers" aria-hidden="true">
                        {cluster.members.slice(1, 4).reverse().map(({ champion }, index) => (
                          <span key={champion.id} className="map-cluster-facepile__layer" style={{ '--pile-index': index } as CSSProperties & Record<string, number>}>
                            {champion.headshotUrl && <Image src={champion.headshotUrl} alt="" fill sizes="32px" className="object-cover" />}
                          </span>
                        ))}
                      </span>
                      <span className="map-cluster-facepile__front">
                        {cluster.members[0].champion.headshotUrl && <Image src={cluster.members[0].champion.headshotUrl} alt="" fill sizes="42px" className="object-cover" />}
                      </span>
                      <span className="map-cluster-facepile__count">+{cluster.members.length - 1}</span>
                    </button>
                  )}

                  {cluster.members.length > 1 && (
                    <div className="map-cluster-popover" role="dialog" aria-label={`Champions in ${clusterLabel}`}>
                      <span className="map-cluster-popover__heading">{clusterLabel}</span>
                      {cluster.members.map(({ champion }) => (
                        <button key={`popover-${champion.id}`} type="button" className="map-cluster-popover__member" onClick={() => onSelect(champion)}>
                          <span className="map-cluster-popover__avatar">
                            {champion.headshotUrl && <Image src={champion.headshotUrl} alt="" fill sizes="32px" className="object-cover" />}
                          </span>
                          <span><span className="map-cluster-popover__name">{champion.fullName}</span><span className="map-cluster-popover__role">{champion.primaryRole}</span></span>
                        </button>
                      ))}
                    </div>
                  )}

                  {cluster.members.map(({ champion }, index) => {
                    const offset = spiderOffset(index, cluster.members.length, inlandFanAngle);
                    const memberStyle = {
                      '--fan-x': `${offset.x.toFixed(1)}px`,
                      '--fan-y': `${offset.y.toFixed(1)}px`,
                      '--fan-delay': `${index * 38}ms`,
                    } as CSSProperties & Record<string, string>;
                    const spokeStyle = {
                      '--spoke-length': `${Math.hypot(offset.x, offset.y).toFixed(1)}px`,
                      '--spoke-angle': `${offset.angle.toFixed(1)}deg`,
                      '--fan-delay': `${index * 38}ms`,
                    } as CSSProperties & Record<string, string>;

                    return (
                      <span key={champion.id}>
                        {cluster.members.length > 1 && <span className="map-cluster-spoke" style={spokeStyle} aria-hidden="true" />}
                        <button
                          type="button"
                          className={`map-fan-member ${cluster.members.length === 1 ? 'map-fan-member--solo' : ''}`}
                          style={memberStyle}
                          onClick={() => onSelect(champion)}
                          aria-label={`Open ${champion.fullName}'s profile — ${champion.primaryRole}, ${COUNTY_BY_NAME.get(champion.county)?.location}`}
                        >
                          <span className="map-fan-member__avatar">
                            {champion.headshotUrl && <Image src={champion.headshotUrl} alt="" fill sizes="44px" className="object-cover" />}
                          </span>
                          <ProfileCard champion={champion} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="caps-label flex items-center gap-2 text-[9px] text-white/55">
              <span className="h-1 w-1 rounded-full bg-[#a4d0ba]" />
              12 YACs · 5 counties · WGS84 city-centre references
            </span>
            <span className="caps-label hidden text-[9px] text-white/40 sm:block">Hover a cluster · tap to expand</span>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 bg-forest p-6 sm:p-8 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <span className="caps-label text-[9px] text-white/60">Sub-National Footprint</span>
              <span className="caps-label inline-flex items-center gap-1.5 text-[9px] text-white/60"><span className="h-1 w-1 rounded-full bg-[#a4d0ba]" />Verified</span>
            </div>
            <h3 className="mt-5 font-serif text-2xl leading-[1.25] tracking-[-0.01em] text-white">
              Five counties, three corridors of <em className="italic text-[#a4d0ba]">youth evidence</em>
            </h3>
            <p className="mt-3 font-serif text-[13px] italic leading-relaxed text-white/60">
              Hover a cluster to meet its champions, or tap it on mobile. Select a portrait to open the full portfolio.
            </p>
            <ul className="mt-6">
              {COUNTY_META.map((county) => {
                const count = CHAMPIONS.filter((champion) => champion.county === county.name).length;
                return (
                  <li key={county.name} className="flex items-start justify-between gap-4 border-b border-white/10 py-3">
                    <div><p className="font-serif text-base leading-snug text-white">{county.name} County</p><p className="mt-1 text-[11px] leading-snug text-white/50">{county.regionNote}</p></div>
                    <span className="mt-0.5 inline-grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/25 font-serif text-sm text-white">{count}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="caps-label text-[8.5px] leading-relaxed text-white/40">
            Regional clusters — Lake Victoria Basin · Capital &amp; National Policy Hub · Coastal Marine &amp; Climate Corridor
          </p>
        </div>
      </div>
    </div>
  );
}
