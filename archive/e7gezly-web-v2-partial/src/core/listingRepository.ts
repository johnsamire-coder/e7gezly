import type { CategoryId, Listing, SearchFilters } from './types';
import { demoListings } from '../data/demoListings';

/** Swappable seam: Phase 2 replaces this with an API/database-backed fetch. */
export function getAllListings(): Listing[] {
  return demoListings;
}

export function getListingById(id: string): Listing | undefined {
  return getAllListings().find((l) => l.id === id);
}

export function getListingsForCategory(id: CategoryId): Listing[] {
  return getAllListings().filter((l) => l.categoryId === id);
}

/** Strips diacritics and unifies alef/ya/ta-marbuta so Arabic queries match loosely. */
export function normalizeArabic(value: string): string {
  return value
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[ؤئ]/g, 'ي')
    .toLowerCase()
    .trim();
}

const PRICE_FLOOR_STEP = 50;

export function priceCeiling(listings: Listing[]): number {
  const max = listings.reduce((acc, l) => Math.max(acc, l.priceFrom), 0);
  return Math.ceil(max / PRICE_FLOOR_STEP) * PRICE_FLOOR_STEP;
}

function matchesQuery(listing: Listing, query: string): boolean {
  if (!query) return true;
  const haystack = normalizeArabic(
    [listing.name, listing.subCategory, listing.city, listing.district, listing.summary, ...listing.tags, ...listing.highlights].join(' '),
  );
  return normalizeArabic(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token));
}

export function searchListings(filters: SearchFilters, source: Listing[] = getAllListings()): Listing[] {
  return source
    .filter((l) => (filters.categoryId ? l.categoryId === filters.categoryId : true))
    .filter((l) => (filters.city ? l.city === filters.city : true))
    .filter((l) => (filters.maxPrice === '' ? true : l.priceFrom <= Number(filters.maxPrice)))
    .filter((l) => matchesQuery(l, filters.query))
    .sort((a, b) => a.priceFrom - b.priceFrom);
}

export function countActiveFilters(filters: SearchFilters): number {
  let count = 0;
  if (filters.query) count += 1;
  if (filters.categoryId) count += 1;
  if (filters.city) count += 1;
  if (filters.date) count += 1;
  if (filters.maxPrice !== '') count += 1;
  return count;
}
