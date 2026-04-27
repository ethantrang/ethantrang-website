'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FrontmatterForm } from './FrontmatterForm';
import { MarkdownEditor } from './MarkdownEditor';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ContentFrontmatter, ContentStatus } from '@/lib/types';

interface AdminEditorProps {
  frontmatter: ContentFrontmatter;
  body: string;
}

export function AdminEditor({ frontmatter, body }: AdminEditorProps) {
  const router = useRouter();
  const slug = frontmatter.slug;

  const [status, setStatus] = useState<ContentStatus>(frontmatter.status);
  const [saving, setSaving] = useState(false);
  const pendingFrontmatter = useRef<Partial<ContentFrontmatter>>({});

  const patchContent = useCallback(
    async (partial: { frontmatter?: Partial<ContentFrontmatter>; body?: string }) => {
      const res = await fetch(`/api/content/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partial),
      });
      // Body-only saves don't affect sidebar — skip refresh to avoid resetting form state
      if (!partial.frontmatter) return;
      const data = await res.json();
      if (partial.frontmatter.slug && partial.frontmatter.slug !== slug) {
        router.replace(`/admin/${data.slug}`);
      } else {
        router.refresh();
      }
    },
    [slug, router],
  );

  async function handleSave() {
    setSaving(true);
    await patchContent({ frontmatter: { ...pendingFrontmatter.current, status } });
    pendingFrontmatter.current = {};
    setSaving(false);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border gap-3">
        <span className="text-xs text-muted-foreground font-mono truncate">{slug}</span>
        <div className="flex items-center gap-2 shrink-0">
          <Select value={status} onValueChange={(v) => setStatus(v as ContentStatus)}>
            <SelectTrigger className="h-8 text-xs w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft" className="text-xs">Draft</SelectItem>
              <SelectItem value="private" className="text-xs">Private</SelectItem>
              <SelectItem value="public" className="text-xs">Public</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="h-8 text-xs" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <FrontmatterForm
        frontmatter={frontmatter}
        onChange={(partial) => {
          pendingFrontmatter.current = { ...pendingFrontmatter.current, ...partial };
        }}
        disableSlug={slug === 'intro'}
      />

      {/* Editor — body still auto-saves */}
      <MarkdownEditor
        body={body}
        onSave={(newBody) => patchContent({ body: newBody })}
      />
    </div>
  );
}
