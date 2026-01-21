
import { GoogleGenAI, Type } from "@google/genai";
import { Framework, GeneratedScript } from "../types";

// التأكد من جلب مفتاح API بشكل آمن
const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

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
  
  const ai = getAI();
  const isUpdating = mode !== 'new';
  
  const systemInstruction = `
    You are an Elite FiveM Software Engineer. Generate high-end, optimized, secure scripts.
    Framework: ${framework}.
    
    BEST PRACTICES:
    - Secure server events (prevent cheating).
    - Optimized loops (Wait(0) sparingly).
    - Clean Lua 5.4 syntax.
    - Always include fxmanifest.lua and config.lua.
    - If prompt is Arabic, write Arabic comments and descriptions.
    - Marketing descriptions must be professional and attractive.
    
    ${isUpdating ? `Context: ${context}. Existing script provided.` : ''}
    Response must strictly follow the JSON schema.
  `;

  try {
    const parts: any[] = [{ text: isUpdating 
        ? `${mode === 'fix' ? 'Fix/Patch' : 'Upgrade'} this project. Request: ${context}.`
        : `Architect a new project: ${prompt}. ${youtubeUrl ? `Refer to YT: ${youtubeUrl}` : ''}` }];

    if (imagesData) {
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
      },
    });

    const result = JSON.parse(response.text || '{}');
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: result.title || 'Elite Script',
      description: result.description || prompt,
      framework: framework,
      files: result.files || [],
      installationSteps: result.installationSteps || [],
      marketing: result.marketing,
      youtubeUrl,
      createdAt: Date.now(),
    };
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
