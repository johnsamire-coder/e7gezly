import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthDisabledResult, AuthShell } from '../components/auth/AuthShell';
import { Button } from '../components/ui/Button';
import { Field, Input } from '../components/ui/Field';
import { Icon } from '../components/ui/Icon';

interface FormState {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirm: string;
}

const initial: FormState = { name: '', phone: '', email: '', password: '', confirm: '' };

export function RegisterPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [attempted, setAttempted] = useState(false);

  function patch(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const found: Partial<Record<keyof FormState, string>> = {};
    if (form.name.trim().length < 3) {
      found.name = 'اكتب اسمك زي ما هو';
    }
    if (form.phone.replace(/\D/g, '').length < 11) found.phone = 'اكتب رقم موبايل مصري كامل (11 رقم).';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      found.email = 'صيغة الإيميل مش صحيحة.';
    if (form.password.length < 8) found.password = 'كلمة السر لازم 8 حروف أو أكثر.';
    if (form.confirm !== form.password) found.confirm = 'الكلمتان مش متطابقتين.';
    setErrors(found);
    if (Object.keys(found).length === 0) setAttempted(true);
  }

  return (
    <AuthShell
      title="إنشاء حساب جديد"
      subtitle="حساب للزبون — لو عندك نشاط عايز تسجّله، فيه صفحة تسجيل المزوّدين."
      footer={
        <div className="space-y-3">
          <p className="text-sm text-ink-500">
            عندك حساب؟{' '}
            <Link to="/login" className="font-display font-bold text-brand-700 hover:underline">
              ادخل من هنا
            </Link>
          </p>
          <Link
            to="/provider"
            className="inline-flex items-center gap-2 text-sm font-bold text-ink-600 hover:text-brand-700"
          >
            <Icon name="briefcase" size={16} />
            سجّل كمزوّد خدمة بدل ما تعمل حساب زبون
          </Link>
        </div>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="الاسم" htmlFor="r-name" required error={errors.name}>
          <Input
            id="r-name"
            value={form.name}
            placeholder="اسمك كامل"
            autoComplete="name"
            onChange={(e) => patch('name', e.target.value)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="رقم الموبايل" htmlFor="r-phone" required error={errors.phone}>
            <Input
              id="r-phone"
              type="tel"
              inputMode="numeric"
              dir="ltr"
              className="text-start"
              value={form.phone}
              placeholder="01012345678"
              autoComplete="tel"
              onChange={(e) => patch('phone', e.target.value)}
            />
          </Field>

          <Field label="البريد الإلكتروني" htmlFor="r-email" error={errors.email} hint="اختياري">
            <Input
              id="r-email"
              type="email"
              dir="ltr"
              className="text-start"
              value={form.email}
              placeholder="example@mail.com"
              autoComplete="email"
              onChange={(e) => patch('email', e.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="كلمة السر" htmlFor="r-pass" required error={errors.password}>
            <Input
              id="r-pass"
              type="password"
              value={form.password}
              placeholder="8 حروف أو أكثر"
              autoComplete="new-password"
              onChange={(e) => patch('password', e.target.value)}
            />
          </Field>

          <Field label="تأكيد كلمة السر" htmlFor="r-confirm" required error={errors.confirm}>
            <Input
              id="r-confirm"
              type="password"
              value={form.confirm}
              placeholder="اكتبها تاني"
              autoComplete="new-password"
              onChange={(e) => patch('confirm', e.target.value)}
            />
          </Field>
        </div>

        <label className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-500">
          <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-brand-600" />
          <span>
            أوافق على شروط الاستخدام وسياسة الخصوصية.
            <span className="mt-0.5 block text-xs text-ink-400">
              الصفحات دي لسه بتتكتب — هتلاقي الروابط الفعلية مع مرحلة إطلاق الحسابات.
            </span>
          </span>
        </label>

        <Button type="submit" block size="lg">
          إنشاء الحساب
          <Icon name="arrowLeft" size={18} />
        </Button>
      </form>

      {attempted && <AuthDisabledResult mode="register" />}
    </AuthShell>
  );
}
