import type { ReactNode } from 'react';
import { cn } from './cn';

type Tone = 'brand' | 'neutral' | 'accent' | 'demo' | 'warn' | 'outline';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-800 ring-brand-100',
  neutral: 'bg-canvas text-ink-500 ring-line',
  accent: 'bg-accent-100 text-accent-700 ring-accent-300',
  demo: 'bg-warn-100 text-warn-700 ring-warn-700/20',
  warn: 'bg-danger-100 text-danger-600 ring-danger-600/20',
  outline: 'bg-white text-ink-600 ring-line',
};

interface Props {
  tone?: Tone;
  size?: 'sm' | 'md';
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', size = 'sm', icon, className, children }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill font-semibold ring-1 whitespace-nowrap',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-[0.8rem]',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
