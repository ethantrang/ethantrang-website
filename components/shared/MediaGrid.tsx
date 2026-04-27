import Image from 'next/image';
import type { MediaFile } from '@/lib/types';

interface MediaGridProps {
  items: MediaFile[];
}

export function MediaGrid({ items }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        No photos yet
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
        {items.map((item) => (
          <div key={item.slug} className="group relative aspect-square overflow-hidden bg-muted">
            <Image
              src={item.frontmatter.src}
              alt={item.frontmatter.description}
              fill
              className="object-cover transition-opacity group-hover:opacity-90"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            {item.frontmatter.description && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                <p className="text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                  {item.frontmatter.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
