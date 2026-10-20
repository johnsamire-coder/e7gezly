export type CategoryId =
  | 'restaurants-cafes'
  | 'sports-venues'
  | 'beauty'
  | 'healthcare'
  | 'home-services'
  | 'events'
  | 'travel'
  | 'other';

export interface Category {
  id: CategoryId;
  title: string;
  subtitle: string;
  examples: string[];
  icon: string;
}

export type ListingSource = 'demo' | 'live';

export type PriceBand = 1 | 2 | 3 | 4;

export interface Listing {
  id: string;
  name: string;
  categoryId: CategoryId;
  subCategory: string;
  city: string;
  district: string;
  summary: string;
  highlights: string[];
  priceFrom: number;
  priceBand: PriceBand;
  tags: string[];
  source: ListingSource;
}

export interface SearchFilters {
  query: string;
  categoryId: CategoryId | '';
  city: string;
  date: string;
  maxPrice: number | '';
}

export interface BookingDraft {
  listingId: string;
  listingName: string;
  serviceTitle: string;
  date: string;
  time: string;
  guests: string;
  fullName: string;
  phone: string;
  notes: string;
}

export const emptyFilters: SearchFilters = {
  query: '',
  categoryId: '',
  city: '',
  date: '',
  maxPrice: '',
};
