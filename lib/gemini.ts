import { GoogleGenAI } from "@google/genai";

let _aiInstance: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI {
  if (!_aiInstance) {
    _aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "AI_STUDIO_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return _aiInstance;
}

export const ai = new Proxy({} as GoogleGenAI, {
  get(_target, prop) {
    const instance = getGenAI();
    const val = (instance as any)[prop];
    if (typeof val === 'function') {
      return val.bind(instance);
    }
    return val;
  },
});

