import { NextRequest, NextResponse } from 'next/server';
import { createContentFile } from '@/lib/content';
import { requireLocalhost } from '@/lib/guard';
import type { ContentFrontmatter } from '@/lib/types';

export async function POST(request: NextRequest) {
  const guard = requireLocalhost(request);
  if (guard) return guard;

  const { section } = await request.json();
  if (!section) return NextResponse.json({ error: 'Missing section' }, { status: 400 });

  const slug = `untitled-${Date.now()}`;
  const now = new Date().toISOString();
  const frontmatter: ContentFrontmatter = {
    title: 'Untitled',
    slug,
    section,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  };

  createContentFile(section, slug, frontmatter, '');
  return NextResponse.json({ slug });
}
