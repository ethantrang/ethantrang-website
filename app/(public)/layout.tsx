import { Sidebar } from '@/components/shared/Sidebar';
import { SidebarLayout } from '@/components/shared/SidebarLayout';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout sidebar={<Sidebar mode="public" />}>
      {children}
    </SidebarLayout>
  );
}
