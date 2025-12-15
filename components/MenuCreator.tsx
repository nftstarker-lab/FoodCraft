
import React, { useState, useRef, useEffect } from 'react';
import { generateMenuStructure, generateMenuBackground } from '../services/geminiService';
import { CatalogItem, MenuDesign, UserCategory } from '../types';
import { 
  Plus, Loader2, Trash2, Wand2, Palette, Image as ImageIcon, ImageDown, FileText,
  UtensilsCrossed, Coffee, Pizza, Wine, IceCream, Sandwich, AlignLeft, DollarSign, Type, RefreshCw, Upload, X, Box, Circle, LayoutTemplate, Sparkles,
  Square, Hexagon, Ticket, FolderPlus, Sun, Moon, Maximize, Info, AlignCenter, Columns, ZoomIn, ZoomOut, Edit3, Eye, Lock, MoveVertical
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ART_STYLES = [
  { id: 'MINIMALIST', label: 'Minimalista', desc: 'Mármore e Espaço', color: 'bg-slate-100 text-slate-800' },
  { id: 'CHALKBOARD', label: 'Lousa', desc: 'Giz e Preto', color: 'bg-gray-800 text-white' },
  { id: 'WATERCOLOR', label: 'Aquarela', desc: 'Artes suaves e cor', color: 'bg-pink-100 text-pink-800' },
  { id: 'DARK_LUXURY', label: 'Luxo Dark', desc: 'Ouro e Preto', color: 'bg-black text-amber-400' },
  { id: 'RUSTIC_KRAFT', label: 'Rústico', desc: 'Papel Kraft', color: 'bg-amber-100 text-amber-900' },
  { id: 'TROPICAL', label: 'Tropical', desc: 'Botânico e Frescor', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'JAPANESE', label: 'Japonês', desc: 'Madeira e Zen', color: 'bg-red-50 text-red-900' },
  { id: 'GRUNGE', label: 'Urbano/Burger', desc: 'Tijolo e Grafite', color: 'bg-stone-800 text-stone-300' },
  { id: 'ITALIAN', label: 'Italiano', desc: 'Xadrez e Quente', color: 'bg-red-100 text-red-800' },
  { id: 'COZY_CAFE', label: 'Cafeteria', desc: 'Vapor e Marrom', color: 'bg-orange-50 text-orange-900' },
];

const FONT_OPTIONS = [
  { id: "'Cinzel', serif", label: 'Cinzel', desc: 'Clássica e Romana' },
  { id: "'Cormorant Garamond', serif", label: 'Cormorant', desc: 'Luxo e Detalhes' },
  { id: "'Playfair Display', serif", label: 'Playfair', desc: 'Elegante Editorial' },
  { id: "'Montserrat', sans-serif", label: 'Montserrat', desc: 'Moderna e Geométrica' },
  { id: "'Lato', sans-serif", label: 'Lato', desc: 'Neutra e Limpa' },
  { id: "'Roboto Slab', serif", label: 'Roboto Slab', desc: 'Forte e Robusta' },
  { id: "'Oswald', sans-serif", label: 'Oswald', desc: 'Condensada' },
  { id: "'Merriweather', serif", label: 'Merriweather', desc: 'Leitura Confortável' },
  { id: "'Abril Fatface', cursive", label: 'Abril Fatface', desc: 'Negrito e Curvas' },
  { id: "'Lobster', cursive", label: 'Lobster', desc: 'Retrô Amigável' },
  { id: "'Dancing Script', cursive", label: 'Dancing Script', desc: 'Manuscrita Fluida' },
  { id: "'Righteous', cursive", label: 'Righteous', desc: 'Futurista Retrô' },
];

const LAYOUT_OPTIONS = [
  { id: 'CLASSIC', label: 'Clássico', icon: <AlignLeft size={14} /> },
  { id: 'ELEGANT', label: 'Elegante', icon: <AlignCenter size={14} /> },
  { id: 'MODERN', label: 'Moderno', icon: <LayoutTemplate size={14} /> },
  { id: 'RUSTIC', label: 'Rústico', icon: <Ticket size={14} /> },
  { id: 'MAGAZINE', label: 'Magazine', icon: <Columns size={14} /> },
  { id: 'GRID', label: 'Grid', icon: <Box size={14} /> },
  { id: 'MINIMAL', label: 'Clean', icon: <MinusIcon /> },
];

function MinusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>; }

interface MenuCreatorProps {
  userCredits?: number;
  onOpenSubscription?: () => void;
  onConsumeCredit?: (amount: number) => void;
}

