
import React, { useState } from 'react';
import { ChefHat, CheckCircle2, X, ChevronDown, ChevronUp, Star, ArrowRight, Zap, ShieldCheck, Lock, DollarSign } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onGetStarted}>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <ChefHat size={24} />
            </div>
            <span className="text-xl font-bold font-serif tracking-tight text-gray-900">FoodCraft</span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={onLogin}
              className="text-sm font-bold text-gray-600 hover:text-orange-600 transition-colors hidden md:block"
            >
              Entrar
            </button>
            <button 
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-600/30 transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              Testar Gratuitamente <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* 1. TOPO DO FUNIL - HERO (SPLIT LAYOUT) */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden bg-[#fdfbf7]">
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Lado Esquerdo: Texto */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
              <Star size={14} className="fill-orange-800" />
              <span>A IA mais poderosa do ramo alimentício</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 font-serif text-gray-900 leading-[1.1] tracking-tight animate-fade-in-up">
              FoodCraft — A IA que transforma <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">seu restaurante em máquina de vendas</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed font-medium animate-fade-in-up max-w-xl" style={{ animationDelay: '0.1s' }}>
              Crie cardápios completos, fotos profissionais de pratos, promoções e todo seu marketing em segundos.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg hover:bg-orange-700 hover:shadow-2xl hover:shadow-orange-600/40 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Criar Meu Cardápio Agora
              </button>
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-2xl font-bold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                Ver Demo
              </button>
            </div>
          </div>

          {/* Lado Direito: Imagem Menor e Representativa */}
          <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
             {/* Elementos Decorativos de Fundo */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
             <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-60 h-60 bg-red-400/20 rounded-full blur-3xl"></div>
             
             {/* Imagem Principal */}
             <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700 border-4 border-white group">
                <img 
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80" 
                  alt="Chef usando tecnologia" 
                  className="w-full h-auto object-cover"
                />
                
                {/* Badge 1: Produtividade (Bottom Left) */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 max-w-[240px]">
                   <div className="flex items-center gap-2 mb-1 text-orange-600">
                      <Zap size={16} fill="currentColor" />
                      <span className="text-xs font-bold uppercase">Produtividade</span>
                   </div>
                   <p className="text-sm font-bold text-gray-800 leading-tight">Economize grande parte do tempo dedicado ao gerenciamento.</p>
                </div>

                {/* Badge 2: Economia (Top Right) */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 max-w-[240px] transform transition-transform group-hover:-translate-y-1">
                   <div className="flex items-center gap-2 mb-1 text-green-600">
                      <div className="bg-green-100 p-1 rounded-full"><DollarSign size={14} className="text-green-700" /></div>
                      <span className="text-xs font-bold uppercase">Economia Real</span>
                   </div>
                   <p className="text-sm font-bold text-gray-800 leading-tight">Reduza drasticamente seus gastos com designers.</p>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* 2. MEIO DO FUNIL - PROBLEMA VS SOLUÇÃO (VISUAL MELHORADO) */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-gray-900 mb-6">Pare de perder tempo (e dinheiro)</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Você cozinha bem, mas o marketing te consome? Veja a diferença.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Antes - Card com Sombra e Design Moderno */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
               
               <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
                    <X size={28} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Sem FoodCraft</h3>
                    <p className="text-sm text-gray-500">O jeito difícil e caro</p>
                  </div>
               </div>
               
               <ul className="space-y-5">
                  {[
                    "Perde horas tentando fazer artes no Canva.",
                    "Fotos de celular escuras e sem apetite appeal.",
                    "Cardápio em PDF feio e difícil de ler.",
                    "Redes sociais paradas por falta de ideias.",
                    "Gasta R$ 600+ com designers freelancers."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start text-gray-600 group-hover:text-gray-800 transition-colors">
                      <div className="mt-1 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                        <X size={12} className="text-red-600" strokeWidth={3} />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
               </ul>
            </div>

            {/* Depois - Card Glassmorphism com Destaque */}
            <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 shadow-2xl relative overflow-hidden transform md:-translate-y-4 hover:scale-[1.02] transition-all duration-300">
               {/* Efeitos de Fundo */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
               
               <div className="absolute top-6 right-6 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-green-500/40 animate-pulse">
                 RECOMENDADO
               </div>

               <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-6 relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-900/50">
                    <CheckCircle2 size={28} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Com FoodCraft AI</h3>
                    <p className="text-sm text-gray-400">Automático, Rápido e Lucrativo</p>
                  </div>
               </div>
               
               <ul className="space-y-5 relative z-10">
                  {[
                    "Tudo automático gerado por IA em segundos.",
                    "Fotos de estúdio profissional com 1 clique.",
                    "Cardápios digitais interativos e lindos.",
                    "Calendário de posts e legendas prontas.",
                    "Economia real de tempo e dinheiro."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start text-gray-300">
                      <div className="mt-1 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/50">
                        <CheckCircle2 size={12} className="text-green-400" strokeWidth={3} />
                      </div>
                      <span className="font-medium text-white">{item}</span>
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOWCASE DE FERRAMENTAS */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold uppercase tracking-widest text-sm">O Poder da IA</span>
            <h2 className="text-3xl md:text-5xl font-bold font-serif mt-3">Sua agência de marketing completa</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
                { title: "Cardápio Digital", desc: "Design automático e descrições persuasivas.", img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=400" },
                { title: "Estúdio de Fotos IA", desc: "Transforme fotos amadoras em profissionais.", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400" },
                { title: "Criador de Promoções", desc: "Copywriting de vendas para WhatsApp.", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=400" },
                { title: "Social Posts", desc: "Calendário editorial infinito.", img: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&q=80&w=400" },
                { title: "Catálogo & SEO", desc: "Seja encontrado no Google e iFood.", img: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=400" },
                { title: "Identidade Visual", desc: "Logos e Branding estratégico.", img: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400" },
             ].map((tool, i) => (
               <div key={i} className="group relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 hover:border-orange-500 transition-all cursor-pointer" onClick={onGetStarted}>
                  <div className="h-48 overflow-hidden">
                     <img src={tool.img} alt={tool.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" />
                  </div>
                  <div className="p-6">
                     <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
                     <p className="text-gray-400 text-sm">{tool.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 5. FUNDO DO FUNIL - PREÇOS */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 text-center">
           <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 text-gray-900">Planos Simples e Transparentes</h2>
           <p className="text-gray-500 mb-16">Cancele quando quiser. Sem letras miúdas.</p>

           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Starter */}
              <div className="p-8 rounded-3xl border border-gray-100 bg-white hover:border-gray-300 transition-all">
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                 <div className="text-4xl font-bold mb-6">R$ 0<span className="text-sm font-normal text-gray-500">/mês</span></div>
                 <p className="text-sm text-gray-500 mb-8">Para quem está começando agora.</p>
                 <button onClick={onGetStarted} className="w-full py-3 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-50 mb-8">Começar Grátis</button>
                 <ul className="space-y-3 text-left text-sm text-gray-600">
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-gray-400"/> <span>3 Gerações de Cardápio</span></li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-gray-400"/> <span>5 Fotos com IA</span></li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-gray-400"/> <span>Ferramentas básicas</span></li>
                 </ul>
              </div>

              {/* Pro */}
              <div className="p-8 rounded-3xl border-2 border-orange-500 bg-orange-50 relative transform md:-translate-y-4 shadow-xl">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-b-lg text-xs font-bold uppercase tracking-wider">Mais Popular</div>
                 <h3 className="text-xl font-bold text-orange-900 mb-2">Pro</h3>
                 <div className="text-4xl font-bold mb-6 text-orange-600">R$ 49<span className="text-sm font-normal text-gray-500">/mês</span></div>
                 <p className="text-sm text-gray-600 mb-8">Tudo ilimitado para crescer rápido.</p>
                 <button onClick={onGetStarted} className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-xl hover:shadow-lg mb-8">Assinar Pro</button>
                 <ul className="space-y-3 text-left text-sm text-gray-800">
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-orange-600"/> <span><strong>Criação Ilimitada</strong></span></li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-orange-600"/> <span>Fotos Premium (Gemini 3 Pro)</span></li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-orange-600"/> <span>Acesso a todas as 8 ferramentas</span></li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-orange-600"/> <span>Modelos Exclusivos</span></li>
                 </ul>
              </div>

              {/* Master */}
              <div className="p-8 rounded-3xl border border-gray-100 bg-white hover:border-gray-300 transition-all">
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Master</h3>
                 <div className="text-4xl font-bold mb-6">R$ 99<span className="text-sm font-normal text-gray-500">/mês</span></div>
                 <p className="text-sm text-gray-500 mb-8">Para franquias e grandes negócios.</p>
                 <button onClick={onGetStarted} className="w-full py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 mb-8">Falar com Vendas</button>
                 <ul className="space-y-3 text-left text-sm text-gray-600">
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-gray-400"/> <span>Múltiplos usuários</span></li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-gray-400"/> <span>Suporte Prioritário</span></li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-gray-400"/> <span>API de Integração</span></li>
                 </ul>
              </div>
           </div>
        </div>
      </section>

      {/* 6. PÓS-FUNIL - FAQ */}
      <section className="py-24 bg-gray-50">
         <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold font-serif text-center mb-12 text-gray-900">Perguntas Frequentes</h2>
            <div className="space-y-4">
               {[
                 { q: "O FoodCraft funciona em qualquer tipo de negócio?", a: "Sim! Hamburguerias, pizzarias, confeitarias, restaurantes japoneses e até food trucks usam." },
                 { q: "Preciso saber design ou tecnologia?", a: "Não. A IA faz 100% do trabalho pesado. Você só precisa dizer o que quer." },
                 { q: "As imagens realmente ficam profissionais?", a: "Sim. Usamos o modelo Gemini 3 Pro Image, o mais avançado do mundo para gerar fotos realistas." },
                 { q: "Tem plano gratuito?", a: "Sim, o plano Starter é gratuito para testar e criar seus primeiros materiais." },
                 { q: "Posso cancelar quando quiser?", a: "Sim, o cancelamento é feito com 1 clique no painel, sem multa." },
               ].map((item, i) => (
                 <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <button onClick={() => toggleFaq(i)} className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-800 hover:bg-gray-50">
                       {item.q}
                       {openFaq === i ? <ChevronUp size={20} className="text-orange-500"/> : <ChevronDown size={20} className="text-gray-400"/>}
                    </button>
                    {openFaq === i && (
                       <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-100 mt-2">
                          {item.a}
                       </div>
                    )}
                 </div>
               ))}
            </div>

            <div className="mt-16 bg-orange-600 rounded-3xl p-10 text-center text-white shadow-2xl shadow-orange-600/30">
               <h3 className="text-3xl font-bold font-serif mb-4">Pronto para aumentar suas vendas?</h3>
               <p className="text-orange-100 mb-8 text-lg">Junte-se a milhares de empreendedores que transformaram seus negócios com IA.</p>
               <button onClick={onGetStarted} className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Quero aumentar minhas vendas
               </button>
               <div className="flex items-center justify-center gap-6 mt-8 text-sm text-orange-200">
                  <span className="flex items-center gap-1"><ShieldCheck size={16}/> Compra Segura</span>
                  <span className="flex items-center gap-1"><Lock size={16}/> Dados Protegidos</span>
               </div>
            </div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-gray-900 text-gray-400 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-white">
              <ChefHat size={18} />
            </div>
            <span className="text-xl font-bold font-serif text-white">FoodCraft</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} FoodCraft AI. Todos os direitos reservados.</p>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
