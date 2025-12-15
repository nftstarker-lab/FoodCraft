
export interface PromptItem {
  id: string;
  title: string;
  description: string;
  price: number; // Preço sugerido em reais
  features: string[];
}

export interface CustomerData {
  name: string;
  email: string;
  cellphone: string;
  taxId: string; // CPF/CNPJ
  amount: number; // Valor que o usuário quer pagar
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  MENU_CREATOR = 'MENU_CREATOR',
  PHOTO_STUDIO = 'PHOTO_STUDIO',
  LOGO_CREATOR = 'LOGO_CREATOR',
  SOCIAL_POSTS = 'SOCIAL_POSTS',
  PROMOTIONS = 'PROMOTIONS',
  CATALOG_IMPROVER = 'CATALOG_IMPROVER',
  PRICE_WIZARD = 'PRICE_WIZARD',
  BRAND_IDENTITY = 'BRAND_IDENTITY'
}

export type PlanType = 'free' | 'pro' | 'master';

export interface User {
  id: string;
  email: string;
  name: string;
  plan?: PlanType;
  credits?: number;
}

export interface CatalogItem {
  id: string;
  name: string;
  ingredients: string;
  price: string;
  description?: string;
}

export interface UserCategory {
  id: string;
  name: string;
  items: CatalogItem[];
}

export interface MenuCategory {
  title: string;
  items: CatalogItem[];
}

export interface MenuDesign {
  restaurantName: string;
  layoutStyle: string;
  fontStyle: string;
  themeColor: string;
  categories: MenuCategory[];
  backgroundImageUrl?: string;
  logo?: string | null;
}

export interface SocialPost {
  day: string;
  topic: string;
  caption: string;
  hashtags: string[];
}

export interface BrandInput {
  brandName: string;
  industry: string;
  description: string;
  toneExamples: string;
}

export interface BrandIdentity {
  slogans: string[];
  mission: string;
  vision: string;
  values: string[];
  toneOfVoice: string;
  packagingPhrases: string[];
  socialMediaPhrases: string[];
}

export interface PricingInput {
  productName: string;
  ingredientsCost: number;
  operationalCost: number;
  desiredMargin: number;
}

export interface PricingStrategy {
  idealPrice: number;
  netProfit: number;
  combos: string[];
  strategy: string;
}
