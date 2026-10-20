import type { SearchFilters } from '../../core/types';
import { categories } from '../../data/categories';
import { egyptCities } from '../../data/locations';
import { getAllListings } from '../../core/listingRepository';
import { formatEGP } from '../../core/format';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Field, Input, Select } from '../ui/Field';
import { Icon } from '../ui/Icon';

interface Props {
  filters: SearchFilters;
  ceiling: number;
  onChange: (patch: Partial<SearchFilters>) => void;
  onReset: () => void;
  resultCount: number;
}

function buildCityOptions(): Array<{ value: string; label: string }> {
  const used = new Set(getAllListings().map((l) => l.city));
  const all = [...new Set([...used, ...egyptCities])];
  return all.map((city) => ({ value: city, label: city }));
}

const cityOptions = buildCityOptions();

export function FilterPanel({ filters, ceiling, onChange, onReset, resultCount }: Props) {
  const priceValue = filters.maxPrice === '' ? ceiling : Number(filters.maxPrice);

  return (
    <div className="rounded-card bg-white p-5 ring-1 ring-line shadow-card">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink-900">
          <Icon name="filter" size={18} className="text-brand-600" />
          تصفية النتائج
        </h2>
        <Badge tone="brand">{resultCount} نتيجة</Badge>
      </div>

      <div className="flex flex-col gap-4">
        <Field label="القسم" htmlFor="f-cat">
          <Select
            id="f-cat"
            value={filters.categoryId}
            placeholder="كل الأقسام"
            options={categories.map((c) => ({ value: c.id, label: c.title }))}
            onChange={(e) => onChange({ categoryId: e.target.value as SearchFilters['categoryId'] })}
          />
        </Field>

        <Field label="الموقع" htmlFor="f-city">
          <Select
            id="f-city"
            value={filters.city}
            placeholder="كل المدن"
            options={cityOptions}
            onChange={(e) => onChange({ city: e.target.value })}
          />
        </Field>

        <Field
          label="التاريخ المطلوب"
          htmlFor="f-date"
          hint="التاريخ بيتسجّل مع طلب الحجز بس. مفيش ربط بمواعيد حقيقية لسه، علشان كده مش بيصفّي النتائج."
        >
          <Input
            id="f-date"
            type="date"
            value={filters.date}
            onChange={(e) => onChange({ date: e.target.value })}
          />
        </Field>

        <Field
          label="أقصى سعر تقريبي"
          htmlFor="f-price"
          hint="السعر المعروض تجريبي وغير ملزم من أي مزوّد حقيقي."
        >
          <div className="pt-1">
            <input
              id="f-price"
              type="range"
              min={50}
              max={ceiling}
              step={50}
              value={priceValue}
              onChange={(e) => {
                const next = Number(e.target.value);
                onChange({ maxPrice: next >= ceiling ? '' : next });
              }}
              className="h-2 w-full cursor-pointer appearance-none rounded-pill bg-line accent-brand-600"
            />
            <div className="mt-2 flex items-center justify-between text-xs font-semibold text-ink-400">
              <span>{formatEGP(50)}</span>
              <span className="font-display text-sm font-bold text-brand-700">
                {filters.maxPrice === '' ? `لحد ${formatEGP(ceiling)}` : `${formatEGP(priceValue)} أو أقل`}
              </span>
            </div>
          </div>
        </Field>

        <Button variant="outline" block onClick={onReset} type="button">
          <Icon name="close" size={17} />
          مسح الفلاتر
        </Button>
      </div>
    </div>
  );
}
