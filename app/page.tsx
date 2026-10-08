"use client";

import React, { useState, useEffect } from "react";
import { StudioHeader } from "@/components/studio-header";
import { GeneratorSidebar } from "@/components/generator-sidebar";
import { ViewportCanvas } from "@/components/viewport-canvas";
import { InspectorPanel } from "@/components/inspector-panel";
import { PresetGalleryModal } from "@/components/preset-gallery-modal";
import { WebGameModal } from "@/components/web-game-modal";
import { PRESET_HD2D_ASSETS, HD2DAsset } from "@/lib/preset-assets";
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Wand2,
  Download,
} from "lucide-react";

const DEFAULT_ANIME_WOMAN: HD2DAsset = {
  id: "anime-woman-onesie",
  title: "Anime Woman in Footed Onesie",
  description:
    "22-year-old adult East Asian woman in pale lavender footed onesie with star and planet prints, diaper bulk silhouette, clean line art and soft cel shading.",
  category: "character",
  perspective: "front",
  recommendedGrid: "512x512",
  dominantColors: ["#be9ec3", "#3c266f", "#5a4298", "#7e65b6", "#b29ed2", "#f2d3c0"],
  svg: `<svg viewBox="0 0 512 512" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" fill="#18181b"/><text x="50%" y="50%" fill="#a1a1aa" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="14">Loading high-fidelity Inkscape SVG...</text></svg>`,
  sourceImageUrl: "/presets/anime_woman_onesie.jpg",
  promptUsed:
    "22-year-old adult East Asian woman, clearly in her twenties, refined anime style. Soft mature face, large dark eyes with subtle inner glow, fair skin, short black hair with neat bangs. Slim soft feminine adult proportions. Wearing a pale lavender long-sleeved footed onesie with small darker-lavender star and planet prints. The onesie has a noticeably rounded, softly padded silhouette at the hips and seat (clear diaper bulk under the fabric, still fully covered and modest). Clean line art, soft cel shading.",
  hd2dStyle: "none",
  godotTip:
    "Import SVG into Godot 4 as Sprite2D with nearest-neighbor texture filter. The 6 Inkscape layers can be animated independently.",
  unityTip:
    "Import with Unity Vector Graphics package at 128 PPU with Point sampling.",
  pipeline: "Text → Image → Inkscape SVG",
  modelUsed: "Flux 2D Game Asset Engine",
  vectorStats: {
    layerCount: 6,
    pathCount: 936,
    nodeCount: 28620,
    targetSize: 512,
  },
  layers: [
    { id: "layer-lineart", label: "Line Art & Outlines", color: "#110C10", lum: 28, pathCount: 152 },
    { id: "layer-shadows-hair", label: "Hair & Deep Shading", color: "#6950A1", lum: 80, pathCount: 275 },
    { id: "layer-fabric-apparel", label: "Lavender Onesie & Patterns", color: "#7F67B6", lum: 135, pathCount: 396 },
    { id: "layer-skin-features", label: "Face & Skin Tones", color: "#BC9CC2", lum: 190, pathCount: 110 },
    { id: "layer-highlights-glow", label: "Eyes Inner Glow & Specular Accents", color: "#DCD1F1", lum: 236, pathCount: 2 },
  ],
};

