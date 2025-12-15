
import React from 'react';
import { 
  LayoutDashboard, Utensils, ShoppingBag, Camera, Percent, CalendarDays,
  Menu as MenuIcon, X, Feather, PenTool, Calculator, ChefHat, LogOut, Moon, Sun, Plus, Zap
} from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  userCredits?: number;
  onOpenSubscription?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen, onLogout, theme, toggleTheme, userCredits = 0, onOpenSubscription }) => {
  
  const menuGroups = [
    {
      title: null, // Grupo Geral sem título visível ou título discreto
      items: [
        { id: AppView.DASHBOARD, label: 'Visão Geral', icon: <LayoutDashboard size={20} /> },
      ]
    },
    {
      title: 'Criação Visual',
      items: [
        { id: AppView.MENU_CREATOR, label: 'Cardápio Digital', icon: <Utensils size={20} /> },
        { id: AppView.PHOTO_STUDIO, label: 'Estúdio IA', icon: <Camera size={20} /> },
        { id: AppView.LOGO_CREATOR, label: 'Logo Maker', icon: <PenTool size={20} /> },
      ]
    },
    {
      title: 'Marketing',
      items: [
        { id: AppView.SOCIAL_POSTS, label: 'Posts Sociais', icon: <CalendarDays size={20} /> },
        { id: AppView.PROMOTIONS, label: 'Promoções', icon: <Percent size={20} /> },
        { id: AppView.CATALOG_IMPROVER, label: 'Catálogo & SEO', icon: <ShoppingBag size={20} /> },
      ]
    },
    {
      title: 'Estratégia',
      items: [
        { id: AppView.PRICE_WIZARD, label: 'Precificação', icon: <Calculator size={20} /> },
        { id: AppView.BRAND_IDENTITY, label: 'Identidade Verbal', icon: <Feather size={20} /> },
      ]
    }
  ];

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg text-orange-600 dark:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X /> : <MenuIcon />}
        </button>
      </div>

      <div className={`
        fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 transition duration-200 ease-in-out
        w-72 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 shadow-xl z-40 flex flex-col border-r border-gray-100 dark:border-gray-800
      `}>
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-orange-200 dark:shadow-none text-white">
            <ChefHat size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight font-serif">
            FoodCraft
          </h1>
          <p className="text-[10px] text-orange-500 uppercase tracking-widest mt-1 font-semibold">Gastronomy AI</p>
        </div>

        {/* Credit Display */}
        {onOpenSubscription && (
          <div className="px-6 py-4">
            <button 
              className="w-full bg-gray-900 dark:bg-gray-800 rounded-xl p-4 text-white relative overflow-hidden group cursor-pointer shadow-lg text-left focus:outline-none focus:ring-2 focus:ring-orange-500" 
              onClick={onOpenSubscription}
              aria-label={`Você tem ${userCredits} créditos. Clique para adicionar mais.`}
            >
               <div className="absolute top-0 right-0 p-8 bg-orange-500/20 rounded-full blur-xl -mr-4 -mt-4"></div>
               <div className="flex justify-between items-center mb-1 relative z-10">
                  <span className="text-xs font-bold text-gray-400 uppercase">Seus Créditos</span>
                  <Zap size={14} className="text-yellow-400 fill-yellow-400"/>
               </div>
               <div className="text-3xl font-black mb-3 relative z-10">{userCredits}</div>
               <div className="w-full py-2 bg-orange-600 group-hover:bg-orange-500 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-md">
                  <Plus size={12} strokeWidth={3}/> Adicionar / Upgrade
               </div>
            </button>
          </div>
        )}

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar" aria-label="Menu Principal">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6" role="group" aria-label={group.title || "Geral"}>
              {group.title && (
                <h3 className="px-4 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id);
                      setIsOpen(false);
                    }}
                    aria-current={currentView === item.id ? 'page' : undefined}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-orange-500
                      ${currentView === item.id 
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-bold shadow-sm' 
                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                    `}
                  >
                    <span className={`transition-transform duration-200 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="text-sm tracking-wide">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-3 bg-gray-50/50 dark:bg-gray-900/50">
           <button 
             onClick={toggleTheme}
             aria-label={theme === 'dark' ? "Ativar modo claro" : "Ativar modo escuro"}
             className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
           >
             <span className="text-xs font-bold uppercase tracking-wider">Modo Escuro</span>
             {theme === 'dark' ? <Moon size={16} className="text-indigo-400 fill-indigo-400" /> : <Sun size={16} className="text-amber-500" />}
           </button>
           
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
           >
             <LogOut size={18} />
             <span className="font-medium text-sm">Sair da Conta</span>
           </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
