import type { ReactNode } from 'react';
import { cn } from './cn';

interface ChipProps {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon?: ReactNode;
  children: ReactNode;
}

export function Chip({ active, disabled, onClick, icon, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-2 rounded-pill px-4 py-2 font-display text-sm font-bold',
        'ring-1 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        active
          ? 'bg-brand-600 text-white ring-brand-600'
          : 'bg-white text-ink-600 ring-line hover:ring-brand-300 hover:text-brand-700',
      )}
    >
      {icon}
      {children}
    </button>
  );
}
