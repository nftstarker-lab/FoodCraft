import React, { useState } from 'react';
import { AppView } from '../types';
import { X, CheckCircle2, ArrowRight, Utensils, Camera, Calculator, PenTool, CalendarDays, ShoppingBag, Percent, Feather } from 'lucide-react';

interface ToolIntroModalProps {
  view: AppView;
  onClose: () => void;
  onConfirm: () => void;
}

const TOOL_DATA: Partial<Record<AppView, { 
  title: string; 
  subtitle: string; 
  description: string; 
  benefits: string[]; 
  image: string; 
  icon: React.ElementType;
  color: string;
}>> = {
  [AppView.MENU_CREATOR]: {
    title: "Cardápio Digital Inteligente",
    subtitle: "Seu menu nunca mais será apenas uma lista de preços.",
    description: "Você sabia que um cardápio bem desenhado pode aumentar o ticket médio em até 30%? Nossa IA analisa a identidade do seu restaurante e cria layouts gastronômicos que despertam a fome, organizando seus pratos de forma estratégica.",
    benefits: [
      "Design profissional gerado automaticamente",
      "Descrições apetitosas criadas por IA",
      "Sugestão inteligente de imagens de fundo",
      "Exportação pronta para impressão ou digital"
    ],
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000",
    icon: Utensils,
    color: "text-orange-600 bg-orange-100"
  },
  [AppView.CATALOG_IMPROVER]: {
    title: "Catálogo & SEO Turbo",
    subtitle: "Transforme descrições chatas em máquinas de vendas.",
    description: "Não basta listar ingredientes. Para vender online, você precisa encantar e ser encontrado. Nossa ferramenta reescreve suas descrições usando técnicas de Copywriting e SEO, garantindo que seu prato pareça irresistível e apareça nas buscas.",
    benefits: [
      "Técnicas de Persuasão (Copywriting)",
      "Otimização para iFood e Google (SEO)",
      "Formatação visual com Markdown e Emojis",
      "Destaque automático dos diferenciais"
    ],
    image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=1000",
    icon: ShoppingBag,
    color: "text-pink-600 bg-pink-100"
  },
  [AppView.PHOTO_STUDIO]: {
    title: "Estúdio Fotográfico IA",
    subtitle: "Fotos de revista tiradas com seu celular.",
    description: "Contratar um fotógrafo é caro e demorado. Com o Estúdio IA, você envia uma foto simples do seu prato (mesmo com iluminação ruim) e nossa inteligência artificial recria a cena em um estúdio profissional, ajustando luz, fundo e apetite appeal.",
    benefits: [
      "Iluminação de estúdio profissional",
      "Troca de cenário (Rústico, Moderno, Dark)",
      "Melhoria de resolução e nitidez",
      "Economia de milhares de reais com fotógrafos"
    ],
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000",
    icon: Camera,
    color: "text-indigo-600 bg-indigo-100"
  },
  [AppView.PRICE_WIZARD]: {
    title: "Otimizador de Preços",
    subtitle: "Pare de perder dinheiro na precificação.",
    description: "Muitos restaurantes quebram porque erram na matemática. O Price Wizard não apenas calcula o preço ideal baseado nos seus custos, mas usa psicologia de preços para sugerir valores que o cliente aceita pagar, maximizando sua margem de lucro real.",
    benefits: [
      "Cálculo preciso de Markup e Margem",
      "Sugestões de estratégias de combos",
      "Análise de lucro líquido real",
      "Psicologia de preços (ex: 19,90 vs 20,00)"
    ],
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000",
    icon: Calculator,
    color: "text-emerald-600 bg-emerald-100"
  },
  [AppView.PROMOTIONS]: {
    title: "Gerador de Promoções",
    subtitle: "Textos que vendem na hora.",
    description: "Precisa limpar o estoque ou bombar o movimento na terça-feira? Nossa IA cria textos de venda focados em conversão imediata para WhatsApp e Instagram, usando gatilhos mentais de urgência, escassez e desejo.",
    benefits: [
      "Textos formatados para WhatsApp",
      "Gatilhos mentais de alta conversão",
      "Variedade de tons (Urgente, Divertido, VIP)",
      "Economia de tempo criativo"
    ],
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1000",
    icon: Percent,
    color: "text-green-600 bg-green-100"
  },
  [AppView.SOCIAL_POSTS]: {
    title: "Planejador de Social Media",
    subtitle: "Sua agência de marketing automática.",
    description: "Manter o Instagram ativo é exaustivo. O Social Planner cria um calendário editorial completo para a semana toda em segundos, com ideias de posts, legendas prontas e hashtags estratégicas para o seu nicho.",
    benefits: [
      "Calendário semanal completo",
      "Ideias infinitas de conteúdo",
      "Legendas prontas para copiar e colar",
      "Mix de conteúdo (Vendas, Engajamento, Educativo)"
    ],
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=1000",
    icon: CalendarDays,
    color: "text-cyan-600 bg-cyan-100"
  },
  [AppView.BRAND_IDENTITY]: {
    title: "Identidade Verbal",
    subtitle: "A alma da sua marca, definida.",
    description: "Marcas fortes têm personalidade. Se você não sabe definir sua missão ou tom de voz, seus clientes também não saberão quem você é. Nossa IA estrutura toda a parte estratégica da sua marca para você se conectar emocionalmente com o público.",
    benefits: [
      "Missão, Visão e Valores claros",
      "Definição de Tom de Voz único",
      "Frases de efeito para embalagens",
      "Slogans memoráveis"
    ],
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000",
    icon: Feather,
    color: "text-amber-600 bg-amber-100"
  },
  [AppView.LOGO_CREATOR]: {
    title: "Logo Maker AI",
    subtitle: "Design profissional em segundos.",
    description: "Não use logos genéricos. Nossa inteligência artificial cria conceitos de logotipos vetoriais baseados no seu nicho e estilo, perfeitos para começar seu negócio com uma aparência profissional e confiável.",
    benefits: [
      "Criação baseada no nicho (Pizza, Sushi, etc)",
      "Vários estilos (Minimalista, Mascote, Luxo)",
      "Resultado em alta resolução",
      "Identidade visual instantânea"
    ],
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000",
    icon: PenTool,
    color: "text-violet-600 bg-violet-100"
  }
};

