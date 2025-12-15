
import React, { useState } from 'react';
import { BrandInput, BrandIdentity } from '../types';
import { generateBrandIdentity } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';
import { ResultsDisplay } from './ResultsDisplay';
import { Wand2, AlertCircle, Sparkles, Type, Target, FileText, Lightbulb } from 'lucide-react';

const BrandIdentityCreator: React.FC = () => {
  const [input, setInput] = useState<BrandInput>({ brandName: '', industry: '', description: '', toneExamples: '' });
  const [result, setResult] = useState<BrandIdentity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.brandName || !input.industry || !input.description) { setError("Preencha campos obrigatórios."); return; }
    setLoading(true); setError(null); setResult(null);
    try { const data = await generateBrandIdentity(input); setResult(data); } 
    catch (err) { setError("Erro ao gerar identidade."); } 
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8">
      {/* LEFT SIDE: INPUTS (White/Dark) */}
      <div className="w-full xl:w-1/3 space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-black p-8 text-white shadow-xl shadow-gray-200/50 dark:shadow-none isolate group border border-white/5">
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
             <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80" alt="Brand Strategy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-transparent"></div>
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-sm"><Wand2 className="text-white drop-shadow-md" size={32} /></div>
                <div><h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm font-serif">Identidade Verbal</h2><div className="h-1 w-12 bg-amber-400 rounded-full mt-1"></div></div>
             </div>
             <p className="text-gray-300 font-medium opacity-90 text-sm mt-3 leading-relaxed max-w-xs">Crie a alma e a voz da sua marca.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
             <div className="p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"><Sparkles size={20} /></div>
             <div><h3 className="font-bold text-gray-800 dark:text-white text-lg">Definição da Marca</h3><p className="text-xs text-gray-500 dark:text-gray-400">Quem você é e como quer falar</p></div>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Type size={12}/> Nome da Marca</label>
              <input type="text" value={input.brandName} onChange={(e) => setInput({ ...input, brandName: e.target.value })} placeholder="Ex: Burger King" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-400/20 focus:border-amber-500 transition-all outline-none font-semibold text-gray-900 dark:text-white placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Target size={12}/> Nicho de Mercado</label>
              <input type="text" value={input.industry} onChange={(e) => setInput({ ...input, industry: e.target.value })} placeholder="Ex: Fast Food" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-400/20 focus:border-amber-500 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><FileText size={12}/> O que sua empresa faz?</label>
              <textarea value={input.description} onChange={(e) => setInput({ ...input, description: e.target.value })} placeholder="Descrição..." rows={3} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-400/20 focus:border-amber-500 transition-all outline-none text-sm text-gray-900 dark:text-white resize-none placeholder-gray-400" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Lightbulb size={12}/> Estilo e Inspirações</label>
              <textarea value={input.toneExamples} onChange={(e) => setInput({ ...input, toneExamples: e.target.value })} placeholder="Ex: 'Jovem e despojado'..." rows={3} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-400/20 focus:border-amber-500 transition-all outline-none text-sm text-gray-900 dark:text-white resize-none placeholder-gray-400" />
            </div>
            {error && (<div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 text-sm flex items-start gap-2"><AlertCircle size={16} className="mt-0.5 shrink-0" />{error}</div>)}
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-amber-200 dark:shadow-none hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-2xl"></div>
          {loading ? <LoadingSpinner message="Criando a alma da sua marca..." /> : <Wand2 className="animate-pulse" />}
          <span className="relative">{loading ? 'Gerando...' : 'GERAR IDENTIDADE'}</span>
        </button>
      </div>

      {/* RIGHT SIDE: RESULTS (Neutral Stone/Dark) */}
      <div className="w-full xl:w-2/3 bg-stone-100 dark:bg-[#0c0c0c] rounded-3xl border border-stone-200 dark:border-gray-800 p-8 min-h-[600px] shadow-inner overflow-y-auto custom-scrollbar relative">
         <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `linear-gradient(90deg, #78716c 1px, transparent 1px), linear-gradient(#78716c 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
         {loading ? (
            <div className="flex flex-col items-center justify-center h-full relative z-10"><LoadingSpinner message="Analisando essência..." /><p className="text-gray-500 dark:text-gray-400 mt-4 text-sm font-medium">Isso pode levar alguns segundos.</p></div>
         ) : result ? (
            <div className="relative z-10"><ResultsDisplay data={result} /></div>
         ) : (
            <div className="flex flex-col items-center justify-center h-full relative z-10 text-center p-8 select-none text-gray-400 dark:text-gray-600">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-full mb-6 border border-gray-200 dark:border-gray-700"><Wand2 size={64} className="opacity-30" /></div>
                <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-2">Aguardando Dados</h3>
            </div>
         )}
      </div>
    </div>
  );
};

export default BrandIdentityCreator;
