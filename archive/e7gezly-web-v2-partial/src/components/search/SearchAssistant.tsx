import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { cn } from '../ui/cn';
import { filtersToSearchParams } from '../../core/searchParams';
import { emptyFilters } from '../../core/types';
import { features } from '../../core/config';

const quickHints = ['ملعب كورة الليلة', 'صالون حريمي في المعادي', 'سبّاك في مدينة نصر', 'بوفيه فرح'];

interface Props {
  size?: 'hero' | 'compact';
  initialQuery?: string;
  categoryId?: string;
}

export function SearchAssistant({ size = 'hero', initialQuery = '', categoryId = '' }: Props) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initialQuery);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    navigate(
      filtersToSearchParams({ ...emptyFilters, query: value.trim(), categoryId: categoryId as never }),
    );
  }

  const hero = size === 'hero';

  return (
    <form onSubmit={submit} className="w-full">
      <label
        htmlFor="assistant-input"
        className={cn(
          'mb-2 block font-display font-bold text-ink-700',
          hero ? 'text-[0.95rem]' : 'sr-only',
        )}
      >
        {hero ? 'قولي محتاج تحجز إيه' : 'ابحث في احجزلي'}
      </label>

      <div
        className={cn(
          'flex items-center gap-2 rounded-pill bg-white p-1.5 ring-1 transition-shadow',
          hero ? 'shadow-lift ring-line focus-within:ring-2 focus-within:ring-brand-400' : 'ring-line',
        )}
      >
        <span className="ps-3 text-brand-600">
          <Icon name="search" size={hero ? 22 : 19} />
        </span>
        <input
          id="assistant-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="عايز تحجز إيه؟"
          autoComplete="off"
          className={cn(
            'min-w-0 flex-1 bg-transparent text-ink-800 placeholder:text-ink-400/80 focus:outline-none',
            hero ? 'py-3 text-base' : 'py-2 text-[0.92rem]',
          )}
        />
        <button
          type="submit"
          className={cn(
            'inline-flex shrink-0 items-center gap-2 rounded-pill bg-brand-600 font-display font-bold text-white hover:bg-brand-700',
            hero ? 'h-12 px-5 text-[0.95rem]' : 'h-9 px-4 text-sm',
          )}
        >
          <Icon name="arrowLeft" size={17} />
          بحث
        </button>
      </div>

      {hero && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-400">أمثلة:</span>
          {quickHints.map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => {
                setValue(hint);
                navigate(filtersToSearchParams({ ...emptyFilters, query: hint }));
              }}
              className="rounded-pill bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink-600 ring-1 ring-line hover:bg-white hover:text-brand-700"
            >
              {hint}
            </button>
          ))}
        </div>
      )}

      {!features.aiAssistant && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-400">
          <Icon name="info" size={14} />
          دي خانة بحث نصّي عادي. مساعد الحجز الذكي هيتفعّل في مرحلة لاحقًا.
        </p>
      )}
    </form>
  );
}