const ToolIntroModal: React.FC<ToolIntroModalProps> = ({ view, onClose, onConfirm }) => {
  const [dontShowToday, setDontShowToday] = useState(false);
  const data = TOOL_DATA[view];

  if (!data) {
    onConfirm(); // Se não tiver dados, abre direto
    return null;
  }

  const Icon = data.icon;

  const handleConfirm = () => {
    if (dontShowToday) {
      const today = new Date().toDateString();
      const storageKey = 'foodcraft_skipped_intros';
      let currentData = { date: today, views: [] as string[] };
      
      try {
          const stored = localStorage.getItem(storageKey);
          if (stored) {
              const parsed = JSON.parse(stored);
              // Mantém as views salvas se a data for hoje, senão reinicia com a lista vazia
              if (parsed.date === today) {
                  currentData = parsed;
              }
          }
      } catch(e) {
          // Ignora erro de parse
      }

      // Adiciona a view atual à lista se ainda não estiver
      if (!currentData.views.includes(view)) {
          currentData.views.push(view);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(currentData));
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity animate-fade-in-up"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up border border-gray-100 dark:border-gray-800 max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/10 hover:bg-black/20 text-white md:text-gray-500 md:hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Side: Image & Hook */}
        <div className="w-full md:w-2/5 relative h-48 md:h-auto">
          <div className="absolute inset-0">
            <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent md:via-transparent"></div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 text-white md:hidden">
            <h3 className="text-2xl font-bold font-serif shadow-black drop-shadow-md">{data.title}</h3>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
          
          <div className="hidden md:flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${data.color} bg-opacity-10`}>
              <Icon size={24} className={data.color.split(' ')[0]} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest ${data.color.split(' ')[0]}`}>FoodCraft AI</span>
          </div>

          <h2 className="hidden md:block text-3xl font-bold text-gray-900 dark:text-white font-serif mb-2">
            {data.title}
          </h2>
          
          <p className="text-lg font-medium text-orange-600 dark:text-orange-400 mb-4">
            {data.subtitle}
          </p>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-sm md:text-base">
            {data.description}
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
              O que você ganha:
            </h4>
            <ul className="space-y-3">
              {data.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
             <div className="flex items-center justify-end gap-2 mb-3">
                <input 
                  type="checkbox" 
                  id="dontShowToday" 
                  checked={dontShowToday}
                  onChange={(e) => setDontShowToday(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="dontShowToday" className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                  Não mostrar essa introdução hoje
                </label>
             </div>
             
             <button 
              onClick={handleConfirm}
              className="w-full px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-base hover:bg-orange-600 dark:hover:bg-gray-200 hover:text-white dark:hover:text-gray-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Começar a Usar <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ToolIntroModal;