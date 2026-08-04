export const STATUS_LABELS: Record<string, string> = {
  pending: 'قيد المعالجة',
  preparing: 'تجهيز الورد',
  arranging: 'التنسيق والتغليف',
  shipped: 'خرج للشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
};

export const PAYMENT_LABELS: Record<string, string> = {
  whatsapp: 'واتساب',
  cod: 'الدفع عند الاستلام',
  visa: 'فيزا',
  apple_pay: 'Apple Pay',
  google_pay: 'Google Pay',
  thawani: 'ثواني',
};

export const DEVICE_LABELS: Record<string, string> = {
  mobile: 'الجوال',
  desktop: 'سطح المكتب',
  tablet: 'التابلت',
  unknown: 'غير معروف',
};

export const CATEGORY_LABELS: Record<string, string> = {
  bouquets: 'باقات الورد',
  chocolates: 'الشوكولاتة',
  perfumes: 'العطور',
  wedding: 'هدايا الزواج',
  graduation: 'هدايا التخرج',
  baby: 'هدايا المواليد',
  'luxury-gifts': 'هدايا فاخرة',
};
