
import React, { useState, useEffect } from 'react';
import { LogIn, Shield, Cpu, Zap, Loader2, AlertCircle, Lock, Sparkles, ShieldCheck } from 'lucide-react';

interface DiscordLoginProps {
  onLoginSuccess: (userData: any) => void;
  isArabic: boolean;
}

export const DiscordLogin: React.FC<DiscordLoginProps> = ({ onLoginSuccess, isArabic }) => {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const CLIENT_ID = "1378878466161643603";
  const GUILD_ID = "1118710026543046738";
  const ROLE_ID = "1421637178743590922";
  const LOGO_URL = "https://i.imgur.com/T09M98v.png"; // تم تحديث الرابط للوجو الجديد
  
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
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userResponse.json();

      if (!userData.id) throw new Error("Failed to get user data");

      const memberResponse = await fetch(`https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let isElite = false;
      if (memberResponse.ok) {
        const memberData = await memberResponse.json();
        isElite = memberData.roles && memberData.roles.includes(ROLE_ID);
      }

      setTimeout(() => {
        onLoginSuccess({ 
          username: userData.username, 
          avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
          id: userData.id,
          isElite: isElite
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 2000);

    } catch (err) {
      setError(isArabic ? 'فشل التحقق من الصلاحيات' : 'Auth Verification Failed');
      setChecking(false);
    }
  };

  const handleDiscordAuth = () => {
    setLoading(true);
    const redirectUri = encodeURIComponent(window.location.origin);
    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=token&scope=identify+guilds+guilds.members.read`;
    window.location.href = authUrl;
  };

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617]">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
          <div className="glass-card p-16 rounded-[4rem] text-center border border-blue-500/20 relative z-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer" />
            <div className="relative mb-10">
               <div className="w-24 h-24 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin mx-auto flex items-center justify-center">
                  <img src={LOGO_URL} className="w-16 h-16 object-contain opacity-50" alt="bq" />
               </div>
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter text-white uppercase">
              {isArabic ? 'جاري فحص رتبة bq' : 'Verifying bq Rank'}
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">{isArabic ? 'تحقق أمني من متجر bq' : 'bq store security check'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative bg-[#020617]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-900/20 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[150px] animate-pulse delay-700" />
      </div>

      <div className="max-w-md w-full glass-card rounded-[4rem] p-16 text-center relative z-10 border border-white/5 shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-white to-blue-600 animate-shimmer" />
        
        <div className="mb-12 flex justify-center">
          <div className="relative group">
            <div className="absolute inset-[-40px] bg-blue-500/10 blur-3xl rounded-full opacity-100 transition-all duration-1000" />
            <div className="w-36 h-36 bg-[#0a0f1e] rounded-full flex items-center justify-center shadow-2xl relative z-10 border border-white/10 group-hover:scale-110 transition-transform duration-700">
               <img src={LOGO_URL} className="w-28 h-28 object-contain" alt="bq store logo" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-black mb-3 tracking-tighter text-white">
           <span className="text-blue-400">bq</span> store <span className="gold-text">Elite</span>
        </h1>
        <p className="text-slate-500 text-[10px] mb-14 font-black tracking-[0.5em] uppercase">
          {isArabic ? 'نظام النخبة البرمجي' : 'Elite Software System'}
        </p>

        <div className="space-y-4 mb-14">
          <div className="flex items-center gap-5 p-5 bg-white/2 rounded-3xl border border-white/5 group hover:bg-white/5 transition-all">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <Shield size={20} />
            </div>
            <div className="text-right flex-1">
               <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Authorization</div>
               <div className="text-xs font-bold text-slate-200">{isArabic ? 'سيرفر bq store' : 'bq store Guild'}</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-10 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3 animate-pulse">
            <AlertCircle size={20} className="shrink-0" />
            {error}
          </div>
        )}

        <button 
          onClick={handleDiscordAuth}
          disabled={loading}
          className="w-full relative group h-24 rounded-[2.5rem] bg-[#5865F2] hover:bg-[#4752C4] transition-all duration-500 disabled:opacity-50 overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
          <div className="relative flex items-center justify-center gap-5">
            {loading ? <Loader2 className="animate-spin text-white" size={32} /> : <LogIn size={32} className="text-white" />}
            <div className="text-right">
               <div className="text-sm font-black text-white uppercase tracking-[0.2em]">{isArabic ? 'تسجيل دخول' : 'VERIFY & LOGIN'}</div>
               <div className="text-[9px] font-black text-blue-200/60 uppercase tracking-widest">{isArabic ? 'عبر رتبة bq' : 'via bq store rank'}</div>
            </div>
          </div>
        </button>
        
        <div className="mt-14 flex flex-col items-center gap-2 opacity-30 group cursor-default">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] group-hover:opacity-100 transition-opacity">bq store | all rights reserved © 2025</span>
           <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">جميع الحقوق محفوظة لمتجر bq store</span>
        </div>
      </div>
    </div>
  );
};
