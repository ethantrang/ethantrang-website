import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { ContentFile, ContentFrontmatter, MediaFile, MediaFrontmatter, ContentStatus } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => path.join(dir, f));
}

function getSectionDirs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(CONTENT_DIR, d.name));
}

function parseContentFile(filePath: string): ContentFile | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      frontmatter: data as ContentFrontmatter,
      body: content,
      filePath,
    };
  } catch {
    return null;
  }
}

function parseMediaFile(filePath: string): MediaFile | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    const slug = path.basename(filePath, '.mdx');
    return {
      frontmatter: data as MediaFrontmatter,
      filePath,
      slug,
    };
  } catch {
    return null;
  }
}

export function getAllContent(opts?: { mode?: 'public' | 'admin' }): Map<string, ContentFrontmatter[]> {
  const mode = opts?.mode ?? 'public';
  const result = new Map<string, ContentFrontmatter[]>();

  for (const sectionDir of getSectionDirs()) {
    const sectionId = path.basename(sectionDir);
    if (sectionId === 'media') continue;

    const files = getMdxFiles(sectionDir)
      .map(parseContentFile)
      .filter((f): f is ContentFile => f !== null)
      .filter((f) => mode === 'admin' || f.frontmatter.status === 'public')
      .sort((a, b) => new Date(b.frontmatter.createdAt).getTime() - new Date(a.frontmatter.createdAt).getTime());

    result.set(sectionId, files.map((f) => f.frontmatter));
  }

  return result;
}

export function getContentBySlug(slug: string): ContentFile | null {
  // Check root-level intro first
  const introPath = path.join(CONTENT_DIR, 'intro.mdx');
  if (slug === 'intro' && fs.existsSync(introPath)) {
    return parseContentFile(introPath);
  }

  // Fast path: filename matches slug
  for (const sectionDir of getSectionDirs()) {
    if (path.basename(sectionDir) === 'media') continue;
    const filePath = path.join(sectionDir, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      const file = parseContentFile(filePath);
      // If filename/frontmatter slug mismatch, heal it by renaming the file
      if (file && file.frontmatter.slug !== slug) {
        const correctedPath = path.join(sectionDir, `${file.frontmatter.slug}.mdx`);
        fs.renameSync(filePath, correctedPath);
        file.filePath = correctedPath;
      }
      return file;
    }
  }

  // Fallback: scan all files by frontmatter slug (handles filename/slug mismatch)
  for (const sectionDir of getSectionDirs()) {
    if (path.basename(sectionDir) === 'media') continue;
    for (const filePath of getMdxFiles(sectionDir)) {
      const file = parseContentFile(filePath);
      if (file?.frontmatter.slug === slug) {
        // Heal the mismatch: rename file to match slug
        const correctedPath = path.join(sectionDir, `${slug}.mdx`);
        fs.renameSync(filePath, correctedPath);
        file.filePath = correctedPath;
        return file;
      }
    }
  }

  return null;
}

export function getContentBySlugAndSection(section: string, slug: string): ContentFile | null {
  const filePath = path.join(CONTENT_DIR, section, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseContentFile(filePath);
}

export function saveContent(filePath: string, frontmatter: ContentFrontmatter, body: string): void {
  const stringified = matter.stringify(body, frontmatter as unknown as Record<string, unknown>);
  fs.writeFileSync(filePath, stringified, 'utf-8');
}

export function getAllMedia(opts?: { mode?: 'public' | 'admin' }): MediaFile[] {
  const mode = opts?.mode ?? 'public';
  const mediaDir = path.join(CONTENT_DIR, 'media');
  if (!fs.existsSync(mediaDir)) return [];

  return getMdxFiles(mediaDir)
    .map(parseMediaFile)
    .filter((f): f is MediaFile => f !== null)
    .filter((f) => mode === 'admin' || f.frontmatter.status === 'public')
    .sort((a, b) => new Date(b.frontmatter.createdAt).getTime() - new Date(a.frontmatter.createdAt).getTime());
}

export function getMediaBySlug(slug: string): MediaFile | null {
  const filePath = path.join(CONTENT_DIR, 'media', `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseMediaFile(filePath);
}

export function getIntroContent(): ContentFile | null {
  const filePath = path.join(CONTENT_DIR, 'intro.mdx');
  if (!fs.existsSync(filePath)) return null;
  return parseContentFile(filePath);
}

export function getFirstPublicSlug(): { section: string; slug: string } | null {
  for (const sectionDir of getSectionDirs()) {
    const sectionId = path.basename(sectionDir);
    if (sectionId === 'media') continue;
    const files = getMdxFiles(sectionDir)
      .map(parseContentFile)
      .filter((f): f is ContentFile => f !== null && f.frontmatter.status === 'public')
      .sort((a, b) => new Date(b.frontmatter.createdAt).getTime() - new Date(a.frontmatter.createdAt).getTime());
    if (files.length > 0) {
      return { section: sectionId, slug: files[0].frontmatter.slug };
    }
  }
  return null;
}

export function getFirstAnySlug(): { section: string; slug: string } | null {
  for (const sectionDir of getSectionDirs()) {
    const sectionId = path.basename(sectionDir);
    if (sectionId === 'media') continue;
    const files = getMdxFiles(sectionDir)
      .map(parseContentFile)
      .filter((f): f is ContentFile => f !== null)
      .sort((a, b) => new Date(b.frontmatter.createdAt).getTime() - new Date(a.frontmatter.createdAt).getTime());
    if (files.length > 0) {
      return { section: sectionId, slug: files[0].frontmatter.slug };
    }
  }
  return null;
}

export function createContentFile(
  section: string,
  slug: string,
  frontmatter: ContentFrontmatter,
  body: string,
): string {
  const sectionDir = path.join(CONTENT_DIR, section);
  if (!fs.existsSync(sectionDir)) fs.mkdirSync(sectionDir, { recursive: true });
  const filePath = path.join(sectionDir, `${slug}.mdx`);
  saveContent(filePath, frontmatter, body);
  return filePath;
}

export function createMediaEntry(
  slug: string,
  frontmatter: MediaFrontmatter,
): string {
  const mediaDir = path.join(CONTENT_DIR, 'media');
  if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });
  const filePath = path.join(mediaDir, `${slug}.mdx`);
  const stringified = matter.stringify('', frontmatter as unknown as Record<string, unknown>);
  fs.writeFileSync(filePath, stringified, 'utf-8');
  return filePath;
}

export function deleteContentFile(filePath: string): void {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export function getContentFilePath(section: string, slug: string): string {
  return path.join(CONTENT_DIR, section, `${slug}.mdx`);
}

export function getMediaFilePath(slug: string): string {
  return path.join(CONTENT_DIR, 'media', `${slug}.mdx`);
}

export function updateMediaEntry(slug: string, frontmatter: Partial<MediaFrontmatter>): void {
  const filePath = getMediaFilePath(slug);
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const merged = { ...data, ...frontmatter };
  fs.writeFileSync(filePath, matter.stringify(content, merged), 'utf-8');
}