const MenuCreator: React.FC<MenuCreatorProps> = ({ userCredits = 0, onOpenSubscription, onConsumeCredit }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [selectedArtStyle, setSelectedArtStyle] = useState(ART_STYLES[0].id);
  const [customVisuals, setCustomVisuals] = useState('');
  const [logoFile, setLogoFile] = useState<string | null>(null);
  
  const [logoShape, setLogoShape] = useState<'square' | 'circle' | 'hexagon'>('square');
  const [logoBorderStyle, setLogoBorderStyle] = useState<'none' | 'gold' | 'rustic' | 'neon' | 'modern' | 'wood' | 'organic' | 'torn' | 'seal' | 'vintage'>('none');
  const [logoScale, setLogoScale] = useState(1); 

  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].id);
  const [selectedLayout, setSelectedLayout] = useState<'CLASSIC' | 'MODERN' | 'RUSTIC' | 'GRID' | 'MINIMAL' | 'ELEGANT' | 'MAGAZINE'>('CLASSIC');
  
  const [customTitleColor, setCustomTitleColor] = useState('#1a1a1a');
  const [customBodyColor, setCustomBodyColor] = useState('#4b5563');
  const [customPriceColor, setCustomPriceColor] = useState('#ea580c');

  const [overlayMode, setOverlayMode] = useState<'neutral' | 'light' | 'dark'>('neutral');
  
  // New State for Layout Adjustments
  const [titleScale, setTitleScale] = useState(1);
  const [titleOffsetY, setTitleOffsetY] = useState(0); 
  const [contentScale, setContentScale] = useState(1);
  const [contentOffsetY, setContentOffsetY] = useState(0); 
  const [layoutRotation, setLayoutRotation] = useState(0);

  // Mobile & Zoom State
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('editor');
  const [previewZoom, setPreviewZoom] = useState(0.5);

  const [categories, setCategories] = useState<UserCategory[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [categoryInputs, setCategoryInputs] = useState<Record<string, { name: string; ingredients: string; price: string }>>({});
  const [loading, setLoading] = useState(false);
  const [bgLoading, setBgLoading] = useState(false);
  const [menuDesign, setMenuDesign] = useState<MenuDesign | null>(null);
  const [loadingStep, setLoadingStep] = useState('');
  
  const printRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Auto-fit Zoom
  useEffect(() => {
    const fitZoom = () => {
      if (!previewContainerRef.current) return;
      const containerWidth = previewContainerRef.current.clientWidth;
      // A4 width in px approx 794px (96 DPI)
      const a4Width = 794; 
      
      // Calculate zoom to fit with some padding (40px)
      const availableWidth = containerWidth - 40;
      let targetZoom = availableWidth / a4Width;
      
      // Limit zoom range
      targetZoom = Math.min(1.0, Math.max(0.3, targetZoom));
      setPreviewZoom(targetZoom);
    };

    // Run slightly delayed to allow layout to settle
    const timer = setTimeout(fitZoom, 100);
    window.addEventListener('resize', fitZoom);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', fitZoom);
    };
  }, [activeMobileTab, menuDesign]);

  // Default color setup when style changes
  useEffect(() => {
    if (menuDesign) return; 
    setCustomTitleColor('#1a1a1a');
    setCustomBodyColor('#4b5563');
    setCustomPriceColor('#ea580c');
  }, [selectedArtStyle]);

  // Adjust text colors based on overlay mode
  useEffect(() => {
    if (overlayMode === 'dark') {
      setCustomTitleColor('#ffffff');
      setCustomBodyColor('#d1d5db');
      setCustomPriceColor('#fbbf24');
    } else {
      setCustomTitleColor('#1a1a1a');
      setCustomBodyColor('#4b5563');
      setCustomPriceColor('#ea580c');
    }
  }, [overlayMode]);

  // Auto switch to preview on mobile when generated
  useEffect(() => {
    if (menuDesign && window.innerWidth < 1024) {
      setActiveMobileTab('preview');
    }
  }, [menuDesign]);

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newCatId = Date.now().toString();
    const newCat: UserCategory = { id: newCatId, name: newCatName, items: [] };
    setCategories([...categories, newCat]);
    setNewCatName('');
    setCategoryInputs(prev => ({ ...prev, [newCatId]: { name: '', ingredients: '', price: '' } }));
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    const newInputs = { ...categoryInputs };
    delete newInputs[id];
    setCategoryInputs(newInputs);
  };

  const handleInputChange = (catId: string, field: 'name' | 'ingredients' | 'price', value: string) => {
    setCategoryInputs(prev => ({
      ...prev,
      [catId]: { ...(prev[catId] || { name: '', ingredients: '', price: '' }), [field]: value }
    }));
  };

  const addItemToCategory = (catId: string) => {
    const inputs = categoryInputs[catId];
    if (!inputs || !inputs.name) return;
    const newItem: CatalogItem = {
      id: Date.now().toString(),
      name: inputs.name,
      ingredients: inputs.ingredients,
      price: inputs.price
    };
    setCategories(categories.map(cat => {
      if (cat.id === catId) return { ...cat, items: [...cat.items, newItem] };
      return cat;
    }));
    setCategoryInputs(prev => ({ ...prev, [catId]: { name: '', ingredients: '', price: '' } }));
  };

  const removeItem = (catId: string, itemId: string) => {
    setCategories(categories.map(cat => {
      if (cat.id === catId) return { ...cat, items: cat.items.filter(i => i.id !== itemId) };
      return cat;
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setLogoFile(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateFullMenu = async () => {
    const hasItems = categories.some(c => c.items.length > 0);
    if (!hasItems || !restaurantName) return;
    setLoading(true); setMenuDesign(null); setBgLoading(false);

    try {
      setLoadingStep('O Designer IA está organizando os pratos...');
      const styleLabel = ART_STYLES.find(s => s.id === selectedArtStyle)?.label || '';
      const structure = await generateMenuStructure(restaurantName, styleLabel, categories);
      
      setSelectedLayout('CLASSIC'); // Force Classic default
      setOverlayMode('neutral'); // Default to Standard/Neutral view
      setTitleScale(1);
      setTitleOffsetY(0);
      setContentScale(1);
      setContentOffsetY(0);
      setLayoutRotation(0);
      setLogoScale(1);

      setMenuDesign({ ...structure, backgroundImageUrl: undefined, logo: logoFile || undefined });
      setLoading(false); setLoadingStep(''); 
      
      // Check Credits for Background
      if (userCredits > 0) {
          setBgLoading(true);
          try {
            const bgImage = await generateMenuBackground(selectedArtStyle, restaurantName, structure.layoutStyle, customVisuals);
            setMenuDesign(prev => prev ? ({ ...prev, backgroundImageUrl: bgImage || undefined }) : null);
            if (onConsumeCredit) onConsumeCredit(1);
          } catch (e) { console.warn("Background gen failed"); }
          finally { setBgLoading(false); }
      }

    } catch (error) { alert("Houve um erro, mas tentaremos mostrar o que foi possível."); setLoading(false); } 
  };

  const handleUpdateTextOnly = async () => {
    const hasItems = categories.some(c => c.items.length > 0);
    if (!hasItems || !restaurantName || !menuDesign) return;
    const currentBackground = menuDesign.backgroundImageUrl;
    const currentLogo = menuDesign.logo;
    setLoading(true);
    try {
      setLoadingStep('Reescrevendo textos e preços...');
      const styleLabel = ART_STYLES.find(s => s.id === selectedArtStyle)?.label || '';
      const structure = await generateMenuStructure(restaurantName, styleLabel, categories);
      setMenuDesign({ ...structure, layoutStyle: selectedLayout as any, backgroundImageUrl: currentBackground, logo: currentLogo });
    } catch (error) { alert("Erro ao atualizar textos."); } finally { setLoading(false); setLoadingStep(''); }
  };

  // --- DOWNLOAD HANDLERS ---

  const prepareCloneForDownload = (element: HTMLElement) => {
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Reset basic positioning for capture
    Object.assign(clone.style, { 
      position: 'fixed', 
      top: '-9999px', 
      left: '0', 
      zIndex: '-1', 
      width: '210mm', 
      minHeight: '297mm', 
      margin: '0', 
      transform: 'none', 
      boxShadow: 'none', 
      borderRadius: '0',
      backgroundColor: 'transparent' // Force transparent base
    });

    // Remove bg-white class if present to prevent white bleed through
    clone.classList.remove('bg-white');

    // FIX: Remove animation classes from background image to prevent opacity/fading issues
    const bgImageDiv = clone.querySelector('div[style*="background-image"]');
    if (bgImageDiv instanceof HTMLElement) {
      bgImageDiv.classList.remove('animate-fade-in-up');
      bgImageDiv.style.opacity = '1';
      bgImageDiv.style.animation = 'none';
      bgImageDiv.style.transition = 'none';
    }

    const overlay = clone.querySelector('div[data-id="menu-overlay"]');
    if (overlay instanceof HTMLElement) {
        if (overlayMode === 'neutral') {
            // Enforce STRICT transparency for the Neutral look
            overlay.style.backgroundColor = 'transparent';
            overlay.style.borderColor = 'transparent';
            overlay.style.boxShadow = 'none';
            overlay.style.backdropFilter = 'none';
            overlay.className = 'absolute inset-0 m-6 md:m-8 rounded-sm z-10'; 
        }
    }

    return clone;
  };

  const handleDownloadImage = async () => {
    if (!printRef.current || !menuDesign) return;
    const btn = document.getElementById('download-btn');
    if(btn) btn.innerText = "Gerando...";
    
    try {
      const clone = prepareCloneForDownload(printRef.current);
      document.body.appendChild(clone);
      await new Promise(resolve => setTimeout(resolve, 200)); 
      
      const canvas = await html2canvas(clone, { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: null, // Critical for transparency
          logging: false,
          allowTaint: true
      });
      document.body.removeChild(clone);
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `${menuDesign.restaurantName.replace(/\s+/g, '_')}_Cardapio.png`;
      link.click();
    } catch (error) { alert("Erro ao gerar imagem."); console.error(error); } finally { if(btn) btn.innerText = "PNG"; }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current || !menuDesign) return;
    const btn = document.getElementById('download-pdf-btn');
    if(btn) btn.innerText = "Gerando...";
    
    try {
        const clone = prepareCloneForDownload(printRef.current);
        document.body.appendChild(clone);
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const canvas = await html2canvas(clone, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: null,
            allowTaint: true
        });
        document.body.removeChild(clone);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${menuDesign.restaurantName.replace(/\s+/g, '_')}_Cardapio.pdf`);
    } catch (error) {
        console.error(error);
        alert("Erro ao gerar PDF.");
    } finally {
        if(btn) btn.innerText = "PDF";
    }
  };

  const getOverlayClass = () => {
    switch (overlayMode) {
      case 'dark': return 'bg-black/85 border-white/10 text-white';
      case 'light': return 'bg-white/90 border-gray-100 shadow-sm';
      case 'neutral': default: return 'bg-transparent border-transparent shadow-none';
    }
  };

  const getCategoryIcon = (title: string, size: number = 24) => {
    const t = title.toLowerCase();
    const props = { size, className: "opacity-80" };
    if (t.includes('bebida') || t.includes('drink')) return <Wine {...props} />;
    if (t.includes('sobremesa') || t.includes('doce')) return <IceCream {...props} />;
    if (t.includes('burger') || t.includes('lanche')) return <Sandwich {...props} />;
    if (t.includes('pizza')) return <Pizza {...props} />;
    if (t.includes('cafe')) return <Coffee {...props} />;
    return <UtensilsCrossed {...props} />;
  };

  const getLogoContainerClass = () => {
      let classes = `mb-6 relative flex items-center justify-center overflow-hidden transition-all duration-300 `;
      
      if (logoShape === 'circle') classes += "rounded-full "; 
      else classes += "rounded-xl ";

      switch (logoBorderStyle) {
          case 'none': 
              classes += "border-0 bg-transparent "; 
              break;
          case 'vintage':
              classes += "border-4 border-gray-800 bg-[#f4f1ea] outline outline-4 outline-[#f4f1ea] shadow-xl "; 
              break;
          case 'gold': 
              classes += "border-4 border-yellow-600 shadow-xl ring-2 ring-yellow-400/50 bg-transparent "; 
              break;
          case 'rustic': 
              classes += "border-4 border-dashed border-amber-800 shadow-md bg-amber-50 "; 
              break;
          case 'neon': 
              classes += "border-2 border-cyan-400 shadow-[0_0_15px_#22d3ee] bg-transparent "; 
              break;
          case 'modern': 
              classes += "border-8 border-gray-900 bg-white "; 
              break;
          case 'wood': 
              classes += "border-8 border-amber-900 ring-2 ring-amber-700 bg-transparent "; 
              break;
          case 'organic': 
              classes += "border-4 border-emerald-500 shadow-lg bg-emerald-50 "; 
              break;
          case 'torn': 
              classes += "border-0 shadow-lg bg-white "; 
              break; 
          case 'seal': 
              classes += "border-4 border-dotted border-red-700 rounded-full ring-4 ring-red-700/30 bg-red-50 "; 
              break;
          default: 
              classes += "border-0 bg-transparent "; 
              break;
      }
      return classes;
  };

  const renderLogo = (design: MenuDesign) => {
    if (!design.logo) return null;
    
    const size = 192 * logoScale; 

    if (logoShape === 'hexagon') {
        const hexClip = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        const hexBgColor = logoBorderStyle === 'gold' ? '#ca8a04' : 
                           logoBorderStyle === 'neon' ? '#22d3ee' : 
                           logoBorderStyle === 'rustic' ? '#92400e' : 
                           logoBorderStyle === 'wood' ? '#78350f' :
                           logoBorderStyle === 'organic' ? '#10b981' :
                           logoBorderStyle === 'vintage' ? '#1f2937' : 'transparent';
        
        const hasBorder = logoBorderStyle !== 'none' && logoBorderStyle !== 'torn';

        return (
            <div className="mb-6 relative flex items-center justify-center filter drop-shadow-md" style={{ width: size, height: size }}>
                {hasBorder && (
                   <div className="absolute inset-0" style={{ clipPath: hexClip, backgroundColor: hexBgColor }}></div>
                )}
                <div className={`absolute inset-0 flex items-center justify-center ${hasBorder ? 'p-1' : ''}`} style={{ clipPath: hexClip }}>
                     <div className="w-full h-full bg-white flex items-center justify-center" style={{ clipPath: hexClip }}>
                        <img src={design.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                     </div>
                </div>
            </div>
        )
    }

    if (logoBorderStyle === 'torn') {
        const tornClip = 'polygon(0% 0%, 100% 0%, 100% 100%, 95% 90%, 90% 100%, 85% 90%, 80% 100%, 75% 90%, 70% 100%, 65% 90%, 60% 100%, 55% 90%, 50% 100%, 45% 90%, 40% 100%, 35% 90%, 30% 100%, 25% 90%, 20% 100%, 15% 90%, 10% 100%, 5% 90%, 0% 100%)';
        return (
            <div className={getLogoContainerClass()} style={{ width: size, height: size, clipPath: tornClip }}>
                <img src={design.logo} alt="Logo" className="w-full h-full object-contain p-4" />
            </div>
        )
    }

    const tightFitStyles = ['gold', 'neon', 'wood', 'vintage', 'none'];
    const paddingClass = tightFitStyles.includes(logoBorderStyle) ? '' : 'p-3';

    return (
        <div className={getLogoContainerClass()} style={{ width: size, height: size }}>
            <img src={design.logo} alt="Logo" className={`w-full h-full object-contain ${paddingClass}`} />
        </div>
    );
  };

  const renderLayout = (design: MenuDesign) => {
    const safeCategories = design.categories || [];
    const layout = selectedLayout;
    const titleFont = { fontFamily: selectedFont, color: customTitleColor };
    const bodyStyle = { fontFamily: selectedFont === "'Great Vibes', cursive" ? "'Lato', sans-serif" : selectedFont, color: customBodyColor };
    const priceStyle = { color: customPriceColor };

    return (
      <div className="h-full flex flex-col relative" style={bodyStyle}>
          {/* Header Section with Title Scale and Offset */}
          <div className="flex flex-col items-center mb-10 text-center relative z-10" style={{ transform: `scale(${titleScale}) translateY(${titleOffsetY}px)`, transformOrigin: 'top center' }}>
              {renderLogo(design)}
              <h1 className="text-5xl md:text-6xl font-bold mb-2 uppercase tracking-wider drop-shadow-sm leading-none" style={titleFont}>{design.restaurantName}</h1>
          </div>

          {/* Content Section with Content Scale and Offset */}
          <div className="flex-1" style={{ transform: `scale(${contentScale}) translateY(${contentOffsetY}px)`, transformOrigin: 'top center' }}>
              {layout === 'CLASSIC' && (
                <div className={`grid grid-cols-2 gap-12 p-2 items-start ${!design.logo ? 'mt-20' : ''}`} style={{ gridAutoRows: 'min-content' }}>
                    {safeCategories.map((cat, idx) => (
                    <div key={idx} className="break-inside-avoid mb-2">
                        <div className="text-center mb-6 relative"><h3 className="text-2xl font-bold uppercase tracking-widest inline-block border-b-2 pb-2 px-8" style={{ ...titleFont, borderColor: customTitleColor }}>{cat.title}</h3></div>
                        <div className="space-y-5 px-2">
                        {cat.items?.map((item, i) => (
                            <div key={i}>
                            <div className="flex items-baseline w-full">
                                <span className="font-bold text-lg tracking-wide" style={{color: customBodyColor}}>{item.name}</span>
                                <span className="flex-1 mx-2 border-b-2 border-dotted mb-1 opacity-60" style={{borderColor: customBodyColor}}></span>
                                <span className="font-bold text-lg whitespace-nowrap" style={priceStyle}>{item.price}</span>
                            </div>
                            <p className="text-sm mt-1 italic leading-relaxed opacity-90" style={{color: customBodyColor}}>
                                {item.description && item.description.length > 5 ? item.description : item.ingredients}
                            </p>
                            </div>
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
              )}

              {layout === 'ELEGANT' && (
                  <div className="flex flex-col gap-12 px-12 items-center">
                      {safeCategories.map((cat, idx) => (
                          <div key={idx} className="w-full max-w-2xl text-center">
                              <h3 className="text-3xl font-light italic mb-8 relative inline-block" style={{ ...titleFont }}>
                                  <span className="opacity-30 mx-2">~</span> {cat.title} <span className="opacity-30 mx-2">~</span>
                              </h3>
                              <div className="space-y-6">
                                  {cat.items?.map((item, i) => (
                                      <div key={i} className="flex flex-col items-center">
                                          <div className="font-semibold text-lg uppercase tracking-widest mb-1" style={{color: customBodyColor}}>{item.name}</div>
                                          <div className="text-xs opacity-70 mb-1 max-w-md mx-auto" style={{color: customBodyColor}}>{item.description || item.ingredients}</div>
                                          <div className="font-bold text-lg" style={priceStyle}>{item.price}</div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              {layout === 'MODERN' && (
                <div className="grid grid-cols-2 gap-x-12 gap-y-12 p-2">
                    {safeCategories.map((cat, idx) => (
                        <div key={idx} className="break-inside-avoid">
                        <h3 className="text-3xl font-black mb-6 uppercase tracking-tight flex items-center gap-4 border-b pb-2" style={{ ...titleFont, borderColor: customTitleColor }}>
                            <span className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">{getCategoryIcon(cat.title, 20)}</span>{cat.title}
                        </h3>
                        <div className="space-y-6 pl-2">
                            {cat.items?.map((item, i) => (
                            <div key={i} className="group relative">
                                <div className="flex justify-between items-start mb-1"><span className="font-bold text-lg" style={{color: customBodyColor}}>{item.name}</span><span className="font-bold text-xl ml-4 whitespace-nowrap" style={priceStyle}>{item.price}</span></div>
                                <p className="text-sm font-light opacity-90" style={{color: customBodyColor}}>{item.description || item.ingredients}</p>
                            </div>
                            ))}
                        </div>
                        </div>
                    ))}
                </div>
              )}

              {layout === 'RUSTIC' && (
                <div className="flex flex-col gap-10 p-2">
                    {safeCategories.map((cat, idx) => (
                    <div key={idx} className="relative p-8 rounded-sm border-2 border-dashed bg-white/10" style={{ borderColor: customTitleColor }}>
                        <div className="flex flex-col items-center mb-8"><h3 className="text-4xl text-center" style={titleFont}>{cat.title}</h3></div>
                        <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                        {cat.items?.map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center pb-4 border-b last:border-0" style={{borderColor: customBodyColor + '30'}}>
                            <div className="font-bold text-xl uppercase tracking-wider mb-1" style={{color: customBodyColor}}>{item.name}</div>
                            <div className="text-sm mb-2 italic opacity-80" style={{color: customBodyColor}}>{item.description || item.ingredients}</div>
                            <div className="w-full flex justify-center mt-2">
                                <div className="font-bold text-xl whitespace-nowrap" style={priceStyle}>
                                    {item.price}
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    ))}
                </div>
              )}

              {layout === 'MAGAZINE' && (
                  <div className="grid grid-cols-12 gap-8 p-2">
                      {safeCategories.map((cat, idx) => (
                          <div key={idx} className={`${idx === 0 || idx % 3 === 0 ? 'col-span-12' : 'col-span-6'} break-inside-avoid bg-white/5 p-6 border-l-4`} style={{ borderColor: customTitleColor }}>
                              <h3 className="text-4xl md:text-5xl font-black mb-6 uppercase leading-none" style={{ ...titleFont, opacity: 0.9 }}>{cat.title}</h3>
                              <div className={`grid ${idx === 0 || idx % 3 === 0 ? 'grid-cols-2 gap-8' : 'grid-cols-1 gap-4'}`}>
                                  {cat.items?.map((item, i) => (
                                      <div key={i} className="flex justify-between items-end border-b pb-2 border-dotted" style={{ borderColor: customBodyColor + '40' }}>
                                          <div>
                                              <div className="font-bold text-xl" style={{color: customBodyColor}}>{item.name}</div>
                                              <div className="text-xs opacity-70 mt-1" style={{color: customBodyColor}}>{item.description || item.ingredients}</div>
                                          </div>
                                          <div className="font-black text-2xl ml-4 whitespace-nowrap" style={priceStyle}>{item.price}</div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              )}

              {layout === 'GRID' && (
                <div className="grid grid-cols-3 gap-6 p-2">
                    {safeCategories.map((cat, idx) => (
                        <div key={idx} className="break-inside-avoid p-6 rounded-xl bg-white/10 backdrop-blur-sm shadow-sm border border-white/20">
                            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-center uppercase" style={{ ...titleFont, borderColor: customTitleColor }}>{cat.title}</h3>
                            <div className="space-y-4">
                                {cat.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between items-start text-sm w-full gap-2">
                                        <div className="font-semibold flex-1" style={{color: customBodyColor}}>{item.name}</div>
                                        <div className="font-bold text-sm whitespace-nowrap shrink-0" style={priceStyle}>
                                            {item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
              )}

              {layout === 'MINIMAL' && (
                <div className="flex flex-col gap-16 p-8 max-w-3xl mx-auto text-center">
                    {safeCategories.map((cat, idx) => (
                        <div key={idx}>
                            <h3 className="text-2xl font-light tracking-[0.3em] mb-10 uppercase" style={titleFont}>{cat.title}</h3>
                            <div className="space-y-8">
                                {cat.items?.map((item, i) => (
                                    <div key={i}>
                                        <div className="text-xl mb-1" style={{color: customBodyColor}}>{item.name} <span className="mx-2 opacity-30 text-sm">|</span> <span style={priceStyle}>{item.price}</span></div>
                                        <div className="text-xs uppercase tracking-wide opacity-60" style={{color: customBodyColor}}>{item.description || item.ingredients}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
              )}
          </div>
          
          <footer className="mt-auto text-center pt-10"><p className="text-[10px] uppercase tracking-widest opacity-60" style={{color: customBodyColor}}>{design.restaurantName} &bull; {new Date().getFullYear()}</p></footer>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      <style>{`@media print { @page { size: A4; margin: 0; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; } body > * { display: none !important; } #print-root { display: block !important; width: 100vw; height: 100vh; position: absolute; top: 0; left: 0; } #menu-canvas { transform: none !important; margin: 0 !important; width: 100% !important; min-height: 100% !important; box-shadow: none !important; } }`}</style>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0 z-30">
          <button onClick={() => setActiveMobileTab('editor')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${activeMobileTab === 'editor' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'}`}><Edit3 size={16}/> Configurar</button>
          <button onClick={() => setActiveMobileTab('preview')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${activeMobileTab === 'preview' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500'}`}><Eye size={16}/> Visualizar</button>
      </div>

      {/* LEFT SIDE: CONFIGURATION */}
      <div className={`w-full lg:w-[400px] xl:w-[480px] h-full overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 space-y-6 flex-shrink-0 z-20 shadow-xl custom-scrollbar ${activeMobileTab === 'editor' ? 'block' : 'hidden lg:block'}`}>
        
        {/* Header - PREMIUM STYLE */}
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-black p-8 text-white shadow-xl shadow-gray-200/50 dark:shadow-none isolate group border border-white/5 mb-6">
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/20 shadow-sm">
                        <UtensilsCrossed className="text-white drop-shadow-md" size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm font-serif">Cardápio Digital</h2>
                        <div className="h-1 w-12 bg-orange-400 rounded-full mt-1"></div>
                    </div>
                </div>
                <p className="text-gray-300 font-medium opacity-90 text-sm mt-3 leading-relaxed max-w-xs">
                    Estrutura gratuita. Background com IA custa 1 crédito.
                </p>
            </div>
        </div>

        {/* Identity Section */}
        <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Type size={12}/> Nome do Restaurante</label>
              <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none font-semibold text-gray-900 dark:text-white placeholder-gray-400" placeholder="Ex: Bistro Paris 6" />
            </div>

            <div className="space-y-3">
               <div className="flex justify-between items-center"><label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><ImageIcon size={12}/> Logotipo</label></div>
               <input type="file" ref={logoInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
               <div className="flex gap-4 items-center">
                  {logoFile ? (
                      <div className="relative w-20 h-20 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-900 shrink-0">
                          <img src={logoFile} alt="Logo" className="w-full h-full object-contain" />
                          <button onClick={() => setLogoFile(null)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"><X size={12} /></button>
                      </div>
                  ) : (
                      <button onClick={() => logoInputRef.current?.click()} className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition shrink-0"><Upload size={20} /><span className="text-[10px] mt-1">Upload</span></button>
                  )}
                  
                  {logoFile && (
                      <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                              <button onClick={() => setLogoShape('square')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold rounded border ${logoShape === 'square' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}><Square size={12}/> Quad.</button>
                              <button onClick={() => setLogoShape('circle')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold rounded border ${logoShape === 'circle' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}><Circle size={12}/> Red.</button>
                              <button onClick={() => setLogoShape('hexagon')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold rounded border ${logoShape === 'hexagon' ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}><Hexagon size={12}/> Hex.</button>
                          </div>
                          
                          {/* Logo Size Control */}
                          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-1.5 rounded-lg border border-gray-200 dark:border-gray-600">
                             <span className="text-[9px] font-bold text-gray-500 uppercase">Tamanho</span>
                             <input type="range" min="0.5" max="1.5" step="0.1" value={logoScale} onChange={(e) => setLogoScale(parseFloat(e.target.value))} className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                          </div>

                          <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar">
                              {['none', 'vintage', 'torn', 'gold', 'rustic', 'neon', 'modern', 'wood', 'organic', 'seal'].map(style => (
                                  <button key={style} onClick={() => setLogoBorderStyle(style as any)} className={`px-2 py-1 text-[10px] rounded border capitalize ${logoBorderStyle === style ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>{style === 'none' ? 'Sem' : style}</button>
                              ))}
                          </div>
                      </div>
                  )}
               </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Sparkles size={12}/> Estilo Artístico</label>
                  <span className="text-[9px] text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-full flex items-center gap-1"><Info size={8} /> Arte IA</span>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto custom-scrollbar">
                 {ART_STYLES.map(style => (
                    <button key={style.id} onClick={() => setSelectedArtStyle(style.id)} className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${selectedArtStyle === style.id ? 'border-orange-500 ring-1 ring-orange-500 shadow-md transform scale-[1.02]' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-orange-300'}`}>
                        <div className={`absolute top-0 right-0 w-16 h-16 opacity-10 rounded-full -mr-8 -mt-8 ${style.color.split(' ')[0]}`}></div>
                        <div className="font-bold text-gray-800 dark:text-white text-sm relative z-10">{style.label}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 relative z-10">{style.desc}</div>
                    </button>
                 ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><LayoutTemplate size={12}/> Layout</label>
              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                 {LAYOUT_OPTIONS.map(layout => (
                    <button key={layout.id} onClick={() => setSelectedLayout(layout.id as any)} className={`flex-1 min-w-[70px] flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg border transition-all ${selectedLayout === layout.id ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 text-orange-700 dark:text-orange-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400'}`}>
                        {layout.icon}<span className="text-[10px] font-bold">{layout.label}</span>
                    </button>
                 ))}
              </div>
            </div>

            {/* Layout Adjustments */}
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
               <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Maximize size={12}/> Ajustes Finos</label>
               <div className="space-y-3">
                  <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Tamanho Título</span><span>{Math.round(titleScale * 100)}%</span></div>
                      <input type="range" min="0.5" max="1.5" step="0.01" value={titleScale} onChange={(e) => setTitleScale(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-orange-600" />
                  </div>
                  <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Posição Título (Y)</span><span>{titleOffsetY}px</span></div>
                      <div className="flex items-center gap-2">
                         <MoveVertical size={12} className="text-gray-400"/>
                         <input type="range" min="-200" max="200" step="10" value={titleOffsetY} onChange={(e) => setTitleOffsetY(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-orange-600" />
                      </div>
                  </div>
                  <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Tamanho Conteúdo</span><span>{Math.round(contentScale * 100)}%</span></div>
                      <input type="range" min="0.5" max="1.5" step="0.01" value={contentScale} onChange={(e) => setContentScale(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-orange-600" />
                  </div>
                  <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Posição Conteúdo (Y)</span><span>{contentOffsetY}px</span></div>
                      <div className="flex items-center gap-2">
                         <MoveVertical size={12} className="text-gray-400"/>
                         <input type="range" min="-200" max="200" step="10" value={contentOffsetY} onChange={(e) => setContentOffsetY(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-orange-600" />
                      </div>
                  </div>
                  <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>Rotação Geral</span><span>{Math.round(layoutRotation)}°</span></div>
                      <input type="range" min="-5" max="5" step="0.1" value={layoutRotation} onChange={(e) => setLayoutRotation(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-orange-600" />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Type size={12}/> Tipografia</label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                 {FONT_OPTIONS.map(font => (
                    <button key={font.id} onClick={() => setSelectedFont(font.id)} className={`px-3 py-2 rounded-lg border text-left transition-all ${selectedFont === font.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/30 text-orange-900 dark:text-orange-200' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                        <div className="font-bold text-xs truncate" style={{ fontFamily: font.id }}>{font.label}</div>
                        <div className="text-[9px] opacity-70 truncate">{font.desc}</div>
                    </button>
                 ))}
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Palette size={12}/> Cores do Texto</label>
               <div className="flex gap-4 items-center">
                  <div className="flex flex-col items-center gap-1"><input type="color" value={customTitleColor} onChange={(e) => setCustomTitleColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" /><span className="text-[9px] text-gray-500">Títulos</span></div>
                  <div className="flex flex-col items-center gap-1"><input type="color" value={customBodyColor} onChange={(e) => setCustomBodyColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" /><span className="text-[9px] text-gray-500">Texto</span></div>
                  <div className="flex flex-col items-center gap-1"><input type="color" value={customPriceColor} onChange={(e) => setCustomPriceColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" /><span className="text-[9px] text-gray-500">Preço</span></div>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider ml-1 flex items-center gap-1"><Wand2 size={12}/> Personalização Visual IA</label>
               <textarea value={customVisuals} onChange={(e) => setCustomVisuals(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-sm text-gray-900 dark:text-white resize-none placeholder-gray-400" rows={2} placeholder="Ex: Adicionar ilustração de tomates..." />
            </div>

             {/* Categories */}
             <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1"><FolderPlus size={12}/> Categorias</label>
                </div>
                <div className="flex gap-2 mb-4">
                    <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-sm dark:text-white" placeholder="Nova Categoria" onKeyDown={(e) => e.key === 'Enter' && addCategory()} />
                    <button onClick={addCategory} disabled={!newCatName} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><Plus size={18} /></button>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {categories.map(cat => {
                        const inputs = categoryInputs[cat.id] || { name: '', ingredients: '', price: '' };
                        return (
                            <div key={cat.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{cat.name}</h4>
                                    <button onClick={() => removeCategory(cat.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                                <div className="space-y-2">
                                    {cat.items.map(item => (
                                        <div key={item.id} className="flex justify-between text-xs bg-gray-50 dark:bg-gray-700 p-1.5 rounded">
                                            <span>{item.name}</span>
                                            <div className="flex items-center gap-2"><span>{item.price}</span><button onClick={() => removeItem(cat.id, item.id)} className="text-red-400"><X size={10}/></button></div>
                                        </div>
                                    ))}
                                    <div className="space-y-2 mt-2">
                                        <input type="text" placeholder="Prato" className="w-full p-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs dark:text-white" value={inputs.name} onChange={(e) => handleInputChange(cat.id, 'name', e.target.value)} />
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Ingred." className="flex-1 p-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs dark:text-white" value={inputs.ingredients} onChange={(e) => handleInputChange(cat.id, 'ingredients', e.target.value)} />
                                            <input type="text" placeholder="R$" className="w-16 p-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs dark:text-white" value={inputs.price} onChange={(e) => handleInputChange(cat.id, 'price', e.target.value)} />
                                        </div>
                                        <button onClick={() => addItemToCategory(cat.id)} className="w-full bg-gray-100 dark:bg-gray-700 text-xs font-bold py-1.5 rounded text-gray-600 dark:text-gray-300">Add</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
             </div>

             <div className="pt-4 space-y-3">
                <button onClick={handleGenerateFullMenu} disabled={loading || categories.length === 0 || !restaurantName} className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:scale-100">
                    {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={18}/>}
                    <span>{loading ? loadingStep || "Gerando..." : "Gerar Cardápio"}</span>
                    {!loading && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${userCredits > 0 ? 'bg-white/20 text-white' : 'bg-green-500/20 text-green-100 border border-green-200/20'}`}>
                            {userCredits > 0 ? '-1 Crédito' : 'Grátis'}
                        </span>
                    )}
                </button>
                {menuDesign && (
                    <button onClick={handleUpdateTextOnly} disabled={loading} className="w-full py-3 border-2 border-orange-100 dark:border-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl font-bold text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition flex items-center justify-center gap-2">
                         <RefreshCw size={16} /> Atualizar Texto
                    </button>
                )}
                {userCredits < 1 && (
                    <div className="flex items-center justify-center gap-2 text-xs text-orange-600 font-bold bg-orange-50 p-2 rounded-lg">
                        <Lock size={12}/> Backgrounds IA requerem créditos.
                    </div>
                )}
             </div>
        </div>
      </div>

      {/* RIGHT SIDE: PREVIEW */}
      <div id="print-root" className={`flex-1 bg-stone-100 dark:bg-[#0c0c0c] relative overflow-hidden flex flex-col h-full ${activeMobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
         
         {/* Preview Toolbar */}
         {menuDesign && (
             <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-3 whitespace-nowrap overflow-x-auto max-w-[95%] custom-scrollbar">
                 <button onClick={() => setOverlayMode('light')} className={`p-2 rounded-full transition ${overlayMode === 'light' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Sun size={18} /></button>
                 <button onClick={() => setOverlayMode('neutral')} className={`p-2 rounded-full transition ${overlayMode === 'neutral' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Box size={18} /></button>
                 <button onClick={() => setOverlayMode('dark')} className={`p-2 rounded-full transition ${overlayMode === 'dark' ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><Moon size={18} /></button>
                 
                 <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-600"></div>
                 
                 {/* Zoom Controls */}
                 <button onClick={() => setPreviewZoom(z => Math.max(0.3, z - 0.1))} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><ZoomOut size={18}/></button>
                 <span className="text-xs font-bold w-12 text-center">{Math.round(previewZoom * 100)}%</span>
                 <button onClick={() => setPreviewZoom(z => Math.min(1.5, z + 0.1))} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><ZoomIn size={18}/></button>

                 <div className="w-[1px] h-6 bg-gray-300 dark:bg-gray-600"></div>

                 <button id="download-btn" onClick={handleDownloadImage} className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black transition flex items-center gap-1"><ImageDown size={14} /> PNG</button>
                 <button id="download-pdf-btn" onClick={handleDownloadPDF} className="text-xs font-bold bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition flex items-center gap-1"><FileText size={14} /> PDF</button>
             </div>
         )}

         {/* Canvas Area */}
         <div ref={previewContainerRef} className="flex-1 overflow-auto bg-stone-100 dark:bg-[#0c0c0c] flex flex-col items-center pt-24 pb-20 custom-scrollbar relative">
            {!menuDesign ? (
                <div className="text-center text-gray-400 dark:text-gray-600 mt-20">
                    <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"><ImageIcon size={40} className="opacity-50"/></div>
                    <p className="text-lg font-medium">Configure e gere seu cardápio</p>
                </div>
            ) : (
                <div className="relative shadow-2xl shadow-black/20 origin-top mx-auto transition-transform duration-200" style={{ transform: `scale(${previewZoom})` }}>
                    <div id="menu-canvas" ref={printRef} className="w-[210mm] min-h-[297mm] bg-white relative overflow-hidden">
                        {menuDesign.backgroundImageUrl ? (
                            <div className="absolute inset-0 z-0 animate-fade-in-up" style={{ backgroundImage: `url(${menuDesign.backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', }} />
                        ) : bgLoading ? (
                            <div className="absolute inset-0 z-0 bg-gray-100 flex items-center justify-center"><div className="flex flex-col items-center animate-pulse text-gray-400"><Palette size={48} className="mb-2" /><span className="font-bold">Gerando Arte IA...</span></div></div>
                        ) : (
                            <div className="absolute inset-0 z-0 bg-white"></div>
                        )}
                        <div data-id="menu-overlay" className={`absolute inset-0 m-6 md:m-8 rounded-sm z-10 transition-all duration-300 ${getOverlayClass()}`}>
                            <div className="relative h-full flex flex-col p-10 md:p-14" style={{ transform: `rotate(${layoutRotation}deg)`, transformOrigin: 'center center' }}>{renderLayout(menuDesign)}</div>
                        </div>
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default MenuCreator;
