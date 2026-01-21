
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
  UserCheck
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
  const [activeTab, setActiveTab] = useState<'editor' | 'store' | 'pricing'>('editor');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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

  const sendToWebhook = async (script: GeneratedScript) => {
    if (!userData) return;
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `<@${userData.id}> 👑 **تم توليد تحفة برمجية جديدة من قبل النخبة!**`,
          embeds: [{
            title: `👑 bq store | Royal Generation Log`,
            description: `تم استدعاء المهندس الذكي لتوليد سكربت جديد للعميل الملكي: **${userData.username}**`,
            color: 0xFB8C00, // لون ذهبي ملكي
            thumbnail: { url: LOGO_URL },
            author: {
              name: userData.username,
              icon_url: userData.avatar || LOGO_URL
            },
            fields: [
              { name: "📜 اسم السكربت", value: `\`\`\`${script.title}\`\`\``, inline: false },
              { name: "🛠️ نظام العمل", value: `\`${script.framework}\``, inline: true },
              { name: "👤 العميل", value: `<@${userData.id}>`, inline: true },
              { name: "📦 عدد الملفات", value: `\`${script.files.length} ملفات\``, inline: true },
              { name: "📝 تفاصيل الطلب", value: `\`\`\`${prompt.substring(0, 1000)}${prompt.length > 1000 ? '...' : ''}\`\`\`` },
            ],
            footer: { text: "BQ STORE ELITE SYSTEM | Luxury Architecture", icon_url: LOGO_URL },
            timestamp: new Date().toISOString()
          }]
        })
      });
    } catch (e) { console.error("Webhook Error", e); }
  };

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
      setError(isArabic ? 'فشل النظام الملكي في التوليد. يرجى مراجعة اشتراكك.' : 'Royal Generation failed. Check subscription.');
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
      a.download = `${currentScript.title.replace(/\s+/g, '_')}_bq_store_elite.zip`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) { setError("ZIP Export Error."); } finally { setIsZipping(false); }
  };

  if (!isLoggedIn) return <DiscordLogin onLoginSuccess={handleLoginSuccess} isArabic={isArabic} />;

  const t = {
    title: isArabic ? 'نظام bq store الملكي' : 'bq store Royal Architect',
    generateBtn: isArabic ? 'توليد ذكاء اصطناعي' : 'GENERATE AI',
    pricing: isArabic ? 'الاشتراكات الملكية' : 'Royal Subscriptions',
    copyright: isArabic ? 'جميع الحقوق محفوظة لمتجر bq store © 2025' : 'All rights reserved to bq store © 2025'
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#020617] text-slate-100 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header Premium */}
      <header className="h-28 border-b border-white/5 glass-card sticky top-0 z-[60] flex items-center px-12 shadow-[0_10px_50px_rgba(0,0,0,0.6)]">
        <div className="max-w-[1900px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('editor')}>
              <div className="absolute inset-[-15px] bg-blue-500/10 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-[#0a0f1e] to-[#111827] rounded-[2rem] flex items-center justify-center border border-white/10 shadow-2xl luxury-transition group-hover:rotate-[360deg] group-hover:scale-110">
                <img src={LOGO_URL} className="w-14 h-14 object-contain" alt="bq" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20 tracking-[0.4em] uppercase">
                   bq store elite v7.0
                </span>
                <span className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-4 py-1.5 rounded-full border border-yellow-500/20 tracking-[0.4em] uppercase flex items-center gap-2">
                   <Crown size={12} /> Royal Membership
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter flex items-center gap-4 text-white drop-shadow-lg">
                {t.title}
                <Activity size={20} className="text-blue-500 animate-pulse" />
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <nav className="hidden xl:flex items-center gap-3 p-2 bg-white/5 rounded-[2.5rem] border border-white/5">
              <button onClick={() => setActiveTab('editor')} className={`px-10 py-3.5 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <Terminal size={16} className="inline-block mr-2" /> {isArabic ? 'المبرمج' : 'Architect'}
              </button>
              <button onClick={() => setActiveTab('pricing')} className={`px-10 py-3.5 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'pricing' ? 'bg-yellow-600 text-white shadow-xl shadow-yellow-600/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                <CreditCard size={16} className="inline-block mr-2" /> {isArabic ? 'العضوية' : 'Membership'}
              </button>
            </nav>

            <div className="flex items-center gap-6 pl-8 border-l border-white/10">
               <div className="text-right">
                  <span className="block text-xs font-black text-white uppercase tracking-[0.1em]">{userData?.username}</span>
                  <span className="block text-[9px] font-black text-yellow-500 uppercase tracking-widest flex items-center justify-end gap-1">
                    <UserCheck size={10} /> {hasPermission ? 'Elite Member' : 'Guest'}
                  </span>
               </div>
               <img src={userData?.avatar || LOGO_URL} className="w-14 h-14 rounded-2xl border-2 border-white/10 shadow-2xl hover:scale-110 transition-transform duration-500" alt="User" />
               <button onClick={handleLogout} className="p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/20 text-red-500 border border-red-500/10 transition-all">
                <LogOut size={20} />
               </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Luxury */}
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
                   <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all ${currentScript?.id === item.id ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-slate-800/50 text-slate-500 group-hover:text-slate-300'}`}>
                      <Code2 size={26} />
                   </div>
                  {sidebarOpen && (
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm truncate text-white group-hover:text-blue-400 transition-colors">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[8px] text-blue-400 font-black uppercase tracking-widest">{item.framework}</span>
                         <div className="w-1 h-1 rounded-full bg-slate-700" />
                         <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Royal Gen</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-12 relative bg-[radial-gradient(circle_at_center,_#0a0f1e_0%,_#020617_100%)]">
          {activeTab === 'pricing' ? (
            <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
               <Pricing isArabic={isArabic} onJoin={() => window.open(DISCORD_LINK)} />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-16 pb-32">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
                <div className="xl:col-span-4 space-y-12">
                  <div className="glass-card rounded-[4rem] p-12 shadow-2xl border border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[100px] group-hover:bg-blue-500/15 transition-all duration-1000" />
                    <div className="space-y-12">
                      <div>
                        <div className="flex items-center justify-between mb-8">
                           <label className="text-[12px] font-black text-blue-400 uppercase tracking-[0.5em]">{isArabic ? 'وصف السكربت الملكي' : 'ROYAL SCOPE'}</label>
                           <Box size={20} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={isArabic ? 'صف مشروعك القادم بكل تفاصيله...' : 'Describe your next project...'} className="w-full h-80 bg-black/50 border border-white/5 rounded-[3rem] p-10 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition-all placeholder:text-slate-800 leading-relaxed font-medium" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {Object.values(Framework).map((f) => (
                          <button key={f} onClick={() => setFramework(f)} className={`py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${framework === f ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                            {f}
                          </button>
                        ))}
                      </div>

                      <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim() || !hasPermission} className={`w-full h-28 rounded-[3.5rem] transition-all shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group ${!hasPermission ? 'bg-slate-800 opacity-50 cursor-not-allowed' : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 hover:scale-[1.03] active:scale-95'}`}>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                        <div className="flex items-center justify-center gap-6 relative">
                          {isGenerating ? <Loader2 className="animate-spin" size={40} /> : <Zap size={40} fill="currentColor" className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />}
                          <span className="text-2xl font-black uppercase tracking-[0.3em] text-white italic">{isGenerating ? 'CRAFTING...' : t.generateBtn}</span>
                        </div>
                        {!hasPermission && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md">
                            <div className="text-center">
                              <Crown className="mx-auto mb-2 text-yellow-500" size={24} />
                              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">{isArabic ? 'يتطلب عضوية ملكية' : 'Membership Required'}</span>
                            </div>
                          </div>
                        )}
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
                        <button onClick={handleDownloadZip} disabled={isZipping} className="bg-white hover:bg-slate-200 text-slate-950 h-22 px-14 rounded-[3rem] font-black text-[12px] uppercase shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all flex items-center gap-5 hover:scale-105 active:scale-95">
                          {isZipping ? <Loader2 className="animate-spin" /> : <Download size={28} />}
                          EXPORT ZIP
                        </button>
                      </div>
                      <div className="flex-1 min-h-[850px] shadow-[0_50px_120px_rgba(0,0,0,0.7)] rounded-[4rem] overflow-hidden">
                        {activeTab === 'editor' ? <ScriptEditor files={currentScript.files} /> : <StoreShowcase marketing={currentScript.marketing!} title={currentScript.title} framework={currentScript.framework} isArabic={isArabic} />}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full min-h-[850px] glass-card border-2 border-dashed border-white/10 rounded-[5rem] flex flex-col items-center justify-center p-20 text-center opacity-30 group relative">
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.05)_0%,_transparent_70%)] rounded-[5rem]" />
                       <div className="relative w-56 h-56 mb-16 grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-30 group-hover:opacity-100 hover:scale-110">
                         <img src={LOGO_URL} className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(59,130,246,0.2)]" alt="bq" />
                       </div>
                       <h3 className="text-5xl font-black tracking-tighter mb-6 text-white italic">{isArabic ? 'بانتظار تعليمات النخبة' : 'AWAITING ELITE COMMANDS'}</h3>
                       <p className="text-slate-500 max-w-lg mx-auto text-base leading-relaxed font-medium">{isArabic ? 'نظام bq store جاهز لتحويل أفكارك إلى أكواد فاخرة مشفرة وبأعلى أداء ممكن.' : 'BQ store system is ready to transform your ideas into luxury encrypted codes with peak performance.'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <footer className="absolute bottom-0 left-0 right-0 h-28 flex items-center justify-between px-20 border-t border-white/5 bg-[#020617]/98 backdrop-blur-3xl z-40">
             <div className="flex items-center gap-14">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-[0.5em]">{t.copyright}</span>
                <div className="flex items-center gap-4 text-emerald-500/60 font-black text-[9px] uppercase tracking-widest">
                  <CheckCircle2 size={12} /> Server Encrypted
                </div>
             </div>
             <div className="flex items-center gap-12">
                <div className="flex items-center gap-5 px-8 py-3.5 bg-white/2 rounded-2xl border border-white/5">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational</span>
                </div>
                <div className="h-12 w-[1px] bg-white/10" />
                <a href={DISCORD_LINK} target="_blank" className="flex items-center gap-10 group no-underline">
                  <span className="text-[11px] font-black text-slate-600 group-hover:text-blue-500 uppercase tracking-[0.6em] transition-colors">JOIN OUR DISCORD</span>
                  <img src={LOGO_URL} className="w-12 h-12 object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="bq" />
                </a>
             </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
