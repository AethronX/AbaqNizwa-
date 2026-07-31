import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FAQPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qAr: 'كيف يتم ضمان نضارة الورد الطبيعي أثناء التوصيل؟',
      qEn: 'How do you guarantee the freshness of natural roses during delivery?',
      aAr: 'يتم حفظ جميع باقات عبق نزوى في سيارات مبردة مخصصة لنقل الزهور بدرجة حرارة متوازنة (4-8 مئوية)، وتوضع جذوع الورد في كبسولات ماء ومغذيات زهور لضمان وصولها بنضارة تامة.',
      aEn: 'All Abaq Nizwa arrangements are delivered in temperature-controlled refrigerated vehicles (4-8°C). Stems are hydrated with water-nutrient capsules ensuring optimal freshness.'
    },
    {
      qAr: 'أين يقع معرض عبق نزوى؟ وهل توجد فروع أخرى؟',
      qEn: 'Where is Abaq Nizwa store located? Are there other branches?',
      aAr: 'يقع معرضنا الرئيسي والوحيد في ولاية نزوى التاريخية بالقرب من قلعة نزوى العريقة (حي التراث). ويوفر متجرنا الإلكتروني خدمة التوصيل السريع لجميع الولايات ومحافظات سلطنة عمان.',
      aEn: 'Our single official flagship showroom is located in historic Nizwa near Nizwa Fort (Al Turath Quarter). Our online store provides express delivery across all governorates in Oman.'
    },
    {
      qAr: 'هل يمكن التوصيل في نفس اليوم لجميع محافظات سلطنة عمان؟',
      qEn: 'Is same-day express delivery available across Oman?',
      aAr: 'نعم! تتوفر خدمة التوصيل السريع بنفس اليوم للطلبات المؤكدة قبل الساعة 4:00 عصراً لكافة المحافظات بما فيها مسقط، نزوى، صحار، صلالة، وصور.',
      aEn: 'Yes! Same-day express delivery is available for orders confirmed before 4:00 PM across Muscat, Nizwa, Ad Dakhiliyah, Sohar, and all regions.'
    },
    {
      qAr: 'هل تتوفر سرية تامة ومفاجأة للمستلم عند الهدايا؟',
      qEn: 'Can I send gifts as an anonymous surprise to the recipient?',
      aAr: 'بالتأكيد. نقوم بتسليم الهدايا للمستلم بكل لباقة وسرية دون إفصاح عن التفاصيل أو السعر ما لم تطلب إضافة اسمك في بطاقة الإهداء.',
      aEn: 'Absolutely. We deliver gifts with complete privacy and luxury protocol, revealing no pricing or sender details unless requested on the gift card.'
    },
    {
      qAr: 'ما هي طرق الدفع المتاحة لدى متجر عبق نزوى؟',
      qEn: 'What payment methods are supported by Abaq Nizwa?',
      aAr: 'نوفر الدفع عبر Apple Pay، بوابة ثواني العمانية (Thawani)، فيزا وماستركارد، بالإضافة إلى خيار الدفع عند الاستلام.',
      aEn: 'We support Apple Pay, Thawani Omani Payment Gateway, Visa & Mastercard, as well as Cash on Delivery.'
    },
    {
      qAr: 'كيف يمكنني تصميم باقة ورد خاصة بحسب ميزانيتي؟',
      qEn: 'How can I customize a gift bouquet according to my budget?',
      aAr: 'يمكنك استخدام "استوديو الهدايا المخصصة" في موقعنا لاختيار نوع الزهور، عدد الورود، لون التغليف، وتخصيص بطاقة الإهداء بكل سهولة.',
      aEn: 'You can use our online "Custom Gift Studio" to select rose varieties, stem counts, velvet ribbon colors, and card messages seamlessly.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fadeIn">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 bg-[#FCECEF] dark:bg-[#7D0A0A]/30 text-[#7D0A0A] dark:text-[#D4AF37] rounded-full flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-gray-900 dark:text-gray-100">
          {t('faq')}
        </h1>
        <p className="text-xs text-gray-500">
          {language === 'en'
            ? 'Answers to frequently asked questions regarding Abaq Nizwa gifts and delivery'
            : 'إجابات شاملة على أكثر الاستفسارات شيوعاً حول باقات وتوصيل عبق نزوى'}
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#151111] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full p-5 text-start font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center justify-between gap-4"
            >
              <span>{language === 'en' ? faq.qEn : faq.qAr}</span>
              <ChevronDown className={`w-5 h-5 text-[#7D0A0A] dark:text-[#D4AF37] transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-3">
                {language === 'en' ? faq.aEn : faq.aAr}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
