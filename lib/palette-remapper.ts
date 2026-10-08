export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: string[];
}

export const RETRO_PALETTES: ColorPalette[] = [
  {
    id: "default",
    name: "Original HD-2D",
    description: "The AI generated colors with dynamic lighting",
    colors: [],
  },
  {
    id: "octopath-gold",
    name: "Octopath Lantern",
    description: "Warm candlelit golds, rich ambers, and deep soot",
    colors: ["#1c1917", "#451a03", "#78350f", "#b45309", "#d97706", "#f59e0b", "#fde047", "#fef08a"],
  },
  {
    id: "gameboy-classic",
    name: "Game Boy 1989",
    description: "Iconic 4-color pea soup LCD palette",
    colors: ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"],
  },
  {
    id: "pico-8",
    name: "Pico-8 Fantasy",
    description: "Playful 16-color fantasy console palette",
    colors: [
      "#000000", "#1D2B53", "#7E2553", "#008751", "#AB5236", "#5F574F",
      "#C2C3C7", "#FFF1E8", "#FF004D", "#FFA300", "#FFEC27", "#00E436",
      "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"
    ],
  },
  {
    id: "cyber-synth",
    name: "Cyber Neon 2.5D",
    description: "High-contrast ultraviolet, electric cyan, and hot magenta",
    colors: ["#09090b", "#18181b", "#3b0764", "#7e22ce", "#ec4899", "#f43f5e", "#06b6d4", "#38bdf8"],
  },
  {
    id: "grim-noir",
    name: "Dark Souls Crypt",
    description: "Desaturated gothic iron, bone white, and dried blood",
    colors: ["#09090b", "#18181b", "#27272a", "#3f3f46", "#52525b", "#71717a", "#991b1b", "#e4e4e7"],
  },
];
