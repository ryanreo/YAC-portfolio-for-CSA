'use client';

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CHAMPIONS, type YACProfile } from '@/lib/yac';
import { Loader2, Send, CheckCircle2, FileSearch, Users2, MapPinned } from 'lucide-react';
import { toast } from 'sonner';

const SPRINT_TYPES = [
  { value: 'policy-scorecard', label: 'Sub-national policy scorecards', icon: FileSearch },
  { value: 'twg-representation', label: 'County youth TWG representation', icon: Users2 },
  { value: 'survey-gis', label: 'Rapid grassroots surveys & GIS mapping', icon: MapPinned },
  { value: 'general', label: 'General partnership inquiry', icon: Send },
] as const;

export function EngageDrawer({
  open,
  onClose,
  champion,
}: {
  open: boolean;
  onClose: () => void;
  champion: YACProfile | null;
}) {
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [sprint, setSprint] = useState<string>('general');
  const [championId, setChampionId] = useState<string>('any');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setDone(false);
      setChampionId(champion?.id ?? 'any');
    }
  }, [open, champion]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in your name and email.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          organisation: org.trim(),
          email: email.trim(),
          sprintType: sprint,
          championId: championId === 'any' ? null : championId,
          message: message.trim() || null,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setDone(true);
      toast.success('Inquiry received — the CSA Kenya team will reach out shortly.');
      setName('');
      setOrg('');
      setEmail('');
      setMessage('');
      setSprint('general');
      setChampionId('any');
    } catch {
      toast.error('Could not send right now. Please write directly to the CSA Kenya lab team.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader className="px-5 pt-6">
          <SheetTitle className="text-xl font-extrabold tracking-tight text-navy">
            Work With the Champions
          </SheetTitle>
          <SheetDescription className="text-sm leading-relaxed text-slate-500">
            Bring one or more of the 12 YACs into your next evidence sprint. Tell us what youth evidence
            you need and our focal points — Rukia Nzibo &amp; Sandra Washika — will respond with a scope.
          </SheetDescription>
        </SheetHeader>

        {done ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-csa-50">
              <CheckCircle2 className="h-8 w-8 text-csa" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-extrabold text-navy">Inquiry received</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
              Thank you. The CSA Kenya partnerships team will review your request and get back to you
              with a proposed evidence sprint scope.
            </p>
            <Button onClick={onClose} variant="outline" className="mt-6 rounded-full">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-5 pb-8 pt-2">
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="inq-name">
                  Your name <span className="text-gold-600">*</span>
                </Label>
                <Input
                  id="inq-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Amina Wanjiru"
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="inq-org">Organisation</Label>
                <Input
                  id="inq-org"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  placeholder="e.g. County Health Directorate"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="inq-email">
                  Work email <span className="text-gold-600">*</span>
                </Label>
                <Input
                  id="inq-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organisation.org"
                  required
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="inq-sprint">I am looking for youth evidence in…</Label>
                <Select value={sprint} onValueChange={setSprint}>
                  <SelectTrigger id="inq-sprint" aria-label="Sprint type">
                    <SelectValue placeholder="Select a sprint" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPRINT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="inq-champion">Champion of interest (optional)</Label>
                <Select value={championId} onValueChange={setChampionId}>
                  <SelectTrigger id="inq-champion" aria-label="Champion of interest">
                    <SelectValue placeholder="Any champion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Match me with the right champion(s)</SelectItem>
                    {CHAMPIONS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.fullName} — {c.county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="inq-msg">Brief context (optional)</Label>
                <Textarea
                  id="inq-msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What decision or policy process should this evidence inform?"
                  rows={4}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-csa font-bold text-white hover:bg-csa-600"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                  Submit inquiry
                </>
              )}
            </Button>
            <p className="text-center text-[11px] leading-relaxed text-slate-400">
              Directed to CSA Kenya lab focal points. Your details are used only to respond to this inquiry.
            </p>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
