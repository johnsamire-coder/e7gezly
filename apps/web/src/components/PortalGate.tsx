import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../lib/auth';

/**
 * Without a connected backend nobody can sign in, so the shell redirects to the
 * login screen. Dev preview mode (VITE_PORTAL_PREVIEW=1) renders the layout with
 * a notice so the RTL chrome can be reviewed before Supabase exists; it is
 * compiled out of production builds because import.meta.env.DEV is false there.
 */
export function PortalGate() {
  const { ready, session, preview } = useAuth();

  if (preview || session) return <Outlet />;
  if (!ready) return null;
  return <Navigate to="/login" replace />;
}
