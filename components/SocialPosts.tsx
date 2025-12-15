import React, { useState } from 'react';
import { generateSocialCalendar } from '../services/geminiService';
import { SocialPost } from '../types';
import { Calendar, Loader2, Share2, Hash, Copy, Check, Sparkles, Target, CalendarDays, AlertTriangle } from 'lucide-react';

const SocialPosts: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleGenerate = async () => {
    if (!niche) return;
    setLoading(true); setPosts([]); setHasError(false);
    try { const calendar = await generateSocialCalendar(niche); if (!calendar || calendar.length === 0) setHasError(true); else setPosts(calendar); } 
    catch (error) { setHasError(true); } 
    finally { setLoading(false); }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8">
      {/* LEFT SIDE: CONFIGURATION (White/Dark) */}
      <div className="w-full xl:w-1/3 space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-black p-8 text-white shadow-xl shadow-gray-200/50 dark:shadow-none isolate group border border-white/5">
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
             <img src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80" alt="Social Media" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-transparent"></div>
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-sm"><CalendarDays className="text-white drop-shadow-md" size={32} /></div>
                <div><h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm font-serif">Social Planner</h2><div className="h-1 w-12 bg-purple-400 rounded-full mt-1"></div></div>
             </div>
             <p className="text-gray-300 font-medium opacity-90 text-sm mt-3 leading-relaxed max-w-xs">Planeje sua semana de conteúdo em segundos.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
             <div className="p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"><Target size={20} /></div>
             <div><h3 className="font-bold text-gray-800 dark:text-white text-lg">Seu Nicho de Mercado</h3><p className="text-xs text-gray-500 dark:text-gray-400">Para quem você quer criar conteúdo?</p></div>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Sparkles size={12}/> Área de Atuação</label>
              <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Ex: Clínica Odontológica" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-500 transition-all outline-none font-semibold text-gray-900 dark:text-white placeholder-gray-400" onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} />
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading || !niche} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-cyan-200 dark:shadow-none hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-2xl"></div>
          {loading ? <Loader2 className="animate-spin" /> : <Calendar className="animate-pulse" />}
          <span className="relative">{loading ? "Planejando Semana..." : "GERAR SEMANA"}</span>
        </button>
      </div>

      {/* RIGHT SIDE: RESULTS GRID (Neutral Stone/Dark) */}
      <div className="w-full xl:w-2/3 bg-stone-100 dark:bg-[#0c0c0c] rounded-3xl p-8 shadow-inner border border-stone-200 dark:border-gray-800 overflow-y-auto custom-scrollbar max-h-[1000px] relative">
         <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `radial-gradient(#78716c 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
             {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-64 flex flex-col gap-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div><div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div><div className="flex-1 space-y-2"><div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full"></div><div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full"></div></div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900 shadow-sm text-center p-8 select-none relative z-10">
            <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-full mb-6"><AlertTriangle size={64} className="text-red-400" /></div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Ops, algo deu errado</h3>
            <button onClick={handleGenerate} className="px-6 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 transition font-bold">Tentar Novamente</button>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10 relative z-10">
            {posts.map((post, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group hover:scale-[1.01] hover:z-10 relative">
                <div className="p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
                  <div><span className="inline-block px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 text-[10px] font-bold uppercase tracking-wider rounded mb-2 shadow-sm">{post.day}</span><h3 className="font-bold text-gray-800 dark:text-white leading-tight text-lg group-hover:text-cyan-600 transition-colors">{post.topic}</h3></div>
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-400 group-hover:text-cyan-500 transition-colors"><Share2 size={18} /></div>
                </div>
                <div className="p-5 flex-1 bg-white dark:bg-gray-800">
                  <div className="relative bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic border border-gray-100 dark:border-gray-600"><span className="absolute top-2 left-2 text-2xl text-gray-300 dark:text-gray-600 font-serif leading-none">“</span>{post.caption}</div>
                </div>
                <div className="p-5 pt-0 mt-auto space-y-4 bg-white dark:bg-gray-800">
                  <div className="flex flex-wrap gap-1.5">{post.hashtags.map((tag, i) => (<span key={i} className="text-[10px] bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 px-2 py-1 rounded-md border border-cyan-100 dark:border-cyan-800 flex items-center font-medium"><Hash size={9} className="mr-0.5 opacity-50" />{tag.replace('#', '')}</span>))}</div>
                  <button onClick={() => copyToClipboard(`${post.topic}\n\n${post.caption}\n\n${post.hashtags.map(t => t.startsWith('#') ? t : '#' + t).join(' ')}`, index)} className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-cyan-50 dark:hover:bg-cyan-900/30 hover:text-cyan-600 hover:border-cyan-200 transition-all active:scale-[0.98]">{copiedIndex === index ? <Check size={16} /> : <Copy size={16} />}{copiedIndex === index ? "Copiado!" : "Copiar Post"}</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[500px] select-none text-center p-8 relative z-10">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-full mb-6 border border-gray-200 dark:border-gray-700"><Calendar size={64} className="text-gray-300 dark:text-gray-600" /></div>
            <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-2">Seu Calendário está vazio</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialPosts;