
import React, { useState, useRef } from 'react';
import { enhanceFoodPhoto } from '../services/geminiService';
import { Camera, Loader2, Download, Image as ImageIcon, Upload, RefreshCw, Wand2, ChefHat, Lock } from 'lucide-react';

const STYLES = [
  { id: 'Professional Studio', label: 'Estúdio Profissional', desc: 'Luz perfeita, fundo infinito, foco total', color: 'bg-gray-800 text-white' },
  { id: 'Rustic Wood Table', label: 'Mesa Rústica', desc: 'Madeira, luz natural, aconchegante', color: 'bg-amber-700 text-white' },
  { id: 'Vibrant Advertising', label: 'Publicidade Pop', desc: 'Cores vivas, contraste alto, moderno', color: 'bg-pink-600 text-white' },
  { id: 'Dark & Moody', label: 'Dark Gourmet', desc: 'Fundo escuro, dramático, elegante', color: 'bg-slate-900 text-white' },
  { id: 'Morning Light', label: 'Luz da Manhã', desc: 'Suave, arejado, brilho do sol', color: 'bg-orange-400 text-white' }
];

interface PhotoStudioProps {
  userCredits?: number;
  onOpenSubscription?: () => void;
  onConsumeCredit?: (amount: number) => void;
}

const PhotoStudio: React.FC<PhotoStudioProps> = ({ userCredits = 0, onOpenSubscription, onConsumeCredit }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setSelectedFile(reader.result as string); setGeneratedUrl(null); };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;
    
    // Credit Check
    if (userCredits < 1 && onOpenSubscription) {
        onOpenSubscription();
        return;
    }

    setLoading(true);
    setGeneratedUrl(null);
    try { 
        const url = await enhanceFoodPhoto(selectedFile, selectedStyle); 
        setGeneratedUrl(url); 
        if (onConsumeCredit) onConsumeCredit(1);
    } 
    catch (error) { alert("Erro ao aprimorar a foto."); } 
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8">
      {/* LEFT SIDE: CONTROLS (White/Dark) */}
      <div className="w-full xl:w-1/3 space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-black p-8 text-white shadow-xl shadow-gray-200/50 dark:shadow-none isolate group border border-white/5">
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
             <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80" alt="Photography Studio Setup" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-transparent"></div>
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-sm"><Camera className="text-white drop-shadow-md" size={32} /></div>
                <div><h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm font-serif">Estúdio IA</h2><div className="h-1 w-12 bg-indigo-400 rounded-full mt-1"></div></div>
             </div>
             <p className="text-gray-300 font-medium opacity-90 text-sm mt-3 leading-relaxed max-w-xs">Transforme fotos de celular em publicidade profissional.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
             <div className="p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"><Upload size={20} /></div>
             <div><h3 className="font-bold text-gray-800 dark:text-white text-lg">Sua Foto Original</h3><p className="text-xs text-gray-500 dark:text-gray-400">Envie a foto do prato, lanche ou bebida</p></div>
          </div>
          <div className="p-5">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
            {!selectedFile ? (
              <button onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex flex-col items-center justify-center text-gray-400 gap-3 group">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm group-hover:scale-110 transition-transform"><Upload size={24} className="text-gray-400" /></div>
                <p className="font-medium text-gray-600 dark:text-gray-300">Clique para enviar foto</p>
              </button>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 group shadow-sm">
                <img src={selectedFile} alt="Original" className="w-full h-48 object-cover opacity-90 group-hover:opacity-60 transition-opacity" />
                <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 flex items-center justify-center text-white font-medium gap-2 bg-black/30"><RefreshCw size={20} /> Trocar Foto</button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
             <div className="p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"><Wand2 size={20} /></div>
             <div><h3 className="font-bold text-gray-800 dark:text-white text-lg">Estilo da Fotografia</h3><p className="text-xs text-gray-500 dark:text-gray-400">Como você quer a nova imagem?</p></div>
          </div>
          <div className="p-5 grid grid-cols-1 gap-3">
            {STYLES.map(style => (
              <button key={style.id} onClick={() => setSelectedStyle(style.id)} className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group ${selectedStyle === style.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-200 shadow-sm' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                <div><div className={`font-bold text-sm`}>{style.label}</div><div className={`text-xs ${selectedStyle === style.id ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-400'}`}>{style.desc}</div></div>
                <div className={`w-4 h-4 rounded-full border ${selectedStyle === style.id ? 'bg-indigo-500 border-indigo-500' : 'bg-transparent border-gray-300 dark:border-gray-500'}`}></div>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleEnhance} disabled={loading || !selectedFile} className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-200 dark:shadow-none hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-2xl"></div>
          {loading ? <Loader2 className="animate-spin" /> : userCredits > 0 ? <Wand2 size={18} className="animate-pulse" /> : <Lock size={18} />}
          <span className="relative">
             {loading ? "Renderizando..." : userCredits > 0 ? "Transformar Foto" : "Recarregar Créditos"}
          </span>
          {!loading && userCredits > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white shadow-sm border border-white/10 relative">
                -1 Crédito
            </span>
          )}
        </button>
      </div>

      {/* RIGHT SIDE: RESULT (Neutral Grey Studio) */}
      <div className="w-full xl:w-2/3 bg-gray-100 dark:bg-[#0c0c0c] rounded-3xl border border-gray-200 dark:border-gray-800 p-8 flex flex-col relative min-h-[600px] shadow-inner overflow-hidden">
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `linear-gradient(#9ca3af 1px, transparent 1px), linear-gradient(90deg, #9ca3af 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
        <div className="flex-1 flex flex-col md:flex-row gap-6 items-center justify-center h-full relative z-10">
            {selectedFile && generatedUrl && (
               <div className="absolute top-0 left-0 z-10 bg-white p-1.5 rounded-lg shadow-lg rotate-[-2deg] w-32 border border-gray-200">
                  <p className="text-[10px] font-bold text-center mb-1 text-gray-900 uppercase tracking-widest">Original</p>
                  <img src={selectedFile} className="w-full h-auto rounded grayscale opacity-80" alt="Original" />
               </div>
            )}
            {loading ? (
               <div className="flex flex-col items-center justify-center gap-6">
                 <div className="relative w-32 h-32">
                   <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
                   <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                   <ChefHat className="absolute inset-0 m-auto text-indigo-400 animate-bounce" size={40} />
                 </div>
                 <div className="text-center space-y-2"><h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">O Chef IA está trabalhando</h3><p className="text-gray-500 dark:text-gray-400">Ajustando iluminação, empratamento e cenário...</p></div>
               </div>
            ) : generatedUrl ? (
              <div className="relative group w-full max-w-2xl animate-fade-in-up">
                 <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-200">
                    <img src={generatedUrl} alt="Enhanced" className="w-full h-auto rounded-lg shadow-sm" />
                    <div className="flex justify-between items-center mt-4 px-2">
                      <div><p className="font-bold text-gray-800">Resultado Profissional</p><p className="text-xs text-gray-500">Gerado com Gemini 3 Pro Image</p></div>
                      <a href={generatedUrl} download="foto_profissional_bizboost.png" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl shadow-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition"><Download size={18} /> Baixar</a>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 max-w-md select-none">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-full inline-block mb-6 shadow-sm border border-gray-200 dark:border-gray-700"><ImageIcon size={64} className="text-gray-300 dark:text-gray-500" /></div>
                <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-2">Darkroom Vazio</h3>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PhotoStudio;
