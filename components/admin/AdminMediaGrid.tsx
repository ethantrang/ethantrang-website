'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { MediaFile } from '@/lib/types';

interface AdminMediaItemProps {
  item: MediaFile;
}

function AdminMediaItem({ item }: AdminMediaItemProps) {
  const [caption, setCaption] = useState(item.frontmatter.description);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleCaptionChange(value: string) {
    setCaption(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetch(`/api/media/${item.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: value }),
      });
    }, 500);
  }

  async function handleDelete() {
    if (!confirm('Delete this photo?')) return;
    await fetch(`/api/media/${item.slug}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div className="group flex flex-col gap-1.5">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={item.frontmatter.src}
          alt={item.frontmatter.description}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 640px) 50vw, 33vw"
        />
        <button
          onClick={handleDelete}
          className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 p-1"
          title="Delete photo"
        >
          <X className="h-3 w-3 text-white" />
        </button>
      </div>
      <input
        type="text"
        value={caption}
        onChange={(e) => handleCaptionChange(e.target.value)}
        placeholder="Add a caption…"
        className="w-full text-xs bg-transparent border-0 border-b border-transparent hover:border-border focus:border-border outline-none py-0.5 text-muted-foreground focus:text-foreground transition-colors"
      />
    </div>
  );
}

interface AdminMediaGridProps {
  items: MediaFile[];
}

export function AdminMediaGrid({ items }: AdminMediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        No photos yet
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-6">
      {items.map((item) => (
        <AdminMediaItem key={item.slug} item={item} />
      ))}
    </div>
  );
}
