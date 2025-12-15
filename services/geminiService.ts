import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MenuDesign, UserCategory, SocialPost, BrandInput, BrandIdentity, PricingInput, PricingStrategy } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: apiKey });

// --- MENU CREATOR ---

const menuDesignSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    restaurantName: { type: Type.STRING },
    layoutStyle: { type: Type.STRING, enum: ['CLASSIC', 'MODERN', 'RUSTIC'] },
    fontStyle: { type: Type.STRING, enum: ['serif', 'script', 'sans'] },
    themeColor: { type: Type.STRING },
    categories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                ingredients: { type: Type.STRING },
                price: { type: Type.STRING },
                description: { type: Type.STRING },
              }
            }
          }
        }
      }
    }
  },
  required: ["restaurantName", "layoutStyle", "themeColor", "categories"]
};

export const generateMenuStructure = async (restaurantName: string, designDescription: string, categories: UserCategory[]): Promise<MenuDesign> => {
  // Switched to Flash for speed.
  const model = "gemini-2.5-flash"; 
  
  const prompt = `
    Atue como um Designer de Cardápios Brasileiro Profissional.
    Crie a estrutura de design para um restaurante chamado "${restaurantName}".
    Preferência de Estilo Visual: ${designDescription}.
    
    IDIOMA OBRIGATÓRIO: PORTUGUÊS (BRASIL).

    Baseado na preferência de estilo, escolha um layoutStyle (CLASSIC, MODERN, ou RUSTIC), um fontStyle, e uma themeColor.
    
    REGRAS ESTRITAS DE CONTEÚDO (CRÍTICO):
    1. MANTENHA EXATAMENTE o nome das categorias fornecidas. NÃO altere.
    2. MANTENHA EXATAMENTE o nome dos itens (pratos). NÃO altere.
    3. MANTENHA EXATAMENTE a lista de ingredientes como 'ingredients'.
    4. PROIBIDO INVENTAR DESCRIÇÕES: Se o item não tiver descrição, copie EXATAMENTE o conteúdo de 'ingredients' para o campo 'description'. NÃO adicione adjetivos como "delicioso", "suculento" se não existirem no original.
    5. O objetivo é organizar visualmente, não reescrever o texto do cliente.

    Dados Brutos das Categorias fornecidos pelo usuário:
    ${JSON.stringify(categories)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: menuDesignSchema,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as MenuDesign;
    }
  } catch (error) {
    console.error("Erro na geração estruturada, tentando fallback...", error);
  }

  // Fallback básico caso o modelo falhe
  return {
    restaurantName,
    layoutStyle: 'MODERN',
    fontStyle: 'sans',
    themeColor: '#333333',
    categories: categories.map(c => ({
      title: c.name,
      items: c.items.map(i => ({
        ...i,
        description: i.ingredients // Fallback to raw ingredients
      }))
    }))
  };
};

export const generateMenuBackground = async (styleId: string, restaurantName: string, layoutStyle: string, customVisuals: string = ""): Promise<string> => {
  const model = "gemini-3-pro-image-preview";
  
  let texturePrompt = "";

  // Mapeamento de Estilos Selecionáveis para Prompts de Alta Qualidade
  switch (styleId) {
    case 'CHALKBOARD':
        texturePrompt = "Black chalkboard texture with artistic white chalk dust, hand-drawn food doodles on the borders";
        break;
    case 'WATERCOLOR':
        texturePrompt = "Soft white paper texture with beautiful watercolor splashes of herbs and vegetables on the corners, pastel colors, artistic";
        break;
    case 'MINIMALIST':
        texturePrompt = "Clean high-end white marble texture, very subtle grey veins, plenty of negative space, ultra modern";
        break;
    case 'DARK_LUXURY':
        texturePrompt = "Premium black leather or matte dark stone texture, subtle gold geometric lines on edges, sophisticated, moody lighting";
        break;
    case 'RUSTIC_KRAFT':
        texturePrompt = "Vintage brown kraft paper texture, crumpled paper effect, stamp style illustrations of ingredients, warm tones";
        break;
    case 'TROPICAL':
        texturePrompt = "Elegant botanical illustration background, palm leaves and tropical flowers on edges, soft cream background, artistic painting style, NOT a stock photo";
        break;
    default:
        texturePrompt = "Elegant restaurant menu background, subtle texture, professional design";
  }

  const prompt = `Create a high quality full-page background image for a restaurant menu. 
  Restaurant Name: ${restaurantName}.
  Style Theme: ${texturePrompt}.
  
  USER SPECIFIC REQUESTS (Must include these elements): ${customVisuals}.
  
  The image should be a full canvas texture/wallpaper suitable for placing text over it. 
  Center should be relatively clean to ensure text readability.
  Make it look artistic, high resolution, 8k, award winning design.
  
  NEGATIVE PROMPT (STRICTLY FORBIDDEN): Do NOT include any text, letters, watermarks, copyright symbols, 'gettyimages' logos, signatures, or stock photo overlay UI. The image must be clean of any writing.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio: "3:4" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
  } catch (error) {
    console.warn("Gemini 3 Pro Image failed, trying fallback...", error);
    try {
       const fallbackResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: { parts: [{ text: prompt }] },
      });
      for (const part of fallbackResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
      }
    } catch (e) {
      console.error("All image generation failed");
    }
  }
  return ""; 
};

