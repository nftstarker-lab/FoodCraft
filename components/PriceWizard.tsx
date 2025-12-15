
import React, { useState } from 'react';
import { generatePricingStrategy } from '../services/geminiService';
import { PricingInput, PricingStrategy } from '../types';
import { Calculator, Loader2, DollarSign, TrendingUp, ShoppingBag, Lightbulb, PieChart, Info } from 'lucide-react';

const PriceWizard: React.FC = () => {
  const [input, setInput] = useState<PricingInput>({ productName: '', ingredientsCost: 0, operationalCost: 0, desiredMargin: 30 });
  const [result, setResult] = useState<PricingStrategy | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    if (!input.productName || input.ingredientsCost <= 0) return;
    setLoading(true);
    try { const strategy = await generatePricingStrategy(input); setResult(strategy); } 
    catch (error) { alert("Erro ao calcular preços."); } 
    finally { setLoading(false); }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="p-6 max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8">
      {/* LEFT SIDE: INPUTS (White/Dark) */}
      <div className="w-full xl:w-1/3 space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-black p-8 text-white shadow-xl shadow-gray-200/50 dark:shadow-none isolate group border border-white/5">
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
             <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80" alt="Finance" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-transparent"></div>
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-sm"><Calculator className="text-white drop-shadow-md" size={32} /></div>
                <div><h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm font-serif">Otimizador de Preços</h2><div className="h-1 w-12 bg-lime-400 rounded-full mt-1"></div></div>
             </div>
             <p className="text-gray-300 font-medium opacity-90 text-sm mt-3 leading-relaxed max-w-xs">Calcule o preço ideal e maximize seus lucros.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
             <div className="p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"><DollarSign size={20} /></div>
             <div><h3 className="font-bold text-gray-800 dark:text-white text-lg">Custos & Metas</h3><p className="text-xs text-gray-500 dark:text-gray-400">Preencha os dados do seu produto</p></div>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1">Nome do Produto</label>
              <input type="text" value={input.productName} onChange={(e) => setInput({ ...input, productName: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-500 transition-all outline-none font-semibold text-gray-900 dark:text-white placeholder-gray-400" placeholder="Ex: X-Bacon" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1">Custo Ingredientes</label>
                <input type="number" value={input.ingredientsCost || ''} onChange={(e) => setInput({ ...input, ingredientsCost: parseFloat(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-500 transition-all outline-none font-mono text-gray-900 dark:text-white placeholder-gray-400 shadow-sm" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1">Gasto Operacional</label>
                <input type="number" value={input.operationalCost || ''} onChange={(e) => setInput({ ...input, operationalCost: parseFloat(e.target.value) })} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-500 transition-all outline-none font-mono text-gray-900 dark:text-white placeholder-gray-400 shadow-sm" placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center"><label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1">Margem de Lucro Desejada</label><span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded text-sm shadow-sm border border-emerald-100 dark:border-emerald-900/50">{input.desiredMargin}%</span></div>
              <input type="range" min="10" max="300" step="5" value={input.desiredMargin} onChange={(e) => setInput({ ...input, desiredMargin: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
          </div>
        </div>

        <button onClick={handleCalculate} disabled={loading || !input.productName || !input.ingredientsCost} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 dark:shadow-none hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-2xl"></div>
          {loading ? <Loader2 className="animate-spin" /> : <TrendingUp className="animate-pulse" />}
          <span className="relative">{loading ? "Calculando..." : "CALCULAR & OTIMIZAR"}</span>
        </button>
      </div>

      {/* RIGHT SIDE: RESULTS (Neutral Stone/Dark) */}
      <div className="w-full xl:w-2/3 bg-stone-100 dark:bg-[#0c0c0c] rounded-3xl p-8 border border-stone-200 dark:border-gray-800 min-h-[500px] shadow-inner relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.4]" style={{backgroundImage: `linear-gradient(#78716c 1px, transparent 1px), linear-gradient(90deg, #78716c 1px, transparent 1px)`, backgroundSize: '30px 30px'}}></div>
         {result ? (
            <div className="space-y-6 animate-fade-in-up relative z-10">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full -mr-16 -mt-16 z-0 blur-3xl"></div>
                 <div className="relative z-10 flex-1">
                    <h3 className="text-emerald-600 dark:text-emerald-400 font-medium mb-1 uppercase tracking-wider text-xs">Preço de Venda Ideal</h3>
                    <div className="text-6xl font-black text-gray-900 dark:text-white tracking-tight">{formatCurrency(result.idealPrice)}</div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Baseado em custos de {formatCurrency(input.ingredientsCost + input.operationalCost)} e margem de {input.desiredMargin}%</p>
                 </div>
                 <div className="relative z-10 bg-emerald-600 text-white p-6 rounded-2xl min-w-[200px] text-center shadow-lg shadow-emerald-200 dark:shadow-none">
                    <p className="text-emerald-100 text-xs font-medium mb-1 uppercase tracking-wide">Lucro Líquido Real</p>
                    <p className="text-3xl font-bold">{formatCurrency(result.netProfit)}</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Lightbulb size={20} /></div><h4 className="font-bold text-gray-800 dark:text-white">Estratégia de Venda</h4></div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{result.strategy}</p>
                 </div>
                 <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg"><PieChart size={20} /></div><h4 className="font-bold text-gray-800 dark:text-white">Composição do Preço</h4></div>
                    <div className="space-y-4">
                       <div className="space-y-1"><div className="flex justify-between text-xs text-gray-500 dark:text-gray-400"><span>Ingredientes</span><span>{formatCurrency(input.ingredientsCost)}</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden"><div className="bg-gray-400 dark:bg-gray-500 h-full" style={{ width: `${(input.ingredientsCost/result.idealPrice)*100}%` }}></div></div></div>
                       <div className="space-y-1"><div className="flex justify-between text-xs text-gray-500 dark:text-gray-400"><span>Operacional</span><span>{formatCurrency(input.operationalCost)}</span></div><div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden"><div className="bg-gray-500 dark:bg-gray-600 h-full" style={{ width: `${(input.operationalCost/result.idealPrice)*100}%` }}></div></div></div>
                       <div className="space-y-1"><div className="flex justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400"><span>Lucro</span><span>{formatCurrency(result.netProfit)}</span></div><div className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full h-1.5 overflow-hidden"><div className="bg-emerald-500 h-full" style={{ width: `${input.desiredMargin > 100 ? 100 : input.desiredMargin}%` }}></div></div></div>
                    </div>
                 </div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                 <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg"><ShoppingBag size={20} /></div><h4 className="font-bold text-gray-800 dark:text-white">Sugestões de Combos Lucrativos</h4></div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.combos.map((combo, idx) => (
                       <div key={idx} className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 p-4 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors">
                          <div className="text-orange-500 dark:text-orange-400 font-bold text-lg mb-2 opacity-50 font-mono">0{idx+1}</div>
                          <p className="text-gray-700 dark:text-gray-300 font-medium text-sm leading-snug">{combo}</p>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] select-none text-gray-400 dark:text-gray-600 relative z-10">
               <div className="bg-white dark:bg-gray-800 p-6 rounded-full mb-6 border border-gray-200 dark:border-gray-700"><Calculator size={64} className="opacity-30" /></div>
               <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-2">Aguardando Cálculo</h3>
            </div>
         )}
      </div>
    </div>
  );
};

export default PriceWizard;