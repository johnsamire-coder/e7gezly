import type { ReactNode } from 'react';
import { Icon } from './Icon';

interface Props {
  icon?: string;
  title: string;
  body: ReactNode;
  action?: ReactNode;
  secondary?: ReactNode;
}

export function EmptyState({ icon = 'search', title, body, action, secondary }: Props) {
  return (
    <div className="flex flex-col items-center rounded-card bg-white px-6 py-14 text-center ring-1 ring-line">
      <span className="mb-5 grid size-14 place-items-center rounded-pill bg-brand-50 text-brand-600">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500">{body}</p>
      {(action || secondary) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondary}
        </div>
      )}
    </div>
  );
}

export function ComingSoon({ label = 'المرحلة الجاية' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-pill bg-canvas px-4 py-2.5 text-sm font-semibold text-ink-400 ring-1 ring-line">
      <Icon name="lock" size={16} />
      {label} — مش مفعّل لسه
    </span>
  );
}
