import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Notice } from '../../components/ui/Notice';
import { categories } from '../../data/categories';
import { getAllListings } from '../../core/listingRepository';

/** Counts derived from the in-memory demo dataset — truthful about the demo, not real business metrics. */
function demoStats() {
  const listings = getAllListings();
  const perCategory = categories.map((c) => ({
    category: c,
    count: listings.filter((l) => l.categoryId === c.id).length,
  }));
  return {
    totalListings: listings.length,
    realProviders: 0,
    pendingRequests: 0,
    categoryCount: categories.length,
    cities: [...new Set(listings.map((l) => l.city))].length,
    perCategory,
  };
}

const statCards = [
  { key: 'totalListings', label: 'بطاقات معروضة', note: 'كلها تجريبية', icon: 'briefcase' },
  { key: 'realProviders', label: 'مزوّدون حقيقيون', note: 'مفيش تسجيل بعد', icon: 'shield' },
  { key: 'pendingRequests', label: 'طلبات حجز محفوظة', note: 'مفيش تخزين لسه', icon: 'calendar' },
  { key: 'cities', label: 'مدن في البيانات', note: 'من البطاقات النموذج', icon: 'pin' },
] as const;

export function AdminOverviewPage() {
  const stats = demoStats();
  const maxCount = Math.max(...stats.perCategory.map((p) => p.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">نظرة عامة</h1>
          <p className="mt-1 text-sm text-ink-500">هيكل لوحة التحكم — من غير أي بيانات تشغيل حقيقية.</p>
        </div>
        <Badge tone="demo" size="md">
          وضع العرض
        </Badge>
      </div>

      <Notice tone="warn" title="اقرأ ده قبل ما تتفرج على الأرقام">
        <p>
          الأرقام دي متحسوبة على مجموعة البطاقات التجريبية اللي في الواجهة، ومش بتعبير عن نشاط حقيقي
          على المنصة. ولا إيرادات ولا عملاء ولا طلبات — دول هيجوا مع قاعدة البيانات.
        </p>
      </Notice>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const value = stats[card.key];
          return (
            <Card key={card.key} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-ink-400">{card.label}</p>
                  <p className="mt-1.5 font-display text-3xl font-extrabold text-ink-900">{value}</p>
                  <p className="mt-1 text-xs text-warn-700">{card.note}</p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-canvas text-ink-400">
                  <Icon name={card.icon} size={19} />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr] lg:items-start">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-extrabold text-ink-900">توزيع البطاقات على الأقسام</h2>
            <span className="text-xs text-ink-400">تجريبي</span>
          </div>
          <ul className="space-y-3">
            {stats.perCategory.map(({ category, count }) => (
              <li key={category.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-semibold text-ink-600">
                    <Icon name={category.icon} size={16} className="text-ink-400" />
                    {category.title}
                  </span>
                  <span className="font-display font-bold text-ink-800">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-pill bg-canvas">
                  <div
                    className="h-full rounded-pill bg-brand-500"
                    style={{ width: `${Math.round((count / maxCount) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <h2 className="mb-1 font-display text-base font-extrabold text-ink-900">آخر طلبات الحجز</h2>
          <p className="mb-4 text-xs text-ink-400">الجدول ده هيتعبّى لما الطلبات تتخزن على سيرفر.</p>
          <div className="overflow-hidden rounded-xl ring-1 ring-line">
            <div className="grid grid-cols-4 gap-2 bg-canvas px-4 py-2.5 text-xs font-bold text-ink-500">
              <span>الزبون</span>
              <span>الخدمة</span>
              <span>التاريخ</span>
              <span>الحالة</span>
            </div>
            <div className="bg-white px-4 py-8 text-center text-sm text-ink-400">
              مفيش طلبات محفوظة
            </div>
          </div>

          <div className="mt-5">
            <EmptyState
              icon="calendar"
              title="مفيش طلبات لسه"
              body="فورم طلب الحجز شغال في الواجهة بس، والبيانات مش بتتخزن. الجدول ده هيشوف أول طلب فعلًا مع المرحلة الجاية."
            />
          </div>

          <ul className="mt-5 space-y-2 text-sm">
            {[
              'لوحة تحكم المزوّدين',
              'مراجعة طلبات التسجيل',
              'إدارة الأقسام والأسعار',
              'تقارير الأداء',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-ink-500">
                <Icon name="lock" size={15} className="text-ink-400" />
                {item}
                <span className="text-xs text-ink-400">— المرحلة الجاية</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/providers"
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-ink-900 px-5 font-display text-sm font-bold text-white hover:bg-ink-800"
        >
          <Icon name="briefcase" size={17} />
          قسم المزوّدين
        </Link>
        <Link
          to="/admin/requests"
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-white px-5 font-display text-sm font-bold text-ink-700 ring-1 ring-line hover:ring-brand-300"
        >
          <Icon name="calendar" size={17} />
          قسم الطلبات
        </Link>
        <Link
          to="/"
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-white px-5 font-display text-sm font-bold text-brand-700 ring-1 ring-brand-100 hover:bg-brand-50"
        >
          <Icon name="arrowLeft" size={17} />
          رجوع لواجهة الزبون
        </Link>
      </div>
    </div>
  );
}
