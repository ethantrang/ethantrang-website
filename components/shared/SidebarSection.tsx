'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Section } from '@/lib/types';

interface SidebarSectionProps {
  section: Section;
  children: React.ReactNode;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
}

export function SidebarSection({ section, children, defaultOpen = true, actions }: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <div className="group flex items-center hover:bg-muted transition-colors">
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-1 items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
        >
          <span>{section.label}</span>
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          )}
        </button>
        {actions && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2">
            {actions}
          </div>
        )}
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}
