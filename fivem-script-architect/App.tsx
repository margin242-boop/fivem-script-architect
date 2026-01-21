
import React, { useState, useEffect, useRef } from 'react';
import { Framework, GeneratedScript } from './types';
import { generateFiveMScript } from './services/geminiService';
import { ScriptEditor } from './components/ScriptEditor';
import { StoreShowcase } from './components/StoreShowcase';
import { StoreNotifications } from './components/StoreNotifications';
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
  ArrowLeft,
  Youtube,
  Store,
  Download,
  Copyright,
  Settings2,
  Plus,
  FileText,
  Trash2,
  Lock,
  UserCheck,
  LogIn,
  LogOut,
  User,
  ExternalLink
} from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userDiscord, setUserDiscord] = useState<{username: string, avatar: string, id: string, roleName: string} | null>(null);
  
  const [prompt, setPrompt] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [framework, setFramework] = useState<Framework>(Framework.QBCORE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [currentScript, setCurrentScript] = useState<GeneratedScript | null>(null);
  const [history, setHistory] = useState<GeneratedScript[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isArabic, setIsArabic] = useState(true);
  
  const [showFixModal, setShowFixModal] = useState(false);
  const [showEvolveModal, setShowEvolveModal] = useState(false);
  const [showStoreView, setShowStoreView] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [updateContext, setUpdateContext] = useState('');
  
  const [refFiles, setRefFiles] = useState<{ name: string; content: string }[]>([]);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<{ data: string; mimeType: string; preview: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants for Auth
  const REQUIRED_ROLE_ID = "1237052416680267786";
  const ROLE_NAME = "عميل متجر BQ";
  const CLIENT_ID = "123456789012345678";

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) handleDiscordAuth(token);
    }

    const savedUser = localStorage.getItem('bq_discord_user');
    if (savedUser) {
      setUserDiscord(JSON.parse(savedUser));
      setIsAuthorized(true);
    }

    const savedHistory = localStorage.getItem('script_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleDiscordAuth = async (token: string) => {
    setIsVerifying(true);
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.id) {
        const userInfo = {
          username: data.username,
          id: data.id,
          avatar: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`,
          roleName: ROLE_NAME
        };
        setUserDiscord(userInfo);
        localStorage.setItem('bq_discord_user', JSON.stringify(userInfo));
        setIsAuthorized(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError("فشل التحقق من الحساب.");
    } finally {
      setIsVerifying(false);
    }
  };

  const loginWithDiscord = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const mockUser = {
        username: "BqUser_" + Math.floor(Math.random() * 999),
        id: "76218392173821",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BqStore",
        roleName: ROLE_NAME
      };
      setUserDiscord(mockUser);
      setIsAuthorized(true);
      setIsVerifying(false);
      localStorage.setItem('bq_discord_user', JSON.stringify(mockUser));
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('bq_discord_user');
    setUserDiscord(null);
    setIsAuthorized(false);
  };

  const handleGenerate = async (mode: 'new' | 'fix' | 'evolve' = 'new') => {
    if (!prompt.trim() && selectedImages.length === 0 && refFiles.length === 0 && mode === 'new') return;
    setError(null);
    setIsGenerating(true);
    try {
      const script = await generateFiveMScript(
        prompt, framework, 
        selectedImages.map(img => ({ data: img.data, mimeType: img.mimeType })),
        (mode !== 'new' ? (currentScript || undefined) : undefined),
        mode,
        (mode !== 'new' ? updateContext : undefined),
        youtubeUrl,
        refFiles
      );
      setCurrentScript(script);
      const newHistory = [script, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('script_history', JSON.stringify(newHistory));
      setShowFixModal(false); setShowEvolveModal(false); setUpdateContext('');
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
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
    } catch (err) { setError("Failed to generate ZIP file."); } finally { setIsZipping(false); }
  };

  const t = {
    title: isArabic ? 'مهندس سكربتات فايف ام' : 'FiveM Script Architect',
    subtitle: isArabic ? 'الإصدار الاحترافي للمطورين - bq store' : 'bq store - Pro Developer Core',
    authTitle: isArabic ? 'بوابة التحقق الذكي' : 'Smart Verification Gate',
    authDesc: isArabic ? 'يجب ربط حسابك للتحقق من امتلاكك لرتبة الدخول المصرحة' : 'Link your Discord to verify authorized role access',
    verifyBtn: isArabic ? 'ربط الحساب والتحقق' : 'Link & Verify Account',
    roleLabel: isArabic ? 'الرتبة المطلوبة:' : 'Required Role:',
    generateBtn: isArabic ? 'إنشاء وبرمجة' : 'BUILD CORE',
    generating: isArabic ? 'جاري البرمجة...' : 'CODING...',
    downloadZip: isArabic ? 'تحميل السكربت (ZIP)' : 'Download (ZIP)',
  };

  if (!isAuthorized) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-[#020617] text-slate-100 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="fixed inset-0 bg-[#5865F2]/5 blur-[120px] pointer-events-none"></div>
        <div className="relative w-full max-w-xl p-12 bg-slate-900/50 backdrop-blur-3xl border border-slate-800 rounded-[3.5rem] shadow-3xl text-center animate-in zoom-in duration-500">
          <div className="w-28 h-28 bg-[#5865F2]/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-[#5865F2]/20 shadow-2xl relative">
             <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#020617] flex items-center justify-center">
                <ShieldCheck size={16} className="text-white" />
             </div>
             <LogIn size={56} className="text-[#5865F2]" />
          </div>
          
          <h2 className="text-4xl font-black mb-3 tracking-tighter uppercase text-white">{t.authTitle}</h2>
          <p className="text-slate-500 text-sm font-bold mb-10 uppercase tracking-widest">{t.authDesc}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 flex items-center gap-4 transition-all hover:border-[#5865F2]/30">
               <div className="p-3 bg-[#5865F2]/10 rounded-2xl text-[#5865F2]">
                  <UserCheck size={24} />
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.roleLabel}</p>
                  <p className="text-sm font-black text-white">{ROLE_NAME}</p>
               </div>
            </div>
            <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 flex items-center gap-4 transition-all hover:border-blue-500/30">
               <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                  <Lock size={24} />
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">ID:</p>
                  <code className="text-[10px] font-mono text-blue-400 font-bold">{REQUIRED_ROLE_ID}</code>
               </div>
            </div>
          </div>

          <button 
            onClick={loginWithDiscord}
            disabled={isVerifying}
            className="w-full py-6 bg-[#5865F2] hover:bg-[#4752C4] text-white font-black rounded-3xl text-xl shadow-[0_0_50px_rgba(88,101,242,0.3)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
          >
             {isVerifying ? <Loader2 className="animate-spin" /> : <LogIn size={28} />}
             {isVerifying ? (isArabic ? 'جاري التحقق من الرتبة...' : 'VERIFYING ROLE...') : t.verifyBtn}
          </button>
          
          <div className="mt-10 pt-10 border-t border-slate-800 flex items-center justify-center gap-6">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <Store size={14} /> bq store
             </div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <ShieldCheck size={14} /> 100% Secure
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-blue-500/30 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-600/10 blur-[120px] pointer-events-none -z-10"></div>
      
      {/* Notifications System */}
      <StoreNotifications isArabic={isArabic} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 shadow-2xl group cursor-pointer">
              <Store className="text-blue-400 group-hover:scale-110 transition-transform" size={32} />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse border-2 border-slate-950"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent tracking-tight uppercase leading-none mb-1">
                {t.title}
              </h1>
              <p className="text-[11px] text-blue-400 font-black uppercase tracking-[0.2em]">
                {t.subtitle}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-2 pr-5 rounded-2xl shadow-xl">
               <div className="text-right">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">{userDiscord?.roleName}</p>
                  <p className="text-sm font-black text-white">{userDiscord?.username}</p>
               </div>
               <div className="relative">
                 <img src={userDiscord?.avatar} className="w-10 h-10 rounded-xl border border-white/10" />
                 <button onClick={handleLogout} className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-lg text-white shadow-lg opacity-0 hover:opacity-100 transition-opacity">
                    <LogOut size={10} />
                 </button>
               </div>
            </div>
            
            <button onClick={() => setIsArabic(!isArabic)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all font-black text-xs">
              {isArabic ? 'EN' : 'AR'}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-[3rem] border border-slate-800 p-10 shadow-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 -z-10 group-hover:scale-110 transition-transform">
               <Code2 size={160} />
            </div>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                 <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">{isArabic ? 'موجه البرمجة الذكي' : 'Smart Prompt Engine'}</h2>
            </div>
            
            <div className="space-y-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isArabic ? 'اشرح ما تريده من السكربت بالتفصيل...' : 'Describe your script requirements...'}
                className="w-full h-40 bg-slate-950/50 border border-slate-800 rounded-[2rem] p-6 text-sm focus:ring-4 focus:ring-blue-500/20 outline-none transition-all resize-none shadow-inner"
              />

              <div className="grid grid-cols-3 gap-3">
                {Object.values(Framework).map((f) => (
                  <button key={f} onClick={() => setFramework(f)} className={`py-4 rounded-2xl text-xs font-black border transition-all ${framework === f ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] scale-105' : 'bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-900'}`}>
                    {f}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleGenerate('new')}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-white text-slate-950 font-black py-6 rounded-[2rem] shadow-2xl transition-all hover:-translate-y-2 active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 flex items-center justify-center gap-4 text-xl"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} fill="currentColor" />}
                <span>{isGenerating ? t.generating : t.generateBtn}</span>
              </button>
            </div>
          </div>
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">{isArabic ? 'تراخيص الوصول' : 'Access Licenses'}</h2>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black rounded-full border border-green-500/20 uppercase tracking-widest">{ROLE_NAME}</span>
             </div>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                   <div className="flex items-center gap-3">
                      <ShieldCheck size={16} className="text-blue-400" />
                      <span className="text-xs font-bold text-slate-300">نظام الذكاء الاصطناعي</span>
                   </div>
                   <span className="text-[10px] font-black text-green-500">نشط</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                   <div className="flex items-center gap-3">
                      <Download size={16} className="text-blue-400" />
                      <span className="text-xs font-bold text-slate-300">تحميل مفتوح (ZIP)</span>
                   </div>
                   <span className="text-[10px] font-black text-green-500">نشط</span>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col min-h-[750px] gap-8">
          {currentScript ? (
            <>
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-3xl flex flex-wrap items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                      <Box size={28} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black text-white leading-tight tracking-tight">{currentScript.title}</h2>
                       <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">{currentScript.framework}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                          <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">bq store official build</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={handleDownloadZip} 
                      className="flex items-center gap-3 bg-white hover:bg-slate-100 text-slate-950 px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-xl active:scale-95 group"
                    >
                      <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                      {t.downloadZip}
                    </button>
                    <button 
                      onClick={() => setShowStoreView(!showStoreView)} 
                      className="p-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all shadow-lg border border-slate-700"
                    >
                      {showStoreView ? <ArrowLeft size={20} /> : <ShoppingBag size={20} />}
                    </button>
                 </div>
              </div>

              {showStoreView ? (
                <StoreShowcase 
                  marketing={currentScript.marketing!} 
                  title={currentScript.title} 
                  framework={currentScript.framework} 
                  isArabic={isArabic} 
                />
              ) : (
                <div className="flex-1 min-h-[500px]">
                  <ScriptEditor files={currentScript.files} />
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-[4rem] flex flex-col items-center justify-center p-20 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-24 h-24 bg-slate-950 rounded-3xl flex items-center justify-center mb-8 border border-slate-800 shadow-3xl transform group-hover:rotate-12 transition-transform">
                <Code2 size={48} className="text-blue-500" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">{isArabic ? 'المختبر البرمجي مفتوح' : 'Coding Lab Ready'}</h3>
              <p className="text-slate-500 max-w-sm text-sm font-bold leading-relaxed">
                مرحباً بك <span className="text-blue-400 font-black">{userDiscord?.username}</span>. أنت الآن داخل بيئة تطوير bq store الاحترافية. قم بوصف فكرتك وسنتكفل بتحويلها لواقع.
              </p>
              <div className="mt-12 flex items-center gap-3 bg-slate-950/80 px-6 py-3 rounded-full border border-slate-800 shadow-xl">
                 <ShieldCheck size={16} className="text-green-500" />
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Authorized via {ROLE_NAME}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 h-24 flex items-center justify-between px-16 text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">
        <div className="flex items-center gap-4">
           <Copyright size={14} />
           <span>{new Date().getFullYear()} BQ STORE ARCHITECT</span>
        </div>
        <div className="flex items-center gap-8">
           <span className="hover:text-blue-400 transition-colors cursor-pointer">Security Portal</span>
           <span className="hover:text-blue-400 transition-colors cursor-pointer">Support</span>
           <div className="bg-blue-600/10 px-3 py-1 rounded-lg border border-blue-500/20 text-blue-400">ROLE_VERIFIED</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
