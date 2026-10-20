import type { SearchFilters } from './types';

const base = '/search';

export function filtersToSearchParams(filters: SearchFilters): string {
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.categoryId) params.set('cat', filters.categoryId);
  if (filters.city) params.set('city', filters.city);
  if (filters.date) params.set('date', filters.date);
  if (filters.maxPrice !== '') params.set('max', String(filters.maxPrice));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function searchParamsToFilters(sp: URLSearchParams): SearchFilters {
  const rawMax = sp.get('max');
  const parsedMax = rawMax === null || rawMax === '' ? '' : Number(rawMax);
  return {
    query: sp.get('q') ?? '',
    categoryId: (sp.get('cat') ?? '') as SearchFilters['categoryId'],
    city: sp.get('city') ?? '',
    date: sp.get('date') ?? '',
    maxPrice: Number.isFinite(parsedMax) ? (parsedMax as number) : '',
  };
}
