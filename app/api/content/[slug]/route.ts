import { NextRequest, NextResponse } from 'next/server';
import { getContentBySlug, saveContent, deleteContentFile, getIntroContent, getContentFilePath } from '@/lib/content';
import { requireLocalhost } from '@/lib/guard';
import type { ContentFrontmatter } from '@/lib/types';

interface PatchBody {
  frontmatter?: Partial<ContentFrontmatter>;
  body?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const guard = requireLocalhost(request);
  if (guard) return guard;

  const { slug } = await params;
  const file = getContentBySlug(slug);

  if (!file) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const patch: PatchBody = await request.json();
  const newFrontmatter: ContentFrontmatter = {
    ...file.frontmatter,
    ...patch.frontmatter,
    updatedAt: new Date().toISOString(),
  };
  const newBody = patch.body !== undefined ? patch.body : file.body;
  const newSlug = newFrontmatter.slug;

  if (newSlug !== slug) {
    // Slug changed — write to new filename, delete old
    const newFilePath = getContentFilePath(newFrontmatter.section, newSlug);
    saveContent(newFilePath, newFrontmatter, newBody);
    deleteContentFile(file.filePath);
  } else {
    saveContent(file.filePath, newFrontmatter, newBody);
  }

  return NextResponse.json({ ok: true, slug: newSlug });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const guard = requireLocalhost(request);
  if (guard) return guard;

  const { slug } = await params;

  // Protect the intro file from deletion
  const intro = getIntroContent();
  if (intro?.frontmatter.slug === slug) {
    return NextResponse.json({ error: 'Cannot delete intro' }, { status: 400 });
  }

  const file = getContentBySlug(slug);
  if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  deleteContentFile(file.filePath);
  return NextResponse.json({ ok: true });
}
