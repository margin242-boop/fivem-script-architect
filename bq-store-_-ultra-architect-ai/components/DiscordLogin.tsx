
import React from 'react';
import { LogIn, Shield, Cpu, Zap, ShoppingCart } from 'lucide-react';

interface DiscordLoginProps {
  onLogin: () => void;
  isArabic: boolean;
}

export const DiscordLogin: React.FC<DiscordLoginProps> = ({ onLogin, isArabic }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse delay-1000" />
      
      <div className="max-w-md w-full glass rounded-[3rem] p-12 text-center relative z-10 border border-white/10 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-3 hover:rotate-0 transition-transform duration-500 group">
             <Cpu className="text-white w-12 h-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">bq store Elite</h1>
        <p className="text-slate-500 text-sm mb-10 font-medium">
          {isArabic ? 'المنصة الأكثر تطوراً لبرمجة FiveM بالذكاء الاصطناعي' : 'The most advanced FiveM AI scripting platform.'}
        </p>

        <div className="space-y-4 mb-10 text-right" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
            <Shield className="text-blue-500" size={16} />
            {isArabic ? 'وصول حصري للمبرمجين' : 'Exclusive access for developers'}
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
            <Zap className="text-yellow-500" size={16} />
            {isArabic ? 'برمجة فورية بدقة عالية' : 'Instant high-precision coding'}
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
            <ShoppingCart className="text-indigo-500" size={16} />
            {isArabic ? 'تصدير مباشر لمتجرك' : 'Direct export to your store'}
          </div>
        </div>

        <button 
          onClick={onLogin}
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all active:scale-95 shadow-xl shadow-[#5865F2]/20"
        >
          <LogIn size={20} />
          {isArabic ? 'تسجيل الدخول عبر دسكورد' : 'Login with Discord'}
        </button>
        
        <p className="mt-6 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
          {isArabic ? 'يجب أن تكون عضواً في متجرنا للوصول' : 'Must be a store member to access'}
        </p>
      </div>

      <div className="mt-12 text-slate-700 text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4">
        <span>SECURITY VERIFIED</span>
        <span className="w-1.5 h-1.5 bg-slate-800 rounded-full" />
        <span>V3.5 PRIVATE BUILD</span>
      </div>
    </div>
  );
};
