
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
  
  // نستخدم دائماً أحدث مفتاح API متوفر (سواء كان من البيئة أو تم اختياره يدوياً)
  const apiKey = process.env.API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    You are the "Ultra Architect", the highest-ranking FiveM Software Engineer at bq store.
    Your mission: Craft flawless, production-ready FiveM scripts for ${framework}.
    
    LUXURY CODING STANDARDS:
    - MAXIMUM SECURITY: All server-side events must be secured. Sanitize all player inputs.
    - PEAK OPTIMIZATION: Ensure the script runs at 0.01ms. Use efficient loops and data structures.
    - MODERN LUA: Use Lua 5.4 features.
    - ARCHITECTURE: Always include fxmanifest.lua (version 'cerulean'), config.lua, client.lua, and server.lua.
    
    You MUST think deeply about the logic before providing the JSON response.
  `;

  try {
    const parts: any[] = [{ text: `ELITE PROJECT INITIATION: ${prompt}` }];

    if (imagesData && imagesData.length > 0) {
      imagesData.forEach(img => parts.push({ inlineData: img }));
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: SCRIPT_SCHEMA,
        temperature: 0.8,
        // تفعيل ميزة التفكير العميق لضمان جودة الأكواد وحل المشاكل المنطقية المعقدة
        maxOutputTokens: 20480,
        thinkingConfig: { thinkingBudget: 16384 }
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Royal AI Core.");
    
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
    console.error("Critical Generation Failure:", error);
    throw error;
  }
};
