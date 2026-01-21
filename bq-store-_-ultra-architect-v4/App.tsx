
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
      
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      audio.volume = 0.15;
      audio.play().catch(() => {});

    } catch (err: any) {
      console.error("Generation Error:", err);
      // Generalized error message without exposing specific environment variable names.
      setError(isArabic 
        ? 'فشل الاتصال بالذكاء الاصطناعي. يرجى التأكد من توفر المفتاح وصلاحيته.' 
        : 'AI connection failed. Please ensure the API key is configured correctly.');
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
    generateBtn: isArabic ? 'بدء البرمجة الذكية' : 'START SMART CODE',
    generating: isArabic ? 'جاري الصياغة...' : 'CRAFTING...',
    history: isArabic ? 'الأرشيف الملكي' : 'Royal Archive',
    editor: isArabic ? 'محرر الأكواد' : 'Source Code',
    showcase: isArabic ? 'معرض المتجر' : 'Store Preview'
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#020617] text-slate-100 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <header className="h-24 border-b border-white/5 glass-card sticky top-0 z-[60] flex items-center px-10 shadow-2xl">
        <div className="max-w-[1900px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-40 transition-all duration-700" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[1.8rem] flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden">
                <Cpu className="text-white relative z-10" size={32} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20 tracking-widest">PRIVATE BUILD</span>
              </div>
              <h1 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                {t.title}
                <Sparkles size={18} className="text-yellow-400" />
              </h1>
            </div>
          </div>
          
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
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500">
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
                  : 'bg-white/2 hover:bg-white/5 rounded-[2rem]'
                }`}
              >
                <div className="p-5">
                  {sidebarOpen ? (
                    <>
                      <h4 className="font-bold text-sm truncate text-slate-200">{item.title}</h4>
                      <div className="mt-2 text-[9px] text-slate-600 font-bold uppercase">{item.framework} - {new Date(item.createdAt).toLocaleDateString()}</div>
                    </>
                  ) : <Box size={20} className="mx-auto" />}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-10">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
              <div className="xl:col-span-4 space-y-10">
                <div className="glass-card rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
                  <div className="relative space-y-10">
                    <div>
                      <label className="flex items-center gap-4 text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-6">
                        <LayoutGrid size={16} />
                        {isArabic ? 'مدخلات المشروع' : 'PROJECT INPUTS'}
                      </label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={isArabic ? 'اشرح ما تريده بدقة...' : 'Explain precisely...'}
                        className="w-full h-60 bg-black/40 border border-white/5 rounded-[2.5rem] p-8 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <select 
                        value={framework}
                        onChange={(e) => setFramework(e.target.value as Framework)}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-5 text-xs font-black outline-none"
                      >
                        {Object.values(Framework).map(f => <option key={f} value={f} className="bg-slate-900">{f}</option>)}
                      </select>
                      <input
                        type="text"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="Youtube URL"
                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-5 px-5 text-xs font-black outline-none"
                      />
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full h-24 rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-[1.02] transition-all disabled:opacity-50 shadow-2xl"
                    >
                      <div className="flex items-center justify-center gap-5">
                        {isGenerating ? <Loader2 className="animate-spin" size={28} /> : <Zap size={28} fill="currentColor" />}
                        <span className="text-lg font-black uppercase tracking-[0.2em]">{isGenerating ? t.generating : t.generateBtn}</span>
                      </div>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="glass-card border-red-500/20 bg-red-500/5 rounded-[2.5rem] p-8 flex items-start gap-5 text-red-400">
                    <AlertCircle className="shrink-0 mt-1" size={20} />
                    <div className="space-y-1">
                      <p className="text-sm font-black uppercase">{isArabic ? 'تنبيه أمني/فني' : 'Security Alert'}</p>
                      <p className="text-xs font-bold leading-relaxed">{error}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="xl:col-span-8">
                {currentScript ? (
                  <div className="flex flex-col h-full space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex p-2 bg-white/5 rounded-[2.5rem]">
                        <button 
                          onClick={() => setActiveTab('editor')}
                          className={`px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase ${activeTab === 'editor' ? 'bg-blue-600' : 'text-slate-500'}`}
                        >
                          {t.editor}
                        </button>
                        <button 
                          onClick={() => setActiveTab('store')}
                          className={`px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase ${activeTab === 'store' ? 'bg-blue-600' : 'text-slate-500'}`}
                        >
                          {t.showcase}
                        </button>
                      </div>
                      <button 
                        onClick={handleDownloadZip}
                        disabled={isZipping}
                        className="bg-white text-slate-950 px-12 py-5 rounded-[2.5rem] font-black text-[11px] uppercase shadow-2xl"
                      >
                        {isZipping ? <Loader2 className="animate-spin" /> : <Download size={18} />}
                      </button>
                    </div>
                    {activeTab === 'editor' ? <ScriptEditor files={currentScript.files} /> : <StoreShowcase marketing={currentScript.marketing!} title={currentScript.title} framework={currentScript.framework} isArabic={isArabic} />}
                  </div>
                ) : (
                  <div className="h-full min-h-[600px] glass-card border-2 border-dashed border-white/10 rounded-[6rem] flex flex-col items-center justify-center p-20 text-center opacity-40">
                    <Code2 size={100} className="mb-10 text-slate-700" />
                    <h3 className="text-3xl font-black">{isArabic ? 'بانتظار الأوامر' : 'Awaiting Commands'}</h3>
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
