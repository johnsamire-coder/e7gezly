import { Link } from 'react-router-dom';
import { DemoModeBanner } from '../components/DemoModeBanner';
import { SearchAssistant } from '../components/search/SearchAssistant';
import { CategoryCard } from '../components/categories/CategoryCard';
import { ServiceCard } from '../components/services/ServiceCard';
import { Logo } from '../components/ui/Logo';
import { Section, Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { Badge } from '../components/ui/Badge';
import { Notice } from '../components/ui/Notice';
import { categories } from '../data/categories';
import { demoListings } from '../data/demoListings';
import { features, PLACEHOLDER_LISTINGS } from '../core/config';

const steps = [
  {
    icon: 'search',
    title: 'ابحث عن اللي محتاجه',
    body: 'اكتب بالعامية: ملعب الليلة، صالون في المعادي، أو سبّاك ييجي البيت.',
  },
  {
    icon: 'filter',
    title: 'قارن بسرعة',
    body: 'شوف القسم والموقع والسعر التقريبي في بطاقة واحدة، وافتح التفاصيل.',
  },
  {
    icon: 'calendar',
    title: 'ابعت طلب حجز',
    body: 'املّ البيانات والتفاصيل اللي عندك، والطلب بيتسجّل للمراجعة.',
  },
];

const promises = [
  { icon: 'shield', label: 'وضوح كامل', body: 'كل بطاقة متعلّمة لو بياناتها تجريبية.' },
  { icon: 'wallet', label: 'من غير مدفوعات', body: 'الدفع بيتم مع المزوّد نفسه، احجزلي وسيط.' },
  { icon: 'phone', label: 'مصري الأول', body: 'عامية في الواجهة ومدن مصر في الفلاتر.' },
];

export function HomePage() {
  const featured = demoListings.slice(0, 6);

  return (
    <>
      <DemoModeBanner />

      <section className="relative overflow-hidden bg-gradient-to-b from-sand via-white to-canvas">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -start-24 size-80 rounded-pill bg-brand-100/50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -end-16 size-96 rounded-pill bg-accent-100/60 blur-3xl"
        />

        <div className="container-page relative py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-6 lg:hidden">
                <Logo size="md" />
              </div>

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge tone="brand" size="md">
                  <Icon name="sparkle" size={15} />
                  سوق الحجز المصري
                </Badge>
                <Badge tone="outline" size="md">
                  {categories.length} أقسام
                </Badge>
              </div>

              <h1 className="max-w-xl text-4xl font-extrabold leading-[1.2] text-ink-900 sm:text-5xl">
                قول <span className="text-brand-600">عايز تحجز إيه</span> — واحجزلي يدوّرك عليه.
              </h1>

              <p className="mt-4 max-w-lg text-[1.05rem] leading-relaxed text-ink-500">
                من الملعب والصالون لعيادة الأسنان وقاعة الفرح: قسم واحد يجمّع لك الأماكن والخدمات
                في مصر، وتطلب الحجز من نفس المكان.
              </p>

              <div className="mt-8 max-w-xl">
                <SearchAssistant size="hero" />
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                {promises.map((p) => (
                  <span key={p.label} className="flex items-start gap-2 text-sm">
                    <Icon name={p.icon} size={18} className="mt-0.5 text-brand-600" />
                    <span>
                      <strong className="font-display font-bold text-ink-800">{p.label}</strong>
                      <span className="ms-1.5 text-ink-500">{p.body}</span>
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <Card className="hidden p-6 lg:block">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-extrabold">أكثر الأقسام بحثًا</h2>
                <Link to="/categories" className="text-sm font-bold text-brand-700 hover:underline">
                  الكل
                </Link>
              </div>
              <ul className="space-y-2.5">
                {categories.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/search?cat=${c.id}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-transparent transition-colors hover:bg-brand-50 hover:ring-brand-100"
                    >
                      <span className="grid size-9 place-items-center rounded-xl bg-canvas text-brand-600">
                        <Icon name={c.icon} size={19} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-sm font-bold text-ink-800">{c.title}</span>
                        <span className="block truncate text-xs text-ink-400">{c.subtitle}</span>
                      </span>
                      <Icon name="arrowLeft" size={16} className="text-ink-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <Section
        eyebrow="الأقسام"
        title="اختار القسم اللي محتاجه فيه"
        description="كل قسم ليه فلاتر وبطاقات خاصة بيه. اضغط على القسم يفتح لك النتائج على طول."
        action={
          <Link
            to="/search"
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-white px-5 font-display text-sm font-bold text-brand-700 ring-1 ring-line hover:ring-brand-300"
          >
            <Icon name="search" size={17} />
            استكشف كل الخدمات
          </Link>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="إزاي احجزلي بيشتغل"
        title="3 خطوات وخلاص"
        className="bg-white border-y-line"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-card bg-canvas p-6 ring-1 ring-line">
              <span className="absolute top-5 start-5 font-display text-4xl font-extrabold text-brand-100">
                {i + 1}
              </span>
              <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-brand-600 text-white">
                <Icon name={s.icon} size={22} />
              </span>
              <h3 className="font-display text-lg font-extrabold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="أمثلة على شكل البطاقات"
        title="بطاقات تجريبية للعرض فقط"
        description="دي نماذج بتوضح شكل البطاقة في نتائج البحث. مش أماكن حقيقية ولا الأسعار بتاعتها ملزمة."
      >
        <Notice tone="demo" title="ليه شوفت البطاقات دي؟" className="mb-6">
          <p>
            {PLACEHOLDER_LISTINGS}، فحاطّين بطاقات نماذج علشان التصميم يبان كامل. أول ما المزوّدين
            الحقيقيين يتسجّلوا، البطاقات دي بتتشال وتحلّ محلها نتائج حقيقية.
          </p>
        </Notice>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((listing) => (
            <ServiceCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/search"
            className="inline-flex h-11 items-center gap-2 rounded-pill bg-brand-600 px-6 font-display text-sm font-bold text-white hover:bg-brand-700"
          >
            افتح البحث
            <Icon name="arrowLeft" size={17} />
          </Link>
          {features.realProviderDirectory ? null : (
            <span className="text-xs font-semibold text-ink-400">
              كل النتائج الحالية مصدرها: بيانات تجريبية
            </span>
          )}
        </div>
      </Section>

      <Section className="pb-16">
        <Card className="overflow-hidden">
          <div className="grid gap-6 p-8 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <Badge tone="accent" size="md">
                <Icon name="briefcase" size={15} />
                لملاك النشاطات
              </Badge>
              <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                عندك ملعب أو صالون أو عيادة؟ سجّله على احجزلي
                </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-ink-500">
                سجّل بيانات نشاطك وخدماتك والأسعار الاسترشادية، وتظهر في نتائج البحث للناس اللي
                بتدوّر على خدمة قريبة منهم.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/provider"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-ink-900 font-display text-[0.95rem] font-bold text-white hover:bg-ink-800"
              >
                ابدأ تسجيل النشاط
                <Icon name="arrowLeft" size={17} />
              </Link>
              <Link
                to="/admin"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-white font-display text-[0.95rem] font-bold text-ink-600 ring-1 ring-line hover:ring-brand-300"
              >
                <Icon name="dashboard" size={17} />
                شاهد شكل لوحة التحكم (تجريبي)
              </Link>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
