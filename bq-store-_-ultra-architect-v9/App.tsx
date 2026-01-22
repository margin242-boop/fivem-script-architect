
import React, { useState, useEffect } from 'react';
import { Framework, GeneratedScript } from './types';
import { generateFiveMScript } from './services/geminiService';
import { ScriptEditor } from './components/ScriptEditor';
import { StoreShowcase } from './components/StoreShowcase';
import { DiscordLogin } from './components/DiscordLogin';
import { Pricing } from './components/Pricing';
import JSZip from 'jszip';
import { 
  Sparkles, 
  Loader2,
  Code2,
  Zap,
  History,
  Download,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Crown,
  CreditCard,
  Layout,
  Terminal,
  Activity,
  Box,
  CheckCircle2,
  UserCheck,
  AlertTriangle,
  Key,
  Info,
  ExternalLink as LinkIcon
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
  const [error, setError] = useState<{ message: string; type: 'quota' | 'general' | 'key' } | null>(null);
  const [isArabic, setIsArabic] = useState(true);
  const [activeTab, setActiveTab] = useState<'editor' | 'store' | 'pricing'>('editor');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showKeyInfo, setShowKeyInfo] = useState(false);
  
  const DISCORD_LINK = "https://discord.gg/zg7rF9agBD"; 
  const LOGO_URL = "https://i.imgur.com/T09M98v.png"; 
  const WEBHOOK_URL = "https://discord.com/api/webhooks/1463574672745693234/u8BJr6n5e7myjOEvDda4jg5B7Fa2Ya3or03P36gkxZhjn6KVB2PIKU4XkQHI0kvgwV_7";

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

  const openKeySelector = async () => {
    try {
      if (window.aistudio) {
        await window.aistudio.openSelectKey();
        setError(null);
        setShowKeyInfo(false);
      }
    } catch (e) {
      console.error("Failed to open key selector", e);
    }
  };

  const sendToWebhook = async (script: GeneratedScript) => {
    if (!userData) return;
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `<@${userData.id}> 👑 **تم توليد سكربت ملكي جديد!**`,
          embeds: [{
            title: `👑 bq store | Royal Architect Log`,
            description: `تم استدعاء الذكاء الاصطناعي لإنشاء تحفة برمجية للعميل: **${userData.username}**`,
            color: 0xFB8C00,
            fields: [
              { name: "📜 اسم السكربت", value: `\`\`\`${script.title}\`\`\``, inline: false },
              { name: "🛠️ نظام العمل", value: `\`${script.framework}\``, inline: true },
              { name: "📦 عدد الملفات", value: `\`${script.files.length}\``, inline: true },
              { name: "🆔 آيدي العميل", value: `\`${userData.id}\``, inline: false },
            ],
            footer: { text: "BQ STORE ELITE VERCEL SYSTEM", icon_url: LOGO_URL },
            timestamp: new Date().toISOString()
          }]
        })
      });
    } catch (e) { console.error("Webhook Error", e); }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setError(null);
    setIsGenerating(true);
    try {
      const script = await generateFiveMScript(prompt, framework, undefined, undefined, 'new', undefined, youtubeUrl);
      setCurrentScript(script);
      const newHistory = [script, ...history.filter(h => h.id !== script.id)].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('bq_elite_history_v8', JSON.stringify(newHistory));
      setActiveTab('editor');
      await sendToWebhook(script);
    } catch (err: any) {
      const errorMsg = err.message || '';
      if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
        setError({ 
          message: isArabic 
            ? 'انتهت حصة الاستخدام (429). يرجى الضغط على زر "إدارة المفاتيح" واستخدام مفتاح مدفوع لتجاوز هذا القيد والاستمرار في التوليد.' 
            : 'Quota exceeded (429). Please click "KEY MANAGER" and use a paid API key to bypass this limit.',
          type: 'quota'
        });
        setShowKeyInfo(true);
      } else {
        setError({ 
          message: isArabic ? 'حدث خطأ في النظام الملكي أثناء معالجة طلبك.' : 'An error occurred in the royal system.',
          type: 'general'
        });
      }
    } finally { setIsGenerating(false); }
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
    } catch (err) { setError({ message: "ZIP Error", type: 'general' }); } finally { setIsZipping(false); }
  };

  if (!isLoggedIn) return <DiscordLogin onLoginSuccess={(data) => { setUserData(data); setIsLoggedIn(true); setHasPermission(data.isElite); }} isArabic={isArabic} />;

  return (
    <div className={`min-h-screen flex flex-col bg-[#020617] text-slate-100 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header Premium */}
      <header className="h-28 border-b border-white/5 glass-card sticky top-0 z-[60] flex items-center px-12 shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1900px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('editor')}>
              <div className="relative w-20 h-20 bg-gradient-to-br from-[#0a0f1e] to-[#111827] rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl transition-all group-hover:scale-110">
                <img src={LOGO_URL} className="w-14 h-14 object-contain" alt="bq" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 uppercase tracking-widest">
                   Elite Vercel v8.0
                </span>
                <span className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20 uppercase flex items-center gap-2">
                   <Crown size={12} /> {isArabic ? 'عضوية النخبة' : 'Elite Access'}
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-white drop-shadow-lg">
                {isArabic ? 'نظام bq store الملكي' : 'bq store Royal Architect'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <button 
              onClick={openKeySelector} 
              className="flex items-center gap-3 px-8 py-4 bg-yellow-600/10 border border-yellow-600/20 rounded-2xl text-yellow-500 hover:bg-yellow-600/20 transition-all shadow-xl shadow-yellow-600/5 group"
            >
              <Key size={18} className="group-hover:rotate-45 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">{isArabic ? 'إدارة المفاتيح' : 'KEY MANAGER'}</span>
            </button>

            <div className="flex items-center gap-6 pl-8 border-l border-white/10">
               <div className="text-right hidden sm:block">
                  <span className="block text-xs font-black text-white uppercase tracking-widest">{userData?.username}</span>
                  <span className="block text-[9px] font-black text-yellow-500 uppercase flex items-center justify-end gap-1">
                    <UserCheck size={10} /> {hasPermission ? 'Elite Member' : 'Guest'}
                  </span>
               </div>
               <img src={userData?.avatar || LOGO_URL} className="w-14 h-14 rounded-2xl border-2 border-white/10 shadow-2xl" alt="User" />
               <button onClick={() => { localStorage.removeItem('bq_elite_session_v5'); window.location.reload(); }} className="p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/20 text-red-500 border border-red-500/10 transition-all">
                <LogOut size={20} />
               </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar History */}
        <aside className={`${sidebarOpen ? 'w-96' : 'w-24'} border-l border-white/5 glass-card transition-all duration-700 hidden lg:flex flex-col z-50`}>
          <div className="p-10 border-b border-white/5 flex items-center justify-between">
            {sidebarOpen && <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{isArabic ? 'أرشيف الملوك' : 'ROYAL ARCHIVE'}</h3>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 transition-all">
              {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {history.map((item) => (
              <button key={item.id} onClick={() => { setCurrentScript(item); setActiveTab('editor'); }} className={`w-full text-right p-6 transition-all group overflow-hidden ${currentScript?.id === item.id ? 'bg-blue-600/15 border-blue-500/40 rounded-[2.5rem] border' : 'bg-white/2 hover:bg-white/5 rounded-[2.5rem] border border-transparent'}`}>
                <div className="flex items-center gap-5">
                   <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all ${currentScript?.id === item.id ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-800/50 text-slate-500'}`}>
                      <Code2 size={26} />
                   </div>
                  {sidebarOpen && (
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm truncate text-white">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[8px] text-blue-400 font-black uppercase tracking-widest">{item.framework}</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-[#020617] relative">
          <div className="max-w-7xl mx-auto space-y-16 pb-32">
            
            {/* Error & Quota Alert */}
            {error && (
              <div className={`p-8 rounded-[2.5rem] border animate-in slide-in-from-top-10 duration-500 ${error.type === 'quota' ? 'bg-yellow-500/5 border-yellow-500/20 text-yellow-500' : 'bg-red-500/5 border-red-500/20 text-red-500'}`}>
                <div className="flex items-center gap-8">
                  <div className={`p-5 rounded-3xl ${error.type === 'quota' ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
                    <AlertTriangle size={40} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-black mb-2 italic uppercase">{isArabic ? 'تنبيه حصة الاستخدام' : 'QUOTA ALERT'}</h4>
                    <p className="text-base font-medium opacity-80 leading-relaxed">{error.message}</p>
                    {error.type === 'quota' && (
                      <div className="mt-8 flex flex-wrap gap-4">
                        <button onClick={openKeySelector} className="px-10 py-4 bg-yellow-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl">
                          {isArabic ? 'تغيير المفتاح الآن' : 'CHANGE KEY NOW'}
                        </button>
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" className="px-10 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center gap-3">
                          <LinkIcon size={16} /> {isArabic ? 'احصل على مفتاح مجاني' : 'GET FREE KEY'}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Key Information Modal-like View */}
            {showKeyInfo && !error && (
              <div className="bg-blue-600/5 border border-blue-500/20 p-10 rounded-[3rem] animate-in fade-in duration-700">
                <div className="flex items-start gap-8">
                  <div className="p-5 bg-blue-500/10 rounded-3xl text-blue-500">
                    <Info size={40} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-white italic">{isArabic ? 'كيف تحصل على مفتاح API؟' : 'How to get an API KEY?'}</h3>
                    <p className="text-slate-400 leading-relaxed">
                      {isArabic 
                        ? 'إذا واجهت مشكلة في التوليد، يمكنك استخدام مفتاحك الخاص من Google AI Studio لضمان عمل السكربت بدون توقف.' 
                        : 'If you face generation issues, use your own key from Google AI Studio to ensure uninterrupted service.'}
                    </p>
                    <button onClick={openKeySelector} className="flex items-center gap-3 text-blue-400 font-black text-sm uppercase tracking-widest hover:underline">
                      {isArabic ? 'افتح قائمة المفاتيح' : 'OPEN KEY MANAGER'} <ChevronLeft size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
              <div className="xl:col-span-4 space-y-12">
                <div className="glass-card rounded-[4rem] p-12 shadow-3xl border border-white/10 relative overflow-hidden group">
                  <div className="space-y-12">
                    <div>
                      <div className="flex items-center justify-between mb-8">
                         <label className="text-[12px] font-black text-blue-400 uppercase tracking-[0.5em]">{isArabic ? 'وصف السكربت الملكي' : 'ROYAL SCOPE'}</label>
                         <Box size={20} className="text-slate-700" />
                      </div>
                      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={isArabic ? 'صف مشروعك القادم بكل تفاصيله لمهندسي bq...' : 'Describe your project in detail...'} className="w-full h-80 bg-black/50 border border-white/5 rounded-[3rem] p-10 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition-all placeholder:text-slate-800 leading-relaxed font-medium" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {Object.values(Framework).map((f) => (
                        <button key={f} onClick={() => setFramework(f)} className={`py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${framework === f ? 'bg-blue-600 text-white shadow-xl' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                          {f}
                        </button>
                      ))}
                    </div>

                    <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim() || !hasPermission} className={`w-full h-28 rounded-[3.5rem] transition-all shadow-2xl relative overflow-hidden group ${!hasPermission ? 'bg-slate-800 opacity-50 cursor-not-allowed' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 hover:scale-[1.03] active:scale-95'}`}>
                      <div className="flex items-center justify-center gap-6 relative">
                        {isGenerating ? <Loader2 className="animate-spin" size={40} /> : <Zap size={40} fill="currentColor" className="text-yellow-400" />}
                        <span className="text-2xl font-black uppercase tracking-[0.3em] text-white italic">{isGenerating ? 'CRAFTING...' : isArabic ? 'توليد ذكاء اصطناعي' : 'GENERATE AI'}</span>
                      </div>
                      {!hasPermission && <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md uppercase tracking-widest text-yellow-500 font-black text-xs">Membership Required</div>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="xl:col-span-8">
                {currentScript ? (
                  <div className="flex flex-col h-full space-y-10 animate-in fade-in duration-1000">
                    <div className="flex items-center justify-between px-6">
                      <div className="flex p-2.5 bg-white/5 rounded-[3rem] border border-white/5">
                        <button onClick={() => setActiveTab('editor')} className={`px-16 py-5 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
                          {isArabic ? 'الأكواد' : 'SOURCE'}
                        </button>
                        <button onClick={() => setActiveTab('store')} className={`px-16 py-5 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest transition-all ${activeTab === 'store' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>
                          {isArabic ? 'الماركت' : 'MARKET'}
                        </button>
                      </div>
                      <button onClick={handleDownloadZip} disabled={isZipping} className="bg-white hover:bg-slate-200 text-slate-950 h-22 px-14 rounded-[3rem] font-black text-[12px] uppercase shadow-2xl transition-all flex items-center gap-5">
                        {isZipping ? <Loader2 className="animate-spin" /> : <Download size={28} />}
                        EXPORT ZIP
                      </button>
                    </div>
                    <div className="flex-1 min-h-[850px] shadow-3xl rounded-[4rem] overflow-hidden">
                      {activeTab === 'editor' ? <ScriptEditor files={currentScript.files} /> : <StoreShowcase marketing={currentScript.marketing!} title={currentScript.title} framework={currentScript.framework} isArabic={isArabic} />}
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-[850px] glass-card border-2 border-dashed border-white/10 rounded-[5rem] flex flex-col items-center justify-center p-20 text-center opacity-30 group relative">
                     <img src={LOGO_URL} className="w-56 h-56 mb-16 grayscale opacity-30 group-hover:opacity-100 transition-all duration-1000" alt="bq" />
                     <h3 className="text-5xl font-black tracking-tighter mb-6 text-white italic uppercase">{isArabic ? 'بانتظار تعليمات الملوك' : 'AWAITING COMMANDS'}</h3>
                     <p className="text-slate-500 max-w-lg mx-auto text-lg leading-relaxed">{isArabic ? 'ارفع من مستوى سيرفرك اليوم باستخدام أقوى نظام ذكاء اصطناعي لبرمجة فايف ام في الوطن العربي.' : 'Elevate your server today with the most powerful AI for FiveM coding in the region.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
