import { notFound } from 'next/navigation';
import { getContentBySlug } from '@/lib/content';
import { ContentViewer } from '@/components/shared/ContentViewer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const file = getContentBySlug(slug);

  if (!file || file.frontmatter.status !== 'public') {
    notFound();
  }

  return <ContentViewer frontmatter={file.frontmatter} body={file.body} />;
}
