import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '../ui/cn';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { features } from '../../core/config';

const navItems = [
  { to: '/', label: 'الرئيسية', end: true },
  { to: '/search', label: 'استكشف الخدمات' },
  { to: '/categories', label: 'الأقسام' },
  { to: '/provider', label: 'سجّل كمزوّد خدمة' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded-pill px-3.5 py-2 font-display text-[0.92rem] font-bold transition-colors',
      isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-canvas hover:text-brand-700',
    );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo size="sm" withSubtitle={false} />

          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to="/login"
              className="rounded-pill px-3.5 py-2 font-display text-[0.92rem] font-bold text-ink-600 hover:text-brand-700"
            >
              دخول
            </Link>
            <Link
              to="/register"
              className="inline-flex h-10 items-center gap-2 rounded-pill bg-brand-600 px-4 font-display text-sm font-bold text-white hover:bg-brand-700"
            >
              <Icon name="user" size={17} />
              {features.realAuth ? 'إنشاء حساب' : 'إنشاء حساب (قريبًا)'}
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid size-10 place-items-center rounded-xl text-ink-600 ring-1 ring-line lg:hidden"
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>

        {open && (
          <nav id="mobile-nav" aria-label="تنقل الموبايل" className="pb-4 lg:hidden">
            <div className="flex flex-col gap-1 pt-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-4 py-3 font-display text-[0.95rem] font-bold',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-canvas',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="grid h-11 place-items-center rounded-pill bg-white font-display text-sm font-bold text-ink-700 ring-1 ring-line"
                >
                  دخول
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="grid h-11 place-items-center rounded-pill bg-brand-600 font-display text-sm font-bold text-white"
                >
                  إنشاء حساب
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
