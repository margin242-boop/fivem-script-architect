
import React from 'react';
import { ScriptMarketing, Framework } from '../types';
import { ShoppingBag, Star, ShieldCheck, Zap, Layers, Copy, Check, Store, Crown } from 'lucide-react';

interface StoreShowcaseProps {
  marketing: ScriptMarketing;
  title: string;
  framework: Framework;
  isArabic: boolean;
}

export const StoreShowcase: React.FC<StoreShowcaseProps> = ({ marketing, title, framework, isArabic }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    const text = `
🛒 **${title}** [${framework}]
✨ ${marketing.shortDescription}

🚀 **المميزات:**
${marketing.keyFeatures.map(f => `• ${f}`).join('\n')}

🛡️ *Optimized & Secure by bq store*
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl h-full flex flex-col">
      <div className="h-56 bg-gradient-to-br from-blue-800 to-slate-950 relative flex items-center px-12 shrink-0">
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.5em]">PREMIUM bq LISTING</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">{title}</h2>
          <span className="bg-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black text-blue-300 border border-blue-500/30 w-fit uppercase">
            {framework} Framework
          </span>
        </div>
        <div className="ml-auto relative z-10">
           <div className="w-24 h-24 bg-white/5 backdrop-blur-2xl rounded-full border border-white/20 flex items-center justify-center">
             <img src="https://i.imgur.com/T09M98v.png" className="w-16 h-16" alt="bq" />
           </div>
        </div>
      </div>

      <div className="p-12 space-y-12 overflow-y-auto custom-scrollbar flex-1 bg-slate-900/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">{isArabic ? 'وصف bq store' : 'bq store Description'}</h3>
            <p className="text-2xl font-black text-slate-100 leading-tight">{marketing.shortDescription}</p>
            <div className="text-slate-400 text-sm leading-relaxed">{marketing.fullDescription}</div>
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4">
              {marketing.keyFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-black/30 border border-white/5 rounded-3xl">
                  <Zap size={16} className="text-blue-400" fill="currentColor" />
                  <span className="text-sm font-bold text-slate-200">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 text-[10px] font-black text-slate-400 border border-white/5">
                <ShieldCheck size={14} className="text-blue-500" />
                {isArabic ? 'حقوق bq store الرسمية' : 'Official bq store Rights'}
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={copyToClipboard}
          className="w-full py-6 bg-white hover:bg-blue-50 text-slate-950 font-black rounded-3xl flex items-center justify-center gap-4 transition-all shadow-2xl"
        >
          {copied ? <Check size={24} className="text-green-600" /> : <Copy size={24} />}
          <span className="text-sm uppercase tracking-[0.2em]">{isArabic ? 'نسخ وصف bq store' : 'COPY bq LISTING'}</span>
        </button>
      </div>
    </div>
  );
};
