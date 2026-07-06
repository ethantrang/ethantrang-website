'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ContentFrontmatter } from '@/lib/types';

const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidSlug(s: string): boolean {
  return VALID_SLUG.test(s);
}

interface FrontmatterFormProps {
  frontmatter: ContentFrontmatter;
  onChange: (partial: Partial<ContentFrontmatter>) => void;
  onValidChange?: (valid: boolean) => void;
  disableSlug?: boolean;
}

export function FrontmatterForm({ frontmatter, onChange, onValidChange, disableSlug = false }: FrontmatterFormProps) {
  const [title, setTitle] = useState(frontmatter.title);
  const [slug, setSlug] = useState(frontmatter.slug);
  const [slugError, setSlugError] = useState(() =>
    isValidSlug(frontmatter.slug) ? '' : 'Slug must be lowercase letters, numbers, and hyphens only'
  );
  const [createdAt, setCreatedAt] = useState(frontmatter.createdAt.slice(0, 10));
  const [updatedAt, setUpdatedAt] = useState(frontmatter.updatedAt.slice(0, 10));

  useEffect(() => {
    setTitle(frontmatter.title);
    const newSlug = frontmatter.slug;
    setSlug(newSlug);
    setSlugError(isValidSlug(newSlug) ? '' : 'Slug must be lowercase letters, numbers, and hyphens only');
    setCreatedAt(frontmatter.createdAt.slice(0, 10));
    setUpdatedAt(frontmatter.updatedAt.slice(0, 10));
  }, [frontmatter.slug, frontmatter.title, frontmatter.createdAt, frontmatter.updatedAt]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 border-b border-border">
      <div className="space-y-1.5">
        <Label htmlFor="fm-title" className="text-xs">Title</Label>
        <Input
          id="fm-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            onChange({ title: e.target.value });
          }}
          className="h-8 text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="fm-slug" className="text-xs">Slug</Label>
        <Input
          id="fm-slug"
          value={slug}
          onChange={(e) => {
            const val = e.target.value;
            setSlug(val);
            const valid = isValidSlug(val);
            setSlugError(valid ? '' : 'Slug must be lowercase letters, numbers, and hyphens only');
            onValidChange?.(valid);
            onChange({ slug: val });
          }}
          disabled={disableSlug}
          className={`h-8 text-sm font-mono disabled:opacity-40 disabled:cursor-not-allowed${slugError ? ' border-destructive focus-visible:ring-destructive' : ''}`}
        />
        {slugError && <p className="text-xs text-destructive">{slugError}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="fm-created" className="text-xs">Created</Label>
        <Input
          id="fm-created"
          type="date"
          value={createdAt}
          onChange={(e) => {
            setCreatedAt(e.target.value);
            onChange({ createdAt: new Date(e.target.value).toISOString() });
          }}
          className="h-8 text-sm"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="fm-updated" className="text-xs">Updated</Label>
        <Input
          id="fm-updated"
          type="date"
          value={updatedAt}
          onChange={(e) => {
            setUpdatedAt(e.target.value);
            onChange({ updatedAt: new Date(e.target.value).toISOString() });
          }}
          className="h-8 text-sm"
        />
      </div>
    </div>
  );
}
