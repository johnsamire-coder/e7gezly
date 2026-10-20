import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Badge } from '../ui/Badge';

const columns = [
  {
    title: 'الزبون',
    links: [
      { to: '/search', label: 'استكشف الخدمات' },
      { to: '/categories', label: 'كل الأقسام' },
      { to: '/booking', label: 'اطلب حجز' },
    ],
  },
  {
    title: 'مزوّد الخدمة',
    links: [
      { to: '/provider', label: 'سجّل نشاطك' },
      { to: '/admin', label: 'لوحة التحكم (تجريبي)' },
    ],
  },
  {
    title: 'الحساب',
    links: [
      { to: '/login', label: 'دخول' },
      { to: '/register', label: 'إنشاء حساب' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-white">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo size="sm" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              سوق حجز الخدمات في مصر — ابحث، قارن، واطلب حجز في مكان واحد.
            </p>
            <Badge tone="demo" className="mt-4">
              نموذج واجهة — المرحلة الأولى
            </Badge>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 font-display text-sm font-bold text-ink-900">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link to={link.to} className="text-sm text-ink-500 hover:text-brand-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 احجزلي — كل البيانات المعروضة تجريبية وغير مرتبطة بمزوّدين حقيقيين.</p>
          <p>مفيش مدفوعات ولا حجوزات فعلية في المرحلة دي.</p>
        </div>
      </div>
    </footer>
  );
}
