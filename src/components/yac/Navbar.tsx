'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'Who We Are' },
  { href: '#team', label: 'The Team' },
  { href: '#footprint', label: 'Footprint' },
  { href: '#engage', label: 'Engage' },
  { href: '#contact', label: 'Contact' },
];

export function Navbar({ onEngage }: { onEngage: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-[0_1px_0_0_rgba(0,43,73,0.08)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main">
        {/* Brand */}
        <a href="#home" className="flex items-center gap-3" aria-label="YAC Digital Portfolio — home">
          <span
            className={`grid h-9 w-9 place-items-center rounded-lg font-extrabold text-sm transition-colors ${
              scrolled ? 'bg-navy text-white' : 'bg-white/10 text-white ring-1 ring-white/25'
            }`}
            aria-hidden="true"
          >
            YAC
          </span>
          <span className="leading-tight">
            <span className={`block text-[13px] font-extrabold tracking-tight ${scrolled ? 'text-navy' : 'text-white'}`}>
              Youth Evidence-to-Policy
            </span>
            <span className={`block text-[10px] font-semibold uppercase tracking-[0.14em] ${scrolled ? 'text-csa-600' : 'text-white/70'}`}>
              CSA Kenya • INSPIRE Lab
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 text-[13px] font-semibold transition-colors ${
                scrolled ? 'text-navy/80 hover:bg-csa-50 hover:text-csa-600' : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              {l.label}
            </a>
          ))}
          <Button
            onClick={onEngage}
            size="sm"
            className="ml-3 rounded-full bg-gold font-bold text-navy shadow-sm hover:bg-gold-600 hover:text-navy"
          >
            Commission a Sprint
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className={`grid h-10 w-10 place-items-center rounded-md lg:hidden ${scrolled ? 'text-navy' : 'text-white'}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 lg:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm font-semibold text-navy/80 hover:bg-csa-50 hover:text-csa-600"
            >
              {l.label}
            </a>
          ))}
          <Button
            onClick={() => {
              setOpen(false);
              onEngage();
            }}
            className="mt-2 w-full rounded-full bg-gold font-bold text-navy hover:bg-gold-600 hover:text-navy"
          >
            Commission an Evidence Sprint
          </Button>
        </div>
      )}
    </header>
  );
}
