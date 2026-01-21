
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

📝 **الوصف الكامل:**
${marketing.fullDescription}

🚀 **المميزات:**
${marketing.keyFeatures.map(f => `• ${f}`).join('\n')}

🛡️ *Optimized & Secure by bq store AI*
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500 h-full flex flex-col">
      {/* Premium Header/Banner */}
      <div className="h-56 bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-950 relative flex items-center px-12 overflow-hidden shrink-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
        
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
             <div className="p-1.5 bg-yellow-400 rounded-lg text-slate-950">
               <Crown size={14} fill="currentColor" />
             </div>
             <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.5em]">PREMIUM LISTING</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter drop-shadow-2xl">{title}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="bg-blue-500/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-blue-300 border border-blue-500/30 uppercase tracking-widest">
              {framework} Framework
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />)}
            </div>
          </div>
        </div>
        
        <div className="ml-auto relative z-10">
           <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[2rem] border border-white/20 shadow-2xl flex items-center justify-center rotate-12 hover:rotate-0 transition-transform duration-500">
             <ShoppingBag className="text-white" size={48} />
           </div>
        </div>
      </div>

      <div className="p-12 space-y-12 overflow-y-auto custom-scrollbar flex-1 bg-slate-900/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="group">
              <h3 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Store size={14} />
                {isArabic ? 'العنوان التسويقي' : 'Store Headline'}
              </h3>
              <p className="text-2xl font-black text-slate-100 leading-tight group-hover:text-blue-50 transition-colors">
                {marketing.shortDescription}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] pb-2 border-b border-white/5">
                {isArabic ? 'وصف المنتج الكامل' : 'Full Store Description'}
              </h3>
              <div className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {marketing.fullDescription}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div>
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                {isArabic ? 'المميزات الرئيسية' : 'Core Features'}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {marketing.keyFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 bg-black/30 border border-white/5 rounded-3xl hover:border-blue-500/40 hover:bg-black/50 transition-all duration-300">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 shadow-lg">
                      <Zap size={16} fill="currentColor" />
                    </div>
                    <span className="text-sm font-bold text-slate-200 tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { icon: <ShieldCheck size={14} />, label: isArabic ? 'حقوق bq store' : 'bq store Official' },
                { icon: <Zap size={14} />, label: isArabic ? 'أداء ممتاز' : 'Optimized' },
                { icon: <Layers size={14} />, label: isArabic ? 'سهل التركيب' : 'Easy Setup' }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 text-[10px] font-black uppercase text-slate-400 border border-white/5">
                  <span className="text-blue-500">{badge.icon}</span>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-8">
          <button 
            onClick={copyToClipboard}
            className="w-full relative group py-6 bg-white hover:bg-blue-50 text-slate-950 font-black rounded-3xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            {copied ? <Check size={24} className="text-green-600" /> : <Copy size={24} />}
            <span className="text-sm uppercase tracking-[0.2em]">{isArabic ? 'نسخ الوصف الكامل للمتجر' : 'COPY STORE LISTING'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
