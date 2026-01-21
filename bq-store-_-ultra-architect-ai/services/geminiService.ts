
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
        shortDescription: { type: Type.STRING, description: "A catchy one-liner for the script." },
        fullDescription: { type: Type.STRING, description: "Detailed description of the script features in Arabic." },
        keyFeatures: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "List of main features."
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
    You are a World-Class FiveM Developer. Your task is to generate complete, high-quality, and optimized scripts.
    Framework: ${framework}.
    
    GUIDELINES:
    - Write professional, clean, and optimized Lua code.
    - Follow FiveM best practices (Statebag, optimized loops, server-side security).
    - If images or YouTube URLs are provided, use them to guide the UI and logic.
    - Always include an fxmanifest.lua.
    - Create a config.lua for customizable options.
    - Use Arabic for comments and descriptions if the prompt is in Arabic.
    
    ${isUpdating ? `
    Original Prompt: ${prompt}
    ${mode === 'fix' ? `User Error Log: ${context}` : `User wants to ADD this feature/improvement: ${context}`}
    The existing files are: ${JSON.stringify(existingScript?.files.map(f => ({ name: f.name, content: f.content })))}
    ` : ''}

    ${referenceFiles && referenceFiles.length > 0 ? `
    REFERENCE FILES:
    ${referenceFiles.map(f => `FILE: ${f.name}\nCONTENT:\n${f.content}`).join('\n\n')}
    ` : ''}
    
    Response must be a structured JSON object.
  `;

  try {
    const parts: any[] = [{ text: isUpdating 
        ? `${mode === 'fix' ? 'Fix' : 'Evolve'} this FiveM script. Context: ${context}.`
        : `Generate a FiveM script based on: ${prompt}.` }];

    if (imagesData && imagesData.length > 0) {
      imagesData.forEach(img => {
        parts.push({
          inlineData: { data: img.data, mimeType: img.mimeType },
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
        temperature: 0.7,
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
    throw new Error("Failed to generate script. Please try again.");
  }
};
