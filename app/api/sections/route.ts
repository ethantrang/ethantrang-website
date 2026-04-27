import { NextRequest, NextResponse } from 'next/server';
import { saveSections } from '@/lib/sections';
import { requireLocalhost } from '@/lib/guard';
import type { Section } from '@/lib/types';

interface PatchBody {
  sections: Section[];
}

export async function PATCH(request: NextRequest) {
  const guard = requireLocalhost(request);
  if (guard) return guard;

  const body: PatchBody = await request.json();
  saveSections(body.sections);
  return NextResponse.json({ ok: true });
}
