import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { createMediaEntry } from '@/lib/content';
import { requireLocalhost } from '@/lib/guard';
import type { ContentStatus } from '@/lib/types';

export async function POST(request: NextRequest) {
  const guard = requireLocalhost(request);
  if (guard) return guard;

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const description = (formData.get('description') as string) ?? '';
  const status = ((formData.get('status') as string) ?? 'public') as ContentStatus;

  if (!file || !file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  const ext = file.name.split('.').pop() ?? 'jpg';
  const slug = `photo-${Date.now()}`;
  const filename = `${slug}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'media');

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const src = `/uploads/media/${filename}`;
  createMediaEntry(slug, {
    description,
    src,
    status,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, src, slug });
}
