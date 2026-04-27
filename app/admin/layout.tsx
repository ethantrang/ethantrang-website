import { Sidebar } from '@/components/shared/Sidebar';
import { SidebarLayout } from '@/components/shared/SidebarLayout';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout sidebar={<Sidebar mode="admin" />}>
      {children}
    </SidebarLayout>
  );
}
