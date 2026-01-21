
import React, { useState, useEffect, useRef } from 'react';
import { Framework, GeneratedScript } from './types';
import { generateFiveMScript } from './services/geminiService';
import { ScriptEditor } from './components/ScriptEditor';
import { StoreShowcase } from './components/StoreShowcase';
import { DiscordLogin } from './components/DiscordLogin';
import JSZip from 'jszip';
import { 
  Sparkles, 
  Loader2,
  Code2,
  Box,
  Wrench,
  ShieldCheck,
  Zap,
  ShoppingBag,
  History,
  Youtube,
  Download,
  Plus,
  Trash2,
  Info,
  ChevronRight,
  MessageSquare,
  Cpu,
  User,
  LogOut,
  ChevronLeft,
  LayoutGrid,
  Bell,
  AlertCircle,
  ShieldAlert,
  ExternalLink,
  Crown,
  Lock,
  ArrowLeft
} from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [prompt, setPrompt] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [framework, setFramework] = useState<Framework>(Framework.QBCORE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [currentScript, setCurrentScript] = useState<GeneratedScript | null>(null);
  const [history, setHistory] = useState<GeneratedScript[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isArabic, setIsArabic] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'editor' | 'store'>('editor');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const DISCORD_LINK = "https://discord.gg/1118710026543046738"; 
  const LOGO_URL = "https://i.imgur.com/T09M98v.png"; // تم تحديث الرابط للوجو الجديد

  useEffect(() => {
    const auth = localStorage.getItem('bq_elite_session_v5');
    if (auth) {
      const parsed = JSON.parse(auth);
      setIsLoggedIn(true);
      setUserData(parsed);
      setHasPermission(parsed.isElite || false); 
    }
    
    const savedHistory = localStorage.getItem('bq_elite_history_v8');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleLoginSuccess = (data: any) => {
    localStorage.setItem('bq_elite_session_v5', JSON.stringify(data));
    setUserData(data);
    setIsLoggedIn(true);
    setHasPermission(data.isElite || false);
  };

  const handleLogout = () => {
    localStorage.removeItem('bq_elite_session_v5');
    setIsLoggedIn(false);
    setHasPermission(false);
    setUserData(null);
    window.location.hash = "";
  };

  const saveToHistory = (script: GeneratedScript) => {
    const newHistory = [script, ...history.filter(h => h.id !== script.id)].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('bq_elite_history_v8', JSON.stringify(newHistory));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError(null);
    setIsGenerating(true);
    try {
      const script = await generateFiveMScript(prompt, framework, undefined, undefined, 'new', undefined, youtubeUrl);
      setCurrentScript(script);
      saveToHistory(script);
      setActiveTab('editor');
    } catch (err: any) {
      setError(isArabic ? 'فشل توليد السكربت. يرجى المحاولة لاحقاً.' : 'AI Generation Failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!currentScript) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      currentScript.files.forEach(file => { zip.file(file.name, file.content); });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentScript.title.replace(/\s+/g, '_')}_bq_store.zip`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) { setError("ZIP Error."); } finally { setIsZipping(false); }
  };

  if (!isLoggedIn) {
    return <DiscordLogin onLoginSuccess={handleLoginSuccess} isArabic={isArabic} />;
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.1),transparent_70%)] pointer-events-none" />
        <div className="max-w-xl w-full glass-card rounded-[4rem] p-16 text-center border-red-500/20 shadow-[0_0_120px_rgba(239,68,68,0.15)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />
          
          <div className="w-28 h-28 bg-[#0a0f1e] rounded-full flex items-center justify-center mx-auto mb-10 border border-red-500/20 shadow-2xl">
            <img src={LOGO_URL} className="w-20 h-20 grayscale opacity-50" alt="bq" />
          </div>
          
          <h1 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase">
            {isArabic ? 'صلاحية مرفوضة' : 'Access Denied'}
          </h1>
          
          <div className="space-y-4 mb-12">
            <p className="text-slate-400 text-sm leading-relaxed px-4">
              {isArabic 
                ? 'عذراً، هذا النظام مخصص فقط لعملاء bq store المعتمدين. حسابك لا يمتلك الرتبة المطلوبة حالياً.' 
                : 'Access to bq store Elite tools is restricted to authorized members only.'}
            </p>
            <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/10 inline-block">
               <span className="text-[10px] font-black text-red-400 tracking-[0.3em] uppercase italic">bq store security v5.0</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <a 
              href={DISCORD_LINK} 
              target="_blank" 
              className="flex items-center justify-center gap-4 w-full h-20 bg-blue-600 hover:bg-blue-700 rounded-[2rem] text-white font-black transition-all shadow-2xl uppercase tracking-widest text-xs"
            >
              <ExternalLink size={20} />
              {isArabic ? 'الحصول على الرتبة من السيرفر' : 'Get Rank from Server'}
            </a>
            
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full h-16 bg-white/5 hover:bg-white/10 rounded-[1.8rem] text-slate-400 font-bold transition-all border border-white/5 uppercase tracking-widest text-[10px]"
            >
              <ArrowLeft size={16} />
              {isArabic ? 'الخروج' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const t = {
    title: isArabic ? 'نظام bq store الفاخر' : 'bq store Elite Architect',
    generateBtn: isArabic ? 'بدء البرمجة الذكية' : 'START SMART CODE',
    generating: isArabic ? 'جاري الصياغة...' : 'CRAFTING...',
    history: isArabic ? 'أرشيف bq store' : 'bq store Archive',
    editor: isArabic ? 'محرر الأكواد' : 'Source Code',
    showcase: isArabic ? 'معرض المتجر' : 'Store Preview',
    copyright: isArabic ? 'جميع الحقوق محفوظة لمتجر bq store © 2025' : 'All rights reserved to bq store © 2025'
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#020617] text-slate-100 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <header className="h-24 border-b border-white/5 glass-card sticky top-0 z-[60] flex items-center px-10 shadow-2xl">
        <div className="max-w-[1900px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700" />
              <div className="relative w-16 h-16 bg-[#0a0f1e] rounded-full flex items-center justify-center border border-white/10 shadow-2xl group-hover:scale-105 transition-transform">
                <img src={LOGO_URL} className="w-12 h-12 object-contain" alt="bq" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[9px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20 tracking-[0.4em] uppercase">
                  OFFICIAL bq store
                </span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                {t.title}
                <Sparkles size={18} className="text-blue-500" />
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-[1.8rem] border border-white/5">
               <div className="relative">
                 {userData?.avatar ? (
                   <img src={userData.avatar} className="w-10 h-10 rounded-full border border-blue-500/50" alt="User" />
                 ) : (
                   <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-black text-white">
                     {userData?.username?.[0]?.toUpperCase()}
                   </div>
                 )}
               </div>
               <div className="text-right">
                  <span className="block text-xs font-black text-white uppercase tracking-widest">{userData?.username}</span>
                  <span className="block text-[8px] font-black text-blue-400 uppercase tracking-widest">bq Elite Account</span>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/15 text-red-500 border border-red-500/10 transition-all"
            >
              <LogOut size={22} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`${sidebarOpen ? 'w-80' : 'w-24'} border-l border-white/5 glass-card transition-all duration-700 hidden lg:flex flex-col z-50`}>
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-4">
                <History size={18} className="text-blue-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">{t.history}</h3>
              </div>
            )}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 hover:bg-white/5 rounded-xl text-slate-500">
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentScript(item); setActiveTab('editor'); }}
                className={`w-full text-right p-5 transition-all group overflow-hidden ${
                  currentScript?.id === item.id 
                  ? 'bg-blue-600/15 border-blue-500/40 rounded-[2.2rem] border' 
                  : 'bg-white/2 hover:bg-white/5 rounded-[2rem]'
                }`}
              >
                <div className="flex items-center gap-5">
                   <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${currentScript?.id === item.id ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-slate-500'}`}>
                      <Code2 size={22} />
                   </div>
                  {sidebarOpen && (
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm truncate text-slate-100">{item.title}</h4>
                      <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{item.framework}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-10 relative">
          <div className="max-w-7xl mx-auto space-y-12 pb-32">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
              <div className="xl:col-span-4 space-y-10">
                <div className="glass-card rounded-[3.5rem] p-10 shadow-2xl border border-white/5">
                  <div className="space-y-10">
                    <div>
                      <label className="flex items-center gap-4 text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-8">
                        {isArabic ? 'مهندس bq store' : 'bq store Architect'}
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={isArabic ? 'أدخل تفاصيل السكربت الذي تريده...' : 'Enter script details...'}
                        className="w-full h-64 bg-black/40 border border-white/5 rounded-[2.5rem] p-8 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none resize-none"
                      />
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full h-24 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-800 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)]"
                    >
                      <div className="flex items-center justify-center gap-5">
                        {isGenerating ? <Loader2 className="animate-spin" size={32} /> : <Zap size={32} fill="currentColor" />}
                        <span className="text-lg font-black uppercase tracking-[0.2em]">{isGenerating ? t.generating : t.generateBtn}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-8">
                {currentScript ? (
                  <div className="flex flex-col h-full space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex p-2 bg-white/5 rounded-[2rem]">
                        <button 
                          onClick={() => setActiveTab('editor')}
                          className={`px-12 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] ${activeTab === 'editor' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                        >
                          {t.editor}
                        </button>
                        <button 
                          onClick={() => setActiveTab('store')}
                          className={`px-12 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] ${activeTab === 'store' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                        >
                          {t.showcase}
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[700px]">
                      {activeTab === 'editor' ? <ScriptEditor files={currentScript.files} /> : <StoreShowcase marketing={currentScript.marketing!} title={currentScript.title} framework={currentScript.framework} isArabic={isArabic} />}
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[750px] glass-card border-2 border-dashed border-white/5 rounded-[5rem] flex flex-col items-center justify-center p-20 text-center opacity-30">
                    <img src={LOGO_URL} className="w-32 h-32 mb-10 grayscale" alt="bq" />
                    <h3 className="text-3xl font-black tracking-tighter mb-4">{isArabic ? 'بانتظار أوامر bq store' : 'Awaiting bq store orders'}</h3>
                  </div>
                )}
              </div>
            </div>
          </div>

          <footer className="absolute bottom-0 left-0 right-0 h-24 flex items-center justify-between px-16 border-t border-white/5 bg-[#020617]/90 backdrop-blur-2xl">
             <div className="flex items-center gap-10">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">{t.copyright}</span>
             </div>
             <div className="flex items-center gap-6">
                <img src={LOGO_URL} className="w-8 h-8 object-contain opacity-50" alt="bq" />
                <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.3em]">BQ STORE ELITE V5.0</span>
             </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
