import raw from '../../../../packages/tokens/tokens.json';

export const tokens = raw;

const stack = (family: string) =>
  `"${family}", ${raw.typography.fallback.map((f) => `"${f}"`).join(', ')}`;

export const fontText = stack(raw.typography.fontFamilyText);
export const fontDisplay = stack(raw.typography.fontFamilyDisplay);

export const c = raw.color;

/** EGP with Latin digits and Arabic unit, e.g. "1,200 ج.م". */
const egp = new Intl.NumberFormat('ar-EG-u-nu-latn', {
  style: 'currency',
  currency: 'EGP',
  maximumFractionDigits: 0,
});

export function formatEgp(value: number): string {
  return egp.format(value).replace('E£', raw.layout.currencyDisplay).replace('ج.م.د', raw.layout.currencyDisplay);
}

export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}
