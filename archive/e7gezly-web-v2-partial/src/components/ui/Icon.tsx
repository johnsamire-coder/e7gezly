import type { ReactNode } from 'react';
import { cn } from './cn';

const paths: Record<string, ReactNode> = {
  search: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10-2-4.5-4.5" />,
  pin: (
    <>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="3" />
      <path d="M3 10h18M16 14h2" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  arrowLeft: <path d="M19 12H5m0 0 6-6m-6 6 6 6" />,
  check: <path d="M4 12.5 9.5 18 20 6.5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  shield: <path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3Z" />,
  phone: (
    <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v3a3 3 0 0 1-3.3 3A15 15 0 0 1 3.9 7.3 3 3 0 0 1 6 4Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3.5 2" />
    </>
  ),
  sparkle: <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />,
  dashboard: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="13" y="10" width="8" height="11" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="3" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12h18" />
    </>
  ),
  restaurant: (
    <>
      <path d="M6 3v8a3 3 0 0 0 6 0V3M9 11v10" />
      <path d="M17 3c-1.5 1.5-2 3-2 5s.6 3 2 3.5V21" />
    </>
  ),
  sports: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3c-3 3.5-3 14 0 18M3.5 9.5c3.5 1.5 13.5 1.5 17 0" />
    </>
  ),
  beauty: (
    <>
      <path d="M9 3v7a3 3 0 0 1-3 3h3M15 3v7a3 3 0 0 0 3 3h-3" />
      <path d="M9 13v8M15 13v8" />
    </>
  ),
  health: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="3" />
      <path d="M12 10v6M9 13h6" />
    </>
  ),
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 10v10h12V10" />
    </>
  ),
  events: (
    <>
      <path d="M12 3v4M5 7h14l-1.5 12h-11L5 7Z" />
      <path d="M9 11v4M15 11v4" />
    </>
  ),
  travel: (
    <>
      <path d="M3 19l9-4 9 4-9-16Z" />
      <path d="M12 15v4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="3" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
};

interface Props {
  name: keyof typeof paths | string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className, strokeWidth = 1.7 }: Props) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
    >
      {paths[name] ?? paths.sparkle}
    </svg>
  );
}
