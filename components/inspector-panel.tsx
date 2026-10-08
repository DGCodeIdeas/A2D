"use client";

import React, { useState } from "react";
import {
  Download,
  Copy,
  Check,
  Code2,
  FileCode,
  Terminal,
  Layers,
  Gamepad2,
  Image as ImageIcon,
} from "lucide-react";
import { HD2DAsset } from "@/lib/preset-assets";
import {
  downloadInkscapeSvg,
  downloadPlainSvg,
  downloadPngFromSvg,
  generateGodotSnippet,
  generateUnitySnippet,
  generateReactSvgSnippet,
} from "@/lib/export-utils";

interface InspectorPanelProps {
  currentAsset: HD2DAsset | null;
  onUpdateSvg: (newSvg: string) => void;
  onOpenWebGameModal: () => void;
}

export function InspectorPanel({
  currentAsset,
  onOpenWebGameModal,
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<"export" | "code">("export");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [pngScale, setPngScale] = useState<number>(2);
  const [isExportingPng, setIsExportingPng] = useState(false);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadInkscapeSvg = () => {
    if (!currentAsset) return;
    downloadInkscapeSvg(currentAsset.svg, currentAsset.id || "inkscape-asset");
  };

  const handleDownloadPlainSvg = () => {
    if (!currentAsset) return;
    downloadPlainSvg(currentAsset.plainSvg || currentAsset.svg, currentAsset.id || "web-asset");
  };

  const handleDownloadSourceImage = () => {
    if (!currentAsset || !currentAsset.sourceImageUrl) return;
    const a = document.createElement("a");
    a.href = currentAsset.sourceImageUrl;
    a.download = `${currentAsset.id || "asset"}-source.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadPng = async () => {
    if (!currentAsset) return;
    try {
      setIsExportingPng(true);
      await downloadPngFromSvg(
        currentAsset.svg,
        currentAsset.id || "game-asset",
        pngScale,
        512,
        512
      );
    } catch (err) {
      console.error("Failed to export PNG", err);
    } finally {
      setIsExportingPng(false);
    }
  };

  if (!currentAsset) {
    return (
      <aside className="w-64 xl:w-72 2xl:w-80 border-l border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-500 flex items-center justify-center">
        Select or generate an asset to inspect
      </aside>
    );
  }

  return (
    <aside className="w-64 xl:w-72 2xl:w-80 border-l border-zinc-800 bg-zinc-950 flex flex-col h-full overflow-hidden shrink-0 select-none">
      {/* Inspector Tabs */}
      <div className="h-10 border-b border-zinc-800 bg-zinc-950 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs w-full">
          <button
            onClick={() => setActiveTab("export")}
            className={`flex-1 py-1 rounded-md text-center transition-all font-medium text-[11px] ${
              activeTab === "export"
                ? "bg-zinc-800 text-amber-400 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Export &amp; Files
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex-1 py-1 rounded-md text-center transition-all font-medium text-[11px] ${
              activeTab === "code"
                ? "bg-zinc-800 text-amber-400 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Game Engines
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Compact Header Summary */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-1">
            <h2 className="text-xs font-semibold text-zinc-100 truncate">
              {currentAsset.title}
            </h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-amber-400 border border-zinc-800 shrink-0">
              {currentAsset.recommendedGrid}
            </span>
          </div>
          {currentAsset.description && (
            <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
              {currentAsset.description}
            </p>
          )}
        </div>

        {/* Vector Metrics Summary */}
        <div className="grid grid-cols-3 gap-1 text-center font-mono">
          <div className="bg-zinc-900/80 p-1.5 rounded-lg border border-zinc-800/80">
            <div className="text-amber-400 text-xs font-bold">
              {currentAsset.vectorStats?.layerCount || currentAsset.layers?.length || 6}
            </div>
            <div className="text-[9px] text-zinc-500 font-sans">Inkscape Layers</div>
          </div>
          <div className="bg-zinc-900/80 p-1.5 rounded-lg border border-zinc-800/80">
            <div className="text-cyan-400 text-xs font-bold">
              {currentAsset.vectorStats?.pathCount || 36}
            </div>
            <div className="text-[9px] text-zinc-500 font-sans">Spline Paths</div>
          </div>
          <div className="bg-zinc-900/80 p-1.5 rounded-lg border border-zinc-800/80">
            <div className="text-emerald-400 text-xs font-bold">
              {currentAsset.dominantColors?.length || 6}
            </div>
            <div className="text-[9px] text-zinc-500 font-sans">Colors</div>
          </div>
        </div>

        {activeTab === "export" && (
          <div className="space-y-2">
            {/* Primary Action: Download Inkscape SVG */}
            <div className="p-2.5 rounded-lg bg-zinc-900/70 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>Inkscape SVG Document</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Native layers with sodipodi &amp; inkscape XML
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadInkscapeSvg}
                className="w-full py-1.5 px-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-semibold rounded-md text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .SVG for Inkscape</span>
              </button>
            </div>

            {/* Secondary Action: Download Plain Web SVG */}
            <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-zinc-200">
                    Standard Web SVG
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Lightweight SVG for web apps &amp; React
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDownloadPlainSvg}
                  className="flex-1 py-1 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] font-medium border border-zinc-700 flex items-center justify-center gap-1"
                >
                  <Download className="w-3 h-3 text-zinc-400" />
                  <span>Download SVG</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(currentAsset.svg, "svg-code")}
                  className="py-1 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px] font-medium border border-zinc-700 flex items-center gap-1"
                  title="Copy SVG XML markup"
                >
                  {copiedType === "svg-code" ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-zinc-400" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Raster PNG Render */}
            <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-zinc-200">
                  Rasterized PNG
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px]">
                  {[1, 2, 4].map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => setPngScale(scale)}
                      className={`px-1.5 py-0.5 rounded ${
                        pngScale === scale
                          ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {scale}x
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={isExportingPng}
                className="w-full py-1 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] font-medium border border-zinc-700 flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Download className="w-3 h-3 text-zinc-400" />
                <span>{isExportingPng ? "Rendering..." : `Download PNG (${512 * pngScale}px)`}</span>
              </button>
            </div>

            {/* Source AI Image (if generated from Text->Image->SVG) */}
            {currentAsset.sourceImageUrl && (
              <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800 space-y-1.5">
                <div className="text-xs font-medium text-zinc-200 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-amber-400" />
                  <span>Source AI Raster</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSourceImage}
                  className="w-full py-1 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] font-medium border border-zinc-700 flex items-center justify-center gap-1"
                >
                  <Download className="w-3 h-3 text-zinc-400" />
                  <span>Save Original Image</span>
                </button>
              </div>
            )}

            {/* Web Sandbox Launch Button */}
            <button
              type="button"
              onClick={onOpenWebGameModal}
              className="w-full py-1.5 px-3 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Test in Web Game Sandbox</span>
            </button>
          </div>
        )}

        {activeTab === "code" && (
          <div className="space-y-2.5 text-xs">
            {/* Godot 4 Instructions */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
                <span>Godot 4.x (Sprite2D)</span>
                <button
                  onClick={() =>
                    handleCopy(
                      generateGodotSnippet(currentAsset),
                      "godot"
                    )
                  }
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                >
                  {copiedType === "godot" ? "Copied" : "Copy GDScript"}
                </button>
              </div>
              <div className="p-2 rounded bg-zinc-900 font-mono text-[10px] text-zinc-400 border border-zinc-800 leading-relaxed overflow-x-auto">
                <div className="text-zinc-500"># Direct Inkscape SVG Import</div>
                <div>{`texture = load("res://${currentAsset.id || "asset"}.svg")`}</div>
                <div>texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST</div>
              </div>
            </div>

            {/* Unity Vector Graphics */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
                <span>Unity (Vector Graphics)</span>
                <button
                  onClick={() =>
                    handleCopy(
                      generateUnitySnippet(currentAsset),
                      "unity"
                    )
                  }
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                >
                  {copiedType === "unity" ? "Copied" : "Copy C#"}
                </button>
              </div>
              <div className="p-2 rounded bg-zinc-900 font-mono text-[10px] text-zinc-400 border border-zinc-800 leading-relaxed overflow-x-auto">
                <div className="text-zinc-500">// VectorSprite Asset Settings</div>
                <div>Pixels Per Unit: 128</div>
                <div>Sampling: Point (no filter)</div>
              </div>
            </div>

            {/* React JSX Snippet */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300">
                <span>React / Next.js Component</span>
                <button
                  onClick={() =>
                    handleCopy(generateReactSvgSnippet(currentAsset), "react")
                  }
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                >
                  {copiedType === "react" ? "Copied" : "Copy JSX"}
                </button>
              </div>
              <div className="p-2 rounded bg-zinc-900 font-mono text-[10px] text-zinc-400 border border-zinc-800 leading-relaxed overflow-x-auto">
                <div>{`export function ${currentAsset.title.replace(/\\s+/g, "")}() {`}</div>
                <div className="text-zinc-500 pl-2">return &lt;svg viewBox=&quot;0 0 512 512&quot; ... /&gt;;</div>
                <div>&#125;</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
