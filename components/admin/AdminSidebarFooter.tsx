'use client';

import { Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { SectionReorder } from './SectionReorder';
import type { Section } from '@/lib/types';

interface AdminSidebarFooterProps {
  sections: Section[];
}

export function AdminSidebarFooter({ sections }: AdminSidebarFooterProps) {
  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center justify-center p-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors" title="Manage sections">
        <Settings className="h-3.5 w-3.5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="px-4 py-4">
          <span className="text-sm font-semibold">Sections</span>
        </div>
        <Separator />
        <SectionReorder sections={sections} />
      </SheetContent>
    </Sheet>
  );
}
