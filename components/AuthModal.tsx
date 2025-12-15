
import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { X, ChefHat, Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle, CheckCircle, Save } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Carregar dados salvos ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      const savedCreds = localStorage.getItem('foodcraft_credentials');
      if (savedCreds) {
        try {
          const { savedEmail, savedPassword } = JSON.parse(savedCreds);
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        } catch (e) {
          console.error("Erro ao carregar credenciais", e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- FLUXO DE LOGIN ---
        const user = await authService.login(email, password);
        
        // Lógica de Salvar Senha
        if (rememberMe) {
          localStorage.setItem('foodcraft_credentials', JSON.stringify({ savedEmail: email, savedPassword: password }));
        } else {
          localStorage.removeItem('foodcraft_credentials');
        }

        onLogin(user);
      } else {
        // --- FLUXO DE CADASTRO ---
        if (!name) throw new Error("Nome é obrigatório.");
        
        await authService.register(name, email, password);
        
        // Sucesso no cadastro
        setSuccessMessage('Cadastro realizado com sucesso! Verifique seu e-mail (título: Supabase Auth) para confirmar sua conta antes de entrar.');
        setIsLogin(true); // Muda para a aba de login
        // Não limpa o email/senha para facilitar o login, apenas foca no login
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar">
        
        {/* Decorative Header */}
        <div className="bg-[#1a1a1a] p-8 text-center relative overflow-hidden shrink-0">
           <div className="absolute top-0 left-0 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl -translate-x-10 -translate-y-10"></div>
           <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl translate-x-10 translate-y-10"></div>
           
           <div className="relative z-10 flex flex-col items-center">
             <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-900/50 text-white transform hover:scale-105 transition-transform duration-500">
                <ChefHat size={32} />
             </div>
             <h2 className="text-2xl font-bold text-white font-serif tracking-wide">FoodCraft</h2>
             <p className="text-orange-400 text-sm font-medium tracking-widest uppercase mt-1">Gastronomy AI</p>
           </div>

           <button 
             onClick={onClose}
             className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
           >
             <X size={20} />
           </button>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <div className="flex gap-4 mb-8 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => { setIsLogin(true); setError(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1 animate-fade-in-up">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome do Restaurante / Chef"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all outline-none text-gray-800 placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all outline-none text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-transparent transition-all outline-none text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Remember Me Checkbox - Only show on Login */}
            {isLogin && (
              <div className="flex items-center gap-2 mt-2 px-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer accent-orange-600"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer select-none">
                  Salvar informações da conta
                </label>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 animate-fade-in-up">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            {/* Success Message (Registration) */}
            {successMessage && (
              <div className="flex items-start gap-2 text-green-700 text-sm bg-green-50 p-4 rounded-lg border border-green-200 animate-fade-in-up shadow-sm">
                <CheckCircle size={20} className="shrink-0 mt-0.5" />
                <div className="leading-tight font-medium">
                  {successMessage}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  {isLogin ? 'Acessar Painel' : 'Criar Conta'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;