"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  Dices,
  Cpu,
  ChevronDown,
} from "lucide-react";

interface GeneratorSidebarProps {
  onGenerate: (params: {
    prompt: string;
    category?: string;
    perspective?: string;
    hd2dStyle?: string;
    resolution: number;
    numColors?: number;
    removeBackground?: boolean;
    cornerSmoothing?: number;
    spritesheet: boolean;
    imageBase64?: string;
    model?: string;
  }) => Promise<void>;
  isGenerating: boolean;
  activeMode: "text" | "image" | "spritesheet";
  setActiveMode: (mode: "text" | "image" | "spritesheet") => void;
}

const PURE_PROMPT_INSPIRATIONS = [
  "22-year-old adult East Asian woman, clearly in her twenties, refined anime style. Soft mature face, large dark eyes with subtle inner glow, fair skin, short black hair with neat bangs. Slim soft feminine adult proportions. Wearing a pale lavender long-sleeved footed onesie with small darker-lavender star and planet prints. The onesie has a noticeably rounded, softly padded silhouette at the hips and seat (clear diaper bulk under the fabric, still fully covered and modest). Clean line art, soft cel shading.",
  "glowing blue mana potion in ornate faceted glass flask with gold stopper, clean line art, soft cel shading",
  "ancient runic broadsword embedded in mossy stone plinth, clean vector line art, vibrant cel shading",
  "winged gargoyle statue perched on gothic cornice, clean contours, dramatic rim lighting",
  "cyberpunk street vendor ramen cart with neon signage, vibrant cel shaded vector art",
  "sacred woodland shrine with floating cyan mana crystals and gentle spirit butterflies",
];

