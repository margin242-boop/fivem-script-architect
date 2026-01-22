
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
  
  // نستخدم دائماً أحدث مفتاح API متوفر في البيئة
  const apiKey = process.env.API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    You are the "Ultra Architect", the most advanced FiveM Software Engineer at bq store.
    Your mission: Craft flawless, production-ready, highly-optimized FiveM scripts for ${framework}.
    
    LUXURY CODING STANDARDS:
    - MAXIMUM SECURITY: All server-side events must be secured. Sanitize all player inputs to prevent exploitation.
    - PEAK OPTIMIZATION: Ensure the script runs at a maximum of 0.01ms. Use efficient loops, local variables, and optimized data structures.
    - MODERN LUA: Use Lua 5.4 features where applicable.
    - ARCHITECTURE: Always include fxmanifest.lua (version 'cerulean'), config.lua, client.lua, and server.lua.
    
    You MUST use your "Thinking Budget" to deeply analyze the script requirements before generating the final JSON response.
  `;

  try {
    const parts: any[] = [{ text: `NEW ELITE PROJECT FOR bq store: ${prompt}` }];

    if (imagesData && imagesData.length > 0) {
      imagesData.forEach(img => parts.push({ inlineData: img }));
    }

    // استخدام موديل Gemini 3 Pro للمهام البرمجية المعقدة
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: SCRIPT_SCHEMA,
        temperature: 0.75,
        // تفعيل ميزة التفكير العميق لضمان جودة الأكواد وحل المشاكل المنطقية المعقدة
        maxOutputTokens: 24576,
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
