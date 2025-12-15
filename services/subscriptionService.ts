
import { PlanType } from '../types';

export const PLANS = {
  free: {
    id: 'free',
    name: 'Starter',
    price: 0,
    credits: 3,
    features: ['Texto Ilimitado', '3 Créditos de Imagem', 'Marca d\'água'],
    color: 'bg-gray-100 text-gray-800'
  },
  pro: {
    id: 'pro',
    name: 'Empreendedor',
    price: 49.90,
    credits: 50,
    features: ['Texto Ilimitado', '50 Créditos/mês', 'Sem marca d\'água', 'Alta Resolução'],
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  master: {
    id: 'master',
    name: 'Master',
    price: 129.90,
    credits: 200,
    features: ['Texto Ilimitado', '200 Créditos/mês', 'Prioridade na Fila', 'Brand Identity Pro'],
    color: 'bg-gray-900 text-white'
  }
};

export const CREDIT_PACKS = [
  // Planos de Teste
  { id: 'test_1', credits: 1, price: 1.00, label: 'Teste Sistema', popular: false },
  { id: 'test_5', credits: 5, price: 5.00, label: 'Teste Rápido', popular: false },
  
  // Planos Originais
  { id: 'pack_10', credits: 10, price: 19.90, label: 'Socorro Rápido', popular: false },
  { id: 'pack_50', credits: 50, price: 59.90, label: 'Cardápio Novo', popular: true },
  { id: 'pack_100', credits: 100, price: 99.90, label: 'Agência', popular: false },
];

export const subscriptionService = {
  // Helpers auxiliares se necessário
  getPlan: (id: string) => Object.values(PLANS).find(p => p.id === id),
  getPack: (id: string) => CREDIT_PACKS.find(p => p.id === id)
};
