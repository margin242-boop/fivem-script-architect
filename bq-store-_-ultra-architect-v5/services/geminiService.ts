
import { GoogleGenAI, Type } from "@google/genai";
import { Framework, GeneratedScript } from "../types";

// تعريف الهيكل المتوقع للاستجابة من Gemini لضمان الحصول على JSON سليم دائماً
const SCRIPT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    installationSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    marketing: {
      type: Type.OBJECT,
      properties: {
        shortDescription: { type: Type.STRING },
        fullDescription: { type: Type.STRING },
        keyFeatures: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING }
        }
      },
      required: ["shortDescription", "fullDescription", "keyFeatures"]
    },
    files: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          content: { type: Type.STRING },
          language: { type: Type.STRING },
        },
        required: ["name", "content", "language"],
      },
    },
  },
  required: ["title", "description", "files", "installationSteps", "marketing"],
};

/**
 * يقوم بتوليد سكربت FiveM احترافي بناءً على مدخلات المستخدم.
 */
export const generateFiveMScript = async (
  prompt: string, 
  framework: Framework, 
  imagesData?: { data: string; mimeType: string }[],
  existingScript?: GeneratedScript, 
  mode: 'new' | 'fix' | 'evolve' = 'new',
  context?: string,
  youtubeUrl?: string
): Promise<GeneratedScript> => {
  
  // تهيئة العميل باستخدام المفتاح المحقن برمجياً
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isUpdating = mode !== 'new';
  
  const systemInstruction = `
    You are an Elite FiveM Software Engineer at bq store. 
    Your mission is to generate high-end, production-ready scripts for ${framework}.
    
    CODING STANDARDS:
    - SECURITY: Sanitize all inputs, secure server-side events, and prevent injection/cheating.
    - OPTIMIZATION: Ensure low MS usage (0.01ms target), optimized loops, and efficient data handling.
    - SYNTAX: Use modern Lua 5.4 practices.
    - STRUCTURE: Always provide fxmanifest.lua, config.lua (with detailed options), client.lua, and server.lua.
    - LOCALIZATION: If the user prompts in Arabic, all comments and marketing text MUST be in professional Arabic.
    
    MARKETING:
    The 'marketing' field should contain catchy, professional sales copy for a premium store listing.
    
    The response MUST be strictly valid JSON.
  `;

  try {
    const parts: any[] = [{ text: isUpdating 
        ? `UPDATE REQUEST: ${context}. Keep existing logic but evolve it. Base: ${prompt}`
        : `NEW ELITE PROJECT: ${prompt}. ${youtubeUrl ? `Referencing Video Logic: ${youtubeUrl}` : ''}` }];

    if (imagesData && imagesData.length > 0) {
      imagesData.forEach(img => parts.push({ inlineData: img }));
    }

    // استخدام gemini-3-pro-preview للمهام البرمجية المعقدة
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: SCRIPT_SCHEMA,
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 0 } // تعطيل التفكير لسرعة الاستجابة في هذا النوع من المهام
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response");
    
    const result = JSON.parse(text);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: result.title || 'Premium bq Script',
      description: result.description || prompt,
      framework: framework,
      files: result.files || [],
      installationSteps: result.installationSteps || [],
      marketing: result.marketing,
      youtubeUrl,
      createdAt: Date.now(),
    };
  } catch (error) {
    console.error("Critical Generation Failure:", error);
    throw error;
  }
};
