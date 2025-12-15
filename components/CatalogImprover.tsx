import React, { useState } from 'react';
import { improveCatalogDescription } from '../services/geminiService';
import { Wand2, Loader2, Copy, Check, Rocket, Tag, FileText, Search, Sparkles, Star } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CatalogImprover: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [currentDesc, setCurrentDesc] = useState('');
  const [improvedDesc, setImprovedDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleImprove = async () => {
    if (!productName) return;
    setLoading(true);
    setImprovedDesc('');
    try {
      const result = await improveCatalogDescription(productName, currentDesc);
      setImprovedDesc(result);
    } catch (error) { alert("Erro ao melhorar descrição."); } 
    finally { setLoading(false); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(improvedDesc);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8 font-modern">
      {/* LEFT SIDE: INPUTS (White/Dark) */}
      <div className="w-full xl:w-1/3 space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-black p-8 text-white shadow-xl shadow-gray-200/50 dark:shadow-none isolate group border border-white/5">
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
             <img src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80" alt="Digital Catalog" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-transparent"></div>
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-sm"><Rocket className="text-white drop-shadow-md" size={32} /></div>
                <div><h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm font-serif">Catálogo Turbo</h2><div className="h-1 w-12 bg-pink-400 rounded-full mt-1"></div></div>
             </div>
             <p className="text-gray-300 font-medium opacity-90 text-sm mt-3 leading-relaxed max-w-xs">Transforme descrições simples em textos de vendas irresistíveis.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
             <div className="p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"><Search size={20} /></div>
             <div><h3 className="font-bold text-gray-800 dark:text-white text-lg">Dados do Produto</h3><p className="text-xs text-gray-500 dark:text-gray-400">Informações para a IA analisar</p></div>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Tag size={12}/> Nome do Produto</label>
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none font-semibold text-gray-900 dark:text-white placeholder-gray-400" placeholder="Ex: Tênis de Corrida Ultra X200" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><FileText size={12}/> Descrição Atual</label>
              <textarea value={currentDesc} onChange={(e) => setCurrentDesc(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none text-sm text-gray-900 dark:text-white h-40 resize-none placeholder-gray-400" placeholder="Cole aqui a descrição atual..." />
            </div>
          </div>
        </div>

        <button onClick={handleImprove} disabled={loading || !productName} className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-pink-200 dark:shadow-none hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-2xl"></div>
          {loading ? <Loader2 className="animate-spin" /> : <Wand2 className="animate-pulse" />}
          <span className="relative">{loading ? "Otimizando..." : "TURINAR DESCRIÇÃO"}</span>
        </button>
      </div>

      {/* RIGHT SIDE: RESULT (Neutral Stone/Dark) */}
      <div className="w-full xl:w-2/3 bg-stone-100 dark:bg-[#0c0c0c] rounded-3xl border border-stone-200 dark:border-gray-800 p-8 min-h-[600px] flex flex-col relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `radial-gradient(#78716c 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
          <div className={`relative z-10 bg-white dark:bg-gray-800 rounded-xl shadow-xl transition-all duration-500 transform ${improvedDesc ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-50'}`}>
             <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg text-green-600 dark:text-green-400"><Sparkles size={18} /></div>
                    <span className="font-bold text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wide">Documento Otimizado</span>
                </div>
                {improvedDesc && (
                    <button onClick={copyToClipboard} className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 hover:border-green-200 transition-all">
                        {copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "COPIADO" : "COPIAR"}
                    </button>
                )}
             </div>
             <div className="p-10 min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
                        <Loader2 className="animate-spin text-pink-500" size={40} />
                        <p className="font-medium animate-pulse">Reescrevendo com persuasão...</p>
                    </div>
                ) : improvedDesc ? (
                    <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                        <ReactMarkdown components={{
                                h1: ({node, ...props}) => <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6 mt-2 pb-4 border-b border-gray-100 dark:border-gray-700" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 mt-8 flex items-center gap-2" {...props}><Star size={18} className="text-amber-400 fill-amber-400" />{props.children}</h2>,
                                p: ({node, ...props}) => <p className="text-gray-600 dark:text-gray-300 mb-4 leading-7" {...props} />,
                                ul: ({node, ...props}) => <ul className="space-y-2 mb-6 bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-50 dark:border-blue-900/30" {...props} />,
                                li: ({node, ...props}) => <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300"><span className="mt-2 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" /><span className="flex-1">{props.children}</span></li>,
                                strong: ({node, ...props}) => <strong className="font-extrabold text-gray-900 dark:text-white bg-yellow-100/50 dark:bg-yellow-900/30 px-1 rounded-sm" {...props} />
                            }}>{improvedDesc}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-300 dark:text-gray-600 select-none">
                        <FileText size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-gray-400 dark:text-gray-500">Aguardando Conteúdo</h3>
                    </div>
                )}
             </div>
          </div>
      </div>
    </div>
  );
};

export default CatalogImprover;