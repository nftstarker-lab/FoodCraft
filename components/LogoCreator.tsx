
import React, { useState, useRef } from 'react';
import { generateLogo } from '../services/geminiService';
import { PenTool, Loader2, Download, Image as ImageIcon, Sparkles, Layers, Type, Maximize, Move, RotateCw, ZoomIn, RefreshCcw, Lock } from 'lucide-react';
import html2canvas from 'html2canvas';

const NICHES = ['Hamburgueria', 'Pizzaria', 'Marmitaria', 'Pastelaria', 'Cafeteria', 'Culinária Japonesa', 'Churrascaria', 'Padaria Artesanal', 'Peixaria', 'Boteco', 'Sorveteria', 'OUTRO'];
const STYLES = [
  { id: 'simples', label: 'Simples', desc: 'Limpo e direto' },
  { id: 'minimalista', label: 'Minimalista', desc: 'Moderno e sofisticado' },
  { id: 'colorido', label: 'Colorido', desc: 'Vibrante e energético' },
  { id: 'dark', label: 'Dark / Luxo', desc: 'Fundo escuro e elegante' },
  { id: 'mascote', label: 'Com Mascote', desc: 'Personagem ilustrado' },
];

interface LogoCreatorProps {
  userCredits?: number;
  onOpenSubscription?: () => void;
  onConsumeCredit?: (amount: number) => void;
}

