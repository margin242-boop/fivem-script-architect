
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
  AlertCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
  const [refactorPrompt, setRefactorPrompt] = useState('');
  const [selectedImages, setSelectedImages] = useState<{ data: string; mimeType: string; preview: string }[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = localStorage.getItem('bq_elite_auth_v2');
    if (auth) {
      const parsed = JSON.parse(auth);
      setIsLoggedIn(true);
      setUserData(parsed);
    }
    
    const savedHistory = localStorage.getItem('bq_elite_history_v5');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleLoginSuccess = (data: any) => {
    localStorage.setItem('bq_elite_auth_v2', JSON.stringify(data));
    setUserData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bq_elite_auth_v2');
    setIsLoggedIn(false);
    setUserData(null);
  };

  const saveToHistory = (script: GeneratedScript) => {
    const newHistory = [script, ...history.filter(h => h.id !== script.id)].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('bq_elite_history_v5', JSON.stringify(newHistory));
  };

  const handleGenerate = async () => {
    // التأكد من أن الزر لا يُضغط إذا كان الوصف فارغاً
    if (!prompt.trim() && selectedImages.length === 0) return;
    
    setError(null);
    setIsGenerating(true);
    
    try {
      const script = await generateFiveMScript(
        prompt, 
        framework, 
        selectedImages.map(img => ({ data: img.data, mimeType: img.mimeType })),
        undefined,
        'new',
        undefined,
        youtubeUrl
      );
      
      if (!script || !script.files || script.files.length === 0) {
        throw new Error('AI returned an empty response.');
      }

      setCurrentScript(script);
      saveToHistory(script);
      setActiveTab('editor');
      
      // صوت نجاح
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      audio.volume = 0.15;
      audio.play().catch(() => {});

    } catch (err: any) {
      console.error("Critical AI Error:", err);
      // معالجة الخطأ بشكل مفصل للمستخدم
      if (err.message?.includes('API_KEY')) {
        setError(isArabic 
          ? 'خطأ: مفتاح الـ API مفقود في إعدادات Vercel.' 
          : 'Error: API_KEY is missing in Vercel settings.');
      } else {
        setError(isArabic 
          ? 'فشل الاتصال بالذكاء الاصطناعي. قد يكون هناك ضغط على الخادم، حاول مرة أخرى.' 
          : 'AI Connection failed. Server might be busy, please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefactor = async (mode: 'fix' | 'evolve') => {
    if (!currentScript || !refactorPrompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const updatedScript = await generateFiveMScript(
        currentScript.description,
        currentScript.framework,
        [],
        currentScript,
        mode,
        refactorPrompt
      );
      setCurrentScript(updatedScript);
      saveToHistory(updatedScript);
      setRefactorPrompt('');
    } catch (err: any) {
      setError(err.message || 'Evolution Failed.');
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
      a.download = `${currentScript.title.replace(/\s+/g, '_')}_bq_elite.zip`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) { setError("ZIP Error."); } finally { setIsZipping(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSelectedImages(prev => [...prev, { data: base64String, mimeType: file.type, preview: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  };

  if (!isLoggedIn) {
    return <DiscordLogin onLoginSuccess={handleLoginSuccess} isArabic={isArabic} />;
  }

  const t = {
    title: isArabic ? 'نظام bq store الفاخر' : 'bq store Elite Architect',
    subtitle: isArabic ? 'برمجية FiveM النخبوية' : 'Elite FiveM Engineering',
    generateBtn: isArabic ? 'بدء البرمجة الذكية' : 'START SMART CODE',
    generating: isArabic ? 'جاري الصياغة...' : 'CRAFTING...',
    history: isArabic ? 'الأرشيف الملكي' : 'Royal Archive',
    editor: isArabic ? 'محرر الأكواد' : 'Source Code',
    showcase: isArabic ? 'معرض المتجر' : 'Store Preview',
    refactor: isArabic ? 'تطوير المشروع' : 'Project Evolution'
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#020617] text-slate-100 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="fixed inset-0 pointer-events-none opacity-25 z-0">
        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse-slow delay-1000" />
      </div>

      <header className="h-24 border-b border-white/5 glass-card sticky top-0 z-[60] flex items-center px-10 shadow-2xl">
        <div className="max-w-[1900px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[1.8rem] flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
                <Cpu className="text-white relative z-10" size={32} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20 tracking-widest">PRIVATE BUILD</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">v4.5</span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                {t.title}
                <Sparkles size={18} className="text-yellow-400" />
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden xl:flex items-center gap-5 px-6 py-3 bg-white/5 rounded-2xl border border-white/5 shadow-xl">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-md opacity-20" />
                {userData?.avatar ? (
                  <img src={userData.avatar} className="w-10 h-10 rounded-full border border-white/10 relative z-10" alt="" />
                ) : (
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center font-black text-blue-400 border border-white/10 relative z-10 uppercase">
                    {userData?.username?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div className="text-[11px] font-black">
                <div className="text-slate-100 tracking-wider uppercase truncate max-w-[120px]">{userData?.username || 'DEVELOPER'}</div>
                <div className="text-emerald-500 flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  AUTHENTICATED
                </div>
              </div>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsArabic(!isArabic)} 
                className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-black border border-white/5 transition-all shadow-xl uppercase tracking-widest"
              >
                {isArabic ? 'ENGLISH' : 'العربية'}
              </button>
              <button 
                onClick={handleLogout}
                className="p-3.5 rounded-2xl bg-red-500/5 hover:bg-red-500/15 text-red-500 border border-red-500/10 transition-all shadow-xl"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        <aside className={`${sidebarOpen ? 'w-80' : 'w-24'} border-l border-white/5 glass-card transition-all duration-700 hidden lg:flex flex-col z-50`}>
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-4">
                <History size={18} className="text-blue-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">{t.history}</h3>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 transition-all"
            >
              {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentScript(item); setActiveTab('editor'); }}
                className={`w-full text-right transition-all group overflow-hidden ${
                  currentScript?.id === item.id 
                  ? 'bg-blue-600/10 border-blue-500/40 p-[1px] rounded-[2rem] border shadow-2xl' 
                  : 'bg-white/2 hover:bg-white/5 rounded-[2rem] border border-transparent'
                }`}
              >
                <div className="p-5 w-full h-full">
                  {sidebarOpen ? (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[9px] font-black text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded uppercase tracking-widest">{item.framework}</span>
                        <ChevronRight size={12} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <h4 className="font-bold text-sm truncate text-slate-200 group-hover:text-blue-400 transition-colors">{item.title}</h4>
                      <div className="mt-3 text-[9px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Bell size={10} />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center py-3">
                      <Box size={22} className={currentScript?.id === item.id ? 'text-blue-400 shadow-xl' : 'text-slate-700'} />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-10 lg:p-14">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
              <div className="xl:col-span-4 space-y-10">
                <div className="glass-card rounded-[3.5rem] border border-white/5 p-10 shadow-2xl relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[100px]" />
                  
                  <div className="relative space-y-10">
                    <div>
                      <label className="flex items-center gap-4 text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-6">
                        <LayoutGrid size={16} />
                        {isArabic ? 'مدخلات المشروع' : 'PROJECT INPUTS'}
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={isArabic ? 'اشرح ما تريده بدقة... مثال: سكربت ميكانيكي متطور مع نظام قطع غيار' : 'Explain precisely... e.g. Advanced Mechanic script with spare parts system'}
                        className="w-full h-60 bg-black/40 border border-white/5 rounded-[2.5rem] p-8 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none placeholder:text-slate-700 font-medium leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isArabic ? 'الإطار' : 'Engine'}</label>
                        <select 
                          value={framework}
                          onChange={(e) => setFramework(e.target.value as Framework)}
                          className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-5 text-xs font-black outline-none focus:border-blue-500 transition-all appearance-none text-center cursor-pointer hover:bg-black/60 shadow-xl"
                        >
                          {Object.values(Framework).map(f => <option key={f} value={f} className="bg-slate-900">{f}</option>)}
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isArabic ? 'يوتيوب' : 'Video Ref'}</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="URL"
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 pl-12 pr-5 text-xs font-black outline-none focus:border-blue-500 transition-all shadow-xl"
                          />
                          <Youtube size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" multiple accept="image/*" />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-5 rounded-[2rem] bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl"
                      >
                        <Plus size={18} />
                        {isArabic ? 'صور الواجهة' : 'UI Reference'}
                      </button>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full h-24 rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-600 bg-[length:200%_auto] hover:bg-right transition-all duration-700 disabled:opacity-50 shadow-[0_20px_60px_rgba(59,130,246,0.3)] group relative overflow-hidden active:scale-[0.98]"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex items-center justify-center gap-5">
                        {isGenerating ? <Loader2 className="animate-spin" size={28} /> : <Zap size={28} fill="currentColor" className="text-white animate-pulse" />}
                        <span className="text-lg font-black uppercase tracking-[0.2em]">{isGenerating ? t.generating : t.generateBtn}</span>
                      </div>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="glass-card border-red-500/20 bg-red-500/5 rounded-[2.5rem] p-8 flex items-start gap-5 text-red-400 animate-in slide-in-from-top-4 duration-500">
                    <AlertCircle className="shrink-0 mt-1" size={20} />
                    <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-widest">{isArabic ? 'تنبيه أمني/فني' : 'Security/Technical Alert'}</p>
                      <p className="text-xs font-bold leading-relaxed opacity-80">{error}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="xl:col-span-8 space-y-10">
                {currentScript ? (
                  <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex p-2 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-3xl">
                        <button 
                          onClick={() => setActiveTab('editor')}
                          className={`px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          {t.editor}
                        </button>
                        <button 
                          onClick={() => setActiveTab('store')}
                          className={`px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'store' ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          {t.showcase}
                        </button>
                      </div>

                      <button 
                        onClick={handleDownloadZip}
                        disabled={isZipping}
                        className="flex items-center gap-5 bg-white hover:bg-blue-50 text-slate-950 px-12 py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-2xl group"
                      >
                        {isZipping ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} className="group-hover:-translate-y-1 transition-transform" />}
                        {isArabic ? 'تصدير الملفات' : 'EXPORT BUILD'}
                      </button>
                    </div>

                    <div className="flex-1 min-h-[800px]">
                      {activeTab === 'editor' ? (
                        <ScriptEditor files={currentScript.files} />
                      ) : (
                        <StoreShowcase 
                          marketing={currentScript.marketing!} 
                          title={currentScript.title} 
                          framework={currentScript.framework} 
                          isArabic={isArabic} 
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-h-[800px] glass-card border-2 border-dashed border-white/10 rounded-[6rem] flex flex-col items-center justify-center p-20 text-center group">
                    <div className="relative mb-16">
                      <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/40 transition-all duration-1000 scale-150" />
                      <div className="relative w-48 h-48 bg-slate-900/80 rounded-[4.5rem] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl">
                        <Code2 size={100} className="text-slate-700 group-hover:text-blue-500 transition-colors duration-500" />
                      </div>
                    </div>
                    <h3 className="text-5xl font-black text-slate-100 mb-6 tracking-tighter gradient-text">
                      {isArabic ? 'بانتظار تعليمات المهندس' : 'Awaiting Tactical Directives'}
                    </h3>
                    <p className="text-slate-500 text-xl max-w-lg leading-relaxed font-bold tracking-tight opacity-80">
                      {isArabic ? 'نظام bq store جاهز لبناء مشروعك القادم بدقة متناهية وسرعة خيالية.' : 'The bq store system is primed to architect your next high-tier project with surgical precision.'}
                    </p>
                    <div className="mt-20 flex gap-8">
                      {[0, 150, 300, 450].map(delay => (
                        <div key={delay} className="w-4 h-4 rounded-full bg-blue-600/30 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="h-20 border-t border-white/5 glass-card px-12 flex items-center justify-between text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] relative z-[70]">
        <div className="flex items-center gap-10">
           <span className="text-blue-500 hover:text-blue-400 transition-colors cursor-pointer">© {new Date().getFullYear()} bq store Elite Architect</span>
           <span className="w-2 h-2 bg-slate-800 rounded-full" />
           <span className="flex items-center gap-2"><Cpu size={14} /> CLOUD COMPUTE ACTIVE</span>
        </div>
        <div className="flex items-center gap-4 text-emerald-500/60">
           <ShieldCheck size={20} className="animate-pulse" />
           <span className="hidden sm:inline">HIGH-SECURITY PROTOCOL ENABLED</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
