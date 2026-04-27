'use client';

import { MediaUpload } from './MediaUpload';
import { AdminMediaGrid } from './AdminMediaGrid';
import { Separator } from '@/components/ui/separator';
import type { MediaFile } from '@/lib/types';

interface AdminMediaPageProps {
  items: MediaFile[];
}

export function AdminMediaPage({ items }: AdminMediaPageProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <MediaUpload />
      <Separator />
      <AdminMediaGrid items={items} />
    </div>
  );
}
