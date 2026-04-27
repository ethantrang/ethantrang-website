import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { getMediaBySlug, updateMediaEntry, getMediaFilePath } from '@/lib/content';
import { requireLocalhost } from '@/lib/guard';
import type { MediaFrontmatter } from '@/lib/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const guard = requireLocalhost(request);
  if (guard) return guard;

  const { slug } = await params;
  const patch: Partial<MediaFrontmatter> = await request.json();
  updateMediaEntry(slug, patch);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const guard = requireLocalhost(request);
  if (guard) return guard;

  const { slug } = await params;
  const media = getMediaBySlug(slug);
  if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Delete the image file
  try {
    const imagePath = path.join(process.cwd(), 'public', media.frontmatter.src);
    await unlink(imagePath);
  } catch {
    // Image may not exist — continue
  }

  // Delete the MDX entry
  const mdxPath = getMediaFilePath(slug);
  try {
    await unlink(mdxPath);
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
