import { Link } from 'react-router-dom';
import type { Category } from '../../core/types';
import { Icon } from '../ui/Icon';
import { getListingsForCategory } from '../../core/listingRepository';

interface Props {
  category: Category;
  to?: string;
}

export function CategoryCard({ category, to }: Props) {
  const count = getListingsForCategory(category.id).length;

  return (
    <Link
      to={to ?? `/search?cat=${category.id}`}
      className="group relative flex flex-col overflow-hidden rounded-card bg-white p-5 ring-1 ring-line shadow-card transition-[transform,box-shadow,ring-color] duration-200 hover:-translate-y-1 hover:shadow-lift hover:ring-brand-200"
    >
      <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
        <Icon name={category.icon} size={24} />
      </span>

      <h3 className="font-display text-lg font-extrabold text-ink-900">{category.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-500">{category.subtitle}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {category.examples.map((example) => (
          <li
            key={example}
            className="rounded-pill bg-canvas px-2.5 py-1 text-xs font-semibold text-ink-500"
          >
            {example}
          </li>
        ))}
      </ul>

      <span className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-bold text-brand-700">
        {count > 0 ? `${count} بطاقة تجريبية` : 'لسّه مفيش بطاقات'}
        <Icon name="arrowLeft" size={16} className="transition-transform group-hover:-translate-x-1" />
      </span>
    </Link>
  );
}
