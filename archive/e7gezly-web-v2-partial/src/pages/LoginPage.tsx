import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthDisabledResult, AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Field';
import { Icon } from '../components/ui/Icon';

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [attempted, setAttempted] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const found: { email?: string; password?: string } = {};
    if (!email.trim()) found.email = 'اكتب البريد الإلكتروني أو رقم الموبايل.';
    else if (email.includes('@') && !validateEmail(email)) found.email = 'صيغة الإيميل مش صحيحة.';
    if (password.length < 6) found.password = 'كلمة السر لازم 6 حروف على الأقل.';
    setErrors(found);
    if (Object.keys(found).length === 0) setAttempted(true);
  }

  return (
    <AuthShell
      title="دخول حسابك"
      subtitle="ادخل بياناتك علشان تكمّل طلبات الحجز وتفضل متابعها."
      footer={
        <p className="text-sm text-ink-500">
          مالهاش حساب؟{' '}
          <Link to="/register" className="font-display font-bold text-brand-700 hover:underline">
            يعملك حساب في دقيقة
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="البريد الإلكتروني أو الموبايل" htmlFor="l-id" required error={errors.email}>
          <Input
            id="l-id"
            value={email}
            placeholder="example@mail.com أو 010xxxxxxxx"
            autoComplete="username"
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((p) => ({ ...p, email: undefined }));
            }}
          />
        </Field>

        <Field label="كلمة السر" htmlFor="l-pass" required error={errors.password}>
          <Input
            id="l-pass"
            type="password"
            value={password}
            placeholder="••••••"
            autoComplete="current-password"
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((p) => ({ ...p, password: undefined }));
            }}
          />
        </Field>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-ink-500">
            <input type="checkbox" className="size-4 accent-brand-600" />
            افتكرني
          </label>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-400">
            <Icon name="lock" size={14} />
            استعادة كلمة السر: المرحلة الجاية
          </span>
        </div>

        <Button type="submit" block size="lg">
          دخول
          <Icon name="arrowLeft" size={18} />
        </Button>
      </form>

      {attempted && <AuthDisabledResult mode="login" />}
    </AuthShell>
  );
}