export function GeneratorSidebar({
  onGenerate,
  isGenerating,
  activeMode,
  setActiveMode,
}: GeneratorSidebarProps) {
  // Pure prompt by default (pre-filled with user requested anime character)
  const [prompt, setPrompt] = useState(
    "22-year-old adult East Asian woman, clearly in her twenties, refined anime style. Soft mature face, large dark eyes with subtle inner glow, fair skin, short black hair with neat bangs. Slim soft feminine adult proportions. Wearing a pale lavender long-sleeved footed onesie with small darker-lavender star and planet prints. The onesie has a noticeably rounded, softly padded silhouette at the hips and seat (clear diaper bulk under the fabric, still fully covered and modest). Clean line art, soft cel shading."
  );
  // Default resolution 512 for high fidelity
  const [resolution, setResolution] = useState(512);
  const [numColors, setNumColors] = useState(8);
  const [hd2dStyle, setHd2dStyle] = useState("none");
  const [removeBackground, setRemoveBackground] = useState(true);
  const [selectedModel, setSelectedModel] = useState("auto");

  // Image Upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRandomInspire = () => {
    const random =
      PURE_PROMPT_INSPIRATIONS[
        Math.floor(Math.random() * PURE_PROMPT_INSPIRATIONS.length)
      ];
    setPrompt(random);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTriggerGenerate = () => {
    if (isGenerating) return;
    onGenerate({
      prompt: prompt.trim(),
      resolution,
      numColors,
      hd2dStyle: hd2dStyle === "none" ? undefined : hd2dStyle,
      removeBackground,
      spritesheet: activeMode === "spritesheet",
      imageBase64: activeMode === "image" ? imagePreview || undefined : undefined,
      model: selectedModel,
    });
  };

  return (
    <aside className="w-64 xl:w-72 2xl:w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col h-full overflow-hidden shrink-0 select-none">
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveMode("text")}
            className={`flex-1 py-1 rounded-md text-center transition-all ${
              activeMode === "text"
                ? "bg-zinc-800 text-amber-400 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Text &rarr; SVG
          </button>
          <button
            onClick={() => setActiveMode("image")}
            className={`flex-1 py-1 rounded-md text-center transition-all ${
              activeMode === "image"
                ? "bg-zinc-800 text-amber-400 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Image &rarr; SVG
          </button>
        </div>

        {/* Raster Image Upload (When in image mode) */}
        {activeMode === "image" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-300">
              <span>Source Image</span>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="text-[11px] text-red-400 hover:text-red-300"
                >
                  Clear
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative border border-amber-500/30 rounded-lg overflow-hidden bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="w-full h-28 object-contain p-2"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-1 text-[11px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-t border-zinc-700 transition-colors"
                >
                  Change Image
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-zinc-800 hover:border-amber-500/50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-900/30 text-center"
              >
                <Upload className="w-4 h-4 text-zinc-400 mb-1" />
                <span className="text-xs font-medium text-zinc-200">
                  Upload image or sketch
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5">
                  PNG, JPG, WebP
                </span>
              </div>
            )}
          </div>
        )}

        {/* Pure User Prompt Box */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-zinc-200 text-[11px]">
              {activeMode === "image" ? "Prompt Guidance (Optional)" : "Pure User Prompt"}
            </label>
            <button
              type="button"
              onClick={handleRandomInspire}
              className="flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 transition-colors"
              title="Fill with clean random idea"
            >
              <Dices className="w-3 h-3" />
              <span>Inspire</span>
            </button>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Describe your character, item, or illustration with pure natural language..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 rounded-lg p-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none resize-none leading-relaxed transition-all"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleTriggerGenerate();
              }
            }}
          />
        </div>

        {/* Resolution Selector: 256, 512, 768, 1024 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-zinc-400">Resolution</span>
            <span className="font-mono text-[10px] text-zinc-500">{resolution}x{resolution}px</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[256, 512, 768, 1024].map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                className={`py-1 text-[10px] font-mono rounded border transition-colors ${
                  resolution === res
                    ? "bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>

        {/* Inkscape Layers Count Selector */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-zinc-400">Inkscape Layers</span>
            <span className="font-mono text-[10px] text-zinc-500">{numColors} Colors</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[6, 8, 12, 16].map((cols) => (
              <button
                key={cols}
                type="button"
                onClick={() => setNumColors(cols)}
                className={`py-1 text-[10px] font-mono rounded border transition-colors ${
                  numColors === cols
                    ? "bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {cols}L
              </button>
            ))}
          </div>
        </div>

        {/* Art Style Preset (Pure by default!) */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-zinc-400">
            Aesthetic Style (Optional)
          </label>
          <div className="relative">
            <select
              value={hd2dStyle}
              onChange={(e) => setHd2dStyle(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 appearance-none outline-none focus:border-amber-500/60"
            >
              <option value="none">Pure (No Style Modifier)</option>
              <option value="octopath-lantern">Octopath HD-2D (Warm Candlelight)</option>
              <option value="triangle-strategy">Triangle Tactics (Gritty Medieval)</option>
              <option value="mana-sanctuary">Mana Sanctuary (Cyan Crystal)</option>
              <option value="dungeon-crypt">Dark Souls Crypt (Purple Soulfire)</option>
              <option value="cyberpunk-neon">Cyberpunk 2.5D (Neon Backlight)</option>
              <option value="ghibli-verdant">Studio Ghibli (Emerald Moss)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* AI Engine Model Dropdown */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <Cpu className="w-3 h-3 text-amber-400" />
              AI Image Engine
            </span>
          </div>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 appearance-none outline-none focus:border-amber-500/60"
            >
              <option value="auto">Auto-Failover Pool (Flux 2D Engine)</option>
              <option value="flux-pixel">Flux Game Asset Engine</option>
              <option value="flux-turbo">Flux Turbo (Ultra Fast)</option>
              <option value="sdxl-sprites">SDXL Game Engine</option>
              <option value="unity-craft">Unity 2D Vector Engine</option>
              <option value="gemini-3.1-flash-lite-image">Gemini Flash Image</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Transparent Sprite Toggle */}
        <div className="pt-0.5 flex items-center justify-between text-xs text-zinc-300">
          <span className="text-[11px]">Transparent Sprite BG</span>
          <button
            type="button"
            onClick={() => setRemoveBackground(!removeBackground)}
            className={`w-8 h-4.5 rounded-full transition-colors relative p-0.5 ${
              removeBackground ? "bg-amber-500" : "bg-zinc-800"
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                removeBackground ? "translate-x-3.5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Sticky Bottom Generate Action */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950">
        <button
          type="button"
          onClick={handleTriggerGenerate}
          disabled={isGenerating || (!prompt && !imagePreview)}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-semibold rounded-lg text-xs shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Vectorizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Inkscape SVG</span>
              <span className="text-[10px] text-zinc-900/60 font-mono ml-0.5">
                ⌘↵
              </span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
