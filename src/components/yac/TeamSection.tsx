'use client';

import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChampionCard } from './ChampionCard';
import {
  CHAMPIONS,
  COUNTY_META,
  PILLAR_SHORT,
  THEMATIC_PILLARS,
  type KenyaCounty,
  type ThematicPillar,
  type YACProfile,
} from '@/lib/yac';
import { Search, LayoutGrid, Table2, X, SearchX } from 'lucide-react';

export function TeamSection({
  search,
  onSearch,
  activePillars,
  onTogglePillar,
  activeCounty,
  onCounty,
  view,
  onView,
  onSelect,
}: {
  search: string;
  onSearch: (v: string) => void;
  activePillars: ThematicPillar[];
  onTogglePillar: (p: ThematicPillar) => void;
  activeCounty: KenyaCounty | null;
  onCounty: (c: KenyaCounty | null) => void;
  view: 'grid' | 'table';
  onView: (v: 'grid' | 'table') => void;
  onSelect: (c: YACProfile) => void;
}) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CHAMPIONS.filter((c) => {
      if (activeCounty && c.county !== activeCounty) return false;
      if (activePillars.length > 0 && !activePillars.some((p) => c.thematicPillars.includes(p))) return false;
      if (!q) return true;
      const haystack = [
        c.fullName,
        c.county,
        c.primaryRole,
        c.academicBackground,
        c.shortBio,
        ...c.skillsAndTools,
        ...c.affiliations,
        ...c.thematicPillars,
        String(c.age),
      ]
        .join(' ')
        .toLowerCase();
      return q.split(/\s+/).every((term) => haystack.includes(term));
    });
  }, [search, activePillars, activeCounty]);

  const hasFilters = !!search || activePillars.length > 0 || !!activeCounty;

  return (
    <div>
      {/* Filter bar */}
      <div className="no-print rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <Input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search names, counties, skills, institutions…"
              className="h-11 rounded-full border-slate-200 bg-slate-csa pl-10 pr-10 text-sm"
              aria-label="Search champions"
            />
            {search && (
              <button
                onClick={() => onSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-navy"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* County select */}
          <div className="flex items-center gap-2">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by county">
              <button
                onClick={() => onCounty(null)}
                aria-pressed={!activeCounty}
                className={`h-9 rounded-full px-3.5 text-xs font-bold transition-colors ${
                  !activeCounty ? 'bg-navy text-white' : 'bg-slate-csa text-navy/60 hover:bg-csa-50 hover:text-csa-600'
                }`}
              >
                All Counties
              </button>
              {COUNTY_META.map((c) => (
                <button
                  key={c.name}
                  onClick={() => onCounty(activeCounty === c.name ? null : c.name)}
                  aria-pressed={activeCounty === c.name}
                  className={`h-9 rounded-full px-3.5 text-xs font-bold transition-colors ${
                    activeCounty === c.name
                      ? 'bg-csa text-white'
                      : 'bg-slate-csa text-navy/60 hover:bg-csa-50 hover:text-csa-600'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="ml-auto flex rounded-full border border-slate-200 p-1 lg:ml-2" role="group" aria-label="View mode">
              <button
                onClick={() => onView('grid')}
                aria-pressed={view === 'grid'}
                aria-label="Grid view"
                className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${
                  view === 'grid' ? 'bg-navy text-white' : 'text-slate-400 hover:text-navy'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => onView('table')}
                aria-pressed={view === 'table'}
                aria-label="Table view"
                className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${
                  view === 'table' ? 'bg-navy text-white' : 'text-slate-400 hover:text-navy'
                }`}
              >
                <Table2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Pillar toggles */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3" role="group" aria-label="Filter by thematic pillar">
          <span className="mr-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            Pillars
          </span>
          {THEMATIC_PILLARS.map((p) => {
            const active = activePillars.includes(p);
            return (
              <button
                key={p}
                onClick={() => onTogglePillar(p)}
                aria-pressed={active}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors ${
                  active
                    ? 'bg-gold text-navy shadow-sm'
                    : 'bg-slate-csa text-navy/60 hover:bg-gold-50 hover:text-gold-600'
                }`}
              >
                {PILLAR_SHORT[p]}
              </button>
            );
          })}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearch('');
                onCounty(null);
                activePillars.forEach(onTogglePillar);
              }}
              className="ml-auto h-8 rounded-full px-3 text-[11px] font-bold text-slate-500 hover:text-navy"
            >
              <X className="mr-1 h-3 w-3" />
              Reset all
            </Button>
          )}
        </div>
      </div>

      {/* Result count */}
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-slate-400" aria-live="polite">
        Showing {filtered.length} of {CHAMPIONS.length} champions
        {activeCounty ? ` • ${activeCounty} County` : ''}
      </p>

      {/* Grid view */}
      {view === 'grid' && (
        <>
          {filtered.length > 0 ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((c) => (
                <ChampionCard key={c.id} champion={c} onSelect={onSelect} />
              ))}
            </div>
          ) : (
            <EmptyState onReset={() => {
              onSearch('');
              onCounty(null);
              activePillars.forEach(onTogglePillar);
            }} />
          )}
        </>
      )}

      {/* Executive table view */}
      {view === 'table' && (
        <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-navy hover:bg-navy">
                  <TableHead className="rounded-tl-3xl text-[11px] font-extrabold uppercase tracking-wider text-white">
                    Champion
                  </TableHead>
                  <TableHead className="text-[11px] font-extrabold uppercase tracking-wider text-white">Age</TableHead>
                  <TableHead className="text-[11px] font-extrabold uppercase tracking-wider text-white">County</TableHead>
                  <TableHead className="text-[11px] font-extrabold uppercase tracking-wider text-white">
                    Academic Background
                  </TableHead>
                  <TableHead className="text-[11px] font-extrabold uppercase tracking-wider text-white">Key Tools</TableHead>
                  <TableHead className="rounded-tr-3xl text-[11px] font-extrabold uppercase tracking-wider text-white">
                    Profile
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c, i) => (
                  <TableRow key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-csa/60'}>
                    <TableCell className="font-bold text-navy">
                      {c.fullName}
                      <span className="block text-[11px] font-medium text-slate-500">{c.primaryRole}</span>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-navy/70">{c.age}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="rounded-full bg-csa-50 text-[11px] font-bold text-csa-600">
                        {c.county}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[240px] text-xs text-slate-500">{c.academicBackground}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <span className="line-clamp-2 text-xs text-slate-500">
                        {c.skillsAndTools.slice(0, 3).join(', ')}
                        {c.skillsAndTools.length > 3 ? ` +${c.skillsAndTools.length - 3}` : ''}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => onSelect(c)}
                        className="text-xs font-extrabold text-csa-600 underline-offset-4 hover:underline"
                        aria-label={`Open profile of ${c.fullName}`}
                      >
                        Open
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <div className="p-6">
              <EmptyState
                onReset={() => {
                  onSearch('');
                  onCounty(null);
                  activePillars.forEach(onTogglePillar);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-slate-csa/50 px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-white shadow-sm">
        <SearchX className="h-6 w-6 text-slate-400" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-extrabold text-navy">No champions match those filters</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        Try a different pillar, county, or search term — all 12 verified champions are just one reset away.
      </p>
      <Button onClick={onReset} variant="outline" className="mt-5 rounded-full border-csa/40 text-csa-600 hover:bg-csa-50 hover:text-csa-600">
        Reset filters
      </Button>
    </div>
  );
}