export default function Page() {
  const [currentAsset, setCurrentAsset] = useState<HD2DAsset>(DEFAULT_ANIME_WOMAN);
  const [recentAssets, setRecentAssets] = useState<HD2DAsset[]>([
    DEFAULT_ANIME_WOMAN,
    ...PRESET_HD2D_ASSETS,
  ]);
  const [activeMode, setActiveMode] = useState<"text" | "image" | "spritesheet">("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [webGameModalOpen, setWebGameModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Responsive sidebar toggles (Desktop & Laptop optimized)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);

  // Mobile navigation active tab
  const [mobileTab, setMobileTab] = useState<"canvas" | "generator" | "inspector">("canvas");

  // Load high-fidelity Inkscape SVG for default asset and adjust layout for laptop screen sizes
  useEffect(() => {
    // For compact laptops (width < 1280px), close inspector by default to give generous room to canvas
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      setInspectorOpen(false);
    }

    // Fetch the pre-rendered high-res Inkscape SVG
    fetch("/presets/anime_woman_onesie.svg")
      .then((res) => {
        if (res.ok) return res.text();
        throw new Error("Could not load preset SVG");
      })
      .then((svgText) => {
        if (svgText && svgText.includes("<svg")) {
          setCurrentAsset((prev) =>
            prev.id === "anime-woman-onesie"
              ? { ...prev, svg: svgText, plainSvg: svgText }
              : prev
          );
        }
      })
      .catch((err) => {
        console.warn("Preloading SVG note:", err?.message);
      });
  }, []);

  const isZenMode = !sidebarOpen && !inspectorOpen;
  const handleToggleZenMode = () => {
    if (isZenMode) {
      setSidebarOpen(true);
      setInspectorOpen(typeof window !== "undefined" && window.innerWidth >= 1280);
    } else {
      setSidebarOpen(false);
      setInspectorOpen(false);
    }
  };

  const handleGenerate = async (params: {
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
    contentMode?: "filtered" | "unfiltered";
    model?: string;
  }) => {
    try {
      setIsGenerating(true);
      setErrorMessage(null);
      setGenerationStep(
        params.imageBase64
          ? "Isolating palette & structuring Inkscape layers..."
          : "Phase 1: Synthesizing high-detail 2D game asset raster via AI..."
      );

      const timer1 = setTimeout(() => {
        setGenerationStep("Phase 2: Quantizing colors & tracing Bezier spline contours...");
      }, 3000);

      const timer2 = setTimeout(() => {
        setGenerationStep("Phase 3: Building native Inkscape layers & validating XML via CLI...");
      }, 6500);

      const res = await fetch("/api/gemini/generate-svg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Generation failed (${res.status})`);
      }

      setGenerationStep("Finalizing Inkscape document & layer hierarchy...");
      const data = await res.json();

      const newAsset: HD2DAsset = {
        id: `gen-${Date.now()}`,
        title: data.title || "Custom HD-2D Asset",
        description: data.description || "Procedurally generated Inkscape vector game asset",
        category: (data.category as any) || params.category || "character",
        perspective: (data.perspective as any) || params.perspective || "front",
        recommendedGrid: data.recommendedGrid || `${params.resolution}x${params.resolution}`,
        dominantColors: data.dominantColors || ["#f59e0b", "#38bdf8", "#1e293b"],
        svg: data.svg,
        plainSvg: data.plainSvg,
        sourceImageUrl: data.sourceImageUrl,
        vectorStats: data.vectorStats,
        layers: data.layers,
        pipeline: data.pipeline || "Text → Image → Inkscape SVG",
        godotTip: data.godotTip || "Configure Sprite2D with nearest-neighbor texture filter.",
        unityTip: data.unityTip || "Import with Point (no filter) mode and matching PPU.",
        promptUsed: params.prompt,
        hd2dStyle: params.hd2dStyle || "none",
        contentMode: params.contentMode || "unfiltered",
        modelUsed: data.modelUsed,
      };

      setCurrentAsset(newAsset);
      setRecentAssets((prev) => [newAsset, ...prev]);
      setSuccessToast(
        data.modelUsed
          ? `Generated "${newAsset.title}" (${newAsset.vectorStats?.layerCount || 6} Inkscape layers) via ${data.modelUsed}`
          : `Created "${newAsset.title}"`
      );
      setMobileTab("canvas"); // Switch to canvas on mobile to view generated asset
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err: any) {
      console.error("Generation error:", err);
      setErrorMessage(err.message || "Failed to generate SVG. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
    }
  };

  const handleUpdateSvg = (newSvg: string) => {
    if (!currentAsset) return;
    const updated = { ...currentAsset, svg: newSvg };
    setCurrentAsset(updated);
    setRecentAssets((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Studio Header */}
      <StudioHeader
        onOpenPresets={() => setGalleryOpen(true)}
        onOpenWebGameModal={() => setWebGameModalOpen(true)}
        onSelectMode={(mode) => {
          setActiveMode(mode);
          setMobileTab("generator");
        }}
        activeMode={activeMode}
        isGenerating={isGenerating}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        inspectorOpen={inspectorOpen}
        onToggleInspector={() => setInspectorOpen((prev) => !prev)}
        onToggleZenMode={handleToggleZenMode}
        isZenMode={isZenMode}
      />

      {/* Main Workspace: Desktop & Laptop Studio Layout (Visible on lg+ screens) */}
      <div className="hidden lg:flex flex-1 overflow-hidden relative">
        {/* Left Column: Generator Controls */}
        {sidebarOpen && (
          <GeneratorSidebar
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            activeMode={activeMode}
            setActiveMode={setActiveMode}
          />
        )}

        {/* Center: Interactive Canvas (Clean, Uncluttered, Max Viewport) */}
        <main className="flex-1 flex flex-col h-full min-w-0 relative">
          <ViewportCanvas
            currentAsset={currentAsset}
            onUpdateSvg={handleUpdateSvg}
          />

          {/* Active Generation Progress Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-4">
              <div className="bg-zinc-950 border border-amber-500/40 rounded-xl p-5 shadow-2xl max-w-sm w-full text-center space-y-3">
                <div className="relative w-10 h-10 mx-auto">
                  <div className="w-10 h-10 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
                  <Sparkles className="w-4 h-4 text-amber-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-semibold text-zinc-100">
                    Text &rarr; Image &rarr; Inkscape SVG
                  </h3>
                  <p className="text-xs text-amber-400 font-mono animate-pulse">
                    {generationStep || "Processing asset..."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Toast / Notifications */}
          {errorMessage && (
            <div className="absolute top-4 right-4 z-40 bg-red-950/90 border border-red-800 text-red-200 px-3 py-2 rounded-lg text-xs shadow-xl flex items-center gap-2 max-w-md">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="flex-1">{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-red-200 text-xs ml-2 cursor-pointer"
              >
                &times;
              </button>
            </div>
          )}

          {successToast && (
            <div className="absolute top-4 right-4 z-40 bg-zinc-900/95 border border-amber-500/40 text-amber-200 px-3 py-2 rounded-lg text-xs shadow-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successToast}</span>
            </div>
          )}
        </main>

        {/* Right Column: Inspector & Export Panel */}
        {inspectorOpen && (
          <InspectorPanel
            key={currentAsset?.id || "empty-desktop"}
            currentAsset={currentAsset}
            onUpdateSvg={handleUpdateSvg}
            onOpenWebGameModal={() => setWebGameModalOpen(true)}
          />
        )}
      </div>

      {/* Mobile Studio Layout (Visible only on < lg screens) */}
      <div className="flex lg:hidden flex-1 flex-col overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {mobileTab === "generator" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <GeneratorSidebar
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                activeMode={activeMode}
                setActiveMode={setActiveMode}
              />
            </div>
          )}

          {mobileTab === "canvas" && (
            <main className="flex-1 flex flex-col h-full min-w-0 relative">
              <ViewportCanvas
                currentAsset={currentAsset}
                onUpdateSvg={handleUpdateSvg}
              />

              {/* Mobile Quick Action Pill on Canvas */}
              <div className="absolute top-13 right-3 z-20 flex items-center gap-1.5">
                <button
                  onClick={() => setMobileTab("generator")}
                  className="px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-amber-400 text-[11px] font-medium shadow-lg backdrop-blur-md flex items-center gap-1 hover:bg-zinc-800"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Generate</span>
                </button>
                <button
                  onClick={() => setMobileTab("inspector")}
                  className="px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-[11px] font-medium shadow-lg backdrop-blur-md flex items-center gap-1 hover:bg-zinc-800"
                >
                  <Download className="w-3 h-3 text-amber-400" />
                  <span>Export</span>
                </button>
              </div>
            </main>
          )}

          {mobileTab === "inspector" && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <InspectorPanel
                key={currentAsset?.id || "empty-mobile"}
                currentAsset={currentAsset}
                onUpdateSvg={handleUpdateSvg}
                onOpenWebGameModal={() => setWebGameModalOpen(true)}
              />
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="h-12 border-t border-zinc-800 bg-zinc-950 px-4 flex items-center justify-around z-20 shrink-0">
          <button
            onClick={() => setMobileTab("generator")}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              mobileTab === "generator" ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Generator</span>
          </button>
          <button
            onClick={() => setMobileTab("canvas")}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              mobileTab === "canvas" ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Canvas</span>
          </button>
          <button
            onClick={() => setMobileTab("inspector")}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
              mobileTab === "inspector" ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Inspector</span>
          </button>
        </nav>
      </div>

      {/* Preset Gallery Modal */}
      <PresetGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        onSelectAsset={(asset) => {
          setCurrentAsset(asset);
          setGalleryOpen(false);
        }}
        onUsePrompt={(_prompt) => {
          setGalleryOpen(false);
        }}
      />

      {/* Web Game Sandbox Modal */}
      <WebGameModal
        isOpen={webGameModalOpen}
        asset={currentAsset}
        onClose={() => setWebGameModalOpen(false)}
      />
    </div>
  );
}
