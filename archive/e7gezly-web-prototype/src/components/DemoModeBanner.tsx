import { Icon } from './ui/Icon';

/** Site-wide honesty strip: nothing here is a live booking, price, or provider. */
export function DemoModeBanner() {
  return (
    <div className="bg-ink-900 px-4 py-2 text-center text-xs font-semibold leading-relaxed text-white/80">
      <span className="inline-flex items-center justify-center gap-2">
        <Icon name="info" size={14} className="text-accent-300" />
        نموذج واجهة — المرحلة الأولى: مفيش مزوّدين حقيقيين، والسعر والمعومات كلها توضيحية.
      </span>
    </div>
  );
}
