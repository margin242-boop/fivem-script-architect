
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
  LayoutGrid
} from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    const authStatus = localStorage.getItem('bq_auth');
    if (authStatus === 'true') setIsLoggedIn(true);
    
    const savedHistory = localStorage.getItem('bq_script_history_v3');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleLogin = () => {
    localStorage.setItem('bq_auth', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('bq_auth');
    setIsLoggedIn(false);
  };

  const saveToHistory = (script: GeneratedScript) => {
    const newHistory = [script, ...history.filter(h => h.id !== script.id)].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('bq_script_history_v3', JSON.stringify(newHistory));
  };

  const handleGenerate = async () => {
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
      setCurrentScript(script);
      saveToHistory(script);
      setActiveTab('editor');
    } catch (err: any) {
      setError(err.message || 'Error occurred during generation.');
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
      setError(err.message || 'Refactor failed.');
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
    return <DiscordLogin onLogin={handleLogin} isArabic={isArabic} />;
  }

  const t = {
    title: isArabic ? 'نظام bq store العبقري' : 'bq store Genius Architect',
    subtitle: isArabic ? 'ذكاء اصطناعي فاخر لـ FiveM' : 'Premium FiveM AI Suite',
    generateBtn: isArabic ? 'برمجة المشروع' : 'CRAFT PROJECT',
    generating: isArabic ? 'جاري الصياغة...' : 'CRAFTING...',
    history: isArabic ? 'سجل المشاريع' : 'Project History',
    editor: isArabic ? 'كود المبرمج' : 'Source Code',
    showcase: isArabic ? 'واجهة المتجر' : 'Store Preview',
    refactor: isArabic ? 'تطوير ذكي' : 'Smart Evolution'
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#020617] text-slate-100 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Premium Background Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      {/* Header */}
      <header className="h-20 border-b border-white/5 glass sticky top-0 z-[60] flex items-center px-8 shadow-2xl">
        <div className="max-w-[1800px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all" />
              <div className="relative w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                <Cpu className="text-white" size={24} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-black text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded tracking-widest">ELITE ARCHITECT</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">V3.5.2</span>
              </div>
              <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                {t.title}
                <Sparkles size={14} className="text-yellow-400" />
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-black text-xs">U</div>
              <div className="text-[10px] font-black">
                <div className="text-slate-100">PREMIUM USER</div>
                <div className="text-blue-400">ACTIVE SESSION</div>
              </div>
            </div>

            <div className="h-8 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsArabic(!isArabic)} 
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black border border-white/5 transition-all"
              >
                {isArabic ? 'ENGLISH' : 'العربية'}
              </button>
              <button 
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-20'} border-l border-white/5 glass transition-all duration-500 hidden lg:flex flex-col z-50`}>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <History size={16} className="text-blue-400" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em]">{t.history}</h3>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-slate-500 transition-all"
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentScript(item); setActiveTab('editor'); }}
                className={`w-full text-right transition-all group overflow-hidden ${
                  currentScript?.id === item.id 
                  ? 'bg-blue-600 p-[1px] rounded-2xl' 
                  : 'bg-white/5 rounded-2xl hover:bg-white/10'
                }`}
              >
                <div className={`p-4 rounded-[calc(1rem-1px)] bg-[#020617] w-full h-full ${currentScript?.id === item.id ? 'bg-blue-600/10' : ''}`}>
                  {sidebarOpen ? (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-black text-blue-400 uppercase">{item.framework}</span>
                        <ChevronRight size={10} className="text-slate-700" />
                      </div>
                      <h4 className="font-bold text-xs truncate text-slate-200">{item.title}</h4>
                      <div className="mt-2 text-[9px] text-slate-600 font-bold uppercase tracking-wider">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center py-2">
                      <Box size={18} className={currentScript?.id === item.id ? 'text-blue-400' : 'text-slate-600'} />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-10">
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              {/* Controls */}
              <div className="xl:col-span-4 space-y-8">
                <div className="glass rounded-[2.5rem] border border-white/5 p-8 shadow-2xl relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 blur-[80px]" />
                  
                  <div className="relative space-y-8">
                    <div>
                      <label className="flex items-center gap-3 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">
                        <LayoutGrid size={14} />
                        {isArabic ? 'وصف المشروع' : 'Project Definition'}
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={isArabic ? 'صف نظامك المتكامل هنا...' : 'Define your integrated system...'}
                        className="w-full h-48 bg-black/40 border border-white/5 rounded-3xl p-6 text-sm focus:ring-2 focus:ring-blue-500/30 outline-none transition-all resize-none placeholder:text-slate-700 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isArabic ? 'الإطار' : 'Framework'}</label>
                        <select 
                          value={framework}
                          onChange={(e) => setFramework(e.target.value as Framework)}
                          className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-4 text-xs font-black outline-none focus:border-blue-500 transition-all appearance-none text-center cursor-pointer"
                        >
                          {Object.values(Framework).map(f => <option key={f} value={f} className="bg-slate-900">{f}</option>)}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isArabic ? 'يوتيوب' : 'YT Reference'}</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="URL"
                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-4 text-xs font-black outline-none focus:border-blue-500 transition-all"
                          />
                          <Youtube size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" multiple accept="image/*" />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                      >
                        <Plus size={16} />
                        {isArabic ? 'رفع صور UI' : 'Upload UI'}
                      </button>
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full h-20 rounded-3xl bg-blue-600 hover:bg-blue-500 transition-all duration-500 disabled:opacity-50 shadow-2xl shadow-blue-600/30 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <div className="relative flex items-center justify-center gap-4">
                        {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} fill="currentColor" />}
                        <span className="text-base font-black uppercase tracking-[0.2em]">{isGenerating ? t.generating : t.generateBtn}</span>
                      </div>
                    </button>
                  </div>
                </div>

                {currentScript && (
                  <div className="glass rounded-[2.5rem] border border-white/5 p-8 space-y-6">
                    <label className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">
                      <Wrench size={16} />
                      {t.refactor}
                    </label>
                    <textarea 
                      value={refactorPrompt}
                      onChange={(e) => setRefactorPrompt(e.target.value)}
                      placeholder={isArabic ? 'تعديل أو إصلاح خطأ برمجي...' : 'Modify or fix code...'}
                      className="w-full h-32 bg-black/20 border border-white/5 rounded-3xl p-5 text-xs font-medium outline-none focus:ring-1 focus:ring-indigo-500/40 resize-none"
                    />
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleRefactor('fix')}
                        className="flex-1 py-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                      >
                        Patch Bug
                      </button>
                      <button 
                        onClick={() => handleRefactor('evolve')}
                        className="flex-1 py-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                      >
                        Add Feature
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Display Area */}
              <div className="xl:col-span-8 space-y-8">
                {currentScript ? (
                  <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex p-1.5 bg-white/5 rounded-[1.5rem] border border-white/5">
                        <button 
                          onClick={() => setActiveTab('editor')}
                          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          {t.editor}
                        </button>
                        <button 
                          onClick={() => setActiveTab('store')}
                          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'store' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          {t.showcase}
                        </button>
                      </div>

                      <button 
                        onClick={handleDownloadZip}
                        disabled={isZipping}
                        className="flex items-center gap-4 bg-white hover:bg-blue-50 text-slate-950 px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-2xl shadow-white/5"
                      >
                        {isZipping ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                        {isArabic ? 'تصدير الملفات' : 'Export Build'}
                      </button>
                    </div>

                    <div className="flex-1 min-h-[700px]">
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
                  <div className="flex-1 min-h-[700px] glass border-2 border-dashed border-white/10 rounded-[4rem] flex flex-col items-center justify-center p-16 text-center group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-600/20 blur-[60px] rounded-full group-hover:bg-blue-600/40 transition-all duration-700" />
                      <div className="relative w-32 h-32 bg-slate-900/80 rounded-[2.5rem] border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl">
                        <Code2 size={64} className="text-slate-600 group-hover:text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-200 mb-4 tracking-tighter">
                      {isArabic ? 'بانتظار تعليماتك البرمجية' : 'Awaiting Tactical Directives'}
                    </h3>
                    <p className="text-slate-500 text-base max-w-sm leading-relaxed font-semibold">
                      {isArabic ? 'قم بوصف مشروعك وسنقوم ببناء بنية برمجية فاخرة وخالية من الأخطاء' : 'Define your project parameters and we will engineer a high-performance, bug-free codebase.'}
                    </p>
                    <div className="mt-12 flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150" />
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-300" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="h-16 border-t border-white/5 glass px-10 flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
        <div className="flex items-center gap-6">
           <span className="text-blue-500/80">© {new Date().getFullYear()} bq store Elite Systems</span>
           <span className="w-1 h-1 bg-slate-800 rounded-full" />
           <span>Architect V3.5</span>
        </div>
        <div className="flex items-center gap-3 text-emerald-500/50">
           <ShieldCheck size={14} />
           <span className="hidden sm:inline">Authenticated & Secured</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
