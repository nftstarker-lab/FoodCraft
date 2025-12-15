import React, { useState } from 'react';
import { generatePromotion } from '../services/geminiService';
import { Megaphone, Loader2, Copy, Check, MessageCircle, ShoppingBag, Clock, Percent, AlertCircle } from 'lucide-react';

const PromotionGenerator: React.FC = () => {
  const [product, setProduct] = useState('');
  const [occasion, setOccasion] = useState('');
  const [discount, setDiscount] = useState('');
  const [rules, setRules] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!occasion || !discount || !product) return;
    setLoading(true);
    try { const text = await generatePromotion(product, occasion, discount, rules); setResult(text); } 
    catch (error) { alert("Erro ao gerar promoção."); } 
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8">
      {/* LEFT SIDE: INPUTS (White/Dark) */}
      <div className="w-full xl:w-1/3 space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-black p-8 text-white shadow-xl shadow-gray-200/50 dark:shadow-none isolate group border border-white/5">
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
             <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80" alt="Sale" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-transparent"></div>
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-sm"><Megaphone className="text-white drop-shadow-md" size={32} /></div>
                <div><h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm font-serif">Promoções IA</h2><div className="h-1 w-12 bg-yellow-400 rounded-full mt-1"></div></div>
             </div>
             <p className="text-gray-300 font-medium opacity-90 text-sm mt-3 leading-relaxed max-w-xs">Textos irresistíveis para WhatsApp e Vendas.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
             <div className="p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"><MessageCircle size={20} /></div>
             <div><h3 className="font-bold text-gray-800 dark:text-white text-lg">Detalhes da Oferta</h3><p className="text-xs text-gray-500 dark:text-gray-400">Quanto mais detalhes, mais vendas</p></div>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><ShoppingBag size={12}/> Produto ou Serviço</label>
              <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Ex: Pizza Grande + Refri" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-400/20 focus:border-green-500 transition-all outline-none font-semibold text-gray-900 dark:text-white placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Clock size={12}/> Ocasião / Motivo</label>
              <input type="text" value={occasion} onChange={(e) => setOccasion(e.target.value)} placeholder="Ex: Black Friday" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-400/20 focus:border-green-500 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Percent size={12}/> A Oferta Irresistível</label>
              <input type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Ex: 50% OFF" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-400/20 focus:border-green-500 transition-all outline-none font-bold text-green-600 dark:text-green-400 placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><AlertCircle size={12}/> Regras / Gatilhos</label>
              <input type="text" value={rules} onChange={(e) => setRules(e.target.value)} placeholder="Ex: Só hoje" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-400/20 focus:border-green-500 transition-all outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400" />
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading || !occasion || !discount || !product} className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-200 dark:shadow-none hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-2xl"></div>
          {loading ? <Loader2 className="animate-spin" /> : <Megaphone className="animate-pulse" />}
          <span className="relative">{loading ? "Escrevendo Copy..." : "GERAR TEXTO VENDEDOR"}</span>
        </button>
      </div>

      {/* RIGHT SIDE: RESULT (Neutral Stone/Dark) */}
      <div className="w-full xl:w-2/3 bg-stone-100 dark:bg-[#0c0c0c] rounded-3xl border border-stone-200 dark:border-gray-800 p-8 min-h-[500px] flex flex-col relative overflow-hidden shadow-inner items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        {loading ? (
           <div className="flex flex-col items-center justify-center gap-4 text-gray-500">
             <div className="relative"><div className="w-16 h-16 border-4 border-green-200 rounded-full animate-pulse"></div><div className="w-16 h-16 border-t-4 border-green-500 rounded-full animate-spin absolute top-0 left-0"></div></div>
             <p className="font-medium text-gray-400">Criando urgência e desejo...</p>
           </div>
        ) : result ? (
          <div className="relative w-full max-w-sm animate-fade-in-up">
            <div className="flex justify-between items-center mb-4 text-gray-500 px-4">
               <span className="text-xs font-bold uppercase tracking-widest">Prévia WhatsApp</span>
               <button onClick={() => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-green-50 transition-all">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "COPIADO!" : "COPIAR"}</button>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
               <div className="bg-gray-100 dark:bg-gray-800 -mx-4 -mt-4 p-3 flex items-center gap-3 mb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">F</div>
                  <div className="text-gray-800 dark:text-white text-sm font-bold">FoodCraft Delivery</div>
               </div>
               {/* WhatsApp Bubble is always light green */}
               <div className="bg-[#dcf8c6] rounded-lg rounded-tl-none p-4 text-gray-800 text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap relative">
                  {result}
                  <div className="absolute top-0 left-0 -ml-2 w-0 h-0 border-t-[10px] border-t-[#dcf8c6] border-l-[10px] border-l-transparent"></div>
                  <div className="flex justify-end mt-1 opacity-70"><span className="text-[10px]">10:45</span></div>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600 select-none">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-full mb-6 border border-gray-200 dark:border-gray-700 shadow-sm"><Megaphone size={64} className="opacity-30" /></div>
            <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">Aguardando Dados</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionGenerator;