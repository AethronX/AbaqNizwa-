import React from 'react';
import { FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TermsPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-xs text-gray-700 dark:text-gray-300 leading-relaxed animate-fadeIn">
      <div className="flex items-center gap-2 text-[#7D0A0A] dark:text-[#D4AF37]">
        <FileText className="w-6 h-6" />
        <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-gray-100">
          {t('terms_conditions')}
        </h1>
      </div>

      <p>
        {language === 'en'
          ? 'Welcome to Abaq Nizwa Store. By accessing our platform or purchasing luxury products, you agree to comply with the following regulations in accordance with Omani E-commerce laws.'
          : 'أهلاً بكم في متجر عبق نزوى. باستعمالك للموقع أو طلب منتجاتنا، فإنك توافق على الشروط والأحكام التنظيمية التالية المعمول بها في سلطنة عمان.'}
      </p>

      <div className="bg-white dark:bg-[#151111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
          {language === 'en' ? '1. Natural Floral Arrangements' : '١. طلبات وتنسيقات الورد الطبيعي'}
        </h3>
        <p>
          {language === 'en'
            ? 'Fresh flowers are organic items subject to seasonal nuances in hue and petal size. Our florists maintain exact fidelity to our catalog designs.'
            : 'الورد الطبيعي منتج زراعي عضوي يختلف الموسمية في الألوان وأحجام البتلات. يسعى مصممونا للمطابقة الدقيقة مع صور العرض المعتمدة.'}
        </p>

        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
          {language === 'en' ? '2. Delivery & Dispatch Policies' : '٢. التوصيل واستلام الهدايا'}
        </h3>
        <p>
          {language === 'en'
            ? 'Accurate recipient contact numbers and delivery instructions are required. In case of unreachable recipients, re-dispatch will be rescheduled smoothly.'
            : 'يجب تزويدنا برقم هاتف صحيح للمستلم وعنوان واضح. في حال تعذر التوصيل بسبب عنوان خاطئ، سيتم التنسيق لإعادة التوصيل في أنسب وقت.'}
        </p>

        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
          {language === 'en' ? '3. Order Amendments & Cancellation' : '٣. سياسة التعديل والإلغاء'}
        </h3>
        <p>
          {language === 'en'
            ? 'Order specifications or gift card greetings can be modified up to 4 hours prior to scheduled courier dispatch.'
            : 'يمكن تعديل تفاصيل الطلب أو بطاقة الإهداء قبل 4 ساعات من موعد التوصيل المحدد.'}
        </p>
      </div>
    </div>
  );
};
