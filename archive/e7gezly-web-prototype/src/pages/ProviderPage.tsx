import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import { Icon } from '../components/ui/Icon';
import { Notice } from '../components/ui/Notice';
import { Badge } from '../components/ui/Badge';
import { Section } from '../components/ui/Card';
import { categories } from '../data/categories';
import { egyptCities } from '../data/locations';

interface ProviderForm {
  businessName: string;
  categoryId: string;
  city: string;
  district: string;
  contactName: string;
  phone: string;
  email: string;
  services: string;
  priceNote: string;
  hours: string;
}

const initial: ProviderForm = {
  businessName: '',
  categoryId: '',
  city: '',
  district: '',
  contactName: '',
  phone: '',
  email: '',
  services: '',
  priceNote: '',
  hours: '',
};

const requiredFields: Array<keyof ProviderForm> = ['businessName', 'categoryId', 'city', 'contactName', 'phone'];

const benefits = [
  { icon: 'search', title: 'تظهر في نتائج البحث', body: 'بطاقة نشاطك بتبان لما الناس تدوّر على القسم بتاعك.' },
  { icon: 'calendar', title: 'تستقبل طلبات حجز', body: 'الطلبات بتيجيك ببيانات التواصل والتفاصيل اللي الزبون كتبها.' },
  { icon: 'wallet', title: 'تتحكم في أسعارك', body: 'تحط سعر استرشادي ومستوى سعر، وتعدّله في أي وقت.' },
  { icon: 'shield', title: 'توثق نشاطك', body: 'بيانات النشاط والرقم التجاري بتطمّن الزبون قبل ما يطلب.' },
];

