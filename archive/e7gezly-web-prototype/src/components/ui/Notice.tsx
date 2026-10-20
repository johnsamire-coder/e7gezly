import type { ReactNode } from 'react';
import { cn } from './cn';
import { Icon } from './Icon';

type Tone = 'info' | 'demo' | 'warn';

const toneStyles: Record<Tone, string> = {
  info: 'bg-brand-50 text-brand-800 ring-brand-100',
  demo: 'bg-sand text-warn-700 ring-accent-300/50',
  warn: 'bg-danger-100 text-danger-600 ring-danger-600/20',
};

const toneIcon: Record<Tone, string> = { info: 'info', demo: 'info', warn: 'shield' };

interface Props {
  tone?: Tone;
  title?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Notice({ tone = 'info', title, action, className, children }: Props) {
  return (
    <div
      role="note"
      className={cn('flex items-start gap-3 rounded-card px-4 py-3.5 ring-1', toneStyles[tone], className)}
    >
      <Icon name={toneIcon[tone]} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        {title && <p className="font-display text-sm font-bold">{title}</p>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
      {action}
    </div>
  );
}
