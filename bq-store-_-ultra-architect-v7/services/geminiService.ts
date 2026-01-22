
import { GoogleGenAI, Type } from "@google/genai";
import { Framework, GeneratedScript } from "../types";

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

export const generateFiveMScript = async (
  prompt: string, 
  framework: Framework, 
  imagesData?: { data: string; mimeType: string }[],
  existingScript?: GeneratedScript, 
  mode: 'new' | 'fix' | 'evolve' = 'new',
  context?: string,
  youtubeUrl?: string
): Promise<GeneratedScript> => {
  
  // نقوم بإنشاء مثيل جديد للـ AI عند كل طلب لضمان استخدام المفتاح الأحدث من الحوار (Dialog)
  // مفتاح API_KEY يتم حقنه تلقائياً من نظام الإيديتور أو من خلال openSelectKey()
  const apiKey = process.env.API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    You are an Elite FiveM Software Engineer at bq store. 
    Your mission is to generate high-end, production-ready scripts for ${framework}.
    
    CODING STANDARDS:
    - SECURITY: Sanitize all inputs, secure server-side events, prevent injection.
    - OPTIMIZATION: Ensure low MS usage (0.01ms target).
    - SYNTAX: Use modern Lua 5.4 practices.
    - STRUCTURE: Always provide fxmanifest.lua, config.lua, client.lua, and server.lua.
    
    The response MUST be strictly valid JSON.
  `;

  try {
    const parts: any[] = [{ text: `NEW ELITE PROJECT FOR bq store: ${prompt}` }];

    if (imagesData && imagesData.length > 0) {
      imagesData.forEach(img => parts.push({ inlineData: img }));
    }

    // نحاول استخدام gemini-3-pro-preview للجودة العالية
    // إذا واجهنا مشكلة 429 مستمرة، سنقوم بتنبيه المستخدم لاختيار مفتاح مدفوع
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: SCRIPT_SCHEMA,
        temperature: 0.7,
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
  } catch (error: any) {
    console.error("Generation Failure:", error);
    // إذا فشل الموديل الاحترافي بسبب الحصة، نحاول التنبيه في App.tsx
    throw error;
  }
};
