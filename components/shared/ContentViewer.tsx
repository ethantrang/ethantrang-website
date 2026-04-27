import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkBreaks from 'remark-breaks';
import type { ContentFrontmatter } from '@/lib/types';

interface ContentViewerProps {
  frontmatter: ContentFrontmatter;
  body: string;
  showDates?: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ContentViewer({ frontmatter, body, showDates = true }: ContentViewerProps) {
  return (
    <article className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-2">{frontmatter.title}</h1>
      {showDates && (
        <div className="flex gap-4 text-sm text-muted-foreground mb-8">
          <span>Created {formatDate(frontmatter.createdAt)}</span>
          {frontmatter.updatedAt !== frontmatter.createdAt && (
            <span>Updated {formatDate(frontmatter.updatedAt)}</span>
          )}
        </div>
      )}
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <MDXRemote source={body} options={{ mdxOptions: { remarkPlugins: [remarkBreaks] } }} />
      </div>
    </article>
  );
}
