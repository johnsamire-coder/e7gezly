import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import { useAuth, type Role } from '../lib/auth';

export function RequireRole({ role, children }: { role: Role; children: React.ReactNode }) {
  const { ready, session, user, preview, hasRole } = useAuth();

  if (!ready) return <Result title="جارٍ التحقق من الجلسة…" />;

  if (!preview && !session) {
    return (
      <Result
        status="403"
        title="تحتاج تسجيل الدخول"
        subTitle="هذه الصفحة خاصة بلوحة تحكم احجزلي، وتتطلب حسابًا بصلاحية مناسبة."
        extra={
          <Link to="/login">
            <Button type="primary">تسجيل الدخول</Button>
          </Link>
        }
      />
    );
  }

  if (!hasRole(role)) {
    return (
      <Result
        status="403"
        title="لا تملك صلاحية الوصول"
        subTitle={
          user && user.roles.length > 0
            ? `صلاحيات حسابك الحالية: ${user.roles.join('، ')}.`
            : 'لم تُسند أي صلاحيات لهذا الحساب بعد.'
        }
        extra={
          <Link to="/">
            <Button>العودة للرئيسية</Button>
          </Link>
        }
      />
    );
  }

  return <>{children}</>;
}
