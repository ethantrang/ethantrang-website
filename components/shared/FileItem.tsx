'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ContentStatus } from '@/lib/types';

interface FileItemProps {
  title: string;
  href: string;
  status?: ContentStatus;
  showStatus?: boolean;
  showDelete?: boolean;
  deleteSlug?: string;
}

const statusBadgeColors: Record<ContentStatus, string> = {
  public: '',
  private: 'bg-muted text-muted-foreground',
  draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
};

export function FileItem({ title, href, status, showStatus = false, showDelete = false, deleteSlug }: FileItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === href;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${title}"?`)) return;
    const slug = deleteSlug ?? href.split('/').pop();
    await fetch(`/api/content/${slug}`, { method: 'DELETE' });
    if (pathname === href) {
      router.push('/admin');
    } else {
      router.refresh();
    }
  }

  return (
    <div className="group relative flex items-center">
      <Link
        href={href}
        className={cn(
          'flex flex-1 items-center gap-2 px-3 py-1.5 text-sm transition-colors min-w-0',
          'hover:bg-muted',
          isActive ? 'bg-muted text-foreground' : 'text-foreground',
          showDelete && 'pr-7',
        )}
      >
        <span className="truncate">{title}</span>
        {showStatus && status && status !== 'public' && (
          <span className={cn('shrink-0 text-[10px] uppercase tracking-wide rounded px-1 py-0.5', statusBadgeColors[status])}>
            {status}
          </span>
        )}
      </Link>
      {showDelete && (
        <button
          onClick={handleDelete}
          className="absolute right-2 opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity p-0.5"
          title={`Delete ${title}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
