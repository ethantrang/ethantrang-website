'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Section } from '@/lib/types';

interface SectionReorderProps {
  sections: Section[];
}

export function SectionReorder({ sections: initialSections }: SectionReorderProps) {
  const [sections, setSections] = useState(initialSections);
  const router = useRouter();

  async function move(index: number, direction: 'up' | 'down') {
    const next = [...sections];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= next.length) return;

    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    const reordered = next.map((s, i) => ({ ...s, order: i }));
    setSections(reordered);

    await fetch('/api/sections', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections: reordered }),
    });

    router.refresh();
  }

  return (
    <div className="p-4 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
        Reorder Sections
      </p>
      {sections.map((section, i) => (
        <div key={section.id} className="flex items-center gap-2 text-sm">
          <span className="flex-1">{section.label}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            disabled={i === 0}
            onClick={() => move(i, 'up')}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            disabled={i === sections.length - 1}
            onClick={() => move(i, 'down')}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}
