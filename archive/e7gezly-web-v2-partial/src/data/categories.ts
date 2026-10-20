import type { Category } from '../core/types';

export const categories: Category[] = [
  {
    id: 'restaurants-cafes',
    title: 'مطاعم وكافيهات',
    subtitle: 'طاولات، حفلات صغيرة، ومناطق عائلية',
    examples: ['حجز طاولة', 'بوفيه مناسبة', 'كافيه للاجتماعات'],
    icon: 'restaurant',
  },
  {
    id: 'sports-venues',
    title: 'مكان رياضي',
    subtitle: 'ملعب كورة، paddle، جيم، ونادي',
    examples: ['حجز ملعب', 'كورة paddle', 'صالة تدريب'],
    icon: 'sports',
  },
  {
    id: 'beauty',
    title: 'تجميل وعناية',
    subtitle: 'صالونات، سبا، وماكيير',
    examples: ['صالون حريمي', 'حلاقة رجالي', 'ماكيير مناسبات'],
    icon: 'beauty',
  },
  {
    id: 'healthcare',
    title: 'عيادات وصحة',
    subtitle: 'مواعيد دكتور وتحاليل',
    examples: ['باطنة وجلد', 'أسنان', 'معمل تحاليل'],
    icon: 'health',
  },
  {
    id: 'home-services',
    title: 'خدمات المنزل',
    subtitle: 'صيانة ونظافة على مدار الأسبوع',
    examples: ['سبّاك', 'تنظيف شقة', 'تكييفات'],
    icon: 'home',
  },
  {
    id: 'events',
    title: 'مناسبات وأفراح',
    subtitle: 'قاعات، تصوير، وتنسيق',
    examples: ['قاعة فرح', 'تصوير', 'تنسيق زهور'],
    icon: 'events',
  },
  {
    id: 'travel',
    title: 'سفر ومصاطيف',
    subtitle: 'فنادق، نقل، وبرامج سياحية',
    examples: ['شاليه', 'باص سياحي', 'برنامج يوم واحد'],
    icon: 'travel',
  },
  {
    id: 'other',
    title: 'خدمات تانية',
    subtitle: 'أي حاجة محتاج تحجزها',
    examples: ['تدريب', 'قاعات اجتماعات', 'تأجير معدات'],
    icon: 'sparkle',
  },
];

export const categoryMap = new Map(categories.map((c) => [c.id, c]));

export function getCategory(id: string): Category | undefined {
  return categoryMap.get(id as Category['id']);
}
