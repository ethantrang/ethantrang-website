import { notFound } from 'next/navigation';
import { getIntroContent } from '@/lib/content';
import { ContentViewer } from '@/components/shared/ContentViewer';

export default function HomePage() {
  const intro = getIntroContent();
  if (!intro) notFound();
  return <ContentViewer frontmatter={intro.frontmatter} body={intro.body} showDates={false} />;
}
