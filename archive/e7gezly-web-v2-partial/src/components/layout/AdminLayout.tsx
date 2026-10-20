import { Link, NavLink, Outlet } from 'react-router-dom';
import { cn } from '../ui/cn';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { Badge } from '../ui/Badge';

const adminNav = [
  { to: '/admin', label: 'نظرة عامة', icon: 'dashboard', end: true },
  { to: '/admin/providers', label: 'المزوّدون', icon: 'briefcase' },
  { to: '/admin/requests', label: 'طلبات الحجز', icon: 'calendar' },
  { to: '/admin/categories', label: 'الأقسام', icon: 'filter' },
];

/** Deliberately a dark, separate shell so admin UI never mixes with customer UI. */
export function AdminLayout() {
  return (
    <div className="min-h-screen bg-ink-900 text-ink-800">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-ink-800 px-5 py-5 lg:w-72 lg:border-b-0 lg:border-s lg:border-white/10 lg:py-7">
          <div className="flex items-center justify-between gap-3">
            <Logo size="sm" tone="light" withSubtitle={false} to="/admin" />
            <Badge tone="demo">Shell</Badge>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-white/50">
            منطقة إدارة منفصلة عن واجهة الزبون. البيانات هنا توضيحية بالكامل.
          </p>

          <nav aria-label="تنقل الإدارة" className="mt-6 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {adminNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 font-display text-sm font-bold',
                    'transition-colors',
                    isActive ? 'bg-brand-600 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white',
                  )
                }
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 hidden rounded-xl bg-white/5 p-4 ring-1 ring-white/10 lg:block">
            <p className="font-display text-xs font-bold text-white">المرحلة الأولى</p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/55">
              مفيش قاعدة بيانات ولا صلاحيات حقيقية. الأرقام معروضة كمثال للشكل فقط.
            </p>
          </div>
        </aside>

        <div className="flex-1 bg-canvas">
          <header className="flex h-16 items-center justify-between gap-4 border-b border-line bg-white px-5">
            <p className="font-display text-sm font-bold text-ink-600">لوحة تحكم احجزلي — شكل مبدئي</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-pill px-3.5 py-2 font-display text-sm font-bold text-brand-700 ring-1 ring-brand-100 hover:bg-brand-50"
            >
              <Icon name="arrowLeft" size={17} />
              رجوع للموقع
            </Link>
          </header>
          <main className="p-5 sm:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
