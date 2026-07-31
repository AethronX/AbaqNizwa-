import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)] sm:w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-slideUp transition-all backdrop-blur-md ${
            toast.type === 'error'
              ? 'bg-red-900/95 text-white border-red-700'
              : toast.type === 'info'
              ? 'bg-[#120E0E]/95 text-gray-100 border-[#7D0A0A]/30'
              : 'bg-[#7D0A0A] text-white border-[#D4AF37]/50'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-5 h-5 text-[#D4AF37] shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0 animate-bounce" />
          )}
          <span className="text-sm font-medium leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
