import { Link } from 'react-router-dom';
import { cn } from './cn';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  tone?: 'dark' | 'light';
  withSubtitle?: boolean;
  to?: string;
}

const wordSize = { sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl sm:text-5xl' };

/** Original typographic wordmark — no third-party logo assets. */
export function Logo({ size = 'md', tone = 'dark', withSubtitle = true, to = '/' }: Props) {
  const mark = (
    <span className="flex items-center gap-2.5">
      <span
        className={cn(
          'grid place-items-center rounded-xl font-display font-extrabold',
          size === 'lg' ? 'size-11 text-2xl' : 'size-9 text-lg',
          tone === 'light' ? 'bg-white text-brand-700' : 'bg-brand-600 text-white',
        )}
        aria-hidden="true"
      >
        اح
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display font-extrabold tracking-tight',
            wordSize[size],
            tone === 'light' ? 'text-white' : 'text-ink-900',
          )}
        >
          احجزلي
        </span>
        {withSubtitle && (
          <span
            className={cn(
              'mt-1 font-sans text-[0.7rem] font-semibold tracking-[0.18em]',
              tone === 'light' ? 'text-white/70' : 'text-brand-600',
            )}
          >
            E7GEZLY
          </span>
        )}
      </span>
    </span>
  );

  if (to === '') return mark;
  return (
    <Link to={to} className="inline-flex rounded-lg" aria-label="احجزلي — الصفحة الرئيسية">
      {mark}
    </Link>
  );
}
