import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-xl">
        <EmptyState
          icon="search"
          title="الصفحة دي مش موجودة"
          body="الرابط غلط أو الصفحة اتنقلّت. ارجع الرئيسية أو دور على خدمة."
          action={
            <Link to="/">
              <Button type="button">روح على الرئيسية</Button>
            </Link>
          }
          secondary={
            <Link
              to="/search"
              className="inline-flex h-11 items-center rounded-pill bg-white px-5 font-display text-sm font-bold text-ink-700 ring-1 ring-line hover:ring-brand-300"
            >
              استكشف الخدمات
            </Link>
          }
        />
      </div>
    </div>
  );
}
