import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { Notice } from '../ui/Notice';

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="container-page py-10 sm:py-16">
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="hidden lg:block">
          <Logo size="lg" />
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-ink-500">
            حساب واحد يجمع لك طلبات الحجز، نشاطك كمزوّد، وتفضيلاتك في البحث.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'احفظ الأماكن المفضلة عندك',
              'تابع حالة طلبات الحجز',
              'سجّل نشاطك واداره من مكان واحد',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-ink-600">
                <span className="grid size-6 place-items-center rounded-pill bg-brand-50 text-brand-600">
                  <Icon name="check" size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="mb-6 lg:hidden">
            <Logo size="sm" />
          </div>

          <h1 className="text-2xl font-extrabold">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p>

          <Notice tone="warn" className="my-5">
            <p>
              تسجيل الدخول لسه مش مفعّل — مفيش سيرفر ولا قاعدة مستخدمين في المرحلة دي. الفورم ده بيوضح
              الشكل فقط ومبيدخلّش حد.
            </p>
          </Notice>

          {children}

          <div className="mt-6 border-t border-line pt-5">{footer}</div>
        </Card>
      </div>
    </div>
  );
}

export function AuthDisabledResult({ mode }: { mode: 'login' | 'register' }) {
  return (
    <div className="mt-5 rounded-xl bg-warn-100 px-4 py-4 text-sm ring-1 ring-warn-700/20">
      <p className="flex items-start gap-2 font-bold text-warn-700">
        <Icon name="lock" size={17} className="mt-0.5" />
        {mode === 'login' ? 'الدخول مش متاح دلوقتي' : 'إنشاء الحساب مش متاح دلوقتي'}
      </p>
      <p className="mt-2 leading-relaxed text-ink-600">
        البيانات اللي كتبتها صحيحة من ناحية الشكل، بس مفيش مكان بيتخزن فيه الحساب. الصلاحية دي بتيجي
        مع مرحلة الاتصال بسيرفر.
      </p>
      <Link to="/" className="mt-3 inline-block font-display text-sm font-bold text-brand-700 hover:underline">
        كمّل من غير حساب →
      </Link>
    </div>
  );
}
