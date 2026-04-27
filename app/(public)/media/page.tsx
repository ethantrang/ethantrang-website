import { getAllMedia } from '@/lib/content';
import { MediaGrid } from '@/components/shared/MediaGrid';

export default function MediaPage() {
  const items = getAllMedia({ mode: 'public' });
  return <MediaGrid items={items} />;
}
