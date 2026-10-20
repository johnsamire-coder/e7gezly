import { Link } from 'react-router-dom';
import { Section } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { CategoryCard } from '../components/categories/CategoryCard';
import { categories } from '../data/categories';
import { getListingsForCategory } from '../core/listingRepository';
import { Notice } from '../components/ui/Notice';

export function CategoriesPage() {
  const total = categories.reduce((sum, c) => sum + getListingsForCategory(c.id).length, 0);

  return (
    <Section
      eyebrow="كل الأقسام"
      title="الأقسام المتاحة على احجزلي"
      description="كل قسم ليه صفحة نتائج فيها فلاتر للقسم والموقع والسعر."
    >
      <Notice tone="info" className="mb-6">
        <p>
          عدد البطاقات المعروض دلوقتي كله من بيانات تجريبية ({total} بطاقة نموذج). مزوّد حقيقي واحد
          لسه مسجّل في السوق.
        </p>
      </Notice>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          to="/search"
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-white px-5 font-display text-sm font-bold text-brand-700 ring-1 ring-line hover:ring-brand-300"
        >
          <Icon name="search" size={17} />
          دور من غير قسم محدد
        </Link>
        <Link
          to="/provider"
          className="inline-flex h-11 items-center gap-2 rounded-pill bg-brand-600 px-5 font-display text-sm font-bold text-white hover:bg-brand-700"
        >
          <Icon name="briefcase" size={17} />
          سجّل نشاطك في قسم
        </Link>
      </div>
    </Section>
  );
}
