import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-[0_6px_16px_-8px_rgb(12_110_92/0.7)]',
  accent: 'bg-accent-500 text-ink-900 hover:bg-accent-600 hover:text-white active:bg-accent-700',
  outline: 'bg-white text-ink-800 ring-1 ring-line hover:ring-brand-300 hover:text-brand-700',
  ghost: 'bg-transparent text-brand-700 hover:bg-brand-50',
  danger: 'bg-danger-600 text-white hover:brightness-95',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-13 px-7 text-base',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  iconEnd?: ReactNode;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', block, iconEnd, className, children, ...rest }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-pill font-semibold font-display',
        'transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px',
        'disabled:cursor-not-allowed disabled:opacity-55 disabled:active:translate-y-0',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className,
      )}
      {...rest}
    >
      {children}
      {iconEnd}
    </button>
  );
}
