'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { ContentStatus } from '@/lib/types';

export function MediaUpload() {
  const [dragging, setDragging] = useState(false);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ContentStatus>('public');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function upload(file: File) {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('description', description);
      fd.append('status', status);

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) {
        setDescription('');
        router.refresh();
      }
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = '';
  }

  return (
    <div className="p-4 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Upload Photo
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 py-8 text-sm text-muted-foreground transition-colors ${dragging ? 'border-foreground bg-muted' : 'border-border hover:border-foreground/40'}`}
      >
        <Upload className="h-5 w-5" />
        <span>{uploading ? 'Uploading…' : 'Drop image or click to browse'}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Caption or description…"
          className="resize-none text-sm h-16"
        />
      </div>

      <div className="flex items-center gap-2">
        <Label className="text-xs">Visibility</Label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ContentStatus)}
          className="text-xs border border-border bg-background px-2 py-1 h-7"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
          <option value="draft">Draft</option>
        </select>
      </div>
    </div>
  );
}
