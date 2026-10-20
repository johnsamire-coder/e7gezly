import { Link } from 'react-router-dom';
import type { Listing } from '../../core/types';
import { categoryMap } from '../../data/categories';
import { priceBands } from '../../data/locations';
import { formatEGP } from '../../core/format';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';
import { cn } from '../ui/cn';

interface Props {
  listing: Listing;
  variant?: 'grid' | 'row';
}

export function ServiceCard({ listing, variant = 'grid' }: Props) {
  const category = categoryMap.get(listing.categoryId);

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-card bg-white ring-1 ring-line shadow-card',
        'transition-[transform,box-shadow,ring-color] duration-200 hover:-translate-y-1 hover:shadow-lift hover:ring-brand-200',
        variant === 'row' && 'sm:flex-row sm:items-stretch',
      )}
    >
      <div
        className={cn(
          'relative flex items-center justify-center bg-gradient-to-bl from-brand-50 to-sand',
          variant === 'row' ? 'sm:w-44 sm:shrink-0' : '',
          'h-28',
        )}
        aria-hidden="true"
      >
        <Icon name={category?.icon ?? 'sparkle'} size={38} className="text-brand-400" />
        <span className="absolute top-2 start-2">
          <Badge tone="demo">بيانات تجريبية</Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-ink-400">
          <span className="text-brand-700">{category?.title}</span>
          <span>·</span>
          <span>{listing.subCategory}</span>
        </div>

        <h3 className="font-display text-lg font-extrabold leading-snug text-ink-900">{listing.name}</h3>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
          <Icon name="pin" size={15} className="text-ink-400" />
          {listing.city} — {listing.district}
        </p>

        <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{listing.summary}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {listing.highlights.slice(0, 3).map((item) => (
            <li key={item} className="rounded-pill bg-canvas px-2.5 py-1 text-xs font-semibold text-ink-500">
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-ink-400">السعر يبدأ من (تجريبي)</p>
              <p className="font-display text-xl font-extrabold text-ink-900">{formatEGP(listing.priceFrom)}</p>
              <p className="text-xs text-ink-400">
                مستوى السعر: {priceBands[listing.priceBand]} · بدون تأكيد توفّر
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                to={`/service/${listing.id}`}
                className="inline-flex h-10 items-center rounded-pill bg-white px-4 font-display text-sm font-bold text-ink-700 ring-1 ring-line hover:ring-brand-300 hover:text-brand-700"
              >
                التفاصيل
              </Link>
              <Link
                to={`/booking/${listing.id}`}
                className="inline-flex h-10 items-center rounded-pill bg-brand-600 px-4 font-display text-sm font-bold text-white hover:bg-brand-700"
              >
                اطلب حجز
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
