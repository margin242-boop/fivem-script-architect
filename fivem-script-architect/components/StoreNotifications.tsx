
import React, { useState, useEffect } from 'react';
import { Bell, Info, Star, ShieldCheck, Zap, X } from 'lucide-react';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'star';
  title: string;
  message: string;
}

export const StoreNotifications: React.FC<{ isArabic: boolean }> = ({ isArabic }) => {
  const [current, setCurrent] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const notifications: Notification[] = [
    {
      id: 1,
      type: 'star',
      title: isArabic ? 'تحديث جديد' : 'New Update',
      message: isArabic ? 'تم تحسين محرك Gemini 3 Pro لسرعة استجابة أعلى.' : 'Gemini 3 Pro engine optimized for faster response.'
    },
    {
      id: 2,
      type: 'info',
      title: isArabic ? 'نصيحة برمجية' : 'Pro Tip',
      message: isArabic ? 'استخدم الـ Config دائماً لتسهيل تجربة العميل.' : 'Always use Config files for better user experience.'
    },
    {
      id: 3,
      type: 'success',
      title: isArabic ? 'متجر bq store' : 'bq store News',
      message: isArabic ? 'خصم 20% على الطلبات الخاصة داخل الديسكورد.' : '20% discount on custom orders via Discord.'
    },
    {
      id: 4,
      type: 'warning',
      title: isArabic ? 'تنبيه الأداء' : 'Performance Alert',
      message: isArabic ? 'احرص على تقليل الـ loops في السيرفر لضمان ثبات الـ FPS.' : 'Keep server loops minimal to ensure stable FPS.'
    }
  ];

  useEffect(() => {
    let index = 0;
    const cycle = () => {
      setCurrent(notifications[index]);
      setIsVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => setIsVisible(false), 5000);
      
      index = (index + 1) % notifications.length;
    };

    const interval = setInterval(cycle, 10000); // Cycle every 10s
    cycle(); // Initial run

    return () => clearInterval(interval);
  }, [isArabic]);

  if (!current) return null;

  const icons = {
    info: <Info className="text-blue-400" size={18} />,
    success: <ShieldCheck className="text-green-400" size={18} />,
    warning: <Zap className="text-orange-400" size={18} />,
    star: <Star className="text-yellow-400" size={18} />
  };

  return (
    <div 
      className={`fixed bottom-8 left-8 z-[200] w-80 transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
      }`}
    >
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/5 blur-[50px] rounded-full"></div>
        
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 bg-slate-950 rounded-2xl border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
            {icons[current.type]}
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1 flex items-center justify-between">
              {current.title}
              <Bell size={10} className="animate-bounce" />
            </h4>
            <p className="text-xs font-bold text-slate-200 leading-relaxed">
              {current.message}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Official bq store Dispatch</span>
          <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-white transition-colors">
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