export function ProviderPage() {
  const [form, setForm] = useState<ProviderForm>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof ProviderForm, string>>>({});
  const [attempted, setAttempted] = useState(false);

  function patch(key: keyof ProviderForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const found: Partial<Record<keyof ProviderForm, string>> = {};
    requiredFields.forEach((key) => {
      if (!form[key].trim()) found[key] = 'الحقل ده مطلوب.';
    });
    if (form.phone && form.phone.replace(/\D/g, '').length < 11)
      found.phone = 'اكتب رقم موبايل كامل (11 رقم).';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      found.email = 'صيغة الإيميل مش صحيحة.';
    setErrors(found);
    if (Object.keys(found).length === 0) setAttempted(true);
  }

  const category = categories.find((c) => c.id === form.categoryId);

  return (
    <>
      <section className="bg-gradient-to-b from-ink-900 to-brand-800 py-14 text-white sm:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <Badge tone="accent" size="md">
              <Icon name="briefcase" size={15} />
              تسجيل مزوّد خدمة
            </Badge>
            <h1 className="mt-4 text-3xl font-extrabold leading-snug text-white sm:text-4xl">
              سجّل نشاطك على احجزلي
            </h1>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-white/75">
              ملعب، صالون، عيادة، مطعم، أو شركة صيانة — سجّل بيانات النشاط وخدماتك علشان تظهر للناس
              اللي بتدوّر عليك في منطقتك.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-card bg-white/10 p-5 ring-1 ring-white/15">
                <Icon name={b.icon} size={22} className="text-accent-300" />
                <h2 className="mt-3 font-display text-[0.95rem] font-bold text-white">{b.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section
        eyebrow="الخطوة الأولى"
        title="عبّي بيانات نشاطك"
        description="كل ما البيانات كانت أدق، البطاقة بتاعتك بتبان أحسن في النتائج."
        className="bg-white border-y-line"
      >
        <Notice tone="warn" className="mb-6" title="التسجيل لسه مش بيتغذّى على سيرفر">
          <p>
            الفورم ده بيوضح البيانات المطلوبة فقط. الطلب ده دلوقتي مش بينشئ نشاط حقيقي في السوق
            ومش بيوصل لمراجعة أي حد.
          </p>
        </Notice>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <form onSubmit={submit} noValidate className="space-y-5">
            <Card className="p-6">
              <h2 className="mb-5 font-display text-base font-extrabold">النشاط</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="اسم النشاط" htmlFor="p-name" required error={errors.businessName}>
                  <Input
                    id="p-name"
                    value={form.businessName}
                    placeholder="مثال: ملعب النجم الخماسي"
                    onChange={(e) => patch('businessName', e.target.value)}
                  />
                </Field>
                <Field label="القسم" htmlFor="p-cat" required error={errors.categoryId}>
                  <Select
                    id="p-cat"
                    value={form.categoryId}
                    placeholder="اختار القسم"
                    options={categories.map((c) => ({ value: c.id, label: c.title }))}
                    onChange={(e) => patch('categoryId', e.target.value)}
                  />
                </Field>
                <Field label="المدينة" htmlFor="p-city" required error={errors.city}>
                  <Select
                    id="p-city"
                    value={form.city}
                    placeholder="اختار المدينة"
                    options={egyptCities.map((c) => ({ value: c, label: c }))}
                    onChange={(e) => patch('city', e.target.value)}
                  />
                </Field>
                <Field label="المنطقة / الحي" htmlFor="p-district" hint="اختياري بس بيفيد في نتائج القرب">
                  <Input
                    id="p-district"
                    value={form.district}
                    placeholder="مثال: مدينة نصر"
                    onChange={(e) => patch('district', e.target.value)}
                  />
                </Field>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-5 font-display text-base font-extrabold">الخدمات والأسعار</h2>
              <div className="space-y-4">
                <Field
                  label="الخدمات اللي بتقدمها"
                  htmlFor="p-services"
                  hint="سطر لكل خدمة. مثال: حجز ملعب خماسي — إضاءة ليلية — تأجير مضارب."
                >
                  <Textarea
                    id="p-services"
                    value={form.services}
                    placeholder={'حجز ملعب خماسي\nإضاءة ليلية\nتنظيم ودّيات'}
                    onChange={(e) => patch('services', e.target.value)}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="السعر الاسترشادي" htmlFor="p-price" hint="بالجنيه المصري، لكل ساعة أو جلسة.">
                    <Input
                      id="p-price"
                      value={form.priceNote}
                      placeholder="مثال: 400 ج.م للساعة"
                      onChange={(e) => patch('priceNote', e.target.value)}
                    />
                  </Field>
                  <Field label="مواعيد العمل" htmlFor="p-hours" hint="اختياري">
                    <Input
                      id="p-hours"
                      value={form.hours}
                      placeholder="مثال: 10 ص – 2 ص يوميًا"
                      onChange={(e) => patch('hours', e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-5 font-display text-base font-extrabold">بيانات التواصل</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="اسم المسؤول" htmlFor="p-contact" required error={errors.contactName}>
                  <Input
                    id="p-contact"
                    value={form.contactName}
                    placeholder="اسم شخص للتواصل"
                    onChange={(e) => patch('contactName', e.target.value)}
                  />
                </Field>
                <Field label="رقم الموبايل" htmlFor="p-phone" required error={errors.phone}>
                  <Input
                    id="p-phone"
                    type="tel"
                    inputMode="numeric"
                    dir="ltr"
                    className="text-start"
                    value={form.phone}
                    placeholder="01012345678"
                    onChange={(e) => patch('phone', e.target.value)}
                  />
                </Field>
                <Field label="البريد الإلكتروني" htmlFor="p-email" error={errors.email} hint="اختياري">
                  <Input
                    id="p-email"
                    type="email"
                    dir="ltr"
                    className="text-start"
                    value={form.email}
                    placeholder="owner@business.com"
                    onChange={(e) => patch('email', e.target.value)}
                  />
                </Field>
              </div>

              <Button type="submit" size="lg" className="mt-6" block>
                حفظ طلب التسجيل (تجريبي)
                <Icon name="arrowLeft" size={18} />
              </Button>
              <p className="mt-2.5 text-center text-xs text-ink-400">
                مفيش نشاط بيتفعّل ولا بيدخل مراجعة دلوقتي — الزر ده للعرض فقط.
              </p>
            </Card>

            {attempted && (
              <Notice tone="demo" title="وصلنا بياناتك في الواجهة بس">
                <p className="mt-1">
                  طلب التسجيل اتعبّى صح، بس مش مبعوت لأي حد. مراجعة الطلبات ونشر البطاقة بييجي مع
                  مرحلة لوحة تحكم المزوّدين.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForm(initial);
                      setAttempted(false);
                    }}
                    className="rounded-pill bg-white px-4 py-2 font-display text-sm font-bold text-ink-700 ring-1 ring-line hover:ring-brand-300"
                  >
                    املا الفورم من الأول
                  </button>
                </div>
              </Notice>
            )}
          </form>

          <aside className="lg:sticky lg:top-24">
            <Card className="p-6">
              <h2 className="mb-4 font-display text-base font-extrabold">معاينة البطاقة</h2>
              <div className="rounded-xl bg-canvas p-4 ring-1 ring-line">
                <p className="text-xs font-semibold text-brand-700">
                  {category?.title ?? 'لسّه مختارش قسم'}
                </p>
                <p className="mt-1 font-display text-lg font-extrabold text-ink-900">
                  {form.businessName || 'اسم النشاط هيظهر هنا'}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                  <Icon name="pin" size={15} className="text-ink-400" />
                  {form.city ? `${form.city}${form.district ? ` — ${form.district}` : ''}` : 'المدينة هتبان هنا'}
                </p>
                {form.priceNote && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
                    <Icon name="wallet" size={15} className="text-ink-400" />
                    {form.priceNote}
                  </p>
                )}
                {form.services && (
                  <ul className="mt-3 space-y-1.5">
                    {form.services
                      .split('\n')
                      .filter(Boolean)
                      .slice(0, 4)
                      .map((line) => (
                        <li key={line} className="flex items-center gap-2 text-xs text-ink-600">
                          <Icon name="check" size={13} className="text-brand-600" />
                          {line}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-400">
                كده شكل البطاقة بتاعتك هيبان في البحث بعد ما النشاط يتفعّل ويتوثق.
              </p>
              <Link
                to="/search"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:underline"
              >
                شوف البطاقات الحالية
                <Icon name="arrowLeft" size={16} />
              </Link>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
