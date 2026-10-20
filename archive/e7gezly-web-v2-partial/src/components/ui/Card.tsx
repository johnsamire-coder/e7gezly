import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div className={cn('rounded-card bg-white ring-1 ring-line shadow-card', className)} {...rest}>
      {children}
    </div>
  );
}

interface SectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ eyebrow, title, description, action, children, className }: SectionProps) {
  return (
    <section className={cn('py-10 sm:py-14', className)}>
      <div className="container-page">
        {(eyebrow || title || description || action) && (
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-xl">
              {eyebrow && (
                <p className="mb-1 font-display text-xs font-bold tracking-wide text-brand-600">{eyebrow}</p>
              )}
              {title && <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>}
              {description && <p className="mt-2 text-ink-500">{description}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
