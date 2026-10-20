import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAllListings, getListingsForCategory, getListingById } from '../core/listingRepository';
import { categories, categoryMap } from '../data/categories';
import { todayIso, formatDateAr, formatEGP } from '../core/format';
import type { BookingDraft } from '../core/types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import { Icon } from '../components/ui/Icon';
import { EmptyState } from '../components/ui/EmptyState';
import { Notice } from '../components/ui/Notice';

const emptyDraft: BookingDraft = {
  listingId: '',
  listingName: '',
  serviceTitle: '',
  date: '',
  time: '',
  guests: '',
  fullName: '',
  phone: '',
  notes: '',
};

function validate(draft: BookingDraft): Partial<Record<keyof BookingDraft, string>> {
  const errors: Partial<Record<keyof BookingDraft, string>> = {};
  if (!draft.listingId) errors.listingId = 'اختار الخدمة اللي عايز تحجزها.';
  if (!draft.fullName.trim()) errors.fullName = 'اكتب اسمك علشان المزوّد يعرف مين بيتواصل معاه.';
  const digits = draft.phone.replace(/\D/g, '');
  if (!digits) errors.phone = 'اكتب رقم موبايل للتواصل.';
  else if (digits.length < 10) errors.phone = 'الرقم ناقص — تأكد منه.';
  return errors;
}

