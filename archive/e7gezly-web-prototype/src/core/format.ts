const arabicLatinDigits = new Intl.NumberFormat('ar-EG-u-nu-latn', { maximumFractionDigits: 0 });

const egp = new Intl.NumberFormat('ar-EG-u-nu-latn', {
  style: 'currency',
  currency: 'EGP',
  maximumFractionDigits: 0,
});

export function formatEGP(amount: number): string {
  return egp.format(amount).replace(/[‏‎]/g, '');
}

export function formatNumber(amount: number): string {
  return arabicLatinDigits.format(amount);
}

export function formatDateAr(iso: string): string {
  if (!iso) return '';
  const parsed = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return iso;
  return new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed);
}

export function todayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}
