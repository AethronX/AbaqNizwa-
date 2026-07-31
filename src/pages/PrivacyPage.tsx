import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-xs text-gray-700 dark:text-gray-300 leading-relaxed animate-fadeIn">
      <div className="flex items-center gap-2 text-[#7D0A0A] dark:text-[#D4AF37]">
        <ShieldCheck className="w-6 h-6" />
        <h1 className="text-2xl font-bold font-heading text-gray-900 dark:text-gray-100">
          {t('privacy_policy')}
        </h1>
      </div>

      <p>
        {language === 'en'
          ? 'Abaq Nizwa is committed to protecting the privacy and confidentiality of all clients and gift recipients across the Sultanate of Oman. This policy outlines how your data is safely gathered and stored.'
          : 'تلتزم علامة عبق نزوى (Abaq Nizwa) بحماية خصوصية كافة عملائها ومستلمي الهدايا في سلطنة عمان. تصف هذه السياسة كيفية جمع واستخدام وتأمين بياناتك الشخصية.'}
      </p>

      <div className="bg-white dark:bg-[#151111] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
          {language === 'en' ? '1. Information We Collect' : '١. المعلومات التي نجمعها'}
        </h3>
        <p>
          {language === 'en'
            ? 'We collect essential data required to complete luxury floral delivery, including full name, contact phone, email address, and recipient destination across Omani governorates.'
            : 'نجمع البيانات الأساسية اللازمة لإكمال عملية إهداء الورد وتأكيد التوصيل مثل: الاسم الكامل، رقم الهاتف، البريد الإلكتروني، وعنوان المستلم في المحافظات.'}
        </p>

        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
          {language === 'en' ? '2. Recipient & Card Privacy' : '٢. سرية بطاقات الإهداء والمستلمين'}
        </h3>
        <p>
          {language === 'en'
            ? 'Gift card messages and recipient contact information are handled strictly under VIP confidentiality standards and never shared with unauthorized third parties.'
            : 'نضمن عدم مشاركة نص الرسائل المدونة في بطاقات الإهداء أو بيانات المستلم مع أي أطراف ثالثة خارجيين.'}
        </p>

        <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
          {language === 'en' ? '3. Secure Payment Gateway' : '٣. حماية الدفع الإلكتروني'}
        </h3>
        <p>
          {language === 'en'
            ? 'All digital transactions are encrypted through certified Omani payment portals (Thawani & Apple Pay). Card information is never stored on our servers.'
            : 'تتم كافة المعاملات المالية المشفرة عبر بوابات معتمدة ومأمونة كبوابة ثواني العمانية ومزودي Apple Pay دون تخزين بيانات بطاقتك البنكية في خوادمنا.'}
        </p>
      </div>
    </div>
  );
};
