
import React, { useState, useEffect, useRef } from 'react';
import { Check, X, Zap, Crown, CreditCard, Loader2, CheckCircle2, ShieldCheck, User, Phone, FileText, Mail, ArrowRight } from 'lucide-react';
import { PLANS, CREDIT_PACKS } from '../services/subscriptionService';
import { paymentService } from '../services/paymentService';
import { PlanType } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (credits: number, plan?: PlanType) => void;
  currentPlan: PlanType;
  userEmail: string;
  initialSuccess?: boolean;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onUpdateUser, currentPlan, userEmail, initialSuccess = false }) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'credits'>('plans');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Dados do formulário para checkout
  const [formData, setFormData] = useState({
    name: '',
    cellphone: '',
    taxId: '' // CPF
  });
  
  // Estado do Item Selecionado
  const [activeItem, setActiveItem] = useState<{ type: 'plan' | 'credits', id: string, price: number, credits: number, description: string, planId?: PlanType } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'redirecting' | 'approved'>('pending');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialSuccess) {
          // Se aberto via URL de sucesso do Stripe
          setActiveItem({ type: 'credits', id: 'success_redirect', price: 0, credits: 0, description: 'Pagamento Externo' });
          setPaymentStatus('approved');
      } else {
          resetPaymentState();
      }
      modalRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, initialSuccess]);

  const resetPaymentState = () => {
      setActiveItem(null);
      setPaymentStatus('pending');
      setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!activeItem) return;
      
      // Validação básica
      if (!formData.name || !formData.cellphone || !formData.taxId) {
          alert("Por favor, preencha todos os campos para a nota fiscal.");
          return;
      }

      setLoading(true);
      setPaymentStatus('redirecting');
      
      try {
          // Verifica se é assinatura (planos pagos) ou pagamento único (créditos)
          const isSubscription = activeItem.type === 'plan' && activeItem.price > 0;

          const response = await paymentService.initiatePayment(
              activeItem.price, 
              activeItem.description, 
              {
                  name: formData.name,
                  email: userEmail,
                  taxId: formData.taxId,
                  cellphone: formData.cellphone
              },
              activeItem.id,
              isSubscription
          );
          
          if (response.success && response.url) {
              // Redireciona para o Stripe
              window.location.href = response.url;
          } else {
              alert("Erro ao criar sessão de pagamento: " + (response.error || "Desconhecido"));
              setLoading(false);
              setPaymentStatus('pending');
          }
      } catch (error: any) {
          alert("Erro no processamento: " + error.message);
          setLoading(false);
          setPaymentStatus('pending');
      }
  };

  if (!isOpen) return null;

  // --- TELA DE CHECKOUT / SUCESSO ---
  if (activeItem) {
      return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true"></div>
            <div 
              ref={modalRef}
              tabIndex={-1}
              className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-fade-in-up focus:outline-none max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {paymentStatus === 'approved' ? 'Sucesso' : 'Finalizar Compra'}
                        </h2>
                    </div>
                    <button onClick={resetPaymentState} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"><X className="text-gray-400 hover:text-gray-600" size={20} /></button>
                </div>
                
                {paymentStatus === 'approved' ? (
                    <div className="p-10 flex flex-col items-center text-center animate-fade-in-up">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center shadow-lg shadow-green-200 mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-green-600 mb-2">Pagamento Confirmado!</h3>
                        <p className="text-gray-500 mb-6">Sua conta foi atualizada com sucesso.</p>
                        {initialSuccess && (
                            <button onClick={onClose} className="bg-gray-900 text-white px-6 py-2 rounded-xl">Fechar e Começar</button>
                        )}
                    </div>
                ) : paymentStatus === 'redirecting' ? (
                    <div className="p-16 flex flex-col items-center text-center animate-fade-in-up">
                        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Processando...</h3>
                        <p className="text-gray-500">Aguarde enquanto confirmamos seus dados de pagamento.</p>
                    </div>
                ) : (
                    <div className="p-8">
                        {/* Resumo */}
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 mb-6 border border-indigo-100 dark:border-indigo-800 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Item</p>
                                <p className="font-bold text-gray-900 dark:text-white">{activeItem.description}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Valor</p>
                                <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                                    R$ {activeItem.price.toFixed(2).replace('.', ',')}
                                </p>
                            </div>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                        placeholder="Seu nome"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">E-mail</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                        type="email"
                                        value={userEmail}
                                        disabled
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">CPF</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input 
                                            name="taxId"
                                            value={formData.taxId}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                            placeholder="000.000.000-00"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Celular</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input 
                                            name="cellphone"
                                            value={formData.cellphone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                            placeholder="(11) 99999-9999"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 mt-4">
                                <ShieldCheck size={16} className="text-green-600 shrink-0" />
                                <p>Pagamento seguro e criptografado.</p>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <CreditCard />}
                                {loading ? "Processando..." : "Ir para Pagamento"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
      );
  }

  // --- TELA DE SELEÇÃO DE PLANOS (Wrapper) ---
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="plans-title">
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true"></div>
      <div ref={modalRef} tabIndex={-1} className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up focus:outline-none">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 id="plans-title" className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Desbloqueie seu Potencial</h2>
            <p className="text-gray-500 text-sm">Escolha o plano ideal para seu negócio</p>
          </div>
          <button onClick={onClose} aria-label="Fechar janela" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-none"><X size={24}/></button>
        </div>

        <div className="flex justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50" role="tablist">
           <button role="tab" aria-selected={activeTab === 'plans'} onClick={() => setActiveTab('plans')} className={`px-6 py-2 rounded-full font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${activeTab === 'plans' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}>Assinatura Mensal</button>
           <button role="tab" aria-selected={activeTab === 'credits'} onClick={() => setActiveTab('credits')} className={`px-6 py-2 rounded-full font-bold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${activeTab === 'credits' ? 'bg-orange-600 text-white shadow-lg' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}>Recarga de Créditos</button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-[#0c0c0c]">
          {activeTab === 'plans' ? (
            <div className="grid md:grid-cols-3 gap-6">
               {/* FREE PLAN */}
               <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 flex flex-col relative opacity-75">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Degustação</h3>
                  <div className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">R$ 0<span className="text-sm font-normal text-gray-500">/mês</span></div>
                  <ul className="space-y-3 mb-8 flex-1" aria-label="Benefícios do plano gratuito">
                     <li className="flex gap-2 text-sm text-gray-600 dark:text-gray-400"><Check size={16} className="text-green-500"/> Texto Ilimitado</li>
                     <li className="flex gap-2 text-sm text-gray-600 dark:text-gray-400"><Check size={16} className="text-green-500"/> 3 Créditos (Únicos)</li>
                     <li className="flex gap-2 text-sm text-gray-600 dark:text-gray-400"><Check size={16} className="text-green-500"/> Marca d'água</li>
                  </ul>
                  <button disabled={true} className="w-full py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-400 cursor-not-allowed">Plano Atual</button>
               </div>

               {/* PRO PLAN */}
               <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-orange-500 shadow-xl relative transform md:-translate-y-2 flex flex-col">
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">Mais Popular</div>
                  <h3 className="text-xl font-bold text-orange-600 mb-2 flex items-center gap-2"><Zap size={20} fill="currentColor"/> Empreendedor</h3>
                  <div className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">R$ 49,90<span className="text-sm font-normal text-gray-500">/mês</span></div>
                  <ul className="space-y-3 mb-8 flex-1" aria-label="Benefícios do plano empreendedor">
                     <li className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"><Check size={16} className="text-orange-500"/> <strong>Texto Ilimitado</strong></li>
                     <li className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"><Check size={16} className="text-orange-500"/> <strong>50 Créditos/mês</strong></li>
                     <li className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"><Check size={16} className="text-orange-500"/> Sem marca d'água</li>
                     <li className="flex gap-2 text-sm text-gray-700 dark:text-gray-300"><Check size={16} className="text-orange-500"/> Baixo custo por imagem</li>
                  </ul>
                  <button 
                    onClick={() => setActiveItem({ type: 'plan', id: 'pro', price: 49.90, credits: PLANS['pro'].credits, description: 'Plano Empreendedor', planId: 'pro' })}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-orange-600 text-white hover:bg-orange-700 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:outline-none"
                    aria-label="Assinar plano Empreendedor"
                  >
                    Assinar Agora
                  </button>
               </div>

               {/* MASTER PLAN */}
               <div className="bg-gray-900 dark:bg-black rounded-3xl p-6 border border-gray-800 flex flex-col relative text-white">
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Crown size={20} className="text-yellow-400" fill="currentColor"/> Master</h3>
                  <div className="text-3xl font-bold mb-4">R$ 129,90<span className="text-sm font-normal text-gray-500">/mês</span></div>
                  <ul className="space-y-3 mb-8 flex-1" aria-label="Benefícios do plano Master">
                     <li className="flex gap-2 text-sm text-gray-300"><Check size={16} className="text-yellow-400"/> Texto Ilimitado</li>
                     <li className="flex gap-2 text-sm text-gray-300"><Check size={16} className="text-yellow-400"/> <strong>200 Créditos/mês</strong></li>
                     <li className="flex gap-2 text-sm text-gray-300"><Check size={16} className="text-yellow-400"/> Prioridade Máxima</li>
                     <li className="flex gap-2 text-sm text-gray-300"><Check size={16} className="text-yellow-400"/> Suporte VIP</li>
                  </ul>
                  <button 
                    onClick={() => setActiveItem({ type: 'plan', id: 'master', price: 129.90, credits: PLANS['master'].credits, description: 'Plano Master', planId: 'master' })}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-white text-gray-900 hover:bg-gray-200 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-white focus:outline-none"
                    aria-label="Assinar plano Master"
                  >
                    Assinar Agora
                  </button>
               </div>
            </div>
          ) : (
            <div>
               <div className="text-center mb-8">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Créditos Avulsos (Não expiram)</h3>
                  <p className="text-gray-500 text-sm">Ideal para projetos pontuais ou complementar seu plano.</p>
               </div>
               <div className="grid md:grid-cols-3 gap-6">
                  {CREDIT_PACKS.map(pack => (
                    <div key={pack.id} className={`bg-white dark:bg-gray-800 rounded-3xl p-6 border transition-all hover:shadow-lg ${pack.popular ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 dark:border-gray-700'}`}>
                       {pack.popular && <div className="text-center mb-4"><span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Melhor Custo-Benefício</span></div>}
                       <div className="text-center mb-6">
                          <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">{pack.credits}</div>
                          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Créditos</div>
                       </div>
                       <div className="flex justify-between items-center mb-6 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                          <span className="text-gray-500 text-xs">Preço Total</span>
                          <span className="font-bold text-lg text-gray-900 dark:text-white">R$ {pack.price.toFixed(2).replace('.',',')}</span>
                       </div>
                       <button 
                        onClick={() => setActiveItem({ type: 'credits', id: pack.id, price: pack.price, credits: pack.credits, description: `Pacote ${pack.credits} Créditos` })}
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none ${pack.popular ? 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500' : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 focus:ring-gray-500'}`}
                        aria-label={`Comprar pacote de ${pack.credits} créditos`}
                       >
                          <CreditCard size={16} aria-hidden="true"/> Comprar Agora
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-center text-xs text-gray-400">
           Pagamento seguro e criptografado.
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