// --- CATALOG IMPROVER ---

export const improveCatalogDescription = async (productName: string, currentDesc: string): Promise<string> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    You are an expert Copywriter and SEO specialist.
    Write a persuasive, high-converting product description for: "${productName}".
    
    Current details provided: "${currentDesc}".
    
    The output should be in Markdown format.
    Include:
    1. A catchy H1 title.
    2. An engaging opening paragraph focusing on benefits.
    3. A bulleted list of features/specifications (H2: Características).
    4. Highlight key selling points using **bold text** for emphasis.
    5. Use emojis where appropriate.
    
    Language: Portuguese (Brazil).
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });

  return response.text || "Could not generate description.";
};

// --- PHOTO STUDIO ---

export const enhanceFoodPhoto = async (base64Image: string, styleId: string): Promise<string> => {
  const model = "gemini-3-pro-image-preview";
  
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
  const mimeType = matches ? matches[1] : 'image/jpeg';
  const data = matches ? matches[2] : base64Image;

  // Mapeamento detalhado dos estilos para prompts de engenharia de alta qualidade
  let detailedPrompt = "";
  
  switch (styleId) {
    case 'Vibrant Advertising': // Publicidade Pop
        detailedPrompt = "Commercial Pop Art Food Photography. High saturation, vivid colors, high contrast, hard lighting, punchy and energetic aesthetic. Make the food look glossy, juicy and explosive. Clean, solid or gradient colorful background. Advertising standard, 8k resolution.";
        break;
    case 'Professional Studio':
        detailedPrompt = "High-end professional food photography, Michelin star style. Perfect soft studio lighting, infinity cove background or neutral surface, razor sharp focus, macro details. Ultra-realistic, appetizing, and clean composition.";
        break;
    case 'Rustic Wood Table':
        detailedPrompt = "Rustic farm-to-table aesthetic. Dark aged wooden table surface, soft natural daylight window lighting (chiaroscuro), warm earth tones. Fresh ingredients scattered nearby, artisan napkin, cozy atmosphere.";
        break;
    case 'Dark & Moody':
        detailedPrompt = "Dark and moody 'Dark Gourmet' aesthetic. Low key lighting, dramatic shadows, black or dark slate background. Elegant, sophisticated, mysterious vibe. Focus on textures and steam. High contrast.";
        break;
    case 'Morning Light':
        detailedPrompt = "Bright and airy morning breakfast aesthetic. High key lighting, overexposed white background, sun flares, soft shadows. Fresh, wholesome, organic vibe. Pastel tones, linen textures.";
        break;
    default:
        detailedPrompt = `Professional food photography style: ${styleId}. High quality, appetizing, award-winning composition.`;
  }

  const prompt = `Enhance this food/product photo to look like a world-class advertisement.
  Target Style Description: ${detailedPrompt}
  
  INSTRUCTIONS:
  - Keep the main food subject recognizable but make it look significantly more appetizing (remove imperfections, enhance textures).
  - Completely replace the background to match the requested style.
  - Adjust lighting and color grading to match the style description perfectly.
  - Output must be photo-realistic 8k resolution.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { mimeType, data } },
        { text: prompt }
      ]
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
  }
  throw new Error("No image generated");
};

// --- PROMOTION GENERATOR ---

export const generatePromotion = async (product: string, occasion: string, discount: string, rules: string): Promise<string> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Crie um texto curto e persuasivo para WhatsApp/Instagram de uma promoção.
    Produto: ${product}
    Ocasião: ${occasion}
    Oferta: ${discount}
    Regras: ${rules}

    O texto deve usar emojis, ter quebras de linha claras, criar senso de urgência e desejo.
    Use APENAS UM asterisco (*) para negrito (ex: *Oferta*), nunca use dois (**).
    Inclua uma Chamada para Ação (CTA) no final.
    Idioma: Português (Brasil).
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });

  let text = response.text || "";
  text = text.replace(/\*\*/g, '*');
  return text;
};

// --- SOCIAL POSTS ---

function cleanJsonString(jsonString: string): string {
  let clean = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstBracket = clean.indexOf('[');
  const lastBracket = clean.lastIndexOf(']');
  
  if (firstBracket !== -1 && lastBracket !== -1) {
    return clean.substring(firstBracket, lastBracket + 1);
  }
  return clean;
}

const socialCalendarSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      day: { type: Type.STRING },
      topic: { type: Type.STRING },
      caption: { type: Type.STRING },
      hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["day", "topic", "caption", "hashtags"]
  }
};

export const generateSocialCalendar = async (niche: string): Promise<SocialPost[]> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Create a 7-day social media content calendar for a business in the niche: "${niche}".
    For each day (Segunda to Domingo), provide:
    1. A Topic/Title.
    2. A engaging Caption (legenda) in Portuguese.
    3. Relevant Hashtags.
    
    The content should be varied (educational, promotional, engaging, lifestyle).
    Language: Portuguese (Brazil).
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: socialCalendarSchema,
      },
    });

    if (response.text) {
      const cleanJson = cleanJsonString(response.text);
      return JSON.parse(cleanJson) as SocialPost[];
    }
  } catch (e) {
    console.error("Error parsing social calendar", e);
  }
  return [];
};

// --- BRAND IDENTITY ---

const brandIdentitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    slogans: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de 3 a 5 slogans." },
    mission: { type: Type.STRING },
    vision: { type: Type.STRING },
    values: { type: Type.ARRAY, items: { type: Type.STRING } },
    toneOfVoice: { type: Type.STRING },
    packagingPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
    socialMediaPhrases: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["slogans", "mission", "vision", "values", "toneOfVoice", "packagingPhrases", "socialMediaPhrases"],
};

export const generateBrandIdentity = async (input: BrandInput): Promise<BrandIdentity> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Atue como um especialista sênior em Branding.
    Crie uma identidade verbal para: ${input.brandName}, Nicho: ${input.industry}, Descrição: ${input.description}, Estilo: ${input.toneExamples}.
    Saída em Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: brandIdentitySchema,
        temperature: 0.7,
      },
    });

    if (response.text) return JSON.parse(response.text) as BrandIdentity;
    throw new Error("Erro ao gerar.");
  } catch (error) {
    console.error("Erro identidade:", error);
    throw error;
  }
};

// --- LOGO CREATOR ---

export const generateLogo = async (brandName: string, niche: string, style: string): Promise<string> => {
  const model = "gemini-3-pro-image-preview";
  
  let artisticDirection = "";
  if (style === 'minimalista') artisticDirection = "Minimalist vector logo, flat design, modern typography.";
  else if (style === 'colorido') artisticDirection = "Vibrant colorful logo, pop art style.";
  else if (style === 'dark') artisticDirection = "Dark mode luxury logo, gold on black.";
  else if (style === 'mascote') artisticDirection = "Mascot style logo, character illustration.";
  else artisticDirection = "Simple, professional vector logo.";

  const prompt = `Design a professional logo. Business: ${brandName}, Niche: ${niche}, Style: ${style} (${artisticDirection}). White background unless dark style.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (error) {
    throw new Error("Não foi possível gerar o logotipo.");
  }
  return ""; 
};