export function BookingPage() {
  const { id } = useParams();
  const routeListing = id ? getListingById(id) : undefined;

  const [draft, setDraft] = useState<BookingDraft>(() => ({
    ...emptyDraft,
    listingId: routeListing?.id ?? '',
    listingName: routeListing?.name ?? '',
    serviceTitle: routeListing?.subCategory ?? '',
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof BookingDraft, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [pickerCategory, setPickerCategory] = useState('');

  if (id && !routeListing) {
    return (
      <div className="container-page py-14">
        <EmptyState
          icon="calendar"
          title="مفيش خدمة بهذا الرابط"
          body="اختار خدمة من نتائج البحث وارجع تاني تطلب حجز."
          action={
            <Link to="/search">
              <Button type="button">روح على البحث</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const listing = routeListing ?? (draft.listingId ? getListingById(draft.listingId) : undefined);
  const category = listing ? categoryMap.get(listing.categoryId) : undefined;

  function patch(next: Partial<BookingDraft>) {
    setDraft((prev) => ({ ...prev, ...next }));
    setErrors((prev) => {
      const copy = { ...prev };
      (Object.keys(next) as Array<keyof BookingDraft>).forEach((k) => delete copy[k]);
      return copy;
    });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const found = validate(draft);
    setErrors(found);
    if (Object.keys(found).length === 0) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="container-page max-w-2xl py-10 sm:py-14">
        <Card className="p-7 sm:p-9">
          <span className="mb-5 grid size-14 place-items-center rounded-pill bg-brand-50 text-brand-600">
            <Icon name="check" size={26} />
          </span>

          <h1 className="text-2xl font-extrabold">استلمنا بيانات طلبك (تجريبي)</h1>
          <p className="mt-3 leading-relaxed text-ink-500">
            الفورم ده اتعبّى صح، بس <strong className="text-ink-800">مفيش حجز اتأكد</strong> —
            لأنه لسه مفيش سيرفر بيتخزن الطلبات ولا مزوّدين حقيقيين على المنصة.
          </p>

          <Notice tone="warn" className="mt-5">
            <p>
              ما تستناش مكالمه ولا رسالة. اللي بيحصل دلوقتي إن بياناتك بتفضل في ذاكرة الصفحة لحد ما
              تقفلها، ومبتتخزنش في أي مكان.
            </p>
          </Notice>

          <dl className="mt-6 divide-y divide-line rounded-xl ring-1 ring-line">
            {[
              { k: 'الخدمة', v: draft.listingName || '—' },
              { k: 'القسم', v: category?.title ?? '—' },
              { k: 'التاريخ المطلوب', v: draft.date ? formatDateAr(draft.date) : 'غير محدد' },
              { k: 'الوقت المفضل', v: draft.time || 'غير محدد' },
              { k: 'عدد الأفراد', v: draft.guests || 'غير محدد' },
              { k: 'الاسم', v: draft.fullName },
              { k: 'الموبايل', v: draft.phone },
            ].map((row) => (
              <div key={row.k} className="flex items-start gap-4 px-4 py-3 text-sm">
                <dt className="w-36 shrink-0 font-display font-bold text-ink-500">{row.k}</dt>
                <dd className="flex-1 text-ink-800">{row.v}</dd>
              </div>
            ))}
            {draft.notes && (
              <div className="flex items-start gap-4 px-4 py-3 text-sm">
                <dt className="w-36 shrink-0 font-display font-bold text-ink-500">ملاحظات</dt>
                <dd className="flex-1 whitespace-pre-line text-ink-800">{draft.notes}</dd>
              </div>
            )}
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={listing ? `/service/${listing.id}` : '/search'}>
              <Button variant="outline" type="button">
                رجوع للتفاصيل
              </Button>
            </Link>
            <Link to="/search">
              <Button type="button">
                كمّل بحث
                <Icon name="arrowLeft" size={17} />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-extrabold sm:text-3xl">طلب حجز خدمة</h1>
        <p className="mt-2 max-w-2xl leading-relaxed text-ink-500">
          عبّي البيانات اللي عندك وابعت الطلب. المزوّد هيتواصل معاك ويأكد الموعد — بعد ما المرحلة دي
          تتوصل بسيرفر حقيقي.
        </p>

        <div className="mt-6">
          <Notice tone="demo" title="الفورم ده تجريبي">
            <p>
              مفيش حفظ في قاعدة بيانات، مفيش إشعار للمزوّد، ومفيش دفع. الزر بيختبر واجهة الطلب بس.
            </p>
          </Notice>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <form onSubmit={submit} noValidate className="space-y-5">
            <Card className="p-6">
              <h2 className="mb-5 font-display text-base font-extrabold">الخدمة المطلوبة</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="القسم"
                  htmlFor="b-cat"
                  hint={listing ? undefined : 'اختار القسم الأول علشان قائمة البطاقات تتضيّق.'}
                >
                  <Select
                    id="b-cat"
                    value={routeListing ? routeListing.categoryId : pickerCategory}
                    placeholder="كل الأقسام"
                    options={categories.map((c) => ({ value: c.id, label: c.title }))}
                    onChange={(e) => {
                      setPickerCategory(e.target.value);
                      patch({ listingId: '', listingName: '', serviceTitle: '' });
                    }}
                    disabled={Boolean(routeListing)}
                  />
                </Field>

                <Field label="الخدمة / المكان" htmlFor="b-listing" required error={errors.listingId}>
                  {routeListing ? (
                    <Input id="b-listing" value={routeListing.name} readOnly />
                  ) : (
                    <Select
                      id="b-listing"
                      value={draft.listingId}
                      placeholder="اختار بطاقة خدمة"
                      options={listingOptions(pickerCategory).map((l) => ({
                        value: l.id,
                        label: `${l.name} — ${l.city}`,
                      }))}
                      onChange={(e) => {
                        const picked = getListingById(e.target.value);
                        patch({
                          listingId: e.target.value,
                          listingName: picked?.name ?? '',
                          serviceTitle: picked?.subCategory ?? '',
                        });
                      }}
                    />
                  )}
                </Field>
              </div>

              {listing && (
                <p className="mt-3 flex items-center gap-2 text-sm text-ink-500">
                  <Icon name="pin" size={15} className="text-ink-400" />
                  {listing.city} — {listing.district}
                  <span className="text-ink-400">·</span>
                  <span>يبدأ من {formatEGP(listing.priceFrom)}</span>
                  <Badge tone="demo">تجريبي</Badge>
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="mb-1 font-display text-base font-extrabold">الموعد المفضل</h2>
              <p className="mb-5 text-xs leading-relaxed text-warn-700">
                دي رغبات منك مش تأكيد. مفيش تقويم مواعيد متصل بالمزوّد لسه.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="التاريخ" htmlFor="b-date">
                  <Input
                    id="b-date"
                    type="date"
                    min={todayIso()}
                    value={draft.date}
                    onChange={(e) => patch({ date: e.target.value })}
                  />
                </Field>
                <Field label="الوقت" htmlFor="b-time">
                  <Input
                    id="b-time"
                    type="time"
                    value={draft.time}
                    onChange={(e) => patch({ time: e.target.value })}
                  />
                </Field>
                <Field label="عدد الأفراد" htmlFor="b-guests">
                  <Input
                    id="b-guests"
                    type="number"
                    min={1}
                    max={500}
                    placeholder="مثال: 4"
                    value={draft.guests}
                    onChange={(e) => patch({ guests: e.target.value })}
                  />
                </Field>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-5 font-display text-base font-extrabold">بيانات التواصل</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="الاسم" htmlFor="b-name" required error={errors.fullName}>
                  <Input
                    id="b-name"
                    value={draft.fullName}
                    placeholder="اسمك كامل"
                    autoComplete="name"
                    onChange={(e) => patch({ fullName: e.target.value })}
                  />
                </Field>
                <Field
                  label="رقم الموبايل"
                  htmlFor="b-phone"
                  required
                  error={errors.phone}
                  hint="مثال: 01xxxxxxxxx"
                >
                  <Input
                    id="b-phone"
                    type="tel"
                    inputMode="numeric"
                    dir="ltr"
                    className="text-start"
                    value={draft.phone}
                    placeholder="01012345678"
                    autoComplete="tel"
                    onChange={(e) => patch({ phone: e.target.value })}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field
                  label="تفاصيل إضافية"
                  htmlFor="b-notes"
                  hint="اكتب أي حاجة تساعد المزوّد: المناسبة، العنوان التقريبي، أو ملاحظة خاصة."
                >
                  <Textarea
                    id="b-notes"
                    value={draft.notes}
                    placeholder="مثال: عايزين طاولة لـ 6 أشخاص قعدة هادية، واحتمال نحتاج كرسى أطفال."
                    onChange={(e) => patch({ notes: e.target.value })}
                  />
                </Field>
              </div>

              <Button type="submit" size="lg" className="mt-6" block>
                ارسال طلب الحجز (تجريبي)
                <Icon name="arrowLeft" size={18} />
              </Button>
              <p className="mt-2.5 text-center text-xs leading-relaxed text-ink-400">
                بالضغط على الزر إنت مش بتأكد حجز ولا بتوافق على أي سعر.
              </p>
            </Card>
          </form>

          <aside className="lg:sticky lg:top-24">
            <Card className="p-6">
              <h2 className="mb-4 font-display text-base font-extrabold">ملخص الطلب</h2>
              <ul className="space-y-3 text-sm">
                <SummaryRow label="الخدمة" value={draft.listingName || 'لسّه مختارش'} />
                <SummaryRow label="القسم" value={category?.title || '—'} />
                <SummaryRow label="التاريخ" value={draft.date ? formatDateAr(draft.date) : '—'} />
                <SummaryRow label="الوقت" value={draft.time || '—'} />
                <SummaryRow label="عدد الأفراد" value={draft.guests || '—'} />
              </ul>

              <div className="mt-5 border-t border-line pt-4">
                <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-500">
                  <Icon name="lock" size={15} className="mt-0.5 shrink-0 text-ink-400" />
                  البيانات دي بتعيش في المتصفح بتاعك في الجلسة دي بس. مفيش تخزين ولا إرسال لحد
                  دلوقتي.
                </p>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

function listingOptions(categoryId: string) {
  return categoryId ? getListingsForCategory(categoryId as never) : getAllListings();
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start justify-between gap-3">
      <span className="font-display font-bold text-ink-500">{label}</span>
      <span className="text-end text-ink-800">{value}</span>
    </li>
  );
}
