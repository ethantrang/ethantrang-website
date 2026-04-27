'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface AddFileButtonProps {
  sectionId: string;
}

export function AddFileButton({ sectionId }: AddFileButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: sectionId }),
      });
      const { slug } = await res.json();
      router.push(`/admin/${slug}`);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="p-0.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
      title={`New file in ${sectionId}`}
    >
      <Plus className="h-3.5 w-3.5" />
    </button>
  );
}
