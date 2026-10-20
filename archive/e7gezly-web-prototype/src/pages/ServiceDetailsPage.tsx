import { Link, useParams } from 'react-router-dom';
import { getListingById } from '../core/listingRepository';
import { categoryMap } from '../data/categories';
import { priceBands } from '../data/locations';
import { formatEGP } from '../core/format';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { EmptyState, ComingSoon } from '../components/ui/EmptyState';
import { Notice } from '../components/ui/Notice';

export function ServiceDetailsPage() {
  const { id } = useParams();
  const listing = id ? getListingById(id) : undefined;

  if (!listing) {
    return (
      <div className="container-page py-14">
        <EmptyState
          icon="search"
          title="البطاقة دي مش موجودة"
          body="الرابط غلط أو البطاقة اتشالت. ارجع للبحث واختار بطاقة تانية."
          action={
            <Link to="/search">
              <Button type="button">روح على البحث</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const category = categoryMap.get(listing.categoryId);

  return (
    <div className="container-page py-8 sm:py-10">
      <nav aria-label="مسار التنقل" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-ink-400">
        <Link to="/" className="font-semibold hover:text-brand-700">
          الرئيسية
        </Link>
        <Icon name="arrowLeft" size={14} />
        <Link to={`/search?cat=${listing.categoryId}`} className="font-semibold hover:text-brand-700">
          {category?.title}
        </Link>
        <Icon name="arrowLeft" size={14} />
        <span className="font-semibold text-ink-600">{listing.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="relative flex h-48 items-center justify-center bg-gradient-to-bl from-brand-50 via-white to-sand">
              <Icon name={category?.icon ?? 'sparkle'} size={72} className="text-brand-300" />
              <span className="absolute top-4 start-4">
                <Badge tone="demo" size="md">
                  بطاقة تجريبية — مش مكان حقيقي
                </Badge>
              </span>
            </div>

            <div className="p-6">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-400">
                <span className="text-brand-700">{category?.title}</span>
                <span>·</span>
                <span>{listing.subCategory}</span>
              </div>

              <h1 className="text-2xl font-extrabold sm:text-3xl">{listing.name}</h1>

              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
                <span className="flex items-center gap-1.5">
                  <Icon name="pin" size={16} className="text-ink-400" />
                  {listing.city} — {listing.district}
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="wallet" size={16} className="text-ink-400" />
                  مستوى السعر: {priceBands[listing.priceBand]}
                </span>
              </p>

              <p className="mt-4 leading-relaxed text-ink-600">{listing.summary}</p>

              <div className="mt-6">
                <h2 className="mb-3 font-display text-sm font-bold text-ink-900">مميزات الخدمة</h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {listing.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 rounded-xl bg-canvas px-3.5 py-2.5 text-sm text-ink-600"
                    >
                      <Icon name="check" size={16} className="text-brand-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {listing.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-pill bg-white px-3 py-1 text-xs font-semibold text-ink-500 ring-1 ring-line"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          <Notice tone="demo" title="إيه اللي ناقص في البطاقة دي؟">
            <div className="mt-3 flex flex-wrap gap-2">
              <ComingSoon label="تقييمات ومراجعات" />
              <ComingSoon label="صور حقيقية" />
              <ComingSoon label="مواعيد متاحة" />
              <ComingSoon label="خريطة الموقع" />
            </div>
          </Notice>

          <Card className="p-6">
            <h2 className="font-display text-lg font-extrabold">عن المزوّد</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              بيانات المزوّد الحقيقي (اسم النشاط، الرقم التجاري، وساعات العمل) هتظهر هنا بعد ما
              التسجيل بيتفعّل في مرحلة لاحقة. حاليًا القسم ده فاضي على قصد.
            </p>
            <div className="mt-4">
              <ComingSoon label="ملف المزوّد والتوثيق" />
            </div>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-24">
          <Card className="p-6">
            <p className="text-xs font-semibold text-ink-400">السعر يبدأ من</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-ink-900">
              {formatEGP(listing.priceFrom)}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-warn-700">
              سعر استرشادي تجريبي — مش تأكيد سعر ولا تأكيد توفّر.
            </p>

            <div className="my-5 h-px bg-line" />

            <div className="space-y-2.5 text-sm">
              <p className="flex items-center gap-2 text-ink-500">
                <Icon name="calendar" size={16} className="text-ink-400" />
                المواعيد: بتتفق بعد الطلب
              </p>
              <p className="flex items-center gap-2 text-ink-500">
                <Icon name="wallet" size={16} className="text-ink-400" />
                الدفع: مع المزوّد مباشرة
              </p>
              <p className="flex items-start gap-2 text-ink-500">
                <Icon name="shield" size={16} className="mt-0.5 text-ink-400" />
                احجزلي وسيط تنسيق، مش طرف في الدفع
              </p>
            </div>

            <Link to={`/booking/${listing.id}`} className="mt-6 block">
              <Button block type="button">
                اطلب حجز
                <Icon name="arrowLeft" size={17} />
              </Button>
            </Link>

            <p className="mt-2.5 text-center text-xs leading-relaxed text-ink-400">
              الطلب بيتسجّل للمراجعة بس — مش تأكيد حجز.
            </p>

            <div className="mt-5 border-t border-line pt-4">
              <Link
                to={`/search?cat=${listing.categoryId}&city=${encodeURIComponent(listing.city)}`}
                className="flex items-center justify-between gap-2 text-sm font-bold text-brand-700 hover:underline"
              >
                شوف قريبين منك في {listing.city}
                <Icon name="arrowLeft" size={16} />
              </Link>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
