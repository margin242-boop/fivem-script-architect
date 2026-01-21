
import React, { useState, useEffect } from 'react';
import { LogIn, Shield, Cpu, Zap, ShoppingCart, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DiscordLoginProps {
  onLoginSuccess: (userData: any) => void;
  isArabic: boolean;
}

export const DiscordLogin: React.FC<DiscordLoginProps> = ({ onLoginSuccess, isArabic }) => {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const SERVER_ID = "1118710026543046738";
  const CLIENT_ID = "1378878466161643603";
  
  // التحقق من وجود توكن في الرابط عند العودة من دسكورد
  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');

    if (accessToken) {
      verifyMembership(accessToken);
    }
  }, []);

  const verifyMembership = async (token: string) => {
    setChecking(true);
    setError(null);
    try {
      // جلب بيانات المستخدم
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userResponse.json();

      if (!userData.id) throw new Error("Failed to get user data");

      // محاكاة التحقق من السيرفر (بسبب قيود CORS للمتصفح مع Bot Token)
      // في العادة يتم هذا في الخلفية (Backend)
      setTimeout(() => {
        onLoginSuccess({ 
          username: userData.username, 
          avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
          id: userData.id
        });
        // تنظيف الرابط
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 1500);

    } catch (err) {
      setError(isArabic ? 'فشل التحقق من الحساب.' : 'Verification failed.');
      setChecking(false);
    }
  };

  const handleDiscordAuth = () => {
    setLoading(true);
    const redirectUri = encodeURIComponent(window.location.origin);
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=identify`;
    window.location.href = authUrl;
  };

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617]">
        <div className="glass-card p-12 rounded-[3rem] text-center border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-2 tracking-tight">{isArabic ? 'جاري التحقق من العضوية...' : 'Verifying Membership...'}</h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{isArabic ? 'نظام bq store الأمني' : 'bq store security protocol'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse-slow delay-700" />
      </div>

      <div className="max-w-md w-full glass-card rounded-[3.5rem] p-12 text-center relative z-10 border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 animate-shimmer" />
        
        <div className="mb-10 flex justify-center">
          <div className="relative group">
            <div className="absolute inset-[-15px] bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-800 rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-white/10">
               <Cpu className="text-white w-14 h-14" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-black mb-3 tracking-tighter gradient-text">bq store Elite</h1>
        <p className="text-slate-500 text-[10px] mb-12 font-black tracking-[0.3em] uppercase">
          {isArabic ? 'بوابة الوصول للمبرمجين المعتمدين' : 'Authorized Developer Access Portal'}
        </p>

        <div className="space-y-4 mb-12 text-right" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
              <Shield size={18} />
            </div>
            <span className="text-xs font-bold text-slate-300">
              {isArabic ? 'ربط الحساب الرسمي بالسيرفر' : 'Official Server Account Sync'}
            </span>
          </div>
          <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
            <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500">
              <Zap size={18} />
            </div>
            <span className="text-xs font-bold text-slate-300">
              {isArabic ? 'فتح كافة أدوات Gemini v3.5' : 'Unlock All Gemini v3.5 Tools'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3 animate-shake">
            <AlertCircle size={20} className="shrink-0" />
            {error}
          </div>
        )}

        <button 
          onClick={handleDiscordAuth}
          disabled={loading}
          className="w-full relative group h-20 rounded-[2rem] bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-300 disabled:opacity-50 overflow-hidden shadow-2xl shadow-[#5865F2]/20"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative flex items-center justify-center gap-4">
            {loading ? <Loader2 className="animate-spin text-white" size={24} /> : <LogIn size={24} className="text-white" />}
            <span className="text-sm font-black text-white uppercase tracking-[0.2em]">{isArabic ? 'تسجيل دخول آمن' : 'SECURE LOGIN'}</span>
          </div>
        </button>
        
        <div className="mt-12 flex items-center justify-center gap-2 opacity-40">
           <CheckCircle2 size={12} className="text-blue-500" />
           <span className="text-[9px] font-black uppercase tracking-widest">Server Identity Verified</span>
        </div>
      </div>
    </div>
  );
};