// --- PRICE WIZARD ---

const pricingStrategySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    combos: { type: Type.ARRAY, items: { type: Type.STRING } },
    strategy: { type: Type.STRING }
  },
  required: ["combos", "strategy"]
};

export const generatePricingStrategy = async (input: PricingInput): Promise<PricingStrategy> => {
  const ingredients = Number(input.ingredientsCost) || 0;
  const operational = Number(input.operationalCost) || 0;
  const marginPercent = Number(input.desiredMargin) || 0;
  
  const totalCost = ingredients + operational;
  const marginDecimal = marginPercent / 100;
  let idealPrice = marginDecimal >= 1 ? totalCost * (1 + marginDecimal) : totalCost / (1 - marginDecimal);
  const netProfit = idealPrice - totalCost;

  const model = "gemini-2.5-flash";
  const prompt = `
    Atue como consultor financeiro. Produto: "${input.productName}", Custo Ingredientes: R$ ${ingredients}, Custo Operacional: R$ ${operational}, Margem: ${marginPercent}%.
    Preço Calc: R$ ${idealPrice.toFixed(2)}, Lucro: R$ ${netProfit.toFixed(2)}.
    Gere 3 sugestões de combos e uma estratégia curta de vendas. Português.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: pricingStrategySchema },
    });

    if (response.text) {
      const aiData = JSON.parse(response.text);
      return { idealPrice, netProfit, combos: aiData.combos, strategy: aiData.strategy };
    }
  } catch (error) { console.error(error); }

  return { idealPrice, netProfit, combos: [], strategy: "Foque na qualidade." };
};