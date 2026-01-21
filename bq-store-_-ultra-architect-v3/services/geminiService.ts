
import { GoogleGenAI, Type } from "@google/genai";
import { Framework, GeneratedScript } from "../types";

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
    You are an Elite FiveM Software Engineer. Generate high-end, optimized, secure scripts for the bq store.
    Framework: ${framework}.
    
    BEST PRACTICES:
    - Secure server events (prevent cheating, use security checks).
    - Optimized loops (Wait(0) sparingly, use higher wait times where possible).
    - Clean Lua 5.4 syntax with professional commenting.
    - Always include fxmanifest.lua, config.lua, and clear folder structure.
    - If prompt is Arabic, write Arabic comments and marketing descriptions.
    - Marketing descriptions must be professional, attractive, and emphasize quality.
    
    ${isUpdating ? `Evolution Context: ${context}. Base project provided.` : ''}
    The response MUST be valid JSON according to the schema.
  `;

  try {
    const parts: any[] = [{ text: isUpdating 
        ? `Request: ${context}. Existing project context must be maintained.`
        : `New Project Blueprint: ${prompt}. ${youtubeUrl ? `Reference Video: ${youtubeUrl}` : ''}` }];

    if (imagesData && imagesData.length > 0) {
      imagesData.forEach(img => parts.push({ inlineData: img }));
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // استخدام Flash لضمان استقرار الطلب وسرعته على Vercel
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: SCRIPT_SCHEMA,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("AI returned empty content");
    
    const result = JSON.parse(text);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: result.title || 'Elite Project',
      description: result.description || prompt,
      framework: framework,
      files: result.files || [],
      installationSteps: result.installationSteps || [],
      marketing: result.marketing,
      youtubeUrl,
      createdAt: Date.now(),
    };
  } catch (error) {
    console.error("Critical Generation Error:", error);
    throw error;
  }
};
