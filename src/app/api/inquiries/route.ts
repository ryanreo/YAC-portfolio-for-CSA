import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const VALID_SPRINTS = ['policy-scorecard', 'twg-representation', 'survey-gis', 'general'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const organisation = typeof body.organisation === 'string' ? body.organisation.trim() : null;
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const sprintType = typeof body.sprintType === 'string' ? body.sprintType : 'general';
    const championId = typeof body.championId === 'string' && body.championId ? body.championId : null;
    const message = typeof body.message === 'string' && body.message.trim() ? body.message.trim() : null;

    if (!name || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'A valid name and email are required.' }, { status: 400 });
    }
    if (!VALID_SPRINTS.includes(sprintType)) {
      return NextResponse.json({ error: 'Invalid sprint type.' }, { status: 400 });
    }

    const inquiry = await db.inquiry.create({
      data: { name, organisation, email, sprintType, championId, message },
    });

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error('Inquiry POST failed:', err);
    return NextResponse.json({ error: 'Could not save inquiry.' }, { status: 500 });
  }
}
