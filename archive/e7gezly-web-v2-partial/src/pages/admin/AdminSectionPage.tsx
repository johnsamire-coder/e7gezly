import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import { Notice } from '../../components/ui/Notice';
import { categories } from '../../data/categories';
import { getListingsForCategory } from '../../core/listingRepository';

interface SectionConfig {
  title: string;
  lead: string;
  columns: string[];
  emptyTitle: string;
  emptyBody: string;
  icon: string;
}

const configs: Record<string, SectionConfig> = {
  providers: {
    title: 'المزوّدون',
    lead: 'قائمة الأنشطة المسجّلة وحالة التوثيق.',
    columns: ['اسم النشاط', 'القسم', 'المدينة', 'الحالة'],
    emptyTitle: 'مفيش مزوّدين مسجّلين',
    emptyBody:
      'تسجيل المزوّدين لسه بيتعبّى في الواجهة ومن غير حفظ. أول ما السيرفر يتوصّل، القائمة دي هتمتلّي بنشاطات حقيقية وتقدر تغيّر حالة كل واحد (مراجعة / مفعّل / مرفوض).',
    icon: 'briefcase',
  },
  requests: {
    title: 'طلبات الحجز',
    lead: 'كل الطلبات اللي بتيجي من واجهة الزبون وحالتها.',
    columns: ['الزبون', 'الخدمة', 'التاريخ', 'الحالة'],
    emptyTitle: 'مفيش طلبات محفوظة',
    emptyBody:
      'فورم طلب الحجز بيبيّن ملخص الطلب بس من غير ما يبعت حاجة. المراحل الجاية هي اللي بتخزّن الطلب وبتحدّث حالته.',
    icon: 'calendar',
  },
  categories: {
    title: 'الأقسام',
    lead: 'الأقسام المعروضة في واجهة الزبون وعدد البطاقات في كل قسم.',
    columns: ['القسم', 'الوصف', 'بطاقات', 'ترتيب'],
    emptyTitle: '',
    emptyBody: '',
    icon: 'filter',
  },
};

export function AdminSectionPage({ section }: { section: keyof typeof configs }) {
  const config = configs[section];
  const rows = buildRows(section);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold text-ink-900">
            <Icon name={config.icon} size={24} className="text-ink-400" />
            {config.title}
          </h1>
          <p className="mt-1 text-sm text-ink-500">{config.lead}</p>
        </div>
        <Badge tone="demo" size="md">
          هيكل فقط
        </Badge>
      </div>

      <Notice tone="warn" title="العمليات اللي على الجدول معطّلة">
        <p>
          أزرار التغيير والنشر لسه متوصّلهاش بسيرفر، فعمدًا مفيش زراير شكلي هنا. أي تعديل فعلي هييجي
          مع مرحلة الصلاحيات وقاعدة البيانات.
        </p>
      </Notice>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-start text-sm">
            <thead>
              <tr className="border-b border-line bg-canvas text-xs font-bold text-ink-500">
                {config.columns.map((col) => (
                  <th key={col} className="px-5 py-3 text-start font-bold whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={config.columns.length} className="px-5 py-14">
                    <div className="text-center">
                      <span className="mb-4 inline-grid size-12 place-items-center rounded-pill bg-canvas text-ink-400">
                        <Icon name={config.icon} size={22} />
                      </span>
                      <p className="font-display text-base font-bold text-ink-800">{config.emptyTitle}</p>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-500">
                        {config.emptyBody}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={index} className="border-b border-line last:border-0 hover:bg-canvas/60">
                    {row.map((cell, i) => (
                      <td key={i} className="px-5 py-3.5 text-ink-600">
                        {i === 0 ? <span className="font-semibold text-ink-900">{cell}</span> : cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function buildRows(section: string): string[][] {
  if (section !== 'categories') return [];
  return categories.map((c) => [
    c.title,
    c.subtitle,
    String(getListingsForCategory(c.id).length),
    String(categories.indexOf(c) + 1),
  ]);
}
