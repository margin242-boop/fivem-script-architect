
import { GoogleGenAI, Type } from "@google/genai";
import { Framework, GeneratedScript } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SCRIPT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    installationSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step by step instructions on how to install this specific script."
    },
    marketing: {
      type: Type.OBJECT,
      properties: {
        shortDescription: { type: Type.STRING, description: "A catchy one-liner for a store listing." },
        fullDescription: { type: Type.STRING, description: "Professional marketing description in Arabic." },
        keyFeatures: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "List of top 5 selling points."
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
  youtubeUrl?: string,
  referenceFiles?: { name: string; content: string }[]
): Promise<GeneratedScript> => {
  const isUpdating = mode !== 'new';
  
  const systemInstruction = `
    You are an expert FiveM Developer & Marketplace Architect. Your task is to generate complete, high-quality, and optimized FiveM scripts.
    The user wants a script for the ${framework} framework. 
    
    BRANDING & COPYRIGHT RULES (STRICT):
    - YOU MUST include the text "bq store" as the sole copyright holder in all generated files.
    - In fxmanifest.lua, the 'author' field MUST be "bq store".
    - Every Lua file MUST start with a large comment block mentioning bq store rights.
    - YOU MUST include a file named "LICENSE" or "حقوق_الاستخدام.txt".

    CONFIGURATION FILE RULES:
    - YOU MUST generate a dedicated configuration file named "config.lua".
    - Include helpful comments in Arabic inside "config.lua".

    CONTEXT RULES:
    - If a YouTube URL is provided, replicate functionality shown there.
    - If images are provided, replicate the UI/Design/Features shown.
    - If reference files are provided below, use them as a base or logic guide.

    Current Mode: ${mode.toUpperCase()}
    
    Rules:
    1. Include fxmanifest.lua with author "bq store".
    2. Write clean, optimized Lua code.
    3. Ensure server-side security checks.
    4. If prompt is in Arabic, respond with Arabic metadata.
    
    ${isUpdating ? `
    Original Prompt: ${prompt}
    ${mode === 'fix' ? `User Error Log: ${context}` : `User wants to ADD this feature/improvement: ${context}`}
    The existing files are: ${JSON.stringify(existingScript?.files.map(f => ({ name: f.name, content: f.content })))}
    ` : ''}

    ${referenceFiles && referenceFiles.length > 0 ? `
    REFERENCE FILES PROVIDED BY USER:
    ${referenceFiles.map(f => `FILE: ${f.name}\nCONTENT:\n${f.content}`).join('\n\n')}
    ` : ''}
    
    Response must be a structured JSON object.
  `;

  try {
    const parts: any[] = [{ text: isUpdating 
        ? `${mode === 'fix' ? 'Fix' : 'Evolve'} this FiveM script. Context: ${context}. YouTube Context: ${youtubeUrl || 'None'}.`
        : `Generate a FiveM script. Prompt: ${prompt}. YouTube Context: ${youtubeUrl || 'None'}.` }];

    if (imagesData && imagesData.length > 0) {
      imagesData.forEach(img => {
        parts.push({
          inlineData: {
            data: img.data,
            mimeType: img.mimeType,
          },
        });
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: SCRIPT_SCHEMA,
        temperature: 0.4,
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: result.title || 'Untitled Script',
      description: result.description || prompt,
      framework: framework,
      files: result.files || [],
      installationSteps: result.installationSteps || [],
      marketing: result.marketing,
      youtubeUrl,
      createdAt: Date.now(),
    };
  } catch (error) {
    console.error("Error generating script:", error);
    throw new Error("Failed to process script. Please check your connection.");
  }
};
