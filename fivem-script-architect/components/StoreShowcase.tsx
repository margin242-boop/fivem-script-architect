
import React from 'react';
import { ScriptMarketing, Framework } from '../types';
import { ShoppingBag, Star, ShieldCheck, Zap, Layers, Copy, Check, Store } from 'lucide-react';

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

📝 **Description:**
${marketing.fullDescription}

🚀 **Key Features:**
${marketing.keyFeatures.map(f => `• ${f}`).join('\n')}

🛡️ *Optimized & Secure*
Copyright (c) bq store. All rights reserved.
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
      {/* Banner */}
      <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-700 to-slate-900 relative flex items-center px-8">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
             <Store size={14} className="text-blue-400" />
             <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">bq store</span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">{title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-blue-200 border border-white/10">
              {framework}
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />)}
            </div>
          </div>
        </div>
        <div className="ml-auto relative z-10 bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-2xl">
          <ShoppingBag className="text-white" size={32} />
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Short Header */}
        <div>
          <h3 className="text-blue-400 text-xs font-black uppercase tracking-widest mb-2">
            {isArabic ? 'وصف مختصر - bq store' : 'bq store - One Liner'}
          </h3>
          <p className="text-xl font-bold text-slate-100 leading-tight">
            {marketing.shortDescription}
          </p>
        </div>

        {/* Full Description */}
        <div className="space-y-4">
          <h3 className="text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-800 pb-2">
            {isArabic ? 'وصف المنتج الكامل' : 'Full Store Description'}
          </h3>
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
            {marketing.fullDescription}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketing.keyFeatures.map((feature, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:border-blue-500/30 transition-colors">
              <div className="mt-1 p-1 bg-blue-500/10 rounded-lg text-blue-400">
                <Zap size={14} fill="currentColor" />
              </div>
              <span className="text-sm font-bold text-slate-200">{feature}</span>
            </div>
          ))}
        </div>

        {/* Quality Badges */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-800">
          {[
            { icon: <ShieldCheck size={12} />, label: isArabic ? 'حقوق bq store' : 'bq store Official' },
            { icon: <Zap size={12} />, label: isArabic ? 'أداء ممتاز' : 'Optimized' },
            { icon: <Layers size={12} />, label: isArabic ? 'سهل التركيب' : 'Easy Setup' }
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 text-[10px] font-black uppercase text-slate-400">
              {badge.icon}
              {badge.label}
            </div>
          ))}
        </div>

        {/* Copy Button */}
        <button 
          onClick={copyToClipboard}
          className="w-full py-4 bg-slate-100 hover:bg-white text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          {isArabic ? 'نسخ الوصف الكامل للمتجر' : 'COPY FULL LISTING'}
        </button>
      </div>
    </div>
  );
};
