import { notFound } from 'next/navigation';
import { getContentBySlug } from '@/lib/content';
import { AdminEditor } from '@/components/admin/AdminEditor';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminContentPage({ params }: PageProps) {
  const { slug } = await params;
  const file = getContentBySlug(slug);

  if (!file) notFound();

  return (
    <div className="flex flex-col h-full">
      <AdminEditor frontmatter={file.frontmatter} body={file.body} />
    </div>
  );
}
