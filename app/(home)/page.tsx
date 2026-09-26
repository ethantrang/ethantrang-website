import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkBreaks from 'remark-breaks';
import { getIntroContent } from '@/lib/content';

export default function HomePage() {
  const intro = getIntroContent();
  if (!intro) notFound();
  return (
    <main className="min-h-full bg-white text-black px-6 pt-16 pb-16 sm:px-12 sm:pt-24">
      <div className="max-w-xl text-left text-[15px] leading-relaxed">
        <h1 className="mb-6 font-medium">{intro.frontmatter.title}</h1>
        <div className="[&_p]:mb-4 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-60">
          <MDXRemote source={intro.body} options={{ mdxOptions: { remarkPlugins: [remarkBreaks] } }} />
        </div>
      </div>
    </main>
  );
}
