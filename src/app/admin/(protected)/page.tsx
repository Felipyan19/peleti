import AdminDashboard from '@/components/admin/AdminDashboard';
import { getAdminDashboardData } from '@/lib/site-data';

export default async function AdminPage() {
  const initialData = JSON.parse(JSON.stringify(await getAdminDashboardData()));

  return <AdminDashboard initialData={initialData} />;
}
