'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShieldCheck, Printer, ArrowUpRight, MapPin } from 'lucide-react';

export function Footer({ onEngage }: { onEngage: () => void }) {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="no-print mt-auto bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 font-extrabold text-sm ring-1 ring-white/20">
                YAC
              </span>
              <div className="leading-tight">
                <p className="text-sm font-extrabold">Youth Evidence-to-Policy Lab</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
                  Digital Portfolio
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-300">
              An initiative of the Centre for the Study of Adolescence (CSA Kenya) under the
              INSPIRE-Kenya Youth Evidence to Policy Lab — showcasing verified youth champions
              driving sub-national policy change across five counties.
            </p>
            <p className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
              All 12 ages &amp; counties verified • Zero-inference data policy
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['#about', 'Who We Are'],
                ['#team', 'The Team'],
                ['#footprint', 'County Footprint'],
                ['#engage', 'Commission a Sprint'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-slate-300 transition-colors hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 text-slate-300 transition-colors hover:text-white"
                >
                  <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                  Download Cohort Dossier (Print)
                </button>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">Partner With Us</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Commissions and partnership inquiries are directed to the CSA Kenya partnerships office —
              Rukia Nzibo (Partnerships, Communications &amp; Advocacy) and Sandra Washika (Project
              Assistant, Youth Advocacy &amp; COMMS).
            </p>
            <Button
              onClick={onEngage}
              className="mt-5 rounded-full bg-gold font-bold text-navy hover:bg-gold-600 hover:text-navy"
            >
              Start an Inquiry
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </Button>
            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-400">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Centre for the Study of Adolescence • Nairobi, Kenya • csakenya.org
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-3 text-[11px] font-medium text-slate-400 sm:flex-row">
          <p>© {year} Centre for the Study of Adolescence (CSA Kenya). All rights reserved.</p>
          <p>
            Built by Osagiede Ryan Eromosele • Lead Developer &amp; Intern — with AI-assisted interface design.
          </p>
        </div>
      </div>
    </footer>
  );
}
