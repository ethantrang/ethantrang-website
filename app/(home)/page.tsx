import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkBreaks from 'remark-breaks';
import { getIntroContent } from '@/lib/content';

const components = {
  a: ({ href, ...props }: React.ComponentProps<'a'>) =>
    href?.startsWith('http') ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    ) : (
      <a href={href} {...props} />
    ),
};

export default function HomePage() {
  const intro = getIntroContent();
  if (!intro) notFound();
  return (
    <main className="min-h-full bg-white text-black px-6 pt-16 pb-16 sm:px-12 sm:pt-24">
      <div className="mx-auto max-w-xl text-left text-[15px] leading-relaxed">
        <h1 className="mb-4 font-normal">{intro.frontmatter.title}</h1>
        <div className="[&_p]:mb-4 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-60">
          <MDXRemote source={intro.body} components={components} options={{ mdxOptions: { remarkPlugins: [remarkBreaks] } }} />
        </div>
      </div>
    </main>
  );
}
