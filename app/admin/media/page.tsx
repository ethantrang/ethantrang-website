import { getAllMedia } from '@/lib/content';
import { AdminMediaPage } from '@/components/admin/AdminMediaPage';

export default function AdminMediaPageRoute() {
  const items = getAllMedia({ mode: 'admin' });
  return <AdminMediaPage items={items} />;
}
