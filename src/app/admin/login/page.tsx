import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import LoginForm from '@/components/admin/LoginForm';
import { AUTH_COOKIE_NAME, getSessionFromToken } from '@/utils/api/authHelpers';

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = getSessionFromToken(token);

  if (session?.role === 'ADMIN') {
    redirect('/admin');
  }

  return <LoginForm />;
}
