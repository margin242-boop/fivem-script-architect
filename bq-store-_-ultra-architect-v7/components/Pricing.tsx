
import React from 'react';
import { Crown, Check, Zap, Shield, Star, Sparkles, ExternalLink, ShieldCheck, Gem } from 'lucide-react';

interface PricingProps {
  isArabic: boolean;
  onJoin: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ isArabic, onJoin }) => {
  const plans = [
    {
      name: isArabic ? 'العضوية الذهبية' : 'Gold Membership',
      price: isArabic ? '99 SAR' : '$29',
      period: isArabic ? '/ شهر' : '/ Mo',
      features: [
        isArabic ? 'توليد سكربتات غير محدود' : 'Unlimited Generations',
        isArabic ? 'دعم QBCore & ESX' : 'QBCore & ESX Support',
        isArabic ? 'تصدير بصيغة ZIP مشفر' : 'Encrypted ZIP Export',
        isArabic ? 'دعم فني سريع (تكت)' : 'Priority Support'
      ],
      color: 'blue',
      highlight: false,
      icon: <Gem className="text-blue-400" size={32} />
    },
    {
      name: isArabic ? 'العضوية الملكية' : 'Royal Membership',
      price: isArabic ? '799 SAR' : '$199',
      period: isArabic ? '/ سنة' : '/ Yr',
      features: [
        isArabic ? 'توفير بنسبة 35% سنوياً' : 'Save 35% Annually',
        isArabic ? 'سكربتات حصرية للنخبة' : 'Elite Exclusive Scripts',
        isArabic ? 'دخول مبكر للميزات (BETA)' : 'Early Access (BETA)',
        isArabic ? 'رتبة ملكية + شعار ذهبي' : 'Royal Discord Badge',
        isArabic ? 'دعم خاص 24/7 (VIP)' : 'Personal 24/7 VIP Support'
      ],
      color: 'yellow',
      highlight: true,
      icon: <Crown className="text-yellow-500" size={40} />
    }
  ];

  return (
    <div className="space-y-24 py-10">
      <div className="text-center space-y-6">
        <div className="flex justify-center mb-8 relative">
           <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full" />
           <div className="relative bg-gradient-to-br from-yellow-500/20 to-transparent p-6 rounded-[2.5rem] border border-yellow-500/20 shadow-2xl animate-bounce">
             <Crown size={56} className="text-yellow-500 drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]" />
           </div>
        </div>
        <h2 className="text-7xl font-black tracking-tighter text-white uppercase italic drop-shadow-2xl">
          {isArabic ? 'بوابتك لعالم النخبة' : 'ENTER THE ELITE REALM'}
        </h2>
        <p className="text-slate-500 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
          {isArabic 
            ? 'انضم إلى نخبة مبرمجي فايف ام واستمتع بقوة الذكاء الاصطناعي الكاملة من متجر bq store، حيث تلتقي الفخامة بالبرمجة.' 
            : 'Join the elite FiveM developers and unleash the full power of bq store AI, where luxury meets code.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <div key={i} className={`relative group luxury-transition ${plan.highlight ? 'scale-105' : 'hover:scale-105'}`}>
            {plan.highlight && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-yellow-400 text-slate-950 px-12 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(234,179,8,0.4)] z-20">
                {isArabic ? 'اختيار الملوك' : 'ROYAL CHOICE'}
              </div>
            )}
            
            <div className={`h-full glass-card rounded-[5rem] p-20 border-2 transition-all duration-1000 relative overflow-hidden flex flex-col ${plan.highlight ? 'border-yellow-500/40 shadow-[0_0_100px_rgba(234,179,8,0.1)]' : 'border-white/5 hover:border-blue-500/40'}`}>
              <div className={`absolute top-0 right-0 w-80 h-80 blur-[120px] opacity-10 transition-all duration-1000 group-hover:opacity-40 ${plan.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
              
              <div className="relative mb-16 flex justify-between items-start">
                <div>
                  <h3 className={`text-sm font-black uppercase tracking-[0.5em] mb-6 ${plan.color === 'yellow' ? 'text-yellow-500' : 'text-blue-400'}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-7xl font-black text-white tracking-tighter">{plan.price}</span>
                    <span className="text-slate-500 text-lg font-black uppercase tracking-widest">{plan.period}</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-3xl border border-white/10 group-hover:rotate-12 transition-transform duration-700">
                  {plan.icon}
                </div>
              </div>

              <div className="space-y-8 mb-20 flex-1">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-6 group/item">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${plan.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-400'} group-hover/item:scale-125 shadow-lg`}>
                      <Check size={20} strokeWidth={4} />
                    </div>
                    <span className="text-base font-black text-slate-300 group-hover/item:text-white transition-colors tracking-wide">{feature}</span>
                  </div>
                ))}
              </div>

              <button onClick={onJoin} className={`w-full py-9 rounded-[3rem] font-black text-sm uppercase tracking-[0.4em] transition-all shadow-3xl relative overflow-hidden group/btn ${plan.highlight ? 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 text-slate-950 hover:scale-[1.02]' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:scale-[1.02]'}`}>
                <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-1000" />
                <span className="relative flex items-center justify-center gap-5 italic">
                  {isArabic ? 'انضم الآن للنخبة' : 'CLAIM YOUR CROWN'}
                  <ExternalLink size={24} />
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto glass-card rounded-[4rem] p-16 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-12 group">
         <div className="flex items-center gap-10">
            <div className="w-24 h-24 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:rotate-[360deg] transition-all duration-1000 shadow-2xl">
              <ShieldCheck size={48} />
            </div>
            <div>
               <h4 className="text-2xl font-black text-white mb-2 italic">{isArabic ? 'ضمان bq store المعتمد' : 'BQ CERTIFIED SECURITY'}</h4>
               <p className="text-slate-500 text-sm tracking-widest uppercase font-bold">{isArabic ? 'نظامنا البرمجي مشفر ومحمي تماماً ضد التسريب والعبث.' : 'Our software system is encrypted and fully protected.'}</p>
            </div>
         </div>
         <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3 text-yellow-500">
               {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
            </div>
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Loved by 10,000+ Elite Devs</span>
         </div>
      </div>
    </div>
  );
};
