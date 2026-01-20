
import { GoogleGenAI, Type } from "@google/genai";
import { HydrationTip } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchHydrationTip = async (): Promise<HydrationTip> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Give me a short, catchy, high-tech heroic hydration tip. Think sci-fi, cyberpunk, or elite athlete vibes. Keep it under 12 words.',
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['motivation', 'fact', 'heroic'] }
          },
          required: ['text', 'category']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error('No content returned');
  } catch (error) {
    console.error('Error fetching tip:', error);
    return {
      text: "Vitals low. Initiate H2O sequence immediately.",
      category: 'heroic'
    };
  }
};
