import React, { useState } from 'react';
import { Lock, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo-abaq-nizwa.png';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(username, password);
    setSubmitting(false);
    if (!result.success) {
      setError(result.message || 'فشل تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBFB] dark:bg-[#0F0B0B] px-4 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 left-4 p-2.5 rounded-full bg-white dark:bg-[#151111] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300"
        aria-label="تبديل المظهر"
      >
        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#D4AF37]" />}
      </button>

      <div className="w-full max-w-sm bg-white dark:bg-[#151111] border border-gray-200 dark:border-[#D4AF37]/30 rounded-3xl p-8 space-y-6 shadow-xl dark:shadow-2xl">
        <div className="text-center space-y-2">
          <img
            src={logo}
            alt="عبق نزوى"
            className="w-20 h-20 mx-auto object-contain"
            width={80}
            height={80}
          />
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-gray-100">لوحة تحكم عبق نزوى</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">دخول مخصص للإدارة فقط</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">اسم المستخدم</label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#1A1515] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-[#1A1515] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {error && (
            <p className="text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl p-2.5">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#7D0A0A] hover:bg-[#5A0707] disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
          >
            <Lock className="w-4 h-4 text-[#D4AF37]" />
            {submitting ? 'جارِ الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
};
