
import React, { useState, useEffect } from 'react';
import { AppView, User, PlanType } from './types';
import { authService } from './services/authService';
import { supabase } from './lib/supabaseClient';

// Components
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import LandingPage from './components/LandingPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import ToolIntroModal from './components/ToolIntroModal';
import SubscriptionModal from './components/SubscriptionModal';

// Views
import MenuCreator from './components/MenuCreator';
import CatalogImprover from './components/CatalogImprover';
import PhotoStudio from './components/PhotoStudio';
import PromotionGenerator from './components/PromotionGenerator';
import SocialPosts from './components/SocialPosts';
import BrandIdentityCreator from './components/BrandIdentityCreator';
import LogoCreator from './components/LogoCreator';
import PriceWizard from './components/PriceWizard';

// Icons
import { ArrowRight, Sparkles, Zap, Camera, CalendarDays, Percent, ShoppingBag, Calculator, Feather, PenTool } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const [introModalView, setIntroModalView] = useState<AppView | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('foodcraft_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    } else {
       document.documentElement.classList.remove('dark');
    }
  }, []);

  // Check URL parameters for payment return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment_status');

    if (paymentStatus === 'success') {
      setPaymentSuccess(true);
      setIsSubscriptionModalOpen(true);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('foodcraft_theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // Inicialização e Listener de Auth do Supabase
  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      // Timeout de segurança: Se a verificação demorar mais de 3s (ex: supabase fora do ar), libera o app
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('timeout'), 3000));
      
      try {
        const userResult = await Promise.race([
            authService.getCurrentUser(),
            timeoutPromise
        ]);

        if (mounted) {
            if (userResult !== 'timeout') {
                setUser(userResult as User | null);
            } else {
                console.warn("Auth check timed out, proceeding as guest initially.");
            }
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkUser();

    // Listener para mudanças de estado (login, logout, refresh de token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' && session?.user) {
         // Recarrega dados completos (incluindo perfil/créditos)
         const fullUser = await authService.getCurrentUser();
         if(mounted) setUser(fullUser);
      } else if (event === 'SIGNED_OUT') {
         if(mounted) {
             setUser(null);
             setCurrentView(AppView.DASHBOARD);
         }
      }
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
  }, []);

  const handleNavigate = (view: AppView) => {
    if (view === AppView.DASHBOARD) {
        setCurrentView(view);
    } else {
        setIntroModalView(view);
    }
  };

  const confirmToolEntry = () => {
      if (introModalView) {
          setCurrentView(introModalView);
          setIntroModalView(null);
      }
  };

  const handleLogout = async () => {
    await authService.logout();
    // User state set to null by the onAuthStateChange listener
  };

  const handleUpdateUser = async (creditsToAdd: number, newPlan?: PlanType) => {
    if (!user) return;
    
    const updatedUser = { 
        ...user, 
        credits: (user.credits || 0) + creditsToAdd,
        plan: newPlan || user.plan
    };
    
    setUser(updatedUser);
    
    // Persistência no Supabase
    try {
        await authService.updateUserData(user.id, { 
            credits: updatedUser.credits,
            plan: updatedUser.plan
        });
    } catch (e) {
        console.error("Failed to sync credits", e);
    }
  };

  const handleConsumeCredit = async (amount: number) => {
    if (!user) return;
    const newCredits = Math.max(0, (user.credits || 0) - amount);
    setUser({ ...user, credits: newCredits });
    
    try {
        await authService.updateUserData(user.id, { credits: newCredits });
    } catch(e) { console.error(e); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage 
          onGetStarted={() => setIsAuthModalOpen(true)} 
          onLogin={() => setIsAuthModalOpen(true)}
        />
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onLogin={(u) => { 
            // O listener do Supabase cuidará do setUser
            setIsAuthModalOpen(false); 
          }} 
        />
      </>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-[#fdfbf7]'}`}>
      
      {introModalView && (
          <ToolIntroModal 
            view={introModalView} 
            onClose={() => setIntroModalView(null)} 
            onConfirm={confirmToolEntry} 
          />
      )}

      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          currentView={currentView} 
          setView={handleNavigate} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
          userCredits={user.credits || 0}
          onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto w-full relative custom-scrollbar">
          {currentView === AppView.DASHBOARD && (
            <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up space-y-10">
              
              <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white shadow-2xl group">
                <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
                  <img src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-30" alt="Kitchen Background" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
                </div>
                <div className="relative z-10 p-10 md:p-14">
                  <div className="flex items-center gap-2 mb-4 text-orange-400 font-bold tracking-widest uppercase text-xs">
                    <Sparkles size={14} />
                    <span>Painel de Controle IA</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 leading-tight">
                    Olá, Chef {user.name.split(' ')[0]}. <br/>
                    <span className="text-gray-400">Pronto para dominar o mercado?</span>
                  </h1>
                  <p className="text-gray-300 max-w-xl text-lg mb-8 leading-relaxed">
                    Sua suíte criativa está pronta. Comece criando um cardápio vendedor ou melhore as fotos dos seus pratos agora mesmo.
                  </p>
                  <button onClick={() => handleNavigate(AppView.MENU_CREATOR)} className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-orange-500 transition shadow-lg shadow-orange-900/50 flex items-center gap-3 transform hover:-translate-y-1">
                    Criar Novo Cardápio <ArrowRight size={18} />
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2 font-serif">
                    <Zap className="text-yellow-500 fill-yellow-500" size={24} /> Ferramentas de Poder
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div onClick={() => handleNavigate(AppView.PHOTO_STUDIO)} className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-indigo-600 text-white cursor-pointer shadow-xl transition-all hover:shadow-2xl hover:scale-[1.01]">
                     <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity bg-[url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent"></div>
                     <div className="relative p-8 h-full flex flex-col justify-end min-h-[260px]">
                        <div className="mb-auto p-3 bg-white/10 w-fit rounded-xl backdrop-blur-md shadow-inner"><Camera size={28} /></div>
                        <h3 className="text-3xl font-bold mb-2">Estúdio Fotográfico IA</h3>
                        <p className="text-indigo-100 max-w-md text-lg">Transforme fotos de celular em produções de estúdio. Aumente o apetite dos seus clientes com imagens profissionais.</p>
                     </div>
                  </div>

                  <div onClick={() => handleNavigate(AppView.SOCIAL_POSTS)} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white cursor-pointer shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02]">
                     <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                     <div className="relative p-8 h-full flex flex-col">
                        <div className="mb-4 p-3 bg-white/20 w-fit rounded-xl"><CalendarDays size={24} /></div>
                        <h3 className="text-2xl font-bold mb-2">Social Planner</h3>
                        <p className="text-cyan-100 text-sm mb-6 leading-relaxed">Nunca mais fique sem ideias. Gere um calendário completo de posts em segundos.</p>
                        <div className="mt-auto flex items-center gap-2 text-sm font-bold bg-white/20 w-fit px-4 py-2 rounded-lg backdrop-blur-sm group-hover:bg-white group-hover:text-cyan-600 transition-colors">
                          Gerar Posts <ArrowRight size={14} />
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                   { id: AppView.PROMOTIONS, title: 'Promoções', desc: 'Copywriting para vendas', icon: Percent, color: 'bg-green-100 text-green-600', hover: 'hover:border-green-500' },
                   { id: AppView.CATALOG_IMPROVER, title: 'Catálogo SEO', desc: 'Descrições otimizadas', icon: ShoppingBag, color: 'bg-pink-100 text-pink-600', hover: 'hover:border-pink-500' },
                   { id: AppView.PRICE_WIZARD, title: 'Precificação', desc: 'Calculadora de lucro', icon: Calculator, color: 'bg-emerald-100 text-emerald-600', hover: 'hover:border-emerald-500' },
                   { id: AppView.BRAND_IDENTITY, title: 'Identidade', desc: 'Missão e valores', icon: Feather, color: 'bg-amber-100 text-amber-600', hover: 'hover:border-amber-500' },
                 ].map(item => (
                   <div key={item.id} onClick={() => handleNavigate(item.id as any)} className={`bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group ${item.hover} relative overflow-hidden`}>
                      <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm`}>
                         <item.icon size={24} />
                      </div>
                      <h3 className="font-bold text-gray-800 dark:text-white text-lg">{item.title}</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{item.desc}</p>
                      <div className="h-1 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mt-4 group-hover:w-full transition-all duration-500"></div>
                   </div>
                 ))}
              </div>

              <div onClick={() => handleNavigate(AppView.LOGO_CREATOR)} className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl p-8 text-white shadow-lg cursor-pointer relative overflow-hidden group hover:shadow-xl transition-all transform hover:scale-[1.005]">
                  <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1626785774573-4b7993143a26?auto=format&fit=crop&q=80')] bg-cover opacity-20 mix-blend-overlay group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                     <div>
                        <h3 className="text-2xl font-bold mb-1">Precisa de uma marca nova?</h3>
                        <p className="text-violet-100 opacity-90">Crie logotipos profissionais e vetoriais baseados no seu nicho de mercado.</p>
                     </div>
                     <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-violet-600 transition-all shadow-lg shrink-0">
                        <PenTool size={24} />
                     </div>
                  </div>
              </div>

            </div>
          )}

          {currentView === AppView.MENU_CREATOR && (
            <MenuCreator 
              userCredits={user.credits} 
              onOpenSubscription={() => setIsSubscriptionModalOpen(true)} 
              onConsumeCredit={handleConsumeCredit} 
            />
          )}
          {currentView === AppView.CATALOG_IMPROVER && <CatalogImprover />}
          {currentView === AppView.PHOTO_STUDIO && (
            <PhotoStudio 
              userCredits={user.credits} 
              onOpenSubscription={() => setIsSubscriptionModalOpen(true)} 
              onConsumeCredit={handleConsumeCredit} 
            />
          )}
          {currentView === AppView.PROMOTIONS && <PromotionGenerator />}
          {currentView === AppView.SOCIAL_POSTS && <SocialPosts />}
          {currentView === AppView.BRAND_IDENTITY && <BrandIdentityCreator />}
          {currentView === AppView.LOGO_CREATOR && (
            <LogoCreator 
              userCredits={user.credits} 
              onOpenSubscription={() => setIsSubscriptionModalOpen(true)} 
              onConsumeCredit={handleConsumeCredit} 
            />
          )}
          {currentView === AppView.PRICE_WIZARD && <PriceWizard />}
        </main>
      </div>

      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen}
        onClose={() => { setIsSubscriptionModalOpen(false); setPaymentSuccess(false); }}
        onUpdateUser={handleUpdateUser}
        currentPlan={user.plan || 'free'}
        userEmail={user.email}
        initialSuccess={paymentSuccess}
      />
    </div>
  );
};

export default App;