const LogoCreator: React.FC<LogoCreatorProps> = ({ userCredits = 0, onOpenSubscription, onConsumeCredit }) => {
  const [brandName, setBrandName] = useState('');
  const [niche, setNiche] = useState(NICHES[0]);
  const [customNiche, setCustomNiche] = useState('');
  const [style, setStyle] = useState(STYLES[0].id);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fine Tuning States
  const [logoScale, setLogoScale] = useState(1);
  const [logoRotation, setLogoRotation] = useState(0);
  const [logoOffsetX, setLogoOffsetX] = useState(0);
  const [logoOffsetY, setLogoOffsetY] = useState(0);

  const logoRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!brandName) return;
    const finalNiche = niche === 'OUTRO' ? customNiche : niche;
    if (!finalNiche) return;
    
    // Credit Check
    if (userCredits < 1 && onOpenSubscription) {
        onOpenSubscription();
        return;
    }

    // Reset adjustments on new generation
    setLogoScale(1);
    setLogoRotation(0);
    setLogoOffsetX(0);
    setLogoOffsetY(0);

    setLoading(true); setResultImage(null);
    try { 
        const image = await generateLogo(brandName, finalNiche, style); 
        setResultImage(image); 
        if (onConsumeCredit) onConsumeCredit(1);
    } 
    catch (error) { alert("Erro ao gerar logotipo."); } 
    finally { setLoading(false); }
  };

  const handleDownload = async () => {
    if (!logoRef.current || !resultImage) return;
    
    try {
      const canvas = await html2canvas(logoRef.current, {
        scale: 3, // High resolution
        backgroundColor: null, 
        logging: false,
        useCORS: true // Important for external images if any
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `${brandName.replace(/\s+/g, '_')}_Logo_Ajustado.png`;
      link.click();
    } catch (error) {
      console.error("Erro ao baixar logo", error);
      alert("Não foi possível processar o download da imagem ajustada.");
    }
  };

  const resetAdjustments = () => {
      setLogoScale(1);
      setLogoRotation(0);
      setLogoOffsetX(0);
      setLogoOffsetY(0);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-8">
      {/* LEFT SIDE: INPUTS (White/Dark) */}
      <div className="w-full xl:w-1/3 space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-black p-8 text-white shadow-xl shadow-gray-200/50 dark:shadow-none isolate group border border-white/5">
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
             <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80" alt="Logo Sketching" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/60 to-transparent"></div>
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-sm"><PenTool className="text-white drop-shadow-md" size={32} /></div>
                <div><h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm font-serif">Brand Logo AI</h2><div className="h-1 w-12 bg-violet-400 rounded-full mt-1"></div></div>
             </div>
             <p className="text-gray-300 font-medium opacity-90 text-sm mt-3 leading-relaxed max-w-xs">Crie logotipos profissionais em segundos.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
             <div className="p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"><Sparkles size={20} /></div>
             <div><h3 className="font-bold text-gray-800 dark:text-white text-lg">Dados da Marca</h3><p className="text-xs text-gray-500 dark:text-gray-400">Defina o conceito visual</p></div>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Type size={12}/> Nome da Empresa</label>
              <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500 transition-all outline-none font-semibold text-gray-900 dark:text-white placeholder-gray-400" placeholder="Ex: Pizzaria Bella" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Layers size={12}/> Nicho de Negócio</label>
              <select value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-400/20 focus:border-violet-500 transition-all outline-none text-gray-900 dark:text-white shadow-sm">
                {NICHES.map(n => <option key={n} value={n} className="text-gray-900">{n}</option>)}
              </select>
              {niche === 'OUTRO' && (
                <input type="text" value={customNiche} onChange={(e) => setCustomNiche(e.target.value)} className="w-full mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-400/20 outline-none text-gray-900 dark:text-white placeholder-gray-400 shadow-sm" placeholder="Digite seu nicho..." />
              )}
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1">Estilo Visual</label>
               <div className="grid grid-cols-2 gap-2">
                  {STYLES.map(s => (
                    <button key={s.id} onClick={() => setStyle(s.id)} className={`p-3 rounded-lg border text-left text-xs transition-all ${style === s.id ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-900 dark:text-violet-200 shadow-sm' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                      <div className="font-bold">{s.label}</div>
                      <div className={`opacity-70 text-[10px] ${style === s.id ? 'text-violet-700 dark:text-violet-300' : 'text-gray-500 dark:text-gray-400'}`}>{s.desc}</div>
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* FINE TUNING SECTION - Only shows if result exists */}
        {resultImage && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in-up">
                <div className="bg-gray-50/50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"><Maximize size={20} /></div>
                        <div><h3 className="font-bold text-gray-800 dark:text-white text-lg">Ajustes Finos</h3><p className="text-xs text-gray-500 dark:text-gray-400">Personalize a posição e tamanho</p></div>
                    </div>
                    <button onClick={resetAdjustments} className="text-xs flex items-center gap-1 text-gray-500 hover:text-violet-500"><RefreshCcw size={12}/> Reset</button>
                </div>
                <div className="p-5 space-y-4">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Tamanho (Escala)</span><span>{Math.round(logoScale * 100)}%</span></div>
                        <div className="flex items-center gap-2">
                            <ZoomIn size={14} className="text-gray-400"/>
                            <input type="range" min="0.1" max="2" step="0.05" value={logoScale} onChange={(e) => setLogoScale(parseFloat(e.target.value))} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-violet-600" />
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Rotação</span><span>{Math.round(logoRotation)}°</span></div>
                        <div className="flex items-center gap-2">
                            <RotateCw size={14} className="text-gray-400"/>
                            <input type="range" min="-180" max="180" step="1" value={logoRotation} onChange={(e) => setLogoRotation(parseFloat(e.target.value))} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-violet-600" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Posição Horizontal (X)</span><span>{logoOffsetX}px</span></div>
                        <div className="flex items-center gap-2">
                            <Move size={14} className="text-gray-400"/>
                            <input type="range" min="-200" max="200" step="5" value={logoOffsetX} onChange={(e) => setLogoOffsetX(parseFloat(e.target.value))} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-violet-600" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Posição Vertical (Y)</span><span>{logoOffsetY}px</span></div>
                        <div className="flex items-center gap-2">
                            <Move size={14} className="text-gray-400 rotate-90"/>
                            <input type="range" min="-200" max="200" step="5" value={logoOffsetY} onChange={(e) => setLogoOffsetY(parseFloat(e.target.value))} className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-violet-600" />
                        </div>
                    </div>
                </div>
            </div>
        )}

        <button onClick={handleGenerate} disabled={loading || !brandName || (niche === 'OUTRO' && !customNiche)} className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-violet-200 dark:shadow-none hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-2xl"></div>
          {loading ? <Loader2 className="animate-spin" /> : userCredits > 0 ? <PenTool size={18} className="animate-pulse" /> : <Lock size={18}/>}
          <span className="relative">
            {loading ? "Desenhando Logo..." : userCredits > 0 ? "Gerar Logotipo" : "Recarregar Créditos"}
          </span>
          {!loading && userCredits > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white shadow-sm border border-white/10 relative">
                -1 Crédito
            </span>
          )}
        </button>
      </div>

      {/* RIGHT SIDE: RESULT (Neutral Stone/Dark) */}
      <div className="w-full xl:w-2/3 bg-stone-100 dark:bg-[#0c0c0c] rounded-3xl p-8 flex flex-col border border-stone-200 dark:border-gray-800 min-h-[600px] shadow-inner relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `linear-gradient(45deg, #78716c 25%, transparent 25%), linear-gradient(-45deg, #78716c 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #78716c 75%), linear-gradient(-45deg, transparent 75%, #78716c 75%)`, backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
         <div className="flex-1 flex items-center justify-center relative z-10">
            {loading ? (
               <div className="flex flex-col items-center gap-4">
                  <div className="relative w-24 h-24"><div className="absolute inset-0 border-4 border-violet-200 rounded-full"></div><div className="absolute inset-0 border-t-4 border-violet-500 rounded-full animate-spin"></div><PenTool className="absolute inset-0 m-auto text-violet-400" size={32} /></div>
                  <p className="text-violet-500 font-bold animate-pulse">Criando conceito visual...</p>
               </div>
            ) : resultImage ? (
               <div className="flex flex-col items-center gap-6 animate-fade-in-up w-full max-w-xl">
                  {/* Container for the logo - Captured by html2canvas */}
                  <div ref={logoRef} className="bg-transparent p-8 w-full aspect-square flex items-center justify-center relative overflow-hidden">
                      <img 
                        src={resultImage} 
                        alt="Logo Gerado" 
                        className="max-w-full max-h-full object-contain drop-shadow-sm transition-transform duration-200"
                        style={{
                            transform: `translate(${logoOffsetX}px, ${logoOffsetY}px) rotate(${logoRotation}deg) scale(${logoScale})`
                        }}
                      />
                  </div>
                  
                  {/* Visual wrapper to show the white box context (not captured) */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[-1]">
                      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 w-full max-w-xl aspect-square"></div>
                  </div>

                  <button onClick={handleDownload} className="flex items-center gap-2 px-8 py-4 bg-violet-600 text-white rounded-xl shadow-lg shadow-violet-200 hover:bg-violet-700 transition font-bold transform hover:-translate-y-1">
                      <Download size={20} /> Baixar Logo Editada
                  </button>
               </div>
            ) : (
               <div className="text-center text-gray-400 dark:text-gray-600 select-none max-w-md">
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-full inline-block mb-6 shadow-sm border border-gray-200 dark:border-gray-700"><ImageIcon size={64} className="text-gray-300 dark:text-gray-500" /></div>
                  <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-2">Seu Logo Aparece Aqui</h3>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default LogoCreator;
