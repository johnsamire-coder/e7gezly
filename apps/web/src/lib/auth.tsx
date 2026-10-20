import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { backendConfigured, supabase } from './backend';

export type Role = 'customer' | 'provider' | 'admin';

export type CurrentUser = {
  id: string;
  fullName: string;
  roles: Role[];
};

type AuthValue = {
  ready: boolean;
  session: Session | null;
  user: CurrentUser | null;
  enabled: boolean;
  preview: boolean;
  signInWithOtp: (target: { email: string } | { phone: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  hasRole: (role: Role) => boolean;
};

/** Layout-only escape hatch; never true in a production build. */
const preview = import.meta.env.DEV === true && import.meta.env.VITE_PORTAL_PREVIEW === '1';

const PREVIEW_USER: CurrentUser = { id: 'preview', fullName: 'معاينة تطوير', roles: ['admin', 'provider'] };

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(preview || !backendConfigured);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(preview ? PREVIEW_USER : null);

  const loadUser = useCallback(async (next: Session | null): Promise<CurrentUser | null> => {
    if (!next || !supabase) return null;
    const [profileResult, rolesResult] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', next.user.id).maybeSingle(),
      supabase.from('account_roles').select('role').eq('account_id', next.user.id),
    ]);
    return {
      id: next.user.id,
      fullName: (profileResult.data?.full_name as string | undefined) ?? '',
      roles: ((rolesResult.data ?? []) as { role: Role }[]).map((row) => row.role),
    };
  }, []);

  useEffect(() => {
    if (!supabase || preview) return;
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      setSession(data.session);
      setUser(await loadUser(data.session));
      setReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange(async (_event, next) => {
      if (cancelled) return;
      setSession(next);
      setUser(await loadUser(next));
      setReady(true);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [loadUser]);

  const value = useMemo<AuthValue>(
    () => ({
      ready,
      session,
      user,
      enabled: backendConfigured,
      preview,
      async signInWithOtp(target) {
        if (!supabase) return { error: 'لا يمكن إرسال رابط دخول: الخادم غير متصل.' };
        const { error } = await supabase.auth.signInWithOtp({ ...target, options: { shouldCreateUser: false } });
        return { error: error ? error.message : null };
      },
      async signOut() {
        if (preview || !supabase) return;
        await supabase.auth.signOut();
      },
      hasRole: (role) => user?.roles.includes(role) ?? false,
    }),
    [ready, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth يجب أن يُستخدم داخل <AuthProvider>');
  return ctx;
}
