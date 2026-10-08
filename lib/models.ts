export interface AIModelOption {
  id: string;
  name: string;
  provider:
    | "Google"
    | "Open-Source"
    | "Stability AI"
    | "Black Forest Labs"
    | "Alibaba Cloud"
    | "DeepSeek";
  category: "auto" | "external" | "gemini";
  shortDesc: string;
  badge?: string;
  svgCapability: string;
  isDefault?: boolean;
}

// Premier Free Open-Source Models powering the Text -> Image stage of the Inkscape SVG pipeline
export const EXTERNAL_OPEN_MODELS: AIModelOption[] = [
  {
    id: "flux-pixel",
    name: "Flux 2D Game Asset Engine",
    provider: "Black Forest Labs",
    category: "external",
    shortDesc: "Flagship 12B model tuned for crisp 2D pixel art, game sprites, and clean silhouettes",
    badge: "Top Asset Model",
    svgCapability: "Elite Text->Image Fidelity for Inkscape",
  },
  {
    id: "flux-turbo",
    name: "Flux 1.1 Turbo Speed",
    provider: "Black Forest Labs",
    category: "external",
    shortDesc: "Sub-second image generation optimized for high-speed game prototyping",
    badge: "Ultra Fast",
    svgCapability: "Fast Text->Image Pipeline",
  },
  {
    id: "sdxl-sprites",
    name: "Stable Diffusion XL Game Sprites",
    provider: "Stability AI",
    category: "external",
    shortDesc: "High-contrast character battlers, weapons, and isometric tiles with clean alpha separation",
    badge: "Game Sprites",
    svgCapability: "Clean Contrast & Layer Separation",
  },
  {
    id: "unity-craft",
    name: "Unity 2D Vector & Pixel Studio",
    provider: "Open-Source",
    category: "external",
    shortDesc: "Tuned for game engine assets, clean outlines, and modular tileable sprites",
    badge: "Engine Native",
    svgCapability: "Precise Inkscape Layer Decomposition",
  },
  {
    id: "midjourney-v6",
    name: "Cinematic HD-2D Battler Engine",
    provider: "Open-Source",
    category: "external",
    shortDesc: "Octopath Traveler and Triangle Strategy style warm amber lighting and deep shadows",
    badge: "HD-2D Master",
    svgCapability: "Rich Volumetric Lighting for Vectors",
  },
  {
    id: "dall-e-3",
    name: "Stylized Game Vector Engine",
    provider: "Open-Source",
    category: "external",
    shortDesc: "Clean flat color palettes, distinct contours, and ideal shapes for Bezier vectorization",
    badge: "Vector Optimized",
    svgCapability: "Crisp Contours for Potrace",
  },
];

// Gemini Models
export const GEMINI_SVG_MODELS: AIModelOption[] = [
  {
    id: "gemini-3.1-flash-lite-image",
    name: "Gemini 3.1 Flash Image",
    provider: "Google",
    category: "gemini",
    shortDesc: "Official Google GenAI image model with sharp prompt comprehension",
    badge: "Google Vision",
    svgCapability: "Multimodal Text->Image",
  },
  {
    id: "gemini-nano-banana-2.1",
    name: "Gemini Nano Banana 2.1 Image",
    provider: "Google",
    category: "gemini",
    shortDesc: "High-fidelity Google image generation model with 1K/2K resolution capability",
    badge: "Banana 2.1",
    svgCapability: "Ultra-Res Text->Image",
  },
];

export const FREE_MODELS: AIModelOption[] = [
  {
    id: "auto",
    name: "Auto-Failover Pool (Recommended)",
    provider: "Open-Source",
    category: "auto",
    shortDesc: "Text -> Image -> Inkscape SVG with automatic model fallback and zero downtime",
    badge: "Smart Pool",
    svgCapability: "Auto Best Available + Inkscape SVG",
    isDefault: true,
  },
  ...EXTERNAL_OPEN_MODELS,
  ...GEMINI_SVG_MODELS,
];

export const MODEL_FALLBACK_CHAIN = [
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
];

export const ALL_MODELS = FREE_MODELS;
