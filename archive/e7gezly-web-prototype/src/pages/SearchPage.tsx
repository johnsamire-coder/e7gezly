import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchAssistant } from '../components/search/SearchAssistant';
import { FilterPanel } from '../components/search/FilterPanel';
import { ServiceCard } from '../components/services/ServiceCard';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Notice } from '../components/ui/Notice';
import { priceCeiling, searchListings } from '../core/listingRepository';
import { filtersToSearchParams, searchParamsToFilters } from '../core/searchParams';
import { emptyFilters, type SearchFilters } from '../core/types';
import { getCategory } from '../data/categories';
import { formatDateAr } from '../core/format';

type SortKey = 'price-asc' | 'price-desc' | 'name';

const sortLabels: Record<SortKey, string> = {
  'price-asc': 'السعر: من الأقل',
  'price-desc': 'السعر: من الأعلى',
  name: 'الاسم',
};

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(() => searchParamsToFilters(params), [params]);
  const sort = (params.get('sort') as SortKey) || 'price-asc';
  const ceiling = useMemo(() => priceCeiling(searchListings({ ...emptyFilters })), []);

  const results = useMemo(() => {
    const list = searchListings(filters);
    if (sort === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    return sort === 'price-desc' ? [...list].reverse() : list;
  }, [filters, sort]);

  function applyPatch(patch: Partial<SearchFilters>) {
    const next = { ...filters, ...patch };
    const nextParams = new URLSearchParams(filtersToSearchParams(next).split('?')[1] ?? '');
    if (sort !== 'price-asc') nextParams.set('sort', sort);
    setParams(nextParams, { replace: true });
  }

  function reset() {
    setParams(new URLSearchParams(), { replace: true });
  }

  function setParamsSort(key: SortKey) {
    const next = new URLSearchParams(params);
    if (key === 'price-asc') next.delete('sort');
    else next.set('sort', key);
    setParams(next, { replace: true });
  }

  const categoryTitle = filters.categoryId ? getCategory(filters.categoryId)?.title : undefined;
  const activeCount =
    Number(Boolean(filters.query)) +
    Number(Boolean(filters.categoryId)) +
    Number(Boolean(filters.city)) +
    Number(Boolean(filters.maxPrice !== ''));

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">نتائج البحث</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            {categoryTitle ? (
              <>
                القسم: <strong className="text-ink-800">{categoryTitle}</strong>
              </>
            ) : (
              'كل الأقسام'
            )}
            {filters.city && (
              <>
                {' · '}
                <strong className="text-ink-800">{filters.city}</strong>
              </>
            )}
          </p>
          {filters.date && (
            <Badge tone="outline" className="mt-2">
              <Icon name="calendar" size={14} />
              التاريخ المطلوب: {formatDateAr(filters.date)} — بيتسجّل مع الطلب بس
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="sort" className="text-sm font-semibold text-ink-500">
            ترتيب:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setParamsSort(e.target.value as SortKey)}
            className="h-10 rounded-pill bg-white px-4 font-display text-sm font-bold text-ink-700 ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {sortLabels[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 max-w-2xl">
        <SearchAssistant size="compact" initialQuery={filters.query} categoryId={filters.categoryId} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <div className="lg:hidden">
            <Button
              variant="outline"
              block
              onClick={() => setMobileFiltersOpen((v) => !v)}
              aria-expanded={mobileFiltersOpen}
            >
              <Icon name="filter" size={17} />
              الفلاتر {activeCount > 0 && `(${activeCount})`}
            </Button>
          </div>

          <div className={`${mobileFiltersOpen ? 'mt-3 block' : 'hidden'} lg:mt-0 lg:block`}>
            <FilterPanel
              filters={filters}
              ceiling={ceiling}
              resultCount={results.length}
              onChange={applyPatch}
              onReset={reset}
            />
          </div>
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-sm font-bold text-ink-600">
              {results.length > 0
                ? `${results.length} بطاقة${filters.query ? ' مطابقة لبحثك' : ''}`
                : 'مفيش نتائج مطابقة'}
            </p>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:underline"
              >
                <Icon name="close" size={15} />
                مسح كل الفلاتر
              </button>
            )}
          </div>

          <Notice tone="demo" className="mb-4">
            <p>
              النتائج دي من مجموعة بطاقات نموذج، مش دليل مزوّدين حقيقي. مفيش تقييمات ولا تأكيد
              توفّر ولا مواعيد معروضة في المرحلة دي.
            </p>
          </Notice>

          {results.length === 0 ? (
            <EmptyState
              icon="search"
              title="مفيش نتائج بفلاتر دلوقتي"
              body={
                <>
                  جرّب تغيّر الكلمة، أو توسّع المدينة، أو ترفع سقف السعر. ولو عندك النشاط اللي بتدوّر
                  عليه، تقدر تسجّله عندنا.
                </>
              }
              action={
                <Button variant="primary" onClick={reset} type="button">
                  مسح الفلاتر
                </Button>
              }
              secondary={
                <Link
                  to="/provider"
                  className="inline-flex h-11 items-center gap-2 rounded-pill bg-white px-5 font-display text-sm font-bold text-ink-700 ring-1 ring-line hover:ring-brand-300"
                >
                  <Icon name="briefcase" size={17} />
                  سجّل نشاطك
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {results.map((listing) => (
                <ServiceCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
